import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { translations } from "../data/translations";
import { schemesData } from "../data/schemes";
import {
  ArrowLeft,
  Check,
  Compass,
  ShieldAlert,
  ArrowRight,
  Volume2,
} from "lucide-react";

const Application = () => {
  const {
    language,
    profile,
    selectedSchemeId,
    navigateTo,
    applyForScheme,
    speakText,
  } = useContext(AppContext);

  const [step, setStep] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const t = translations[language];

  // Fetch scheme
  const scheme =
    schemesData.find((s) => s.id === selectedSchemeId) || schemesData[0];

  useEffect(() => {
    if (step === 1) {
      const text =
        language === "hi"
          ? "अपने विवरण की पुष्टि करें। हमने आपकी प्रोफ़ाइल से आपकी जानकारी ले ली है। यदि यह सही है, तो पुष्टि करें बटन दबाएं।"
          : language === "mr"
            ? "माहितीची खात्री करा. आम्ही तुमच्या प्रोफाइलवरून माहिती भरली आहे. योग्य असल्यास, पुढे जाण्यासाठी बटण दाबा."
            : "Please confirm your details. We have loaded your profile information. Tap confirm if everything is correct.";
      speakText(text);
    } else if (step === 2) {
      const text =
        language === "hi"
          ? "कृषि ऋण सहमति। नियम और शर्तों से सहमत होने के लिए बड़े चेकमार्क पर क्लिक करें।"
          : language === "mr"
            ? "कर्ज अर्ज संमती. नियम व अटी मान्य करण्यासाठी मोठ्या टिकमार्कवर दाबा."
            : "Loan consent. Tap the checkmark to agree to the credit check and terms.";
      speakText(text);
    }
  }, [step]);

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2);
    } else {
      if (!agreed) return;
      // Apply and save
      const appId = applyForScheme(scheme.id);
      speakText(
        language === "hi"
          ? "आवेदन शुरू हो गया है। कृपया आवश्यक दस्तावेज अपलोड करें।"
          : language === "mr"
            ? "अर्ज दाखल केला आहे. कृपया आता कागदपत्रे अपलोड करा."
            : "Application created. Let's upload your documents.",
      );
      navigateTo("docs"); // Navigate to Document Manager
    }
  };

  return (
    <div className="px-5 py-6 bg-brand-beige min-h-[92vh] pb-24 flex flex-col justify-between animate-fade-in-up">
      {/* Header */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={
              step === 2 ? () => setStep(1) : () => navigateTo("scheme-detail")
            }
            className="w-10 h-10 bg-white border border-brand-beige-dark rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-700 shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-extrabold text-brand-green-deep">
            {language === "en"
              ? "Digital Application"
              : language === "hi"
                ? "डिजिटल आवेदन"
                : "डिजिटल अर्ज"}
          </h1>
          <button
            onClick={() =>
              speakText(
                step === 1
                  ? "Verify details before applying"
                  : "Accept terms and conditions",
              )
            }
            className="w-10 h-10 bg-white border border-brand-beige-dark rounded-xl flex items-center justify-center text-brand-blue shadow-sm"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {/* Form Steps Progress */}
        <div className="flex justify-between items-center max-w-xs mx-auto mb-8 bg-white p-3 rounded-2xl border border-brand-beige-dark">
          <div className="flex items-center gap-1.5">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step >= 1
                  ? "bg-brand-green text-white"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              1
            </div>
            <span className="text-xs font-bold text-gray-600">{t.step2}</span>
          </div>
          <div className="h-0.5 w-8 bg-brand-beige-dark"></div>
          <div className="flex items-center gap-1.5">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step >= 2
                  ? "bg-brand-green text-white"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              2
            </div>
            <span className="text-xs font-bold text-gray-500">{t.step3}</span>
          </div>
        </div>
      </div>

      {/* Steps Content Area */}
      <div className="my-auto w-full max-w-sm flex-1 flex flex-col justify-center">
        {step === 1 ? (
          /* STEP 1: PRE-FILLED PROFILE VERIFICATION */
          <div className="flex flex-col gap-5 animate-fade-in-up">
            <div className="text-center">
              <span className="text-xs font-extrabold text-brand-blue bg-brand-blue-light px-2.5 py-0.5 rounded-full uppercase">
                {language === "en"
                  ? "Pre-filled from Profile"
                  : language === "hi"
                    ? "प्रोफ़ाइल से भरा हुआ"
                    : "प्रोफाइलवरून भरलेले"}
              </span>
              <h2 className="text-lg font-bold text-gray-700 mt-2">
                {language === "en"
                  ? "Verify your loan details"
                  : language === "hi"
                    ? "अपने ऋण विवरण सत्यापित करें"
                    : "कर्ज माहितीची खात्री करा"}
              </h2>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-brand-beige-dark shadow-sm flex flex-col gap-3.5">
              <div className="flex justify-between border-b border-brand-beige-dark/50 pb-2.5">
                <span className="text-xs font-bold text-gray-400">
                  {language === "en"
                    ? "Scheme"
                    : language === "hi"
                      ? "योजना"
                      : "योजना"}
                </span>
                <span className="text-xs font-black text-brand-green">
                  {scheme.name[language]}
                </span>
              </div>
              <div className="flex justify-between border-b border-brand-beige-dark/50 pb-2.5">
                <span className="text-xs font-bold text-gray-400">
                  {language === "en"
                    ? "Farmer Name"
                    : language === "hi"
                      ? "किसान का नाम"
                      : "शेतकऱ्याचे नाव"}
                </span>
                <span className="text-xs font-bold text-gray-800">
                  {profile.name}
                </span>
              </div>
              <div className="flex justify-between border-b border-brand-beige-dark/50 pb-2.5">
                <span className="text-xs font-bold text-gray-400">
                  {language === "en"
                    ? "Mobile"
                    : language === "hi"
                      ? "मोबाइल"
                      : "मोबाईल"}
                </span>
                <span className="text-xs font-mono font-bold text-gray-800">
                  +91 {profile.phone}
                </span>
              </div>
              <div className="flex justify-between border-b border-brand-beige-dark/50 pb-2.5">
                <span className="text-xs font-bold text-gray-400">
                  {language === "en"
                    ? "Land Size"
                    : language === "hi"
                      ? "भूमि आकार"
                      : "जमीन आकार"}
                </span>
                <span className="text-xs font-bold text-gray-800">
                  {profile.landSize} Acres ({profile.cropType})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs font-bold text-gray-400">
                  {language === "en"
                    ? "Bank Account"
                    : language === "hi"
                      ? "बैंक खाता"
                      : "बँक खाते"}
                </span>
                <span className="text-xs font-bold text-gray-800">
                  {profile.bankName} (...{profile.accountNumber.slice(-4)})
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* STEP 2: DECLARATION & CONSENT */
          <div className="flex flex-col gap-5 animate-fade-in-up">
            <div className="flex flex-col items-center text-center">
              <div className="p-3.5 bg-amber-500/10 text-amber-500 rounded-full mb-2">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                {language === "en"
                  ? "Farmer Declaration"
                  : language === "hi"
                    ? "किसान घोषणा पत्र"
                    : "शेतकरी घोषणा"}
              </h2>
            </div>

            <button
              onClick={() => setAgreed((prev) => !prev)}
              className={`p-6 rounded-3xl border-2 text-left transition-all active:scale-[0.98] cursor-pointer flex gap-4 ${
                agreed
                  ? "bg-brand-green-light/40 border-brand-green text-brand-green-deep shadow-sm"
                  : "bg-white border-brand-beige-dark text-gray-600 hover:border-gray-300"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  agreed
                    ? "bg-brand-green border-brand-green text-white"
                    : "border-gray-300 bg-white"
                }`}
              >
                {agreed && <Check className="w-5 h-5 stroke-[3px]" />}
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-brand-blue-dark">
                  {language === "en"
                    ? "I Consent & Agree"
                    : language === "hi"
                      ? "मैं सहमत हूँ"
                      : "मला मान्य आहे"}
                </p>
                <p className="text-xs font-semibold leading-relaxed text-gray-500 mt-1">
                  {language === "en"
                    ? "I hereby authorise AgriCredit to fetch my land registry records (7/12 extract) and verify my profile information for bank loan assessment."
                    : language === "hi"
                      ? "मैं इसके द्वारा कृषिसेतु को मेरी भूमि रजिस्ट्री रिकॉर्ड (7/12 उतरा) प्राप्त करने और बैंक ऋण मूल्यांकन के लिए मेरी प्रोफ़ाइल जानकारी सत्यापित करने के लिए अधिकृत करता हूँ।"
                      : "मी याद्वारे कृषीसेतूला माझी जमीन मालकी माहिती (७/१२ उतारा) गोळा करण्याची आणि बँक कर्ज मूल्यांकनासाठी माझ्या प्रोफाइलची पडताळणी करण्याची संमती देतो."}
                </p>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Wizard actions */}
      <div className="flex gap-3 max-w-sm w-full mx-auto mt-6">
        {step === 2 && (
          <button
            onClick={() => setStep(1)}
            className="w-1/3 py-4 bg-white border-2 border-brand-beige-dark hover:bg-gray-50 text-gray-600 font-bold rounded-2xl transition-all cursor-pointer text-center text-sm"
          >
            {t.back}
          </button>
        )}
        <button
          onClick={handleNextStep}
          disabled={step === 2 && !agreed}
          className={`py-4 text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer text-center ${
            step === 1
              ? "w-full text-lg bg-brand-green"
              : "w-2/3 text-md bg-brand-green"
          } ${step === 2 && !agreed ? "opacity-50 cursor-not-allowed bg-gray-400" : "bg-brand-green hover:bg-brand-green-dark"}`}
        >
          <span>
            {step === 1
              ? language === "en"
                ? "Confirm & Proceed"
                : language === "hi"
                  ? "पुष्टि करें और आगे बढ़ें"
                  : "खात्री करा आणि पुढे जा"
              : language === "en"
                ? "Submit Consent"
                : language === "hi"
                  ? "सहमति भेजें"
                  : "संमती द्या"}
          </span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Application;
