import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { translations } from '../data/translations';
import { Home, Compass, MessageSquare, Bell, User } from 'lucide-react';

const Navbar = () => {
  const { currentScreen, navigateTo, language, notifications } = useContext(AppContext);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  const t = translations[language];

  // If we are on Splash or Login, do not show the navbar
  if (currentScreen === 'splash' || currentScreen === 'login') return null;

  const navItems = [
    { id: 'dashboard', label: t.home, icon: Home },
    { id: 'directory', label: t.schemes, icon: Compass },
    { id: 'ai-chat', label: t.chat, icon: MessageSquare, highlight: true },
    { id: 'notifications', label: t.notifications, icon: Bell, badge: unreadCount },
    { id: 'profile', label: t.profile, icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-brand-beige-dark px-4 py-2 flex justify-around items-center max-w-md mx-auto shadow-2xl rounded-t-3xl transition-all">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentScreen === item.id || 
                         (item.id === 'directory' && currentScreen === 'scheme-detail') ||
                         (item.id === 'directory' && currentScreen === 'apply') ||
                         (item.id === 'directory' && currentScreen === 'docs') ||
                         (item.id === 'dashboard' && currentScreen === 'eligibility') ||
                         (item.id === 'dashboard' && currentScreen === 'tracking');

        if (item.highlight) {
          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              aria-label={item.label}
              className={`relative -top-5 flex flex-col items-center justify-center w-14 h-14 rounded-full shadow-lg transition-transform active:scale-95 ${
                isActive 
                  ? 'bg-brand-green text-white ring-4 ring-brand-green-light' 
                  : 'bg-brand-blue text-white hover:bg-brand-blue-dark ring-4 ring-white'
              }`}
            >
              <Icon className="w-6 h-6 animate-pulse-slow" />
              <span className="text-[10px] absolute -bottom-6 font-semibold text-brand-green-dark">
                {item.label}
              </span>
            </button>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => navigateTo(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all active:scale-95 relative ${
              isActive 
                ? 'text-brand-green font-bold' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <div className="relative p-1">
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
              {item.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-bounce">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[11px] mt-0.5 font-medium tracking-tight">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default Navbar;
