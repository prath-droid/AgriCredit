import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Volume2, Square, X } from 'lucide-react';

const VoiceAssistant = () => {
  const { voiceSpeaking, voiceText, stopSpeaking, language } = useContext(AppContext);

  if (!voiceSpeaking) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-fade-in-up">
      <div className="bg-brand-green-deep text-white p-4 rounded-2xl shadow-2xl border border-brand-green/30 flex flex-col gap-3 glass-panel max-w-sm mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-brand-green p-1.5 rounded-full flex items-center justify-center">
              <Volume2 className="w-4 h-4 text-brand-green-light animate-bounce" />
            </div>
            <span className="text-xs font-bold text-brand-green-light tracking-wide uppercase">
              {language === 'en' ? 'AI Voice Speaking' : language === 'hi' ? 'एआई आवाज बोल रही है' : 'एआय आवाज बोलत आहे'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Waveform Animation */}
            <div className="flex items-end gap-0.5 h-4 w-12 mr-1">
              <div className="w-1 bg-brand-green-light rounded-full h-full animate-wave" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1 bg-brand-green-light rounded-full h-full animate-wave" style={{ animationDelay: '0.3s' }}></div>
              <div className="w-1 bg-brand-green-light rounded-full h-full animate-wave" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-1 bg-brand-green-light rounded-full h-full animate-wave" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1 bg-brand-green-light rounded-full h-full animate-wave" style={{ animationDelay: '0.4s' }}></div>
            </div>

            <button 
              onClick={stopSpeaking}
              className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-gray-300 hover:text-white"
              title="Stop speaking"
            >
              <Square className="w-4 h-4 fill-white" />
            </button>
          </div>
        </div>

        {/* Localized Speech Transcript Subtitle */}
        <p className="text-sm font-medium leading-relaxed text-gray-100 bg-black/20 p-3 rounded-xl border border-white/5 no-scrollbar max-h-24 overflow-y-auto italic">
          "{voiceText}"
        </p>

        <div className="text-[10px] text-center text-gray-400 font-medium">
          {language === 'en' ? 'Tap stop button to mute' : language === 'hi' ? 'शांत करने के लिए स्टॉप बटन दबाएं' : 'शांत करण्यासाठी स्टॉप बटण दाबा'}
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;
