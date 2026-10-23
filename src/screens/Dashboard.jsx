import React, { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { translations } from "../data/translations";
import { schemesData } from "../data/schemes";
import {
  ClipboardCheck,
  BookOpen,
  FileText,
  MessageSquare,
  User,
  Bell,
  LogOut,
  ChevronRight,
  TrendingUp,
  Volume2,
  FolderLock,
} from "lucide-react";

const Dashboard = () => {
  const {
    language,
    profile,
    applications,
    navigateTo,
    speakText,
    logoutUser,
    notifications,
  } = useContext(AppContext);

  const t = translations[language] || translations.en;
  const activeApp = applications?.[0];

  const activeScheme = activeApp
    ? schemesData.find((scheme) => scheme.id === activeApp.schemeId)
    : null;

  const unreadNotifications = notifications.filter(
    (notification) => !notification.read,
  ).length;

  useEffect(() => {
    let statusText = "";

    if (activeApp && activeScheme) {
      const statusLoc =
        activeApp.status === "Verification"
          ? language === "hi"
            ? "सत्यापन के अधीन है"
            : language === "mr"
              ? "पडताळणीत आहे"
              : "under verification"
          : activeApp.status === "Approved"
            ? language === "hi"
              ? "मंजूर हो गया है"
              : language === "mr"
                ? "मंजूर झाला आहे"
                : "approved"
            : language === "hi"
              ? "दस्तावेज लंबित हैं"
              : language === "mr"
                ? "कागदपत्रे प्रलंबित आहेत"
                : "pending document upload";

      const schemeName =
        typeof activeScheme.name === "object"
          ? activeScheme.name[language] || activeScheme.name.en
          : activeScheme.name;

      statusText =
        language === "hi"
          ? `। आपका ${schemeName} का आवेदन ${statusLoc}।`
          : language === "mr"
            ? `. तुमचा ${schemeName} चा अर्ज ${statusLoc}.`
            : `. Your application for ${schemeName} is ${statusLoc}.`;
    }

    const farmerName = profile?.name || "Farmer";

    const greeting =
      language === "hi"
        ? `नमस्ते ${farmerName}! आपके कृषिसेतु डैशबोर्ड पर आपका स्वागत है${statusText} आज आप क्या करना चाहेंगे?`
        : language === "mr"
          ? `नमस्कार ${farmerName}! तुमच्या कृषीसेतू डॅशबोर्डवर स्वागत आहे${statusText} आज तुम्हाला काय करायला आवडेल?`
          : `Hello ${farmerName}! Welcome to your AgriCredit dashboard${statusText} What would you like to do today?`;

    speakText(greeting);
    // Speak the dashboard greeting when the screen first opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const menuItems = [
    {
      id: "eligibility",
      title: t.checkEligibility,
      desc: {
        en: "Answer 4 simple questions to check which loans you can get.",
        hi: "कौन से ऋण उपलब्ध हैं, यह जानने के लिए 4 आसान प्रश्नों के उत्तर दें।",
        mr: "तुम्हाला कोणती कर्जे मिळू शकतात हे पाहण्यासाठी ४ सोपे प्रश्न सोडवा.",
      },
      icon: ClipboardCheck,
      color:
        "bg-emerald-50 text-brand-green border-emerald-100 hover:border-brand-green",
      iconColor: "bg-brand-green text-white",
    },
    {
      id: "directory",
      title: t.exploreSchemes,
      desc: {
        en: "Browse government loan schemes in detail with voice explanation.",
        hi: "आवाज स्पष्टीकरण के साथ सरकारी ऋण योजनाओं को विस्तार से देखें।",
        mr: "व्हॉईस स्पष्टीकरणासह सरकारी कर्ज योजना सविस्तर पहा.",
      },
      icon: BookOpen,
      color: "bg-sky-50 text-brand-blue border-sky-100 hover:border-brand-blue",
      iconColor: "bg-brand-blue text-white",
    },
    {
      id: "tracking",
      title: t.myApplications,
      desc: {
        en: "Track application status and check verification updates.",
        hi: "आवेदन की स्थिति और सत्यापन अपडेट देखें।",
        mr: "अर्जाची स्थिती आणि पडताळणी अपडेट तपासा.",
      },
      icon: FileText,
      color:
        "bg-amber-50 text-brand-accent border-amber-100 hover:border-brand-accent",
      iconColor: "bg-brand-accent text-white",
      badge: applications.length,
    },

    // NEW FEATURE: Smart Document Vault
    {
      id: "docmanager",
      title: {
        en: "Smart Document Vault",
        hi: "स्मार्ट दस्तावेज़ वॉल्ट",
        mr: "स्मार्ट डॉक्युमेंट व्हॉल्ट",
      }[language],
      desc: {
        en: "Upload, store, download and manage your loan documents.",
        hi: "अपने ऋण दस्तावेज़ अपलोड करें, सहेजें और प्रबंधित करें।",
        mr: "तुमची कर्जाची कागदपत्रे अपलोड करा, जतन करा आणि व्यवस्थापित करा.",
      },
      icon: FolderLock,
      color:
        "bg-emerald-50 text-brand-green border-emerald-100 hover:border-brand-green",
      iconColor: "bg-brand-green text-white",
    },

    {
      id: "ai-chat",
      title: t.aiAssistant,
      desc: {
        en: "Ask me questions in English, Hindi, or Marathi.",
        hi: "मुझसे अंग्रेजी, हिंदी या मराठी में कोई भी सवाल पूछें।",
        mr: "मला इंग्रजी, हिंदी किंवा मराठीमध्ये प्रश्न विचारा.",
      },
      icon: MessageSquare,
      color:
        "bg-purple-50 text-purple-600 border-purple-100 hover:border-purple-500",
      iconColor: "bg-purple-500 text-white",
    },
    {
      id: "profile",
      title: t.profile,
      desc: {
        en: "View and edit crop, land, bank, and income details.",
        hi: "फसल, भूमि, बैंक और आय का विवरण देखें और संपादित करें।",
        mr: "पीक, जमीन, बँक आणि उत्पन्नाची माहिती पहा आणि बदला.",
      },
      icon: User,
      color: "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-500",
      iconColor: "bg-gray-500 text-white",
    },
  ];

  return (
    <div className="px-5 py-6 bg-brand-beige min-h-[92vh] pb-24 animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-brand-green/20 border-2 border-brand-green flex items-center justify-center font-extrabold text-brand-green-dark text-lg uppercase shadow-inner">
            {(profile?.name || "F").charAt(0)}
          </div>

          <div>
            <div className="text-xs text-gray-400 font-bold tracking-wider uppercase">
              {language === "en"
                ? "Welcome"
                : language === "hi"
                  ? "नमस्ते"
                  : "नमस्कार"}
            </div>

            <div className="text-lg font-extrabold text-brand-green-deep">
              {profile?.name || "Farmer"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigateTo("notifications")}
            aria-label="Notifications"
            className="w-10 h-10 bg-white border border-brand-beige-dark rounded-xl flex items-center justify-center text-gray-500 hover:text-brand-blue relative shadow-sm cursor-pointer"
          >
            <Bell className="w-5 h-5" />

            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-accent text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                {unreadNotifications}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={logoutUser}
            aria-label="Log out"
            title="Log Out"
            className="w-10 h-10 bg-white border border-brand-beige-dark rounded-xl flex items-center justify-center text-red-500 hover:text-red-700 shadow-sm cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Location and Land Card */}
      <div className="bg-white rounded-2xl p-4 border border-brand-beige-dark shadow-sm flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-green-light rounded-xl">
            <TrendingUp className="w-5 h-5 text-brand-green" />
          </div>

          <div>
            <div className="text-xs text-gray-400 font-bold">
              {language === "en"
                ? "Location & Land"
                : language === "hi"
                  ? "स्थान और भूमि"
                  : "स्थान आणि जमीन"}
            </div>

            <div className="text-sm font-bold text-gray-700">
              {profile?.district || "District"}, {profile?.state || "State"}{" "}
              &bull; {profile?.landSize || "0"} Acres
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigateTo("profile")}
          className="text-xs font-bold text-brand-blue hover:underline cursor-pointer"
        >
          {language === "en" ? "Edit" : language === "hi" ? "बदलें" : "बदला"}
        </button>
      </div>

      {/* Active Loan Status */}
      {activeApp && activeScheme && (
        <div className="bg-gradient-to-br from-brand-green-deep to-emerald-950 text-white rounded-2xl p-5 shadow-lg border border-brand-green/30 mb-6 flex flex-col gap-3 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/5" />

          <div className="flex justify-between items-start">
            <div>
              <span className="bg-white/15 text-brand-green-light text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">
                {language === "en"
                  ? "Active Loan Status"
                  : language === "hi"
                    ? "सक्रिय ऋण स्थिति"
                    : "सक्रिय कर्ज स्थिती"}
              </span>

              <h3 className="text-lg font-bold mt-1 text-white truncate max-w-[200px]">
                {typeof activeScheme.name === "object"
                  ? activeScheme.name[language] || activeScheme.name.en
                  : activeScheme.name}
              </h3>
            </div>

            <span
              className={`text-xs font-black px-3 py-1 rounded-xl shadow-inner ${
                activeApp.status === "Verification"
                  ? "bg-amber-500 text-white"
                  : activeApp.status === "Approved"
                    ? "bg-brand-green text-white"
                    : "bg-red-500 text-white"
              }`}
            >
              {t[activeApp.status.toLowerCase().replace(" ", "")] ||
                activeApp.status}
            </span>
          </div>

          <div className="flex justify-between items-center border-t border-white/10 pt-3">
            <div>
              <div className="text-[10px] text-gray-300">
                {language === "en"
                  ? "Application ID"
                  : language === "hi"
                    ? "आवेदन आईडी"
                    : "अर्ज आयडी"}
              </div>

              <div className="text-sm font-mono font-bold text-brand-green-light">
                {activeApp.id}
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigateTo("tracking")}
              className="px-4 py-2 bg-brand-green text-white text-xs font-bold rounded-xl shadow hover:bg-brand-green-dark flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
            >
              <span>
                {language === "en"
                  ? "Track Progress"
                  : language === "hi"
                    ? "स्थिति देखें"
                    : "स्थिती पहा"}
              </span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Dashboard Menu */}
      <div className="flex flex-col gap-4">
        <h2 className="text-md font-bold text-gray-500 uppercase tracking-wider">
          {language === "en"
            ? "How can we help you?"
            : language === "hi"
              ? "हम आपकी क्या सहायता कर सकते हैं?"
              : "आम्ही तुम्हाला कशी मदत करू शकतो?"}
        </h2>

        <div className="flex flex-col gap-3">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                type="button"
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`p-5 rounded-2xl border border-transparent transition-all flex items-center justify-between text-left shadow-sm active:scale-[0.99] cursor-pointer bg-white ${item.color}`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3.5 rounded-2xl shadow-md ${item.iconColor}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-gray-800 flex items-center gap-2">
                      <span>{item.title}</span>

                      {item.badge !== undefined && (
                        <span className="bg-brand-accent text-white text-xs px-2 py-0.5 rounded-full font-bold">
                          {item.badge}
                        </span>
                      )}
                    </h3>

                    <p className="text-xs text-gray-500 mt-1 max-w-[240px] leading-relaxed">
                      {item.desc[language] || item.desc.en}
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Voice Guidance Tip */}
      <div className="mt-8 bg-brand-blue-light/30 border border-brand-blue/10 p-4 rounded-2xl flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center shrink-0">
          <Volume2 className="w-5 h-5 text-brand-blue" />
        </div>

        <p className="text-xs text-brand-blue-dark leading-relaxed font-semibold">
          {language === "en"
            ? "Tip: Look for the blue speaker icons. Tap them to hear descriptions read aloud in your language."
            : language === "hi"
              ? "सुझाव: नीले रंग के स्पीकर आइकन खोजें। उन्हें अपनी भाषा में विवरण सुनने के लिए टैप करें।"
              : "टीप: निळ्या रंगाचे स्पीकर चिन्हे शोधा. तुमच्या भाषेत माहिती ऐकण्यासाठी त्यावर दाबा."}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
