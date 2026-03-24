// Text-to-Speech utility — improved Hindi support
const TTS = {
  speaking: false,
  currentUtterance: null,
  voicesLoaded: false,

  // Pre-load voices (needed on some browsers)
  init() {
    if (this.voicesLoaded) return;
    if ('speechSynthesis' in window) {
      speechSynthesis.getVoices();
      speechSynthesis.onvoiceschanged = () => { this.voicesLoaded = true; };
    }
  },

  // Get the best voice for a language
  getBestVoice(langCode) {
    const voices = speechSynthesis.getVoices();
    const lang = langCode.split('-')[0]; // 'hi' or 'en'

    // Priority 1: Google voices (best quality)
    const googleVoice = voices.find(v =>
      v.lang.startsWith(lang) && v.name.toLowerCase().includes('google')
    );
    if (googleVoice) return googleVoice;

    // Priority 2: Microsoft voices
    const msVoice = voices.find(v =>
      v.lang.startsWith(lang) && v.name.toLowerCase().includes('microsoft')
    );
    if (msVoice) return msVoice;

    // Priority 3: Any voice matching the full lang code
    const exactVoice = voices.find(v => v.lang === langCode);
    if (exactVoice) return exactVoice;

    // Priority 4: Any voice matching the language prefix
    const prefixVoice = voices.find(v => v.lang.startsWith(lang));
    if (prefixVoice) return prefixVoice;

    return null;
  },

  speak(text, lang = 'en-IN') {
    if (!('speechSynthesis' in window)) {
      console.warn('Text-to-Speech not supported in this browser');
      return false;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    // Hindi needs slower rate and higher pitch for clarity
    if (lang.startsWith('hi')) {
      utterance.rate = 0.85;
      utterance.pitch = 1.05;
    } else {
      utterance.rate = 0.95;
      utterance.pitch = 1;
    }
    utterance.volume = 1;

    // Set the best available voice
    const voice = this.getBestVoice(lang);
    if (voice) utterance.voice = voice;

    utterance.onstart = () => { this.speaking = true; };
    utterance.onend = () => { this.speaking = false; this.currentUtterance = null; };
    utterance.onerror = () => { this.speaking = false; this.currentUtterance = null; };

    this.currentUtterance = utterance;
    speechSynthesis.speak(utterance);
    return true;
  },

  stop() {
    if ('speechSynthesis' in window && speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    this.speaking = false;
    this.currentUtterance = null;
  },

  toggle(text, lang = 'en-IN') {
    if (this.speaking) {
      this.stop();
      return false;
    }
    this.speak(text, lang);
    return true;
  },

  // Generate natural scheme description for TTS
  schemeToSpeech(scheme, lang = 'en') {
    if (lang === 'hi') {
      const benefits = scheme.benefits?.length
        ? `इस योजना के लाभ हैं: ${scheme.benefits.join('। ')}`
        : '';
      const eligibility = scheme.eligibility?.length
        ? `पात्रता: ${scheme.eligibility.join('। ')}`
        : '';
      return `योजना: ${scheme.name}। ${scheme.description}। ${benefits}। ${eligibility}`;
    }
    const benefits = scheme.benefits?.length
      ? `Benefits include: ${scheme.benefits.join('. ')}`
      : '';
    const eligibility = scheme.eligibility?.length
      ? `Eligibility criteria: ${scheme.eligibility.join('. ')}`
      : '';
    return `${scheme.name}. ${scheme.description}. ${benefits}. ${eligibility}`;
  }
};

// Init voices on load
TTS.init();

export default TTS;
