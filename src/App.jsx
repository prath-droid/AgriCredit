import React, { useContext } from "react";
import { AppProvider, AppContext } from "./context/AppContext";
import Navbar from "./components/Navbar";
import VoiceAssistant from "./components/VoiceAssistant";

// Screens imports
import Splash from "./screens/Splash";
import Login from "./screens/Login";
import Dashboard from "./screens/Dashboard";
import Profile from "./screens/Profile";
import Eligibility from "./screens/Eligibility";
import Directory from "./screens/Directory";
import SchemeDetail from "./screens/SchemeDetail";
import Application from "./screens/Application";
import DocManager from "./screens/DocManager";
import Tracking from "./screens/Tracking";
import Notifications from "./screens/Notifications";
import AIAssistantScreen from "./screens/AIAssistantScreen";

const AppContent = () => {
  const { currentScreen } = useContext(AppContext);

  const renderScreen = () => {
    switch (currentScreen) {
      case "splash":
        return <Splash />;

      case "login":
        return <Login />;

      case "dashboard":
        return <Dashboard />;

      case "profile":
        return <Profile />;

      case "eligibility":
        return <Eligibility />;

      case "directory":
        return <Directory />;

      case "scheme-detail":
        return <SchemeDetail />;

      case "apply":
        return <Application />;

      // Support both screen names for the Document Vault.
      case "docmanager":
      case "docs":
        return <DocManager />;

      case "tracking":
        return <Tracking />;

      case "notifications":
        return <Notifications />;

      case "ai-chat":
        return <AIAssistantScreen />;

      default:
        return <Splash />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center font-sans py-0 sm:py-6">
      <div className="w-full max-w-md min-h-screen sm:min-h-[850px] sm:max-h-[900px] bg-brand-beige sm:rounded-3xl shadow-2xl relative flex flex-col justify-between overflow-y-auto sm:border-8 sm:border-neutral-800 no-scrollbar">
        <main className="flex-1 w-full">{renderScreen()}</main>

        <VoiceAssistant />

        <Navbar />
      </div>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
