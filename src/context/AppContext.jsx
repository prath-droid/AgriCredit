import React, { createContext, useState, useEffect } from "react";
import { schemesData } from "../data/schemes";
import {
  supabase,
  signOutSupabase,
  subscribeToApplications,
  subscribeToNotifications,
} from "../lib/supabase";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [language, setLanguage] = useState(
    () => localStorage.getItem("ks_language") || "en",
  );
  const [currentScreen, setCurrentScreen] = useState("splash");
  const [selectedSchemeId, setSelectedSchemeId] = useState(null);
  const [supabaseUser, setSupabaseUser] = useState(null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("ks_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("ks_profile");
    return saved
      ? JSON.parse(saved)
      : {
          name: "Ramesh Kumar",
          phone: "9876543210",
          age: "45",
          state: "Maharashtra",
          district: "Nashik",
          landSize: "3.5",
          cropType: "Grapes",
          annualIncome: "180000",
          bankName: "State Bank of India",
          accountNumber: "32145678901",
          ifscCode: "SBIN0001234",
        };
  });

  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem("ks_applications");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "APP-8392",
            schemeId: "kcc",
            status: "Verification", // 'Submitted' | 'Verification' | 'Documents Pending' | 'Approved' | 'Rejected'
            date: "24 Jul 2026",
            documents: {
              aadhaar: "uploaded",
              passbook: "uploaded",
              landRecord: "uploaded",
            },
          },
        ];
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("ks_notifications");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            title: {
              en: "Welcome to AgriCredit",
              hi: "कृषिसेतु में आपका स्वागत है",
              mr: "कृषीसेतू मध्ये आपले स्वागत आहे",
            },
            message: {
              en: "Explore agricultural loan schemes with the help of AI Voice Assistant.",
              hi: "एआई वॉयस असिस्टेंट की मदद से कृषि ऋण योजनाओं की खोज करें।",
              mr: "एआय व्हॉईस असिस्टंटच्या मदतीने कृषी कर्ज योजना शोधा.",
            },
            date: "2 hours ago",
            read: false,
          },
          {
            id: 2,
            title: {
              en: "Profile Pre-filled!",
              hi: "प्रोफ़ाइल पहले से भरी हुई है!",
              mr: "प्रोफाइल आधीच भरली आहे!",
            },
            message: {
              en: "Your profile details are loaded. You can verify them on the Profile tab.",
              hi: "आपके प्रोफ़ाइल विवरण लोड हो गए हैं। आप उन्हें प्रोफ़ाइल टैब पर सत्यापित कर सकते हैं।",
              mr: "तुमचे प्रोफाइल तपशील लोड झाले आहेत. तुम्ही ते प्रोफाइल टॅबवर तपासू शकता.",
            },
            date: "1 hour ago",
            read: false,
          },
        ];
  });

  const [eligibilityInputs, setEligibilityInputs] = useState({
    landSize: 3.5,
    cropType: "Crops",
    annualIncome: 180000,
    age: 45,
  });

  const [eligibilityResult, setEligibilityResult] = useState(null);

  // Voice Assistant & Continuous Guidance States
  const [voiceSpeaking, setVoiceSpeaking] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const [speechInstance, setSpeechInstance] = useState(null);
  const [continuousVoice, setContinuousVoice] = useState(() => {
    return localStorage.getItem("ks_continuous_voice") === "true";
  });

  useEffect(() => {
    localStorage.setItem("ks_continuous_voice", continuousVoice);
  }, [continuousVoice]);

  // Screen transition continuous narration for Hindi & Marathi guidance
  useEffect(() => {
    stopSpeaking();
    if (
      !continuousVoice ||
      currentScreen === "splash" ||
      currentScreen === "login"
    )
      return;

    const screenNarrations = {
      dashboard: {
        hi: "आप डैशबोर्ड पर हैं। यहाँ आप सरकारी ऋण योजनाओं और अपनी पात्रता देख सकते हैं।",
        mr: "तुम्ही डॅशबोर्डवर आहात. येथे तुम्ही सरकारी कर्ज योजना आणि तुमची पात्रता पाहू शकता.",
        en: "You are on the Farmer Dashboard. Explore top farm schemes or check loan eligibility.",
      },
      eligibility: {
        hi: "ऋण पात्रता जांच पृष्ठ। 4 सरल प्रश्नों के उत्तर देकर तुरंत परिणाम प्राप्त करें।",
        mr: "कर्ज पात्रता तपासणी पान. ४ सोप्या प्रश्नांची उत्तरे देऊन लगेच निकाल मिळवा.",
        en: "Check loan eligibility page. Answer four quick questions to view Instant result.",
      },
      docmanager: {
        hi: "दस्तावेज़ प्रबंधक। अपने आधार कार्ड, पासबुक और 7/12 भूमि रिकॉर्ड अपलोड करें।",
        mr: "कागदपत्र व्यवस्थापक. तुमचे आधार कार्ड, पासबुक आणि ७/१२ उतारा अपलोड करा.",
        en: "Document Manager. Upload your Aadhaar, Bank Passbook, and Land records.",
      },
      profile: {
        hi: "किसान प्रोफ़ाइल पृष्ठ। अपनी व्यक्तिगत और बैंक जानकारी देखें या बदलें।",
        mr: "शेतकरी प्रोफाइल पान. तुमची वैयक्तिक आणि बँक माहिती तपासा किंवा बदला.",
        en: "Farmer Profile page. Review and edit your contact and bank details.",
      },
      tracking: {
        hi: "आवेदन ट्रैकिंग स्क्रीन। अपने कृषि ऋण आवेदनों की स्थिति देखें।",
        mr: "अर्ज ट्रॅकिंग स्क्रीन. तुमच्या कृषी कर्ज अर्जांची स्थिती पहा.",
        en: "Application Tracking screen. Track status updates for your submitted loan files.",
      },
    };

    const textToNarrate = screenNarrations[currentScreen]?.[language];
    if (textToNarrate) {
      setTimeout(() => {
        speakText(textToNarrate);
      }, 400);
    }
  }, [currentScreen, continuousVoice, language]);

  const navigateTo = (screen) => {
    setCurrentScreen(screen);
  };

  const loginUser = (phone, name = "Ramesh Kumar", isGuest = false) => {
    const newUser = { phone, name, isGuest };
    setUser(newUser);
    setProfile((prev) => ({
      ...prev,
      phone,
      name: isGuest ? "Guest Farmer" : name,
    }));
    setCurrentScreen("dashboard");
    addNotification(
      isGuest ? "Logged in as Guest" : "Login Successful",
      isGuest
        ? "You have entered as a guest. Some features might require verification."
        : `Welcome back, ${name}! Your farmer dashboard is ready.`,
    );
  };

  const logoutUser = () => {
    signOutSupabase();
    setUser(null);
    stopSpeaking();
    setCurrentScreen("login");
  };

  const updateProfile = (updatedFields) => {
    setProfile((prev) => ({ ...prev, ...updatedFields }));
    addNotification(
      "Profile Updated",
      "Your farmer profile changes have been saved successfully.",
    );
  };

  const applyForScheme = (schemeId) => {
    const existing = applications.find((app) => app.schemeId === schemeId);
    if (existing) {
      navigateTo("tracking");
      return existing.id;
    }

    const newId = `APP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApp = {
      id: newId,
      schemeId,
      status: "Submitted",
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      documents: {
        aadhaar: "pending",
        passbook: "pending",
        landRecord: "pending",
      },
    };

    setApplications((prev) => [newApp, ...prev]);
    addNotification(
      "Application Submitted",
      `Your application for ${schemesData.find((s) => s.id === schemeId)?.name[language]} has been received.`,
    );
    return newId;
  };

  const updateDocumentStatus = (appId, docType, status) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          const updatedDocs = { ...app.documents, [docType]: status };

          // Check if all are uploaded
          const allUploaded = Object.values(updatedDocs).every(
            (s) => s === "uploaded",
          );
          const newStatus = allUploaded ? "Verification" : "Documents Pending";

          return { ...app, documents: updatedDocs, status: newStatus };
        }
        return app;
      }),
    );
  };

  const addNotification = (titleText, messageText) => {
    // Check if texts are objects (multilingual) or strings
    const titleObj =
      typeof titleText === "string"
        ? { en: titleText, hi: titleText, mr: titleText }
        : titleText;
    const msgObj =
      typeof messageText === "string"
        ? { en: messageText, hi: messageText, mr: messageText }
        : messageText;

    const newNotif = {
      id: Date.now(),
      title: titleObj,
      message: msgObj,
      date: "Just now",
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const checkEligibility = (inputs) => {
    setEligibilityInputs(inputs);
    // Simple mock logic
    let result = "eligible";
    if (inputs.landSize > 10) {
      result = "partial"; // limited assistance for larger landowners
    } else if (inputs.annualIncome > 500000) {
      result = "ineligible"; // exceeds margin for subsidised credit
    }
    setEligibilityResult(result);
    return result;
  };

  // Text to Speech integration with robust multilingual Web Speech API synthesis
  const speakText = (text, customLang = null) => {
    if (!text) return;
    stopSpeaking();

    const targetLang = customLang || language;
    const langCode =
      targetLang === "hi" ? "hi-IN" : targetLang === "mr" ? "mr-IN" : "en-IN";

    if (!("speechSynthesis" in window)) {
      console.warn("Speech synthesis not supported in this browser.");
      return;
    }

    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.rate = targetLang === "en" ? 0.95 : 0.85;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices() || [];
      let matchedVoice = null;

      if (targetLang === "hi") {
        matchedVoice =
          voices.find(
            (v) =>
              v.lang === "hi-IN" ||
              v.lang.startsWith("hi") ||
              v.name.toLowerCase().includes("hindi"),
          ) ||
          voices.find((v) => v.lang.includes("IN")) ||
          null;
      } else if (targetLang === "mr") {
        matchedVoice =
          voices.find(
            (v) =>
              v.lang === "mr-IN" ||
              v.lang.startsWith("mr") ||
              v.name.toLowerCase().includes("marathi"),
          ) ||
          voices.find(
            (v) =>
              v.lang === "hi-IN" ||
              v.lang.startsWith("hi") ||
              v.name.toLowerCase().includes("hindi"),
          ) ||
          voices.find((v) => v.lang.includes("IN")) ||
          null;
      } else {
        matchedVoice =
          voices.find(
            (v) =>
              v.lang === "en-IN" ||
              v.lang.startsWith("en-IN") ||
              v.name.toLowerCase().includes("india"),
          ) ||
          voices.find((v) => v.lang.startsWith("en")) ||
          null;
      }

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onstart = () => {
        setVoiceSpeaking(true);
        setVoiceText(text);
      };

      utterance.onend = () => {
        setVoiceSpeaking(false);
        setVoiceText("");
      };

      utterance.onerror = (e) => {
        console.warn("SpeechSynthesis utterance notice:", e);
        setVoiceSpeaking(false);
        setVoiceText("");
      };

      setSpeechInstance(utterance);

      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 50);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
      setVoiceSpeaking(false);
      setVoiceText("");
    }
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
    if (speechInstance && typeof speechInstance.pause === "function") {
      try {
        speechInstance.pause();
        speechInstance.currentTime = 0;
      } catch (e) {}
    }
    setVoiceSpeaking(false);
    setVoiceText("");
  };

  // Listen to getVoices loaded dynamically in some browsers
  useEffect(() => {
    if ("speechSynthesis" in window) {
      const handleVoicesChanged = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.addEventListener(
        "voiceschanged",
        handleVoicesChanged,
      );
      return () => {
        window.speechSynthesis.removeEventListener(
          "voiceschanged",
          handleVoicesChanged,
        );
      };
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        currentScreen,
        navigateTo,
        user,
        setUser,
        supabaseUser,
        profile,
        updateProfile,
        applications,
        applyForScheme,
        updateDocumentStatus,
        notifications,
        setNotifications,
        eligibilityInputs,
        eligibilityResult,
        checkEligibility,
        selectedSchemeId,
        setSelectedSchemeId,
        loginUser,
        logoutUser,
        voiceSpeaking,
        voiceText,
        speakText,
        stopSpeaking,
        continuousVoice,
        setContinuousVoice,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
