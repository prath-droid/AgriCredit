import React, { useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { translations } from '../data/translations';
import { schemesData } from '../data/schemes';
import { ArrowLeft, Volume2, CheckCircle2, FileText, ArrowRight, Play, Square } from 'lucide-react';

const SchemeDetail = () => {
  const { 
    language, 
    selectedSchemeId, 
    navigateTo, 
    speakText, 
    voiceSpeaking, 
    stopSpeaking,
    applyForScheme
  } = useContext(AppContext);
  
  const t = translations[language];

  // Fetch scheme detail
  const scheme = schemesData.find(s => s.id === selectedSchemeId) || schemesData[0];

  useEffect(() => {
    // Automatically narrate the details on entry
    const timer = setTimeout(() => {
      speakText(scheme.aiExplain[language]);
    }, 500);
    return () => clearTimeout(timer);
  }, [selectedSchemeId]);

  const handleApply = () => {
    stopSpeaking();
    navigateTo('apply');
  };

  return (
    <div className="px-5 py-6 bg-brand-beige min-h-[92vh] pb-24 animate-fade-in-up">
      {/* Navigation */}
      <div className="flex justify-between items-center mb-5">
        <button
          onClick={() => {
            stopSpeaking();
            navigateTo('directory');
          }}
          className="w-10 h-10 bg-white border border-brand-beige-dark rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-700 shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs uppercase font-extrabold text-brand-blue bg-brand-blue-light px-3 py-1 rounded-full">
          {scheme.category === 'crop' ? t.filterCrop :
           scheme.category === 'infrastructure' ? t.filterInfra :
           scheme.category === 'entrepreneurship' ? t.filterEntrepreneur : t.filterLivestock}
        </span>
        <button
          onClick={() => speakText(scheme.aiExplain[language])}
          className="w-10 h-10 bg-white border border-brand-beige-dark rounded-xl flex items-center justify-center text-brand-blue shadow-sm"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* Main Title Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-brand-green-deep tracking-tight leading-snug">
          {scheme.name[language]}
        </h1>
      </div>

      {/* Floating AI Voice Guide Card */}
      <div className="bg-white rounded-3xl p-5 border border-brand-beige-dark shadow-sm mb-6 flex items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-brand-blue"></div>
        <div className="bg-brand-blue-light p-3 rounded-2xl flex items-center justify-center text-brand-blue shrink-0">
          <Volume2 className="w-6 h-6 animate-pulse" />
        </div>
        <div className="flex-1">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            {language === 'en' ? 'AI Voice Guide' : language === 'hi' ? 'एआई वॉयस गाइड' : 'एआय व्हॉईस मार्गदर्शक'}
          </h4>
          <p className="text-sm font-bold text-gray-700 leading-snug">
            {voiceSpeaking 
              ? (language === 'en' ? 'AI is speaking now...' : language === 'hi' ? 'एआई अभी बोल रही है...' : 'एआय आता बोलत आहे...')
              : (language === 'en' ? 'Click below to listen to explanation' : language === 'hi' ? 'स्पष्टीकरण सुनने के लिए नीचे क्लिक करें' : 'स्पष्टीकरण ऐकण्यासाठी खाली दाबा')}
          </p>
          <div className="flex gap-2 mt-2">
            {!voiceSpeaking ? (
              <button
                onClick={() => speakText(scheme.aiExplain[language])}
                className="px-3 py-1 bg-brand-blue text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>{language === 'en' ? 'Listen' : language === 'hi' ? 'सुनें' : 'ऐका'}</span>
              </button>
            ) : (
              <button
                onClick={stopSpeaking}
                className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Square className="w-3 h-3 fill-white" />
                <span>{language === 'en' ? 'Stop' : language === 'hi' ? 'रोकें' : 'थांबवा'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid Specs */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white p-4 rounded-2xl border border-brand-beige-dark shadow-sm">
          <span className="text-[10px] text-gray-400 font-bold uppercase block mb-0.5">{t.loanAmount}</span>
          <span className="text-lg font-black text-brand-green-dark">{scheme.maxAmount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-brand-beige-dark shadow-sm">
          <span className="text-[10px] text-gray-400 font-bold uppercase block mb-0.5">{t.interestRate}</span>
          <span className="text-lg font-black text-brand-blue-dark">{scheme.interestRate}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-brand-beige-dark shadow-sm col-span-2">
          <span className="text-[10px] text-gray-400 font-bold uppercase block mb-0.5">
            {language === 'en' ? 'Repayment Details' : language === 'hi' ? 'पुनर्भुगतान विवरण' : 'परतफेड तपशील'}
          </span>
          <span className="text-sm font-bold text-gray-700">{scheme.repayment}</span>
        </div>
      </div>

      {/* Key Benefits List */}
      <div className="bg-white rounded-3xl p-5 border border-brand-beige-dark shadow-sm mb-6 flex flex-col gap-3">
        <h3 className="text-md font-extrabold text-brand-green-deep border-b border-brand-beige-dark pb-2 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-brand-green" />
          <span>{t.benefitsTitle}</span>
        </h3>
        <ul className="flex flex-col gap-2.5">
          {scheme.benefits[language].map((benefit, idx) => (
            <li key={idx} className="flex gap-2.5 items-start">
              <span className="text-brand-green text-sm font-bold shrink-0 mt-0.5">&bull;</span>
              <p className="text-xs text-gray-600 font-semibold leading-relaxed">{benefit}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Required Documents List */}
      <div className="bg-white rounded-3xl p-5 border border-brand-beige-dark shadow-sm mb-6 flex flex-col gap-3">
        <h3 className="text-md font-extrabold text-brand-green-deep border-b border-brand-beige-dark pb-2 flex items-center gap-2">
          <FileText className="w-5 h-5 text-brand-blue" />
          <span>{t.requiredDocs}</span>
        </h3>
        <div className="grid grid-cols-1 gap-2.5">
          {scheme.documents.map((doc, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-brand-beige/30 p-2.5 rounded-xl border border-brand-beige-dark/50">
              <div className="w-6 h-6 rounded-lg bg-brand-blue-light text-brand-blue flex items-center justify-center font-bold text-xs">
                {idx + 1}
              </div>
              <span className="text-xs font-bold text-gray-700">
                {language === 'en' ? doc.name : language === 'hi' ? doc.nameHi : doc.nameMr}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Eligibility description details */}
      <div className="bg-white rounded-3xl p-5 border border-brand-beige-dark shadow-sm mb-6 flex flex-col gap-2">
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
          {language === 'en' ? 'Who can apply?' : language === 'hi' ? 'कौन आवेदन कर सकता है?' : 'कोण अर्ज करू शकतो?'}
        </span>
        <p className="text-xs font-bold text-gray-600 leading-relaxed">
          {scheme.eligibilityDesc[language]}
        </p>
      </div>

      {/* Apply Button */}
      <div className="max-w-sm mx-auto mt-6">
        <button
          onClick={handleApply}
          className="w-full py-4 bg-brand-green hover:bg-brand-green-dark text-white text-lg font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
        >
          <span>{t.applyNow}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default SchemeDetail;
