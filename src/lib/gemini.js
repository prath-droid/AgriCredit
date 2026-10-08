/**
 * Google Gemini AI Integration for AgriCredit Multilingual Agricultural Assistant
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

export const askGeminiAI = async (userPrompt, language = "hi") => {
  const apiKey = GEMINI_API_KEY;

  const systemInstructions = {
    hi: "आप कृषिसेतु के लिए एक मित्रवत और विशेषज्ञ कृषि ऋण एआई सहायक हैं। भारतीय किसानों को किसान क्रेडिट कार्ड (KCC), PM-किसान, पशुधन ऋण, और कृषि सब्सिडी के बारे में हिंदी में सरल, स्पष्ट और व्यावहारिक उत्तर दें। उत्तर को 2-3 वाक्यों में संक्षिप्त रखें ताकि इसे आसानी से बोला जा सके।",
    mr: "तुम्ही कृषीसेतूचे एक स्नेही आणि तज्ञ कृषी कर्ज एआय सहाय्यक आहात. भारतीय शेतकऱ्यांना किसान क्रेडिट कार्ड (KCC), पीएम-किसान, पशुधन कर्ज आणि कृषी अनुदानाबद्दल मराठीत सोप्या आणि स्पष्ट शब्दात उत्तरे द्या. उत्तर २-३ वाक्यात थोडक्यात ठेवा जेणेकरून ते सहज ऐकता येईल.",
    en: "You are an expert AI agricultural loan assistant for AgriCredit. Provide simple, accurate, and concise guidance to Indian farmers regarding Kisan Credit Card (KCC), PM-Kisan, livestock loans, and government agricultural subsidies in English. Keep responses under 3 sentences for clear speech synthesis.",
  };

  const sysPrompt = systemInstructions[language] || systemInstructions.en;

  if (!apiKey || apiKey.includes("YOUR_GEMINI")) {
    // Intelligent local fallback responses when API key is not configured
    return getLocalFallbackResponse(userPrompt, language);
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: `${sysPrompt}\n\nUser Question: ${userPrompt}` }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 250,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (candidateText) {
      return candidateText.trim();
    } else {
      return getLocalFallbackResponse(userPrompt, language);
    }
  } catch (error) {
    console.warn("Gemini API call notice, using intelligent fallback:", error);
    return getLocalFallbackResponse(userPrompt, language);
  }
};

const getLocalFallbackResponse = (queryText, language) => {
  const query = queryText.toLowerCase();

  if (
    query.includes("kisan") ||
    query.includes("kcc") ||
    query.includes("क्रेडिट") ||
    query.includes("कार्ड")
  ) {
    return language === "hi"
      ? "किसान क्रेडिट कार्ड (KCC) योजना के तहत आपको केवल 4% ब्याज पर 3 लाख रुपये तक का कृषि ऋण मिलता है। इसके लिए आधार, बैंक पासबुक और भूमि का 7/12 उतारा आवश्यक है।"
      : language === "mr"
        ? "किसान क्रेडिट कार्ड (KCC) योजने अंतर्गत तुम्हाला फक्त ४% व्याजदराने ३ लाख रुपयांपर्यंत कृषी कर्ज मिळते. यासाठी आधार कार्ड, बँक पासबुक आणि ७/१२ उतारा आवश्यक आहे."
        : "The Kisan Credit Card (KCC) scheme provides up to 3 Lakh rupees crop credit at a subsidized 4% interest rate. Required documents are Aadhaar, Bank Passbook, and Land 7/12 extract.";
  } else if (
    query.includes("pum") ||
    query.includes("subsidy") ||
    query.includes("सब्सिडी") ||
    query.includes("अनुदान")
  ) {
    return language === "hi"
      ? "कृषि यंत्रों और सौर पंप (PM-KUSUM) पर सरकार 50% से 80% तक की भारी सब्सिडी प्रदान करती है। आप अपने निकटतम कृषि सेवा केंद्र से आवेदन कर सकते हैं।"
      : language === "mr"
        ? "कृषी यंत्रे आणि सौर पंपांवर (PM-KUSUM) सरकार ५०% ते ८०% पर्यंत मोठे अनुदान देते. तुम्ही जवळच्या कृषी सेवा केंद्रातून अर्ज करू शकता."
        : "Government subsidies on farm equipment and solar pumps (PM-KUSUM) range from 50% to 80%. You can apply through your local district agriculture portal.";
  } else if (
    query.includes("livestock") ||
    query.includes("पशु") ||
    query.includes("गाय") ||
    query.includes("म्हैस") ||
    query.includes("बकरी")
  ) {
    return language === "hi"
      ? "राष्ट्रीय पशुधन मिशन (NLM) के अंतर्गत गाय, भैंस, भेड़ और बकरी पालन के लिए 50 लाख रुपये तक का ऋण 50% सब्सिडी के साथ मिलता है।"
      : language === "mr"
        ? "राष्ट्रीय पशुधन मिशन (NLM) अंतर्गत गाय, म्हैस, शेळी-मेंढी पालनासाठी ५० लाख रुपयांपर्यंत कर्ज ५०% अनुदानासह मिळते."
        : "The National Livestock Mission offers up to 50 Lakh rupees with a 50% government subsidy for dairy, goat, and poultry farming.";
  }

  return language === "hi"
    ? "कृषिसेतु एआई पोर्टल पर आपका स्वागत है। भारत सरकार की योजनाओं के तहत कृषि ऋण और ब्याज छूट का लाभ उठाने के लिए आप प्रोफाइल टैब में अपनी जानकारी भरें।"
    : language === "mr"
      ? "कृषीसेतू एआय पोर्टलवर आपले स्वागत आहे. सरकारी कृषी कर्ज योजना आणि व्याज सवलतीचा लाभ घेण्यासाठी प्रोफाइल टॅबमध्ये तुमची माहिती भरा."
      : "Welcome to AgriCredit AI Portal. Fill in your farm details under the Profile tab to instantly check eligibility for subsidized credit schemes.";
};
