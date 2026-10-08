import React, { useState, useContext, useEffect, useRef } from "react";
import { AppContext } from "../context/AppContext";
import { translations } from "../data/translations";
import { askGeminiAI } from "../lib/gemini";
import {
  ArrowLeft,
  Send,
  Mic,
  Volume2,
  VolumeX,
  Compass,
  Square,
  Sparkles,
  Radio,
} from "lucide-react";

const AIAssistantScreen = () => {
  const {
    language,
    navigateTo,
    speakText,
    stopSpeaking,
    voiceSpeaking,
    voiceText,
    continuousVoice,
    setContinuousVoice,
  } = useContext(AppContext);
  const t = translations[language];
  const chatEndRef = useRef(null);

  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  // Auto-scroll chat history
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isRecording, isThinking]);

  // Set initial welcome message
  useEffect(() => {
    const welcome =
      language === "hi"
        ? "नमस्कार! मैं आपका कृषिसेतु जेमिनी एआई वॉयस असिस्टेंट हूँ। आप मुझसे ऋण योजनाओं, आवश्यक दस्तावेजों या योग्यता के बारे में पूछ सकते हैं।"
        : language === "mr"
          ? "नमस्कार! मी तुमचा कृषीसेतू जेमिनी एआय व्हॉईस असिस्टंट आहे. तुम्ही मला कर्ज योजना, आवश्यक कागदपत्रे किंवा पात्रतेबद्दल विचारू शकता."
          : "Namaskar! I am your AgriCredit Gemini AI Voice Assistant. Ask me about government loan schemes, document uploads, or check your eligibility in English, Hindi, or Marathi.";

    setChatHistory([{ sender: "ai", text: welcome, timestamp: "Just now" }]);
    speakText(welcome);
  }, []);

  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim() || isThinking) return;

    // Add user message
    const userMsg = { sender: "user", text: textToSend, timestamp: "Just now" };
    setChatHistory((prev) => [...prev, userMsg]);
    setInputText("");
    setIsThinking(true);

    // Call Gemini AI
    const replyText = await askGeminiAI(textToSend, language);
    setIsThinking(false);

    setChatHistory((prev) => [
      ...prev,
      { sender: "ai", text: replyText, timestamp: "Just now" },
    ]);
    speakText(replyText);
  };

  // Real Web Speech Recognition & fallback
  const handleMicPress = () => {
    if (isRecording) {
      setIsRecording(false);
      stopSpeaking();
      return;
    }

    stopSpeaking();
    setIsRecording(true);

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang =
          language === "hi" ? "hi-IN" : language === "mr" ? "mr-IN" : "en-IN";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
          const spokenTranscript = event.results[0][0].transcript;
          setIsRecording(false);
          if (spokenTranscript) {
            handleSendMessage(spokenTranscript);
          }
        };

        recognition.onerror = (err) => {
          console.warn("Speech recognition notice:", err);
          setIsRecording(false);
          // Fallback query if speech recognition encounters error
          const fallbackQuery =
            language === "hi"
              ? "किसान क्रेडिट कार्ड योजना क्या है?"
              : language === "mr"
                ? "किसान क्रेडिट कार्ड काय आहे?"
                : "What is Kisan Credit Card scheme?";
          handleSendMessage(fallbackQuery);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognition.start();
        return;
      } catch (e) {
        console.warn("Speech recognition init error:", e);
      }
    }

    // Fallback simulation if Speech Recognition is unsupported
    setTimeout(() => {
      setIsRecording(false);
      const mockQuery =
        language === "hi"
          ? "किसान क्रेडिट कार्ड लोन के लिए योग्यता क्या है?"
          : language === "mr"
            ? "किसान क्रेडिट कार्ड कर्ज काय आहे?"
            : "What is Kisan Credit Card loan?";

      handleSendMessage(mockQuery);
    }, 3000);
  };

  const presetQuestions = [t.q1, t.q2, t.q3, t.q4];

  return (
    <div className="flex flex-col min-h-[92vh] bg-brand-beige pb-24 animate-fade-in-up">
      {/* Header */}
      <div className="px-5 py-4 bg-white border-b border-brand-beige-dark flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              stopSpeaking();
              navigateTo("dashboard");
            }}
            className="w-10 h-10 bg-brand-beige border border-brand-beige-dark rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-700 shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-brand-blue rounded-xl flex items-center justify-center text-white relative">
              <Sparkles className="w-5 h-5 fill-white animate-pulse" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-brand-green border-2 border-white rounded-full"></span>
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-brand-green-deep">
                {t.aiAssistant}
              </h1>
              <span className="text-[10px] text-brand-green font-bold block leading-none">
                Online &bull; Voice Ready
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const newVal = !continuousVoice;
              setContinuousVoice(newVal);
              const txt = newVal
                ? language === "hi"
                  ? "निरंतर वॉयस गाइड चालू कर दिया गया है।"
                  : language === "mr"
                    ? "सतत व्हॉईस मार्गदर्शक चालू केला आहे."
                    : "Continuous Voice Guidance Enabled."
                : language === "hi"
                  ? "निरंतर वॉयस गाइड बंद है।"
                  : language === "mr"
                    ? "सतत व्हॉईस मार्गदर्शक बंद आहे."
                    : "Continuous Voice Guidance Disabled.";
              speakText(txt);
            }}
            className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
              continuousVoice
                ? "bg-brand-green-light border-brand-green text-brand-green-deep shadow-sm"
                : "bg-white border-brand-beige-dark text-gray-500"
            }`}
            title="Toggle Continuous Voice Guidance for Hindi/Marathi"
          >
            <Radio
              className={`w-3.5 h-3.5 ${continuousVoice ? "text-brand-green animate-pulse" : "text-gray-400"}`}
            />
            <span className="hidden sm:inline">
              {continuousVoice ? "Continuous Voice ON" : "Voice Guidance"}
            </span>
          </button>

          <button
            onClick={stopSpeaking}
            className="w-10 h-10 bg-brand-beige border border-brand-beige-dark rounded-xl flex items-center justify-center text-gray-400 shadow-sm"
            title="Stop speech"
          >
            {voiceSpeaking ? (
              <VolumeX className="w-5 h-5 text-red-500" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Chat scroll wrapper */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4 no-scrollbar">
        {chatHistory.map((msg, idx) => {
          const isAI = msg.sender === "ai";
          return (
            <div
              key={idx}
              className={`flex items-end gap-2.5 max-w-[85%] ${
                isAI ? "self-start" : "self-end flex-row-reverse"
              }`}
            >
              {/* Profile Avatar inside chat */}
              {isAI ? (
                <div className="w-8 h-8 rounded-xl bg-brand-green-deep text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Compass className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center shrink-0 shadow-sm font-extrabold text-xs">
                  U
                </div>
              )}

              {/* Chat Bubble */}
              <div
                className={`p-4 rounded-3xl shadow-sm text-xs leading-relaxed font-semibold ${
                  isAI
                    ? "bg-white text-gray-700 rounded-bl-none border border-brand-beige-dark"
                    : "bg-brand-green text-white rounded-br-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}

        {/* Typing/Recording indicators */}
        {isRecording && (
          <div className="self-end flex items-center gap-3 max-w-[85%] flex-row-reverse">
            <div className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center shrink-0">
              <Mic className="w-4 h-4 animate-ping" />
            </div>

            {/* Visual Waveform Animation */}
            <div className="bg-brand-blue-light/50 border border-brand-blue/10 p-4 rounded-3xl rounded-br-none flex items-center gap-3">
              <span className="text-xs font-bold text-brand-blue-dark">
                Listening...
              </span>
              <div className="flex items-end gap-0.5 h-3">
                <div
                  className="w-0.5 bg-brand-blue rounded-full h-full animate-wave"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-0.5 bg-brand-blue rounded-full h-full animate-wave"
                  style={{ animationDelay: "0.3s" }}
                ></div>
                <div
                  className="w-0.5 bg-brand-blue rounded-full h-full animate-wave"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="w-0.5 bg-brand-blue rounded-full h-full animate-wave"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested chips panel */}
      {chatHistory.length === 1 && !isRecording && (
        <div className="px-5 py-3 border-t border-brand-beige-dark/50">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
            {t.suggestedQuestions}
          </span>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {presetQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="px-4 py-2 bg-white hover:bg-brand-green-light border border-brand-beige-dark rounded-xl text-xs font-bold whitespace-nowrap text-gray-600 hover:text-brand-green transition-all shadow-sm cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input panel bottom */}
      <div className="px-4 py-3 bg-white border-t border-brand-beige-dark flex gap-3 items-center">
        {/* Large Touch mic button */}
        <button
          onClick={handleMicPress}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg ${
            isRecording
              ? "bg-red-500 text-white animate-pulse ring-4 ring-red-100"
              : "bg-brand-blue text-white hover:bg-brand-blue-dark hover:shadow-xl"
          }`}
          title="Speak"
        >
          <Mic className="w-6 h-6" />
        </button>

        {/* Text Input */}
        <div className="flex-1 relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage(inputText);
              }
            }}
            placeholder={
              language === "en"
                ? "Type a message..."
                : language === "hi"
                  ? "सवाल लिखें..."
                  : "प्रश्न विचारा..."
            }
            className="w-full pl-4 pr-12 py-3.5 bg-brand-beige/50 border-2 border-brand-beige-dark rounded-2xl text-xs font-bold text-gray-700 placeholder-gray-400 focus:border-brand-green focus:outline-none focus:bg-white transition-all shadow-inner"
          />
          <button
            onClick={() => handleSendMessage(inputText)}
            disabled={!inputText.trim()}
            className={`absolute right-2 p-2 rounded-xl transition-all cursor-pointer ${
              inputText.trim()
                ? "text-brand-green bg-brand-green-light hover:bg-brand-green"
                : "text-gray-300"
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantScreen;
