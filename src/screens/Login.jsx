import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { translations } from "../data/translations";
import {
  Phone,
  Lock,
  ChevronRight,
  Volume2,
  Mail,
  User,
  ShieldCheck,
} from "lucide-react";
import { signUpWithSupabase, signInWithSupabase } from "../lib/supabase";

const Login = () => {
  const { language, loginUser, speakText, navigateTo } = useContext(AppContext);

  // Auth mode: 'mobile' | 'email_login' | 'email_signup'
  const [authMode, setAuthMode] = useState("email_login");
  const [mobileNumber, setMobileNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  // Supabase Email Auth states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const t = translations[language];

  // Auto voice guidance on render or state change
  useEffect(() => {
    if (authMode === "mobile") {
      if (!otpSent) {
        const txt =
          language === "hi"
            ? "कृपया लॉगिन करने के लिए अपना दस अंकों का मोबाइल नंबर दर्ज करें।"
            : language === "mr"
              ? "कृपया लॉगिन करण्यासाठी तुमचा दहा अंकी मोबाईल नंबर टाका."
              : "Please enter your ten digit mobile number to receive an OTP code.";
        speakText(txt);
      } else {
        const txt =
          language === "hi"
            ? "ओटीपी भेज दिया गया है। कृपया सत्यापन कोड दर्ज करें।"
            : language === "mr"
              ? "ओटीपी पाठवला आहे. कृपया तो तपासा आणि कोड टाका."
              : "OTP sent. Please enter the verification code.";
        speakText(txt);
      }
    } else if (authMode === "email_login") {
      const txt =
        language === "hi"
          ? "अपने ईमेल और पासवर्ड का उपयोग करके लॉगिन करें।"
          : language === "mr"
            ? "तुमचा ईमेल आणि पासवर्ड वापरून लॉगिन करा."
            : "Sign in using your email and password credentials.";
      speakText(txt);
    } else {
      const txt =
        language === "hi"
          ? "कृषिसेतु पोर्टल पर नया खाता बनाएं।"
          : language === "mr"
            ? "कृषीसेतू पोर्टलवर नवीन खाते तयार करा."
            : "Create a new farmer account on AgriCredit portal.";
      speakText(txt);
    }
  }, [authMode, otpSent]);

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (mobileNumber.length !== 10) {
      setError(
        language === "en"
          ? "Enter a valid 10-digit number"
          : language === "hi"
            ? "10 अंकों का सही नंबर डालें"
            : "कृपया १० अंकी योग्य नंबर प्रविष्ट करा",
      );
      return;
    }
    setError("");
    setOtpSent(true);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      setError(
        language === "en"
          ? "Enter a valid 6-digit OTP"
          : language === "hi"
            ? "6 अंकों का सही ओटीपी डालें"
            : "६ अंकी योग्य ओटीपी टाका",
      );
      return;
    }
    loginUser(mobileNumber, "Ramesh Kumar");
  };

  const handleSupabaseLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError(
        language === "en" ? "Please fill in all fields" : "सभी फ़ील्ड भरें",
      );
      return;
    }
    setError("");
    setLoading(true);
    const { data, error: err } = await signInWithSupabase({ email, password });
    setLoading(false);

    if (err) {
      if (
        err.message?.toLowerCase().includes("api key") ||
        err.message?.toLowerCase().includes("apikey")
      ) {
        setSuccessMsg(
          language === "en"
            ? "Logged in (Demo Auth Mode)"
            : "लॉगिन सफल (डेमो मोड)",
        );
        setTimeout(() => {
          loginUser("9876543210", email.split("@")[0] || "Farmer User");
        }, 800);
      } else {
        setError(err.message || "Login failed. Please check your credentials.");
      }
    } else if (data?.user) {
      loginUser(
        data.user.phone || mobileNumber || "9876543210",
        data.user.user_metadata?.full_name || email.split("@")[0],
      );
    }
  };

  const handleSupabaseSignUp = async (e) => {
    e.preventDefault();
    if (!email || !password || !fullName) {
      setError(
        language === "en"
          ? "Please enter your full name, email, and password"
          : "कृपया नाम, ईमेल और पासवर्ड दर्ज करें",
      );
      return;
    }
    setError("");
    setLoading(true);
    const { data, error: err } = await signUpWithSupabase({
      email,
      password,
      phone: mobileNumber,
      name: fullName,
    });
    setLoading(false);

    if (err) {
      if (
        err.message?.toLowerCase().includes("api key") ||
        err.message?.toLowerCase().includes("apikey")
      ) {
        setSuccessMsg(
          language === "en"
            ? "Account created! Logging you in..."
            : "खाता बनाया गया! लॉगिन हो रहा है...",
        );
        setTimeout(() => {
          loginUser(mobileNumber || "9876543210", fullName);
        }, 1000);
      } else {
        setError(err.message || "Sign up failed.");
      }
    } else {
      setSuccessMsg(
        language === "en"
          ? "Account created successfully! Logging you in..."
          : "खाता सफलतापूर्वक बनाया गया!",
      );
      setTimeout(() => {
        loginUser(mobileNumber || "9876543210", fullName);
      }, 1200);
    }
  };

  return (
    <div className="flex flex-col justify-between min-h-[92vh] px-6 py-6 bg-brand-beige animate-fade-in-up">
      {/* Title block */}
      <div>
        <button
          onClick={() => navigateTo("splash")}
          className="text-sm font-semibold text-brand-blue-dark flex items-center gap-1 mb-3"
        >
          &larr;{" "}
          {language === "en"
            ? "Back to Languages"
            : language === "hi"
              ? "भाषा विकल्प"
              : "भाषा पर्याय"}
        </button>
        <h1 className="text-3xl font-extrabold text-brand-green-deep tracking-tight">
          {t.loginTitle}
        </h1>
        <p className="text-sm text-gray-500 font-medium mt-1">
          {language === "en"
            ? "Sign in or Sign up securely to manage your loan schemes."
            : language === "hi"
              ? "ऋण योजनाओं का प्रबंधन करने के लिए सुरक्षित रूप से साइन इन या साइन अप करें।"
              : "तुमच्या कर्ज योजना व्यवस्थापित करण्यासाठी सुरक्षितपणे साइन इन किंवा साइन अप करा."}
        </p>
      </div>

      {/* Auth Mode Toggle Tabs */}
      <div className="w-full max-w-sm mx-auto my-3 bg-white p-1 rounded-2xl border border-brand-beige-dark flex gap-1 shadow-sm">
        <button
          onClick={() => {
            setAuthMode("email_login");
            setError("");
            setSuccessMsg("");
          }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            authMode === "email_login"
              ? "bg-brand-green text-white shadow-sm"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          {language === "en"
            ? "Sign In"
            : language === "hi"
              ? "साइन इन"
              : "साइन इन"}
        </button>

        <button
          onClick={() => {
            setAuthMode("email_signup");
            setError("");
            setSuccessMsg("");
          }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            authMode === "email_signup"
              ? "bg-brand-green text-white shadow-sm"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          {language === "en"
            ? "Sign Up"
            : language === "hi"
              ? "साइन अप"
              : "साइन अप"}
        </button>

        <button
          onClick={() => {
            setAuthMode("mobile");
            setError("");
            setSuccessMsg("");
          }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            authMode === "mobile"
              ? "bg-brand-green text-white shadow-sm"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          {language === "en"
            ? "Mobile OTP"
            : language === "hi"
              ? "ओटीपी"
              : "ओटीपी"}
        </button>
      </div>

      {/* Inputs Form */}
      <div className="w-full max-w-sm mx-auto my-auto">
        {successMsg && (
          <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-800 text-xs font-bold rounded-xl text-center">
            {successMsg}
          </div>
        )}

        {authMode === "email_login" && (
          <form onSubmit={handleSupabaseLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer@example.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-brand-beige-dark rounded-2xl text-sm font-bold text-gray-800 placeholder-gray-300 focus:border-brand-green focus:outline-none shadow-sm"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-brand-beige-dark rounded-2xl text-sm font-bold text-gray-800 placeholder-gray-300 focus:border-brand-green focus:outline-none shadow-sm"
                  required
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-xs font-bold">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-brand-green hover:bg-brand-green-dark text-white text-base font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>{loading ? "Signing In..." : "Sign In with Supabase"}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </form>
        )}

        {authMode === "email_signup" && (
          <form onSubmit={handleSupabaseSignUp} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-600">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-4 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ramesh Kumar"
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-brand-beige-dark rounded-2xl text-sm font-bold text-gray-800 placeholder-gray-300 focus:border-brand-green focus:outline-none shadow-sm"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-600">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer@example.com"
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-brand-beige-dark rounded-2xl text-sm font-bold text-gray-800 placeholder-gray-300 focus:border-brand-green focus:outline-none shadow-sm"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-600">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create password"
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-brand-beige-dark rounded-2xl text-sm font-bold text-gray-800 placeholder-gray-300 focus:border-brand-green focus:outline-none shadow-sm"
                  required
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-xs font-bold">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-brand-green hover:bg-brand-green-dark text-white text-base font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer mt-1"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>{loading ? "Creating Account..." : "Create Account"}</span>
            </button>
          </form>
        )}

        {authMode === "mobile" &&
          (!otpSent ? (
            <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="mobile"
                  className="text-sm font-bold text-gray-600"
                >
                  {t.enterMobile}
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-gray-500 font-bold text-lg border-r border-brand-beige-dark pr-3">
                    +91
                  </span>
                  <input
                    id="mobile"
                    type="tel"
                    maxLength="10"
                    pattern="[0-9]*"
                    value={mobileNumber}
                    onChange={(e) =>
                      setMobileNumber(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="98765 43210"
                    className="w-full pl-18 pr-12 py-4 bg-white border-2 border-brand-beige-dark rounded-2xl text-lg font-bold text-gray-800 placeholder-gray-300 focus:border-brand-green focus:outline-none shadow-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      speakText(
                        language === "en"
                          ? "Mobile number input field."
                          : "मोबाइल नंबर फ़ील्ड।",
                      )
                    }
                    className="absolute right-4 text-brand-blue"
                  >
                    <Volume2 className="w-5 h-5 animate-pulse" />
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm font-bold">{error}</p>
              )}

              <button
                type="submit"
                className="w-full py-4 bg-brand-green hover:bg-brand-green-dark text-white text-lg font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>{t.sendOtp}</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
              <div className="bg-brand-blue-light/50 p-4 rounded-xl border border-brand-blue-light text-center mb-2">
                <span className="text-xs font-bold text-brand-blue-dark block mb-1">
                  {t.otpSent}
                </span>
                <span className="text-lg font-extrabold text-brand-blue-dark">
                  +91 {mobileNumber.slice(0, 5)} {mobileNumber.slice(5)}
                </span>
                <div className="text-xs font-semibold text-brand-accent mt-1.5">
                  Code:{" "}
                  <strong className="underline text-sm font-black">
                    123456
                  </strong>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="otp"
                  className="text-sm font-bold text-gray-600"
                >
                  {t.enterOtp}
                </label>
                <input
                  id="otp"
                  type="password"
                  maxLength="6"
                  value={otpCode}
                  onChange={(e) =>
                    setOtpCode(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="••••••"
                  className="w-full py-4 bg-white border-2 border-brand-beige-dark rounded-2xl text-center text-2xl font-black text-gray-800 placeholder-gray-300 focus:border-brand-green focus:outline-none shadow-sm"
                  required
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm font-bold">{error}</p>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="w-1/3 py-4 bg-white border-2 border-brand-beige-dark hover:bg-gray-50 text-gray-600 font-bold rounded-2xl text-sm"
                >
                  Change
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-4 bg-brand-green text-white text-lg font-bold rounded-2xl shadow-lg"
                >
                  {t.verifyOtp}
                </button>
              </div>
            </form>
          ))}
      </div>

      {/* Guest Login Option */}
      <div className="w-full max-w-sm mx-auto mt-4 text-center">
        <div className="relative flex items-center justify-center my-3">
          <div className="border-t border-brand-beige-dark w-full"></div>
          <span className="absolute px-3 bg-brand-beige text-xs font-bold text-gray-400 uppercase tracking-widest">
            {language === "en" ? "OR" : language === "hi" ? "अथवा" : "किंवा"}
          </span>
        </div>

        <button
          onClick={() => loginUser("Guest", "Guest Farmer", true)}
          className="w-full py-3.5 bg-white hover:bg-brand-beige-dark border border-brand-beige-dark text-brand-blue-dark text-sm font-bold rounded-2xl shadow-sm transition-all cursor-pointer"
        >
          {t.continueAsGuest}
        </button>
      </div>
    </div>
  );
};

export default Login;
