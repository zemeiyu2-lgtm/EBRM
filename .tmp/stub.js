(function () {
  window.__spokeLog = []; window.__cancelCount = 0;
  var voices = [
    { name: 'Stub English US', lang: 'en-US', voiceURI: 'stub-en-us', default: true, localService: true },
    { name: 'Stub English GB', lang: 'en-GB', voiceURI: 'stub-en-gb', default: false, localService: true },
    { name: 'Stub Chinese', lang: 'zh-CN', voiceURI: 'stub-zh', default: false, localService: true }
  ];
  var stub = {
    getVoices: function () { return voices; },
    speak: function (u) { window.__spokeLog.push({ text: u.text, rate: u.rate, lang: u.lang, voice: u.voice ? u.voice.name : null });
      if (u.onstart) setTimeout(u.onstart, 1); setTimeout(function () { if (u.onend) u.onend(); }, 8); },
    cancel: function () { window.__cancelCount++; }, pause: function () {}, resume: function () {},
    addEventListener: function () {}, removeEventListener: function () {}, speaking: false, pending: false, paused: false
  };
  Object.defineProperty(window, 'speechSynthesis', { configurable: true, get: function () { return stub; } });
  window.SpeechSynthesisUtterance = function (t) { this.text = t; this.rate = 1; this.pitch = 1; this.volume = 1; this.voice = null; };
})();
