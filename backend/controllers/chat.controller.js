// Chat controller — handles AI chat with Gemini and rule-based fallback.
// ┌──────────────────────────────────────────────────┐
// │  SCHEME DATA:   MongoDB Atlas  (Scheme collection)  │
// │  Supabase is NOT used here.                         │
// │  Auth is handled by the auth middleware in routes.  │
// └──────────────────────────────────────────────────┘

const mongoose = require('mongoose');
const Scheme = require('../models/Scheme');
const logger = require('../utils/logger');
const { sendSuccess, sendBadRequest, sendServiceUnavailable } = require('../utils/responseHelper');
const { chatSchema, formatZodError } = require('../validators/schemas');

let genAI = null;
let model = null;

try {
  if (process.env.GEMINI_API_KEY) {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    logger.info('Chat', 'Gemini AI initialized (gemini-1.5-flash)');
  } else {
    logger.warn('Chat', 'No GEMINI_API_KEY — using rule-based chat');
  }
} catch (initErr) {
  logger.error('Chat', 'Failed to initialize Gemini', { error: initErr.message });
}

// Build scheme context from MongoDB Atlas for Gemini prompt
async function getSchemeContext() {
  const schemes = await Scheme.find()
    .select('scheme_name details benefits schemeCategory level tags')
    .limit(16)
    .lean();

  return schemes
    .map((s) => `- ${s.scheme_name}: ${(s.details || '').slice(0, 150)}. Category: ${s.schemeCategory || 'N/A'}. Level: ${s.level || 'N/A'}.`)
    .join('\n');
}

async function geminiChat(message, language, userProfile, schemeContext) {
  const langName = { hi: 'Hindi', ta: 'Tamil', te: 'Telugu', bn: 'Bengali', mr: 'Marathi', gu: 'Gujarati', kn: 'Kannada', ml: 'Malayalam', pa: 'Punjabi' }[language] || 'English';
  const systemPrompt = `You are SmartSchemes AI Assistant, a friendly Indian government schemes expert.
RULES:
- Respond in ${langName}
- Keep responses concise (under 200 words)
- Use simple language suitable for rural users
- Include emojis for friendliness
- When listing schemes, use numbered format with **bold** names
- Always suggest next steps

USER PROFILE: ${userProfile ? `Age: ${userProfile.age || '?'}, Income: ${userProfile.income || '?'}, State: ${userProfile.state || '?'}, Category: ${userProfile.category || '?'}, Occupation: ${userProfile.occupation || '?'}` : 'Not available'}

SCHEMES DATABASE:
${schemeContext}`;

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: message }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: { maxOutputTokens: 500, temperature: 0.7 },
  });
  return result.response.text();
}

async function ruleBasedChat(message, language) {
  const lower = message.toLowerCase();
  const isHi = language === 'hi';

  if (['hello', 'hi', 'hey', 'namaste', 'help', 'start'].some((p) => lower.includes(p))) {
    return { text: isHi ? '🙏 नमस्ते! मैं SmartSchemes AI सहायक हूँ।' : '👋 Hello! I can help you find schemes, check eligibility, and guide applications!', suggestions: ['Find schemes for me', 'Check eligibility', 'Documents needed'] };
  }

  if (['thank', 'dhanyavad', 'shukriya'].some((p) => lower.includes(p))) {
    return { text: isHi ? '🙏 धन्यवाद!' : '😊 You\'re welcome!', suggestions: ['Find schemes', 'Start over'] };
  }

  if (['document', 'papers', 'proof', 'kagaz'].some((p) => lower.includes(p))) {
    return { text: isHi ? '📄 दस्तावेज़:\n• आधार कार्ड\n• पैन कार्ड\n• आय प्रमाण पत्र\n• बैंक पासबुक' : '📄 Common documents:\n• Aadhaar Card\n• PAN Card\n• Income Certificate\n• Bank Passbook\n\nAsk about a specific scheme!', suggestions: ['Find schemes', 'How to apply'] };
  }

  // Search schemes by keyword in MongoDB Atlas
  const words = lower.split(/\s+/).filter((w) => w.length > 3);
  for (const word of words) {
    const scheme = await Scheme.findOne({
      scheme_name: { $regex: word, $options: 'i' },
    }).lean();

    if (scheme) {
      const isApply = ['apply', 'kaise', 'process', 'register', 'how'].some((p) => lower.includes(p));
      let text;
      if (isApply && scheme.application) {
        text = '📋 **How to apply for ' + scheme.scheme_name + ':**\n\n' + scheme.application + '\n\n🌐 Documents: ' + (scheme.documents || 'N/A');
      } else {
        text = '🏛️ **' + scheme.scheme_name + '**\n\n' + (scheme.details || '').slice(0, 300) + '\n\n✅ Eligibility:\n' + (scheme.eligibility || 'N/A') + '\n\n🎁 Benefits:\n' + (scheme.benefits || 'N/A');
      }
      return { text, schemes: [{ id: scheme._id, name: scheme.scheme_name, category: scheme.schemeCategory }], suggestions: ['How to apply', 'Documents needed', 'Find more schemes'] };
    }
  }

  // Fallback: show random schemes from MongoDB Atlas
  const all = await Scheme.find().limit(4).lean();
  if (all.length > 0) {
    const list = all.map((s, i) => (i + 1) + '. **' + s.scheme_name + '**\n   📂 ' + (s.schemeCategory || 'General')).join('\n\n');
    return { text: (isHi ? '🎯 ये योजनाएं आपके लिए:\n\n' : '🎯 Schemes for you:\n\n') + list, schemes: all.map((s) => ({ id: s._id, name: s.scheme_name, category: s.schemeCategory })), suggestions: all.slice(0, 2).map((s) => 'About ' + s.scheme_name.split('(')[0].trim()) };
  }

  return { text: isHi ? '🤖 योजना का नाम बताएं या "Find schemes" कहें।' : '🤖 Tell me a scheme name or say "Find schemes for me"!', suggestions: ['Find schemes for me', 'How to apply', 'Documents needed'] };
}

async function chat(req, res, next) {
  try {
    if (mongoose.connection.readyState !== 1) {
      return sendServiceUnavailable(res, 'Database not connected');
    }

    const parsed = chatSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendBadRequest(res, formatZodError(parsed.error));
    }

    const { message, language, userProfile } = parsed.data;

    logger.debug('Chat', 'Incoming message', { message, language });
    let response = { text: '', suggestions: [], schemes: [] };

    if (model) {
      try {
        const ctx = await getSchemeContext();
        const aiText = await geminiChat(message, language, userProfile, ctx);
        response.text = aiText;
        response.suggestions = ['Find schemes', 'Check eligibility', 'Documents needed', 'How to apply'];
      } catch (aiErr) {
        logger.warn('Chat', 'Gemini error, falling back to rule-based', { error: aiErr.message?.slice(0, 100) });
        response = await ruleBasedChat(message, language);
      }
    } else {
      response = await ruleBasedChat(message, language);
    }

    return sendSuccess(res, response, 'Chat response generated');
  } catch (error) {
    next(error);
  }
}

module.exports = { chat };
