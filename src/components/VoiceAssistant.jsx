import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Volume2, Square, Mic } from "lucide-react";

const VoiceAssistant = () => {
  const {
    voiceSpeaking,
    voiceText,
    stopSpeaking,
    language,
    unlockSpeech,
    speakText,
    currentScreen,
    continuousVoice,
    setContinuousVoice,
  } = useContext(AppContext);

  const handleEnableVoice = () => {
    if (typeof unlockSpeech === "function") {
      unlockSpeech();
    } else if (typeof speakText === "function") {
      speakText(
        language === "hi"
          ? "एग्रीक्रेडिट वॉयस असिस्टेंट चालू है।"
          : language === "mr"
            ? "अॅग्रीक्रेडिट व्हॉइस असिस्टंट सुरू आहे."
            : "AgriCredit voice assistant is enabled.",
      );
    } else {
      console.error("Voice assistant is not configured in AppContext.jsx.");
    }

    if (typeof setContinuousVoice === "function") {
      setContinuousVoice(true);
    }
  };

  const labels = {
    en: {
      title: "AI Voice Assistant",
      speaking: "AI Voice Speaking",
      stop: "Stop speaking",
      mute: "Tap stop to mute",
      enabled: "Automatic page narration enabled",
    },
    hi: {
      title: "एआई वॉयस असिस्टेंट",
      speaking: "एआई आवाज़ बोल रही है",
      enable: "वॉयस असिस्टेंट चालू करें",
      stop: "बोलना बंद करें",
      mute: "आवाज़ बंद करने के लिए दबाएँ",
      enabled: "पेज की आवाज़ अपने आप चालू है",
    },
    mr: {
      title: "एआय व्हॉइस असिस्टंट",
      speaking: "एआय आवाज बोलत आहे",
      enable: "व्हॉइस असिस्टंट सुरू करा",
      stop: "बोलणे थांबवा",
      mute: "आवाज बंद करण्यासाठी दाबा",
      enabled: "पेजचे स्वयंचलित वाचन सुरू आहे",
    },
  };

  const text = labels[language] || labels.en;

  return (
    <>
      {/* Always-visible voice activation button */}
      <button
        type="button"
        onClick={handleEnableVoice}
        className="fixed right-4 bottom-24 z-[60] flex items-center gap-2 rounded-xl bg-green-700 px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-green-800"
        aria-label={text.enable}
      >
        <Mic className="h-5 w-5" />
        {text.enable}
      </button>

      {/* Voice status panel, shown only while speech is active */}
      {voiceSpeaking && (
        <div className="fixed bottom-40 left-4 right-4 z-50 animate-fade-in-up">
          <div className="glass-panel mx-auto flex max-w-sm flex-col gap-3 rounded-2xl border border-brand-green/30 bg-brand-green-deep p-4 text-white shadow-2xl">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center rounded-full bg-brand-green p-1.5">
                  <Volume2 className="h-4 w-4 animate-bounce text-brand-green-light" />
                </div>

                <span className="text-xs font-bold uppercase tracking-wide text-brand-green-light">
                  {text.speaking}
                </span>
              </div>

              <button
                type="button"
                onClick={stopSpeaking}
                className="rounded-full p-2 text-gray-300 transition hover:bg-white/10 hover:text-white"
                title={text.stop}
                aria-label={text.stop}
              >
                <Square className="h-4 w-4 fill-white" />
              </button>
            </div>

            <div className="flex h-4 items-end justify-center gap-1">
              {[0, 1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className="h-full w-1 animate-wave rounded-full bg-brand-green-light"
                  style={{
                    animationDelay: `${bar * 0.1}s`,
                  }}
                />
              ))}
            </div>

            {voiceText && (
              <p className="max-h-24 overflow-y-auto rounded-xl border border-white/5 bg-black/20 p-3 text-sm font-medium italic leading-relaxed text-gray-100">
                {voiceText}
              </p>
            )}

            <p className="text-center text-[10px] font-medium text-gray-400">
              {text.mute}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceAssistant;
