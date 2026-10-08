import React, { useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { translations } from '../data/translations';
import { schemesData } from '../data/schemes';
import { ArrowLeft, CheckCircle2, Clock, Hourglass, HelpCircle, FileClock, Volume2 } from 'lucide-react';

const Tracking = () => {
  const { language, applications, navigateTo, speakText } = useContext(AppContext);
  const t = translations[language];

  const app = applications[0]; // get the latest application

  useEffect(() => {
    if (!app) return;
    const scheme = schemesData.find(s => s.id === app.schemeId);
    if (!scheme) return;

    let text = "";
    if (app.status === 'Submitted') {
      text = language === 'hi'
        ? `आवेदन ट्रैकिंग। ${scheme.name.hi} के लिए आपका आवेदन जमा कर दिया गया है।`
        : language === 'mr'
          ? `अर्ज ट्रॅकिंग. ${scheme.name.mr} साठी तुमचा अर्ज सादर केला आहे.`
          : `Application tracking. Your application for ${scheme.name.en} has been submitted successfully.`;
    } else if (app.status === 'Verification') {
      text = language === 'hi'
        ? `आवेदन ट्रैकिंग। ${scheme.name.hi} के लिए आपका आवेदन वर्तमान में सत्यापन के अधीन है। अधिकारी आपके भूमि दस्तावेजों की जांच कर रहे हैं।`
        : language === 'mr'
          ? `अर्ज ट्रॅकिंग. ${scheme.name.mr} साठी तुमचा अर्ज सध्या पडताळणी टप्प्यात आहे. अधिकारी जमीन उतारा तपासत आहेत.`
          : `Application tracking. Your application for ${scheme.name.en} is under verification. Officers are verifying your land record entries.`;
    } else if (app.status === 'Documents Pending') {
      text = language === 'hi'
        ? `आवेदन ट्रैकिंग। कुछ दस्तावेज अभी भी लंबित हैं। कृपया उन्हें शीघ्र अपलोड करें।`
        : language === 'mr'
          ? `अर्ज ट्रॅकिंग. काही कागदपत्रे प्रलंबित आहेत. कृपया ती लवकरात लवकर अपलोड करा.`
          : `Application tracking. Some documents are pending. Please upload them to resume verification.`;
    } else if (app.status === 'Approved') {
      text = language === 'hi'
        ? `बधाई हो! आपका आवेदन स्वीकृत हो गया है। कृपया संवितरण के लिए अपनी बैंक शाखा से संपर्क करें।`
        : language === 'mr'
          ? `अभिनंदन! तुमचा अर्ज मंजूर झाला आहे. कृपया कर्ज वितरणासाठी बँकेच्या शाखेत भेट द्या.`
          : `Congratulations! Your application is approved. Please visit your bank branch for disbursal.`;
    }
    speakText(text);
  }, []);

  if (!app) {
    return (
      <div className="px-5 py-6 bg-brand-beige min-h-[92vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-xl font-bold text-gray-500 mb-4">No active applications found.</h2>
        <button
          onClick={() => navigateTo('dashboard')}
          className="px-6 py-3 bg-brand-green text-white font-bold rounded-2xl shadow"
        >
          Go back to dashboard
        </button>
      </div>
    );
  }

  const scheme = schemesData.find(s => s.id === app.schemeId) || schemesData[0];

  // Define steps
  const steps = [
    {
      title: { en: "Application Submitted", hi: "आवेदन जमा किया गया", mr: "अर्ज सादर केला" },
      desc: { 
        en: `Received on ${app.date}`, 
        hi: `${app.date} को प्राप्त हुआ`, 
        mr: `${app.date} रोजी प्राप्त झाला` 
      },
      status: "completed" // always completed
    },
    {
      title: { en: "Land Record Verification", hi: "भूमि रिकॉर्ड सत्यापन", mr: "जमीन उतारा पडताळणी" },
      desc: { 
        en: "Matching land boundaries with state registry records.", 
        hi: "राज्य रजिस्ट्री रिकॉर्ड के साथ भूमि सीमाओं का मिलान किया जा रहा है।", 
        mr: "राज्य नोंदणी पुस्तकासह जमिनीच्या मालकीची खात्री केली जात आहे." 
      },
      status: app.status === 'Submitted' ? 'upcoming' : 'completed'
    },
    {
      title: { en: "Document Authenticity Check", hi: "दस्तावेज़ प्रामाणिकता जांच", mr: "कागदपत्र तपासणी" },
      desc: { 
        en: "Bank auditing Aadhaar Card and signature records.", 
        hi: "बैंक आधार कार्ड और हस्ताक्षर रिकॉर्ड का ऑडिट कर रहा है।", 
        mr: "बँक आधार कार्ड आणि स्वाक्षरी पडताळून पाहत आहे." 
      },
      status: (app.status === 'Submitted' || app.status === 'Verification') 
        ? 'upcoming' 
        : app.status === 'Documents Pending' 
          ? 'pending' 
          : 'completed'
    },
    {
      title: { en: "Final Loan Approval", hi: "अंतिम ऋण स्वीकृति", mr: "कर्ज मंजुरी" },
      desc: { 
        en: "Credit sanction letter issuing from rural branch office.", 
        hi: "ग्रामीण शाखा कार्यालय से क्रेडिट मंजूरी पत्र जारी किया जा रहा है।", 
        mr: "ग्रामीण बँक शाखेकडून मंजुरी पत्र जारी केले जात आहे." 
      },
      status: app.status === 'Approved' ? 'completed' : 'upcoming'
    }
  ];

  return (
    <div className="px-5 py-6 bg-brand-beige min-h-[92vh] pb-24 animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigateTo('dashboard')}
          className="w-10 h-10 bg-white border border-brand-beige-dark rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-700 shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-extrabold text-brand-green-deep">
          {t.applicationTracker}
        </h1>
        <button
          onClick={() => speakText(`Tracking application code ${app.id}. Currently ${app.status}.`)}
          className="w-10 h-10 bg-white border border-brand-beige-dark rounded-xl flex items-center justify-center text-brand-blue shadow-sm"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* Main scheme tag card */}
      <div className="bg-white rounded-3xl p-5 border border-brand-beige-dark shadow-sm mb-6 relative overflow-hidden">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
              {language === 'en' ? 'Tracking Application' : language === 'hi' ? 'आवेदन की स्थिति' : 'अर्ज प्रगती'}
            </span>
            <h2 className="text-md font-extrabold text-gray-800 mt-0.5">{scheme.name[language]}</h2>
            <div className="text-xs font-mono font-bold text-brand-blue mt-1.5">{app.id}</div>
          </div>
          
          <span className={`text-xs font-black px-3 py-1 rounded-xl shadow-inner ${
            app.status === 'Verification' 
              ? 'bg-amber-500 text-white animate-pulse' 
              : app.status === 'Approved'
                ? 'bg-brand-green text-white'
                : 'bg-red-500 text-white'
          }`}>
            {t[app.status.toLowerCase().replace(" ", "")] || app.status}
          </span>
        </div>
      </div>

      {/* Timeline Steps visual render */}
      <div className="bg-white rounded-3xl p-6 border border-brand-beige-dark shadow-sm flex flex-col gap-6">
        {steps.map((stepItem, idx) => {
          return (
            <div key={idx} className="flex gap-4 items-start relative">
              {/* Timeline connector line */}
              {idx < steps.length - 1 && (
                <div className={`absolute left-4.5 top-8 bottom-0 w-0.5 -mb-6 ${
                  stepItem.status === 'completed' ? 'bg-brand-green' : 'bg-brand-beige-dark'
                }`}></div>
              )}

              {/* Status Circle Icons */}
              <div className="shrink-0 mt-1">
                {stepItem.status === 'completed' ? (
                  <div className="w-9 h-9 rounded-full bg-brand-green text-white flex items-center justify-center shadow-md">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                ) : stepItem.status === 'pending' ? (
                  <div className="w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md animate-bounce">
                    <FileClock className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-full bg-brand-beige border-2 border-brand-beige-dark text-gray-400 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Step info labels */}
              <div className="flex-1">
                <h3 className={`text-sm font-extrabold ${
                  stepItem.status === 'completed' ? 'text-gray-800' : 'text-gray-400'
                }`}>
                  {stepItem.title[language]}
                </h3>
                <p className="text-xs text-gray-400 font-bold mt-0.5 leading-relaxed">
                  {stepItem.desc[language]}
                </p>

                {stepItem.status === 'pending' && (
                  <button 
                    onClick={() => navigateTo('docs')}
                    className="mt-2 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold rounded-lg shadow-sm cursor-pointer"
                  >
                    {language === 'en' ? 'Upload Missing Files' : language === 'hi' ? 'दस्तावेज अपलोड करें' : 'कागदपत्रे अपलोड करा'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tracking;
