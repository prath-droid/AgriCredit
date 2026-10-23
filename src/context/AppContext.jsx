import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

import { schemesData } from "../data/schemes";
import { signOutSupabase } from "../lib/supabase";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const speechRequestId = useRef(0);
  const speechTimeoutRef = useRef(null);
  const voiceListenerRef = useRef(null);

  const [language, setLanguage] = useState(
    () => localStorage.getItem("ks_language") || "en",
  );

  const [currentScreen, setCurrentScreen] = useState("splash");
  const [selectedSchemeId, setSelectedSchemeId] = useState(null);
  const [supabaseUser, setSupabaseUser] = useState(null);

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("ks_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [profile, setProfile] = useState(() => {
    const defaultProfile = {
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

    try {
      const saved = localStorage.getItem("ks_profile");
      return saved ? JSON.parse(saved) : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem("ks_applications");

      return saved
        ? JSON.parse(saved)
        : [
            {
              id: "APP-8392",
              schemeId: "kcc",
              status: "Verification",
              date: "24 Jul 2026",
              documents: {
                aadhaar: "uploaded",
                passbook: "uploaded",
                landRecord: "uploaded",
              },
            },
          ];
    } catch {
      return [];
    }
  });

  const [notifications, setNotifications] = useState(() => {
    try {
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
                mr: "एआय व्हॉईस असिस्टंटच्या मदतीने कृषी कर्ज योजना शोधा।",
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
                mr: "तुमचे प्रोफाइल तपशील लोड झाले आहेत. तुम्ही ते प्रोफाइल टॅबवर तपासू शकता।",
              },
              date: "1 hour ago",
              read: false,
            },
          ];
    } catch {
      return [];
    }
  });

  const [eligibilityInputs, setEligibilityInputs] = useState({
    landSize: 3.5,
    cropType: "Crops",
    annualIncome: 180000,
    age: 45,
  });

  const [eligibilityResult, setEligibilityResult] = useState(null);

  const [voiceSpeaking, setVoiceSpeaking] = useState(false);
  const [voiceText, setVoiceText] = useState("");

  // Narration is enabled by default unless the user explicitly disabled it.
  const [continuousVoice, setContinuousVoice] = useState(
    () => localStorage.getItem("ks_continuous_voice") !== "false",
  );

  // Browsers require speech to be initiated by a user gesture.
  const [speechUnlocked, setSpeechUnlocked] = useState(false);

  useEffect(() => {
    localStorage.setItem("ks_continuous_voice", String(continuousVoice));
  }, [continuousVoice]);

  useEffect(() => {
    localStorage.setItem("ks_language", language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem("ks_profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("ks_applications", JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem("ks_notifications", JSON.stringify(notifications));
  }, [notifications]);

  const clearSpeechTimeout = useCallback(() => {
    if (speechTimeoutRef.current !== null) {
      window.clearTimeout(speechTimeoutRef.current);
      speechTimeoutRef.current = null;
    }
  }, []);

  const removeVoiceListener = useCallback(() => {
    if (voiceListenerRef.current && "speechSynthesis" in window) {
      window.speechSynthesis.removeEventListener(
        "voiceschanged",
        voiceListenerRef.current,
      );
      voiceListenerRef.current = null;
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    speechRequestId.current += 1;

    clearSpeechTimeout();
    removeVoiceListener();

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setVoiceSpeaking(false);
    setVoiceText("");
  }, [clearSpeechTimeout, removeVoiceListener]);

  // Call this from a real button click before relying on automatic narration.
  const unlockSpeech = useCallback(() => {
    if (!("speechSynthesis" in window)) {
      console.error("Speech synthesis is not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();

    const activationUtterance = new SpeechSynthesisUtterance(
      "Voice assistant enabled.",
    );

    activationUtterance.lang = "en-IN";
    activationUtterance.rate = 1;
    activationUtterance.volume = 1;

    activationUtterance.onend = () => {
      setSpeechUnlocked(true);
      setVoiceSpeaking(false);
      setVoiceText("");
    };

    activationUtterance.onerror = (event) => {
      console.error("Could not activate voice assistant:", event.error);
      setSpeechUnlocked(false);
      setVoiceSpeaking(false);
      setVoiceText("");
    };

    // Do not defer this call: it must run directly from the click.
    window.speechSynthesis.speak(activationUtterance);
  }, []);

  const speakText = useCallback(
    (text, customLang = null) => {
      if (typeof text !== "string" || !text.trim()) {
        return;
      }

      if (!("speechSynthesis" in window)) {
        console.error("Speech synthesis is unavailable in this browser.");
        return;
      }

      const cleanText = text.trim();
      const targetLang = customLang || language;

      const langCode =
        targetLang === "hi" ? "hi-IN" : targetLang === "mr" ? "mr-IN" : "en-IN";

      // Invalidate any previous utterance and its callbacks.
      speechRequestId.current += 1;
      const requestId = speechRequestId.current;

      clearSpeechTimeout();
      removeVoiceListener();
      window.speechSynthesis.cancel();

      setVoiceSpeaking(false);
      setVoiceText(cleanText);

      const utterance = new SpeechSynthesisUtterance(cleanText);

      utterance.lang = langCode;
      utterance.rate = targetLang === "en" ? 0.95 : 0.85;
      utterance.pitch = 1;
      utterance.volume = 1;

      let finished = false;

      const finish = () => {
        if (finished) return;
        finished = true;

        clearSpeechTimeout();
        removeVoiceListener();

        if (speechRequestId.current === requestId) {
          setVoiceSpeaking(false);
          setVoiceText("");
        }
      };

      utterance.onstart = () => {
        if (speechRequestId.current !== requestId) return;

        setVoiceSpeaking(true);
        setVoiceText(cleanText);
      };

      utterance.onend = finish;

      utterance.onerror = (event) => {
        if (event.error !== "canceled" && event.error !== "interrupted") {
          console.error("Speech synthesis error:", event.error);
        }

        finish();
      };

      const chooseVoice = () => {
        const voices = window.speechSynthesis.getVoices();

        if (targetLang === "hi") {
          return (
            voices.find((voice) => voice.lang.toLowerCase() === "hi-in") ||
            voices.find((voice) => voice.lang.toLowerCase().startsWith("hi")) ||
            voices.find((voice) =>
              voice.name.toLowerCase().includes("hindi"),
            ) ||
            null
          );
        }

        if (targetLang === "mr") {
          return (
            voices.find((voice) => voice.lang.toLowerCase() === "mr-in") ||
            voices.find((voice) => voice.lang.toLowerCase().startsWith("mr")) ||
            voices.find((voice) =>
              voice.name.toLowerCase().includes("marathi"),
            ) ||
            voices.find((voice) => voice.lang.toLowerCase() === "hi-in") ||
            null
          );
        }

        return (
          voices.find((voice) => voice.lang.toLowerCase() === "en-in") ||
          voices.find((voice) => voice.lang.toLowerCase().startsWith("en")) ||
          null
        );
      };

      const startSpeech = () => {
        if (finished || speechRequestId.current !== requestId) {
          return;
        }

        removeVoiceListener();

        const selectedVoice = chooseVoice();

        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }

        try {
          window.speechSynthesis.speak(utterance);
        } catch (error) {
          console.error("Unable to start speech:", error);
          finish();
        }
      };

      if (window.speechSynthesis.getVoices().length > 0) {
        startSpeech();
      } else {
        let attempted = false;

        const tryStart = () => {
          if (attempted || finished) return;
          attempted = true;
          startSpeech();
        };

        voiceListenerRef.current = tryStart;

        window.speechSynthesis.addEventListener("voiceschanged", tryStart);

        speechTimeoutRef.current = window.setTimeout(tryStart, 1000);
      }

      // Detect a browser that never starts or finishes the utterance.
      speechTimeoutRef.current = window.setTimeout(() => {
        if (speechRequestId.current === requestId && !finished) {
          console.warn(
            "Speech did not finish. Check browser audio settings and permissions.",
          );
          finish();
        }
      }, 30000);
    },
    [language, clearSpeechTimeout, removeVoiceListener],
  );

  const screenNarrations = {
    dashboard: {
      en: "Welcome to the Farmer Dashboard. Explore agricultural loan schemes and check your loan eligibility.",
      hi: "किसान डैशबोर्ड में आपका स्वागत है। कृषि ऋण योजनाएँ देखें और अपनी पात्रता जाँचें।",
      mr: "शेतकरी डॅशबोर्डमध्ये तुमचे स्वागत आहे. कृषी कर्ज योजना पहा आणि तुमची पात्रता तपासा.",
    },
    eligibility: {
      en: "Loan Eligibility. Enter your details to check which agricultural loan schemes you may qualify for.",
      hi: "ऋण पात्रता। यह जाँचने के लिए अपना विवरण भरें कि आप किन कृषि ऋण योजनाओं के लिए पात्र हो सकते हैं।",
      mr: "कर्ज पात्रता. तुम्ही कोणत्या कृषी कर्ज योजनांसाठी पात्र असू शकता हे तपासण्यासाठी तुमची माहिती भरा.",
    },
    docmanager: {
      en: "Smart Document Vault. Upload and manage your Aadhaar card, bank passbook, and land records.",
      hi: "स्मार्ट दस्तावेज़ वॉल्ट। अपना आधार कार्ड, बैंक पासबुक और भूमि रिकॉर्ड अपलोड करें और प्रबंधित करें।",
      mr: "स्मार्ट डॉक्युमेंट वॉल्ट. तुमचे आधार कार्ड, बँक पासबुक आणि जमीन नोंदी अपलोड करा व व्यवस्थापित करा.",
    },
    docs: {
      en: "Smart Document Vault. Upload and manage your Aadhaar card, bank passbook, and land records.",
      hi: "स्मार्ट दस्तावेज़ वॉल्ट। अपना आधार कार्ड, बैंक पासबुक और भूमि रिकॉर्ड अपलोड करें और प्रबंधित करें।",
      mr: "स्मार्ट डॉक्युमेंट वॉल्ट. तुमचे आधार कार्ड, बँक पासबुक आणि जमीन नोंदी अपलोड करा व व्यवस्थापित करा.",
    },
    profile: {
      en: "Farmer Profile. Review or update your personal, farming, and bank details.",
      hi: "किसान प्रोफ़ाइल। अपनी व्यक्तिगत, खेती और बैंक जानकारी देखें या अपडेट करें।",
      mr: "शेतकरी प्रोफाइल. तुमची वैयक्तिक, शेतीविषयक आणि बँक माहिती तपासा किंवा अपडेट करा.",
    },
    tracking: {
      en: "Application Tracking. Review the current status of your agricultural loan applications.",
      hi: "आवेदन ट्रैकिंग। अपने कृषि ऋण आवेदनों की वर्तमान स्थिति देखें।",
      mr: "अर्ज ट्रॅकिंग. तुमच्या कृषी कर्ज अर्जांची सध्याची स्थिती तपासा.",
    },
    directory: {
      en: "Government Loan Schemes. Search available agricultural loans, compare their details, and open a scheme to learn more.",
      hi: "सरकारी ऋण योजनाएँ। उपलब्ध कृषि ऋण खोजें, उनकी जानकारी की तुलना करें और अधिक जानने के लिए योजना खोलें।",
      mr: "सरकारी कर्ज योजना. उपलब्ध कृषी कर्ज शोधा, त्यांची तुलना करा आणि अधिक माहितीसाठी योजना उघडा.",
    },
    schemes: {
      en: "Government Loan Schemes. Search available agricultural loans, compare their details, and open a scheme to learn more.",
      hi: "सरकारी ऋण योजनाएँ। उपलब्ध कृषि ऋण खोजें, उनकी जानकारी की तुलना करें और अधिक जानने के लिए योजना खोलें।",
      mr: "सरकारी कर्ज योजना. उपलब्ध कृषी कर्ज शोधा, त्यांची तुलना करा आणि अधिक माहितीसाठी योजना उघडा.",
    },
    "scheme-detail": {
      en: "Scheme Details. Review the benefits, eligibility criteria, interest rates, and required documents.",
      hi: "योजना विवरण। लाभ, पात्रता, ब्याज दर और आवश्यक दस्तावेज़ देखें।",
      mr: "योजना तपशील. फायदे, पात्रता, व्याजदर आणि आवश्यक कागदपत्रे तपासा.",
    },
    apply: {
      en: "Loan Application. Complete the required information and review your details before submitting.",
      hi: "ऋण आवेदन। आवश्यक जानकारी भरें और जमा करने से पहले अपने विवरण की जाँच करें।",
      mr: "कर्ज अर्ज. आवश्यक माहिती भरा आणि सबमिट करण्यापूर्वी तपशील तपासा.",
    },
    notifications: {
      en: "Notifications. Review important updates about your loan applications and schemes.",
      hi: "सूचनाएँ। अपने ऋण आवेदनों और योजनाओं से जुड़े महत्वपूर्ण अपडेट देखें।",
      mr: "सूचना. तुमच्या कर्ज अर्ज आणि योजनांशी संबंधित महत्त्वाचे अपडेट तपासा.",
    },
    "ai-chat": {
      en: "AI Assistant. Ask questions about agricultural loans, government schemes, and eligibility.",
      hi: "एआई सहायक। कृषि ऋण, सरकारी योजनाओं और पात्रता के बारे में प्रश्न पूछें।",
      mr: "एआय सहाय्यक. कृषी कर्ज, सरकारी योजना आणि पात्रतेबद्दल प्रश्न विचारा.",
    },
    login: {
      en: "Welcome to AgriCredit. Log in to explore agricultural loan schemes.",
      hi: "एग्रीक्रेडिट में आपका स्वागत है। कृषि ऋण योजनाएँ देखने के लिए लॉग इन करें।",
      mr: "अॅग्रीक्रेडिटमध्ये तुमचे स्वागत आहे. कृषी कर्ज योजना पाहण्यासाठी लॉग इन करा.",
    },
  };

  const getVisiblePageText = useCallback(() => {
    const root = document.getElementById("root");
    if (!root) return "";

    const main =
      root.querySelector("main") || root.querySelector('[role="main"]') || root;

    const clone = main.cloneNode(true);

    clone
      .querySelectorAll(
        "script, style, button, input, textarea, select, nav, [aria-hidden='true']",
      )
      .forEach((element) => element.remove());

    return (clone.innerText || clone.textContent || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 700);
  }, []);

  // Narrate whenever the active screen or selected language changes.
  useEffect(() => {
    stopSpeaking();

    if (
      !continuousVoice ||
      !speechUnlocked ||
      currentScreen === "splash" ||
      currentScreen === "login"
    ) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      const screenText = screenNarrations[currentScreen];

      const narration =
        screenText?.[language] || screenText?.en || getVisiblePageText();

      if (narration) {
        speakText(narration);
      }
    }, 700);

    return () => {
      window.clearTimeout(timer);
      stopSpeaking();
    };
  }, [
    currentScreen,
    continuousVoice,
    speechUnlocked,
    language,
    speakText,
    stopSpeaking,
    getVisiblePageText,
  ]);

  const navigateTo = (screen) => {
    setCurrentScreen(screen);
  };

  const addNotification = (titleText, messageText) => {
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
    stopSpeaking();
    setSpeechUnlocked(false);
    signOutSupabase();
    setUser(null);
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

    const scheme = schemesData.find((item) => item.id === schemeId);

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
      `Your application for ${
        scheme?.name?.[language] || scheme?.name?.en || "the selected scheme"
      } has been received.`,
    );

    return newId;
  };

  const updateDocumentStatus = (appId, docType, status) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;

        const updatedDocs = {
          ...app.documents,
          [docType]: status,
        };

        const allUploaded = Object.values(updatedDocs).every(
          (value) => value === "uploaded",
        );

        return {
          ...app,
          documents: updatedDocs,
          status: allUploaded ? "Verification" : "Documents Pending",
        };
      }),
    );
  };

  const checkEligibility = (inputs) => {
    setEligibilityInputs(inputs);

    let result = "eligible";

    if (inputs.landSize > 10) {
      result = "partial";
    } else if (inputs.annualIncome > 500000) {
      result = "ineligible";
    }

    setEligibilityResult(result);
    return result;
  };

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
        setSupabaseUser,
        profile,
        updateProfile,
        applications,
        setApplications,
        applyForScheme,
        updateDocumentStatus,
        notifications,
        setNotifications,
        addNotification,
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
        speechUnlocked,
        unlockSpeech,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
