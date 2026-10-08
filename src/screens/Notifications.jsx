import React, { useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { translations } from '../data/translations';
import { ArrowLeft, Bell, BellOff, Volume2, CheckCheck, CircleAlert } from 'lucide-react';

const Notifications = () => {
  const { language, notifications, setNotifications, navigateTo, speakText } = useContext(AppContext);
  const t = translations[language];

  useEffect(() => {
    const count = notifications.filter(n => !n.read).length;
    const txt = language === 'hi'
      ? `सूचनाएं स्क्रीन। आपके पास ${count} नई सूचनाएं हैं।`
      : language === 'mr'
        ? `सूचना विभाग. तुमच्याकडे ${count} नवीन संदेश आहेत.`
        : `Notifications screen. You have ${count} unread notifications.`;
    speakText(txt);
  }, []);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    speakText(language === 'hi' ? "सभी सूचनाओं को पढ़ा गया चिह्नित किया गया है।" : language === 'mr' ? "सर्व संदेश वाचले म्हणून चिन्हांकित केले आहेत." : "All notifications marked as read.");
  };

  const handleToggleRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

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
          {t.notifications}
        </h1>
        <button
          onClick={handleMarkAllRead}
          className="w-10 h-10 bg-white border border-brand-beige-dark rounded-xl flex items-center justify-center text-brand-blue hover:text-brand-blue-dark shadow-sm cursor-pointer"
          title="Mark all as read"
        >
          <CheckCheck className="w-5 h-5" />
        </button>
      </div>

      {/* Notifications list */}
      <div className="flex flex-col gap-3">
        {notifications.length > 0 ? (
          notifications.map((notif) => {
            return (
              <button
                key={notif.id}
                onClick={() => handleToggleRead(notif.id)}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex gap-4 items-start cursor-pointer ${
                  notif.read 
                    ? 'bg-white/80 border-brand-beige-dark text-gray-700' 
                    : 'bg-white border-brand-blue-light ring-2 ring-brand-blue-light/50 text-gray-900 shadow-sm'
                }`}
              >
                {/* Dot for unread */}
                {!notif.read && (
                  <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-brand-blue rounded-full animate-ping"></span>
                )}

                <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                  notif.read ? 'bg-gray-100 text-gray-400' : 'bg-brand-blue-light text-brand-blue'
                }`}>
                  <CircleAlert className="w-5 h-5" />
                </div>

                <div className="flex-1 pr-4">
                  <h3 className="text-xs font-black tracking-tight leading-snug">
                    {notif.title[language]}
                  </h3>
                  <p className="text-[11px] text-gray-400 font-bold mt-0.5">{notif.date}</p>
                  <p className="text-xs text-gray-500 font-semibold mt-1.5 leading-relaxed">
                    {notif.message[language]}
                  </p>
                </div>
              </button>
            );
          })
        ) : (
          <div className="text-center py-16 text-gray-400 bg-white rounded-3xl border border-brand-beige-dark">
            <BellOff className="w-12 h-12 mx-auto text-gray-300 mb-2 animate-bounce" />
            <p className="font-bold">
              {language === 'en' ? 'No new notifications.' : language === 'hi' ? 'कोई नई सूचना नहीं है।' : 'कोणत्याही नवीन सूचना नाहीत.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
