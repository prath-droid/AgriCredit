import React, { useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { translations } from '../data/translations';
import { Compass, Volume2 } from 'lucide-react';

const Splash = () => {
  const { language, setLanguage, navigateTo, speakText, voiceSpeaking } = useContext(AppContext);
  const t = translations[language];

  // Auto-speak welcome greeting on language select or mount
  useEffect(() => {
    // Small delay to ensure browser speech engine is ready
    const timer = setTimeout(() => {
      const welcomeText = language === 'hi' 
        ? t.voiceWelcomeHi 
        : language === 'mr' 
          ? t.voiceWelcomeMr 
          : t.voiceWelcome;
      speakText(welcomeText);
    }, 800);
    return () => clearTimeout(timer);
  }, [language]);

  const languages = [
    { code: 'hi', label: 'हिन्दी', desc: 'किसान सहायता' },
    { code: 'mr', label: 'मराठी', desc: 'शेतकरी मदत' },
    { code: 'en', label: 'English', desc: 'Farmer Support' }
  ];

  return (
    <div className="flex flex-col justify-between items-center min-h-[92vh] px-6 py-10 bg-brand-beige animate-fade-in-up">
      {/* Top Section: Logo & Name */}
      <div className="flex flex-col items-center text-center mt-8 gap-4">
        <div className="w-24 h-24 bg-gradient-to-br from-brand-green to-brand-green-dark rounded-3xl shadow-xl flex items-center justify-center text-white relative ring-8 ring-brand-green-light">
          <Compass className="w-12 h-12 animate-pulse-slow" />
          <span className="absolute -top-2 -right-2 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-brand-accent"></span>
          </span>
        </div>

        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-brand-green-deep">
            {t.appName}
          </h1>
          <p className="text-sm font-semibold text-brand-blue-dark mt-1.5 uppercase tracking-widest">
            {t.tagline}
          </p>
        </div>
      </div>

      {/* Middle Section: Language Cards */}
      <div className="w-full max-w-sm flex flex-col gap-4 my-6">
        <h2 className="text-lg font-bold text-gray-700 text-center flex items-center justify-center gap-2">
          <span>{t.chooseLanguage}</span>
          <Volume2 className="w-4 h-4 text-brand-blue animate-bounce" />
        </h2>

        <div className="grid grid-cols-1 gap-3">
          {languages.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`flex items-center justify-between p-5 rounded-2xl transition-all cursor-pointer border text-left shadow-sm hover:shadow-md active:scale-[0.98] ${
                  isSelected
                    ? 'bg-white border-brand-green ring-3 ring-brand-green-light text-brand-green-dark'
                    : 'bg-white border-brand-beige-dark text-gray-700 hover:border-gray-300'
                }`}
              >
                <div>
                  <div className="text-xl font-bold">{lang.label}</div>
                  <div className="text-xs text-gray-400 font-medium mt-0.5">{lang.desc}</div>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                  isSelected ? 'border-brand-green bg-brand-green text-white' : 'border-gray-300'
                }`}>
                  {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: Navigation Action */}
      <div className="w-full max-w-sm flex flex-col gap-3">
        <button
          onClick={() => navigateTo('login')}
          className="w-full py-4 bg-brand-green hover:bg-brand-green-dark text-white text-lg font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98] cursor-pointer text-center"
        >
          {language === 'en' ? 'Get Started' : language === 'hi' ? 'शुरू करें' : 'सुरू करा'}
        </button>
      </div>
    </div>
  );
};

export default Splash;
