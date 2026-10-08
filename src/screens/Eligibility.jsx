import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { translations } from '../data/translations';
import { schemesData } from '../data/schemes';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Map, 
  Sprout, 
  Coins, 
  Sparkles, 
  Volume2,
  Calendar,
  AlertTriangle
} from 'lucide-react';

const Eligibility = () => {
  const { language, checkEligibility, eligibilityResult, navigateTo, speakText, setSelectedSchemeId } = useContext(AppContext);
  const [step, setStep] = useState(1);
  const t = translations[language];

  const [inputs, setInputs] = useState({
    landSize: 3.5,
    cropType: "Grapes",
    annualIncome: 180000,
    age: 45
  });

  // Prompt user with voice guidance on step changes
  useEffect(() => {
    if (eligibilityResult) {
      const outcome = eligibilityResult === 'eligible' 
        ? (language === 'hi' ? "बधाई हो! आप फसल ऋण योजनाओं के लिए पूर्ण रूप से पात्र हैं। नीचे दी गई योजनाओं को देखें।" : language === 'mr' ? "अभिनंदन! तुम्ही पीक कर्ज योजनांसाठी पूर्णपणे पात्र आहात. खालील योजना पहा." : "Congratulations! You are fully eligible for crop loan schemes. Check out the recommended schemes below.")
        : eligibilityResult === 'partial'
          ? (language === 'hi' ? "आप कुछ योजनाओं के लिए आंशिक रूप से पात्र हैं। अधिक भूमि मालिकों के लिए बुनियादी ढांचा ऋण सहायक हो सकते हैं।" : language === 'mr' ? "तुम्ही काही योजनांसाठी अंशतः पात्र आहात. अधिक जमीन असलेल्या शेतकऱ्यांसाठी पायाभूत सुविधा कर्ज फायदेशीर ठरू शकतात." : "You are partially eligible. Infrastructure loans might support larger land ownership.")
          : (language === 'hi' ? "आपकी आय सीमा ऋण पात्रता से अधिक है। कृपया अन्य व्यावसायिक योजनाओं का पता लगाएं।" : language === 'mr' ? "तुमचे उत्पन्न कर्ज मर्यादेपेक्षा जास्त आहे. कृपया इतर व्यावसायिक योजना शोधा." : "Your income exceeds the margin for subsidised credit. Explore our commercial schemes.");
      speakText(outcome);
      return;
    }

    let text = "";
    if (step === 1) {
      text = language === 'hi' ? "पहला कदम। आपके पास कुल कितने एकड़ जमीन है? स्लाइडर का उपयोग करें।" : language === 'mr' ? "पहिली पायरी. तुमच्याकडे एकूण किती एकर जमीन आहे? स्लाइडर वापरा." : "Step one. How many acres of land do you own? Use the slider.";
    } else if (step === 2) {
      text = language === 'hi' ? "दूसरा कदम। आप किस प्रकार की फसल उगाते हैं? कार्ड चुनें।" : language === 'mr' ? "दुसरी पायरी. तुम्ही कोणत्या प्रकारचे पीक घेता? कार्ड निवडा." : "Step two. What type of crop do you cultivate? Select a card.";
    } else if (step === 3) {
      text = language === 'hi' ? "तीसरा कदम। आपकी कुल वार्षिक आय कितनी है? इसे स्लाइडर से चुनें।" : language === 'mr' ? "तिसरी पायरी. तुमचे एकूण वार्षिक उत्पन्न किती आहे? स्लाइडरने निवडा." : "Step three. What is your total annual income? Choose with the slider.";
    } else if (step === 4) {
      text = language === 'hi' ? "अंतिम कदम। आपकी आयु कितनी है? इसे चुनें और आगे बढ़ें।" : language === 'mr' ? "शेवटची पायरी. तुमचे वय किती आहे? निवडून पुढे जा." : "Final step. What is your age? Select it and proceed.";
    }
    speakText(text);
  }, [step, eligibilityResult]);

  const handleNext = () => {
    if (step < 4) {
      setStep(prev => prev + 1);
    } else {
      checkEligibility(inputs);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const resetChecker = () => {
    setInputs({
      landSize: 3.5,
      cropType: "Grapes",
      annualIncome: 180000,
      age: 45
    });
    setStep(1);
    checkEligibility({ landSize: 0, cropType: "", annualIncome: 0, age: 0 }); // clear
    // set eligibilityResult to null indirectly
    navigateTo('dashboard');
  };

  const cropOptions = ["Grapes", "Sugarcane", "Wheat", "Rice", "Cotton", "Soybean", "Onion"];

  // Filter schemes based on result
  const getRecommendedSchemes = () => {
    if (eligibilityResult === "eligible") {
      return schemesData.filter(s => s.id === "kcc" || s.id === "acabc" || s.id === "nlm");
    } else if (eligibilityResult === "partial") {
      return schemesData.filter(s => s.id === "aif" || s.id === "acabc");
    } else {
      return schemesData.filter(s => s.id === "acabc"); // business startup
    }
  };

  return (
    <div className="px-5 py-6 bg-brand-beige min-h-[92vh] pb-24 flex flex-col justify-between animate-fade-in-up">
      {/* Header */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={eligibilityResult ? resetChecker : () => navigateTo('dashboard')}
            className="w-10 h-10 bg-white border border-brand-beige-dark rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-700 shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-extrabold text-brand-green-deep">
            {t.checkEligibility}
          </h1>
          <button
            onClick={() => speakText(eligibilityResult ? "Eligibility results page loaded." : `Step ${step} of 4.`)}
            className="w-10 h-10 bg-white border border-brand-beige-dark rounded-xl flex items-center justify-center text-brand-blue shadow-sm"
          >
            <Volume2 className="w-5 h-5 animate-pulse" />
          </button>
        </div>

        {/* Progress Bar (hide on results) */}
        {!eligibilityResult && (
          <div className="w-full flex items-center gap-2 mb-8">
            <span className="text-xs font-bold text-gray-400 shrink-0">
              {language === 'en' ? `Question ${step} of 4` : language === 'hi' ? `प्रश्न ${step}/4` : `प्रश्न ${step}/४`}
            </span>
            <div className="w-full bg-brand-beige-dark h-3 rounded-full overflow-hidden">
              <div 
                className="bg-brand-green h-full rounded-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Step Content */}
      <div className="my-auto w-full max-w-sm flex-1 flex flex-col justify-center">
        {eligibilityResult ? (
          /* RESULTS SCREEN */
          <div className="flex flex-col gap-6 animate-fade-in-up">
            <div className="bg-white rounded-3xl p-6 border border-brand-beige-dark shadow-sm text-center flex flex-col items-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white mb-4 ${
                eligibilityResult === 'eligible' 
                  ? 'bg-brand-green' 
                  : eligibilityResult === 'partial' 
                    ? 'bg-brand-accent' 
                    : 'bg-red-500'
              }`}>
                {eligibilityResult === 'eligible' ? <Check className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
              </div>

              <span className={`text-xs uppercase font-extrabold px-3 py-1 rounded-full mb-2 ${
                eligibilityResult === 'eligible'
                  ? 'bg-brand-green-light text-brand-green-dark'
                  : eligibilityResult === 'partial'
                    ? 'bg-amber-100 text-brand-accent'
                    : 'bg-red-100 text-red-700'
              }`}>
                {t[eligibilityResult]}
              </span>

              <h2 className="text-2xl font-black text-gray-800 tracking-tight">
                {eligibilityResult === 'eligible' 
                  ? (language === 'en' ? 'Fully Eligible!' : language === 'hi' ? 'पूर्णतः पात्र!' : 'पूर्णपणे पात्र!')
                  : eligibilityResult === 'partial'
                    ? (language === 'en' ? 'Partially Eligible' : language === 'hi' ? 'आंशिक रूप से पात्र' : 'अंशतः पात्र')
                    : (language === 'en' ? 'Ineligible for Subsidy' : language === 'hi' ? 'सब्सिडी के लिए अपात्र' : 'अनुदानासाठी अपात्र')}
              </h2>

              <p className="text-sm text-gray-500 font-medium leading-relaxed mt-2">
                {eligibilityResult === 'eligible'
                  ? (language === 'en' ? 'Great news! You meet all base requirements for standard government interest subvention loans.' : language === 'hi' ? 'बड़ी खुशखबरी! आप बुनियादी सरकारी रियायती ऋण योजनाओं के लिए सभी आवश्यकताओं को पूरा करते हैं।' : 'आनंदाची बातमी! तुम्ही सर्व मूलभूत कर्ज अटी पूर्ण करता. कमी व्याजदराच्या योजना खाली दिल्या आहेत.')
                  : eligibilityResult === 'partial'
                    ? (language === 'en' ? 'You qualify for medium enterprise loans. Consider co-applying or checking infrastructure funds.' : language === 'hi' ? 'आप मध्यम कृषि उद्यम ऋणों के पात्र हैं। बुनियादी ढांचा कोषों की जांच करें।' : 'तुमची जमीन मोठी असल्याने पायाभूत सुविधा योजनांसाठी अर्ज करा.')
                    : (language === 'en' ? 'Your annual income exceeds maximum threshold for free credit cards. Try startup ACABC grants.' : language === 'hi' ? 'आपकी वार्षिक आय सीमा क्रेडिट कार्ड पात्रता से अधिक है। कृपया एग्रो क्लीनिक विकल्प देखें।' : 'तुमचे उत्पन्न मर्यादेपेक्षा जास्त आहे. तुम्ही कृषी व्यवसाय सुरू करण्याचे कर्ज पाहू शकता.')}
              </p>
            </div>

            {/* Recommendations Section */}
            <div className="flex flex-col gap-3">
              <h3 className="text-md font-bold text-gray-500 uppercase tracking-wider">
                {t.recommendedSchemes}
              </h3>

              <div className="flex flex-col gap-3">
                {getRecommendedSchemes().map((scheme) => (
                  <button
                    key={scheme.id}
                    onClick={() => {
                      setSelectedSchemeId(scheme.id);
                      navigateTo('scheme-detail');
                    }}
                    className="p-4 bg-white hover:bg-brand-green-light/30 border border-brand-beige-dark rounded-2xl flex items-center justify-between text-left transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <div>
                      <h4 className="font-bold text-gray-800 text-md">{scheme.name[language]}</h4>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xs text-brand-green font-bold bg-brand-green-light px-2 py-0.5 rounded-md">
                          {scheme.interestRate}
                        </span>
                        <span className="text-xs text-gray-400 font-semibold">
                          Max: {scheme.maxAmount}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* STEP WIZARD */
          <div className="flex flex-col gap-6">
            {step === 1 && (
              <div className="flex flex-col gap-5 animate-fade-in-up">
                <div className="flex flex-col gap-1 items-center text-center">
                  <div className="p-3.5 bg-brand-green-light text-brand-green rounded-full mb-2">
                    <Map className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {language === 'en' ? 'Select your total land size' : language === 'hi' ? 'अपनी कुल भूमि का आकार चुनें' : 'तुमची एकूण जमीन निवडा'}
                  </h2>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-brand-beige-dark shadow-sm text-center">
                  <div className="text-4xl font-extrabold text-brand-green">
                    {inputs.landSize} <span className="text-lg font-bold text-gray-400">Acres</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="20"
                    step="0.5"
                    value={inputs.landSize}
                    onChange={(e) => setInputs(prev => ({ ...prev, landSize: parseFloat(e.target.value) }))}
                    className="w-full h-2 bg-brand-beige-dark rounded-lg appearance-none cursor-pointer accent-brand-green mt-6 mb-4"
                  />
                  <div className="flex justify-between text-xs text-gray-400 font-bold">
                    <span>0.5 Acres</span>
                    <span>20 Acres</span>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-5 animate-fade-in-up">
                <div className="flex flex-col gap-1 items-center text-center">
                  <div className="p-3.5 bg-brand-blue-light text-brand-blue rounded-full mb-2">
                    <Sprout className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {language === 'en' ? 'Select your primary crop' : language === 'hi' ? 'अपनी मुख्य फसल का चयन करें' : 'तुमचे मुख्य पीक निवडा'}
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-3 max-h-72 overflow-y-auto no-scrollbar py-1">
                  {cropOptions.map((crop) => {
                    const isSelected = inputs.cropType === crop;
                    return (
                      <button
                        key={crop}
                        onClick={() => setInputs(prev => ({ ...prev, cropType: crop }))}
                        className={`p-4 rounded-2xl border text-center transition-all active:scale-95 cursor-pointer font-bold ${
                          isSelected
                            ? 'bg-brand-blue-light border-brand-blue text-brand-blue-dark shadow-sm'
                            : 'bg-white border-brand-beige-dark text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {crop}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-5 animate-fade-in-up">
                <div className="flex flex-col gap-1 items-center text-center">
                  <div className="p-3.5 bg-brand-accent/15 text-brand-accent rounded-full mb-2">
                    <Coins className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {language === 'en' ? 'Estimate your annual income' : language === 'hi' ? 'अपनी वार्षिक आय का अनुमान लगाएं' : 'तुमचे अंदाजे वार्षिक उत्पन्न निवडा'}
                  </h2>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-brand-beige-dark shadow-sm text-center">
                  <div className="text-3xl font-extrabold text-brand-accent">
                    ₹ {inputs.annualIncome.toLocaleString('en-IN')}
                  </div>
                  <input
                    type="range"
                    min="20000"
                    max="1000000"
                    step="10000"
                    value={inputs.annualIncome}
                    onChange={(e) => setInputs(prev => ({ ...prev, annualIncome: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-brand-beige-dark rounded-lg appearance-none cursor-pointer accent-brand-accent mt-6 mb-4"
                  />
                  <div className="flex justify-between text-xs text-gray-400 font-bold">
                    <span>₹ 20,000</span>
                    <span>₹ 10 Lakhs</span>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="flex flex-col gap-5 animate-fade-in-up">
                <div className="flex flex-col gap-1 items-center text-center">
                  <div className="p-3.5 bg-purple-100 text-purple-600 rounded-full mb-2">
                    <Calendar className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {language === 'en' ? 'Select your current age' : language === 'hi' ? 'अपनी वर्तमान आयु चुनें' : 'तुमचे चालू वय निवडा'}
                  </h2>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-brand-beige-dark shadow-sm text-center">
                  <div className="text-4xl font-extrabold text-purple-600">
                    {inputs.age} <span className="text-lg font-bold text-gray-400">Years</span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="80"
                    step="1"
                    value={inputs.age}
                    onChange={(e) => setInputs(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-brand-beige-dark rounded-lg appearance-none cursor-pointer accent-purple-600 mt-6 mb-4"
                  />
                  <div className="flex justify-between text-xs text-gray-400 font-bold">
                    <span>18 Years</span>
                    <span>80 Years</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Buttons */}
      {!eligibilityResult && (
        <div className="flex gap-3 max-w-sm w-full mx-auto mt-6">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="w-1/3 py-4 bg-white border-2 border-brand-beige-dark hover:bg-gray-50 text-gray-600 font-bold rounded-2xl transition-all cursor-pointer text-center text-sm"
            >
              {t.back}
            </button>
          )}
          <button
            onClick={handleNext}
            className={`py-4 bg-brand-green hover:bg-brand-green-dark text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer text-center ${
              step === 1 ? 'w-full text-lg' : 'w-2/3 text-md'
            }`}
          >
            <span>{step === 4 ? (language === 'en' ? 'View Results' : language === 'hi' ? 'परिणाम देखें' : 'निकाल पहा') : t.next}</span>
            {step < 4 && <ArrowRight className="w-5 h-5" />}
          </button>
        </div>
      )}

      {eligibilityResult && (
        <div className="max-w-sm w-full mx-auto mt-6">
          <button
            onClick={resetChecker}
            className="w-full py-4 bg-brand-green text-white text-lg font-bold rounded-2xl shadow-md transition-all active:scale-[0.98] cursor-pointer text-center"
          >
            {language === 'en' ? 'Back to Dashboard' : language === 'hi' ? 'डैशबोर्ड पर लौटें' : 'डॅशबोर्डवर परत जा'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Eligibility;
