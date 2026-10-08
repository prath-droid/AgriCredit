import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { translations } from '../data/translations';
import { schemesData } from '../data/schemes';
import { 
  ArrowLeft, 
  UploadCloud, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Volume2, 
  Play, 
  Check 
} from 'lucide-react';

const DocManager = () => {
  const { 
    language, 
    applications, 
    updateDocumentStatus, 
    navigateTo, 
    speakText 
  } = useContext(AppContext);

  const t = translations[language];

  // Fetch the latest application in status
  const currentApp = applications[0]; 
  const currentScheme = currentApp ? schemesData.find(s => s.id === currentApp.schemeId) : schemesData[0];

  const [uploadProgress, setUploadProgress] = useState({
    aadhaar: 0,
    passbook: 0,
    landRecord: 0
  });

  const [uploading, setUploading] = useState({
    aadhaar: false,
    passbook: false,
    landRecord: false
  });

  useEffect(() => {
    const text = language === 'hi'
      ? "कृपया आवश्यक दस्तावेज अपलोड करें। अपना आधार कार्ड, बैंक पासबुक या भूमि रिकॉर्ड अपलोड करने के लिए स्लॉट पर टैप करें।"
      : language === 'mr'
        ? "कृपया आवश्यक कागदपत्रे अपलोड करा. आधार कार्ड, बँक पासबुक किंवा जमिनीचा उतारा अपलोड करण्यासाठी कार्डवर दाबा."
        : "Please upload the required documents. Tap any slot to upload your Aadhaar Card, Bank Passbook, or Land Record.";
    speakText(text);
  }, []);

  const handleSimulatedUpload = (docType, label) => {
    if (uploading[docType] || (currentApp && currentApp.documents[docType] === 'uploaded')) return;

    setUploading(prev => ({ ...prev, [docType]: true }));
    setUploadProgress(prev => ({ ...prev, [docType]: 5 }));

    speakText(
      language === 'hi' 
        ? `${label} अपलोड हो रहा है, कृपया प्रतीक्षा करें।` 
        : language === 'mr' 
          ? `${label} अपलोड होत आहे, कृपया वाट पहा.` 
          : `Uploading ${label}, please wait.`
    );

    // Simulate progress ticks
    let progressVal = 5;
    const interval = setInterval(() => {
      progressVal += 20;
      if (progressVal >= 100) {
        clearInterval(interval);
        setUploadProgress(prev => ({ ...prev, [docType]: 100 }));
        setUploading(prev => ({ ...prev, [docType]: false }));
        
        // Save to global state
        updateDocumentStatus(currentApp.id, docType, 'uploaded');
        
        speakText(
          language === 'hi'
            ? `${label} सफलतापूर्वक अपलोड कर दिया गया है।`
            : language === 'mr'
              ? `${label} यशस्वीरित्या अपलोड केले आहे.`
              : `${label} uploaded successfully.`
        );
      } else {
        setUploadProgress(prev => ({ ...prev, [docType]: progressVal }));
      }
    }, 300);
  };

  const handleComplete = () => {
    // Navigate to Application Tracking
    navigateTo('tracking');
  };

  if (!currentApp) {
    return (
      <div className="px-5 py-6 bg-brand-beige min-h-[92vh] flex items-center justify-center">
        <button onClick={() => navigateTo('dashboard')} className="p-4 bg-brand-green text-white font-bold rounded-2xl">
          Go back to dashboard
        </button>
      </div>
    );
  }

  const documentSlots = [
    {
      id: "aadhaar",
      label: language === 'en' ? "Aadhaar Card" : language === 'hi' ? "आधार कार्ड" : "आधार कार्ड",
      desc: {
        en: "Proof of identity (12-digit UIDAI number card)",
        hi: "पहचान का प्रमाण (12-अंकों का आधार कार्ड)",
        mr: "ओळख पुरावा (१२-अंकी आधार कार्ड)"
      }
    },
    {
      id: "passbook",
      label: language === 'en' ? "Bank Passbook" : language === 'hi' ? "बैंक पासबुक" : "बँक पासबुक",
      desc: {
        en: "Passbook front page showing Account No. & IFSC Code",
        hi: "खाता संख्या और आईएफएससी कोड दर्शाने वाला पासबुक का मुखपृष्ठ",
        mr: "खाते क्रमांक आणि आयएफएससी कोड असलेले बँक पासबुक पहिले पान"
      }
    },
    {
      id: "landRecord",
      label: language === 'en' ? "Land Record (7/12 Extract)" : language === 'hi' ? "भूमि रिकॉर्ड (7/12 उतरा)" : "जमीन उतारा (७/१२)",
      desc: {
        en: "Land possession details certified by Patwari",
        hi: "पटवारी द्वारा प्रमाणित भूमि स्वामित्व विवरण",
        mr: "तलाठ्याकडून प्रमाणित जमिनीचा अधिकार अभिलेख (७/१२)"
      }
    }
  ];

  const allUploaded = Object.values(currentApp.documents).every(s => s === 'uploaded');

  return (
    <div className="px-5 py-6 bg-brand-beige min-h-[92vh] pb-24 flex flex-col justify-between animate-fade-in-up">
      {/* Header */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigateTo('dashboard')}
            className="w-10 h-10 bg-white border border-brand-beige-dark rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-700 shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-extrabold text-brand-green-deep">
            {t.documentsUploadTitle}
          </h1>
          <button
            onClick={() => speakText(language === 'en' ? "Document Manager. Upload your identity proofs and land documents." : language === 'hi' ? "दस्तावेज प्रबंधक। अपनी पहचान प्रमाण और भूमि दस्तावेज अपलोड करें।" : "कागदपत्रे अपलोड विभाग. आधार, बँक माहिती आणि जमीन उतारा अपलोड करा.")}
            className="w-10 h-10 bg-white border border-brand-beige-dark rounded-xl flex items-center justify-center text-brand-blue shadow-sm"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {/* Current scheme info badge */}
        <div className="bg-white p-4 rounded-2xl border border-brand-beige-dark shadow-sm mb-6 flex items-center gap-3">
          <FileText className="w-5 h-5 text-brand-green shrink-0" />
          <div>
            <span className="text-[10px] text-gray-400 font-bold block uppercase">
              {language === 'en' ? 'Uploading files for' : language === 'hi' ? 'दस्तावेज जमा हो रहे हैं' : 'कागदपत्रे जमा होत आहेत'}
            </span>
            <span className="text-xs font-black text-gray-700">{currentScheme.name[language]}</span>
          </div>
        </div>
      </div>

      {/* Upload slots */}
      <div className="flex flex-col gap-4 flex-1 justify-center my-auto">
        {documentSlots.map((slot) => {
          const status = currentApp.documents[slot.id];
          const isUploaded = status === 'uploaded';
          const isUploading = uploading[slot.id];
          const progress = uploadProgress[slot.id];

          return (
            <button
              key={slot.id}
              onClick={() => handleSimulatedUpload(slot.id, slot.label)}
              disabled={isUploaded || isUploading}
              className={`p-5 rounded-3xl border-2 text-left transition-all active:scale-[0.98] cursor-pointer flex flex-col gap-3 relative overflow-hidden ${
                isUploaded 
                  ? 'bg-emerald-50/50 border-brand-green/30' 
                  : isUploading 
                    ? 'bg-brand-blue-light/20 border-brand-blue/30' 
                    : 'bg-white border-brand-beige-dark hover:border-gray-300'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-md font-bold text-gray-800 tracking-tight">{slot.label}</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-snug font-medium max-w-[240px]">
                    {slot.desc[language]}
                  </p>
                </div>
                
                {/* Visual Status Indicator Icon */}
                <div className="shrink-0 mt-0.5">
                  {isUploaded ? (
                    <div className="bg-brand-green p-1.5 rounded-full flex items-center justify-center text-white">
                      <Check className="w-4 h-4 stroke-[3px]" />
                    </div>
                  ) : isUploading ? (
                    <div className="text-xs font-bold text-brand-blue animate-pulse">
                      {t.uploadProgress}
                    </div>
                  ) : (
                    <div className="bg-brand-beige-dark p-2 rounded-xl text-gray-400">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              {isUploading && (
                <div className="w-full bg-brand-beige-dark h-2 rounded-full overflow-hidden mt-1">
                  <div 
                    className="bg-brand-blue h-full rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              )}

              {/* Upload Status text badges */}
              <div className="flex items-center gap-1.5 mt-1 border-t border-brand-beige-dark/20 pt-2 text-[10px] font-bold">
                {isUploaded ? (
                  <span className="text-brand-green flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 fill-emerald-50 text-brand-green" />
                    <span>{t.statusUploaded}</span>
                  </span>
                ) : (
                  <span className="text-brand-accent flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{language === 'en' ? 'Upload Required' : language === 'hi' ? 'अपलोड आवश्यक' : 'अपलोड आवश्यक'}</span>
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <div className="max-w-sm w-full mx-auto mt-6">
        <button
          onClick={handleComplete}
          disabled={!allUploaded}
          className={`w-full py-4 text-white text-lg font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 ${
            allUploaded 
              ? 'bg-brand-green hover:bg-brand-green-dark' 
              : 'bg-gray-300 opacity-60 cursor-not-allowed'
          }`}
        >
          {allUploaded && <Check className="w-5 h-5" />}
          <span>
            {allUploaded 
              ? (language === 'en' ? 'Submit Application' : language === 'hi' ? 'आवेदन जमा करें' : 'अर्ज सादर करा')
              : (language === 'en' ? 'Upload All Documents' : language === 'hi' ? 'सभी दस्तावेज अपलोड करें' : 'सर्व कागदपत्रे अपलोड करा')}
          </span>
        </button>
      </div>
    </div>
  );
};

export default DocManager;
