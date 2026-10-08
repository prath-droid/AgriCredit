import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { translations } from '../data/translations';
import { schemesData } from '../data/schemes';
import { Search, Volume2, ArrowRight, ChevronRight, Compass } from 'lucide-react';

const Directory = () => {
  const { language, navigateTo, speakText, voiceSpeaking, setSelectedSchemeId } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  const t = translations[language];

  useEffect(() => {
    const text = language === 'hi'
      ? "विभिन्न ऋण योजनाओं की खोज करें। विवरण देखने के लिए किसी भी कार्ड पर क्लिक करें, या एआई स्पष्टीकरण सुनने के लिए नीला बटन दबाएं।"
      : language === 'mr'
        ? "विविध कर्ज योजना शोधा. माहिती पाहण्यासाठी कोणत्याही कार्डवर दाबा, किंवा एआय स्पष्टीकरण ऐकण्यासाठी निळे बटण दाबा."
        : "Explore government loan schemes. Click on any card to view details, or tap the AI Explain button to hear an audio summary.";
    speakText(text);
  }, []);

  // Filter schemes list
  const filteredSchemes = schemesData.filter(scheme => {
    const matchesSearch = scheme.name[language].toLowerCase().includes(searchTerm.toLowerCase()) || 
                          scheme.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || scheme.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', label: t.filterAll },
    { id: 'crop', label: t.filterCrop },
    { id: 'infrastructure', label: t.filterInfra },
    { id: 'entrepreneurship', label: t.filterEntrepreneur },
    { id: 'livestock', label: t.filterLivestock }
  ];

  return (
    <div className="px-5 py-6 bg-brand-beige min-h-[92vh] pb-24 animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-brand-green/10 text-brand-green rounded-xl">
            <Compass className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-extrabold text-brand-green-deep">
            {language === 'en' ? 'Government Loans' : language === 'hi' ? 'सरकारी ऋण योजनाएं' : 'सरकारी कर्ज योजना'}
          </h1>
        </div>
        <button
          onClick={() => speakText(language === 'en' ? "Government loan directory. Filter and search available schemes." : language === 'hi' ? "सरकारी ऋण निर्देशिका। उपलब्ध योजनाओं को फ़िल्टर और खोजें।" : "सरकारी कर्ज निर्देशिका. कर्ज योजना शोधा आणि निवडा.")}
          className="w-10 h-10 bg-white border border-brand-beige-dark rounded-xl flex items-center justify-center text-brand-blue shadow-sm"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* Search Input Card */}
      <div className="relative flex items-center mb-5">
        <Search className="absolute left-4 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-brand-beige-dark rounded-2xl text-sm font-semibold text-gray-700 placeholder-gray-300 focus:border-brand-green focus:outline-none transition-all shadow-sm"
        />
      </div>

      {/* Categories Horizontal Scroll */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 -mx-5 px-5">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all active:scale-95 cursor-pointer shadow-sm ${
                isActive
                  ? 'bg-brand-green border-brand-green text-white'
                  : 'bg-white border-brand-beige-dark text-gray-600 hover:border-gray-300'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Scheme Cards Grid */}
      <div className="flex flex-col gap-4 mt-2">
        {filteredSchemes.length > 0 ? (
          filteredSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-white rounded-3xl p-5 border border-brand-beige-dark shadow-sm hover:shadow-md transition-all flex flex-col gap-4 relative overflow-hidden"
            >
              {/* Category Indicator Accent Line */}
              <div className={`absolute left-0 top-0 bottom-0 w-2 ${
                scheme.category === 'crop' ? 'bg-brand-green' :
                scheme.category === 'infrastructure' ? 'bg-brand-blue' :
                scheme.category === 'entrepreneurship' ? 'bg-purple-500' : 'bg-brand-accent'
              }`}></div>

              {/* Title Section */}
              <div className="flex justify-between items-start pl-2">
                <div className="cursor-pointer flex-1" onClick={() => {
                  setSelectedSchemeId(scheme.id);
                  navigateTo('scheme-detail');
                }}>
                  <h3 className="font-extrabold text-gray-800 text-md tracking-tight leading-snug">
                    {scheme.name[language]}
                  </h3>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mt-0.5">
                    {scheme.category === 'crop' ? t.filterCrop :
                     scheme.category === 'infrastructure' ? t.filterInfra :
                     scheme.category === 'entrepreneurship' ? t.filterEntrepreneur : t.filterLivestock}
                  </span>
                </div>
                
                {/* AI Explain Voice Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const audioText = scheme.aiExplain[language];
                    speakText(audioText);
                  }}
                  className="w-10 h-10 bg-brand-blue-light text-brand-blue hover:bg-brand-blue hover:text-white rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-sm"
                  title="Explain with AI voice"
                  aria-label="Explain scheme with AI voice"
                >
                  <Volume2 className="w-5 h-5 animate-pulse" />
                </button>
              </div>

              {/* Key Details Strip */}
              <div className="grid grid-cols-2 gap-4 bg-brand-beige/50 p-3 rounded-2xl pl-4 border border-brand-beige-dark/50">
                <div>
                  <div className="text-[10px] text-gray-400 font-bold tracking-wide uppercase">{t.loanAmount}</div>
                  <div className="text-md font-extrabold text-brand-green-dark">{scheme.maxAmount}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 font-bold tracking-wide uppercase">{t.interestRate}</div>
                  <div className="text-md font-extrabold text-brand-blue-dark">{scheme.interestRate}</div>
                </div>
              </div>

              {/* Summary Description & Action */}
              <div className="flex justify-between items-center pl-2">
                <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-[220px] line-clamp-2">
                  {scheme.eligibilityDesc[language]}
                </p>

                <button
                  onClick={() => {
                    setSelectedSchemeId(scheme.id);
                    navigateTo('scheme-detail');
                  }}
                  className="flex items-center gap-1 text-xs font-bold text-brand-green hover:underline cursor-pointer py-1"
                >
                  <span>{language === 'en' ? 'Details' : language === 'hi' ? 'विवरण' : 'माहिती'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-400 bg-white rounded-3xl border border-brand-beige-dark">
            <Compass className="w-12 h-12 mx-auto text-gray-300 mb-2 animate-spin" />
            <p className="font-bold">
              {language === 'en' ? 'No schemes found.' : language === 'hi' ? 'कोई योजना नहीं मिली।' : 'कोणतीही योजना सापडली नाही.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Directory;
