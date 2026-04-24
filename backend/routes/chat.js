const express = require('express');
const supabase = require('../config/supabase');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

router.use((req, res, next) => {
  if (!supabase) return res.status(503).json({ message: 'Database not configured.' });
  next();
});

// Initialize Gemini
let genAI = null;
let model = null;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  console.log('✅ Gemini AI initialized (gemini-1.5-flash)');
} else {
  console.log('⚠️ No GEMINI_API_KEY — using rule-based chat');
}

// Fetch scheme context for Gemini
async function getSchemeContext() {
  const { data: biz } = await supabase.from('business_schemes').select('name, description, benefits, eligibility, application_process, funding_amount, ministry, website').eq('is_active', true).limit(8);
  const { data: edu } = await supabase.from('education_schemes').select('name, description, benefits, eligibility, application_process, funding_amount, ministry, website').eq('is_active', true).limit(8);
  const schemes = [...(biz || []), ...(edu || [])];
  return schemes.map(s => `- ${s.name}: ${s.description?.slice(0, 150)}. Funding: ${s.funding_amount || 'N/A'}. Ministry: ${s.ministry || 'N/A'}.`).join('\n');
}

// Gemini-powered chat
async function geminiChat(message, language, userProfile, schemeContext) {
  const langName = { hi:'Hindi', ta:'Tamil', te:'Telugu', bn:'Bengali', mr:'Marathi', gu:'Gujarati', kn:'Kannada', ml:'Malayalam', pa:'Punjabi' }[language] || 'English';
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

// Smart rule-based fallback
async function ruleBasedChat(message, language, userProfile) {
  const lower = message.toLowerCase();
  const isHi = language === 'hi';

  if (['hello','hi','hey','namaste','help','start'].some(p => lower.includes(p)))
    return { text: isHi ? '🙏 नमस्ते! मैं SmartSchemes AI सहायक हूँ।' : '👋 Hello! I can help you find schemes, check eligibility, and guide applications!', suggestions: ['Find schemes for me', 'Check eligibility', 'Documents needed'] };

  if (['thank','dhanyavad','shukriya'].some(p => lower.includes(p)))
    return { text: isHi ? '🙏 धन्यवाद!' : '😊 You\'re welcome!', suggestions: ['Find schemes', 'Start over'] };

  if (['document','papers','proof','kagaz'].some(p => lower.includes(p)))
    return { text: isHi ? '📄 दस्तावेज़:\n• आधार कार्ड\n• पैन कार्ड\n• आय प्रमाण पत्र\n• बैंक पासबुक' : '📄 Common documents:\n• Aadhaar Card\n• PAN Card\n• Income Certificate\n• Bank Passbook\n\nAsk about a specific scheme!', suggestions: ['Find schemes', 'How to apply'] };

  // Search DB by words
  const words = lower.split(/\s+/).filter(w => w.length > 3);
  for (const word of words) {
    const { data: biz } = await supabase.from('business_schemes').select('*').ilike('name', `%${word}%`).limit(1);
    const { data: edu } = await supabase.from('education_schemes').select('*').ilike('name', `%${word}%`).limit(1);
    const scheme = biz?.[0] || edu?.[0];
    if (scheme) {
      const isApply = ['apply','kaise','process','register','how'].some(p => lower.includes(p));
      let text;
      if (isApply && scheme.application_process?.length) {
        text = '📋 **How to apply for ' + scheme.name + ':**\n\n' + scheme.application_process.map((s, i) => (i+1) + '. ' + s).join('\n') + '\n\n🌐 Website: ' + (scheme.website || 'N/A');
      } else {
        text = '🏛️ **' + scheme.name + '**\n\n' + scheme.description + '\n\n💰 Funding: ' + (scheme.funding_amount || 'N/A') + '\n\n✅ Eligibility:\n' + (scheme.eligibility||[]).map(e => '• ' + e).join('\n') + '\n\n🎁 Benefits:\n' + (scheme.benefits||[]).map(b => '• ' + b).join('\n');
      }
      return { text, schemes: [{ id: scheme.id, name: scheme.name, funding: scheme.funding_amount, website: scheme.website }], suggestions: ['How to apply', 'Documents needed', 'Find more schemes'] };
    }
  }

  // Find schemes by profile
  const age = userProfile?.age || 25;
  const { data: b } = await supabase.from('business_schemes').select('*').eq('is_active', true).lte('min_age', age).gte('max_age', age).limit(4);
  const { data: e } = await supabase.from('education_schemes').select('*').eq('is_active', true).lte('min_age', age).gte('max_age', age).limit(4);
  const all = [...(b||[]),...(e||[])].slice(0, 4);
  if (all.length > 0) {
    const list = all.map((s, i) => (i+1) + '. **' + s.name + '**\n   💰 ' + (s.funding_amount || 'Varies')).join('\n\n');
    return { text: (isHi ? '🎯 ये योजनाएं आपके लिए:\n\n' : '🎯 Schemes for you:\n\n') + list, schemes: all.map(s => ({ id: s.id, name: s.name, funding: s.funding_amount, website: s.website })), suggestions: all.slice(0,2).map(s => 'About ' + s.name.split('(')[0].trim()) };
  }

  return { text: isHi ? '🤖 योजना का नाम बताएं या "Find schemes" कहें।' : '🤖 Tell me a scheme name or say "Find schemes for me"!', suggestions: ['Find schemes for me', 'How to apply', 'Documents needed'] };
}

// POST /api/chat
router.post('/', async (req, res) => {
  try {
    const { message, language = 'en', userProfile } = req.body;
    if (!message?.trim()) return res.status(400).json({ message: 'Message is required' });

    console.log('[Chat] Message:', message, '| Lang:', language);
    let response = { text: '', suggestions: [], schemes: [] };

    if (model) {
      try {
        const ctx = await getSchemeContext();
        const aiText = await geminiChat(message, language, userProfile, ctx);
        response.text = aiText;
        response.suggestions = ['Find schemes', 'Check eligibility', 'Documents needed', 'How to apply'];
        console.log('[Chat] Gemini response OK');
      } catch (aiErr) {
        console.error('[Chat] Gemini error:', aiErr.message?.slice(0, 100));
        response = await ruleBasedChat(message, language, userProfile);
      }
    } else {
      response = await ruleBasedChat(message, language, userProfile);
    }

    res.json(response);
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ message: 'Chat service error' });
  }
});

module.exports = router;
