import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { translations } from '../data/translations';
import { User, MapPin, Sprout, Building, Edit2, Check, ArrowLeft, Volume2 } from 'lucide-react';

const Profile = () => {
  const { language, profile, updateProfile, navigateTo, speakText } = useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...profile });
  const t = translations[language];

  useEffect(() => {
    const text = language === 'hi'
      ? "यहाँ आपकी व्यक्तिगत और कृषि संबंधी जानकारी है। विवरण बदलने के लिए प्रोफाइल संपादित करें बटन दबाएं।"
      : language === 'mr'
        ? "येथे तुमची वैयक्तिक आणि शेतीची माहिती आहे. बदल करण्यासाठी प्रोफाइल संपादित करा बटण दाबा."
        : "Here is your profile information. Tap Edit Profile to make changes to your land, crop, or bank details.";
    speakText(text);
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
    speakText(language === 'hi' ? "प्रोफ़ाइल सफलतापूर्वक सहेज ली गई है।" : language === 'mr' ? "प्रोफाइल यशस्वीरित्या जतन केली आहे." : "Profile saved successfully.");
  };

  const states = ["Maharashtra", "Madhya Pradesh", "Uttar Pradesh", "Punjab", "Gujarat", "Karnataka"];
  const crops = ["Grapes", "Sugarcane", "Wheat", "Rice", "Cotton", "Soybean", "Onion"];

  return (
    <div className="px-5 py-6 bg-brand-beige min-h-[92vh] pb-24 animate-fade-in-up">
      {/* Top Navigation */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigateTo('dashboard')}
          className="w-10 h-10 bg-white border border-brand-beige-dark rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-700 shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-extrabold text-brand-green-deep">
          {language === 'en' ? 'My Farmer Profile' : language === 'hi' ? 'मेरी प्रोफाइल' : 'माझी प्रोफाइल'}
        </h1>
        <button
          onClick={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
              speakText(language === 'hi' ? "संपादित मोड सक्रिय। कृपया फ़ील्ड बदलें।" : language === 'mr' ? "बदल करा मोड सुरू. कृपया माहिती बदला." : "Editing mode active. Please update your details.");
            }
          }}
          className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm cursor-pointer transition-colors ${
            isEditing 
              ? 'bg-brand-green text-white hover:bg-brand-green-dark' 
              : 'bg-white border border-brand-beige-dark text-brand-blue hover:text-brand-blue-dark'
          }`}
        >
          {isEditing ? <Check className="w-5 h-5" /> : <Edit2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Main card info container */}
      <div className="flex flex-col gap-5">
        
        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl p-5 border border-brand-beige-dark shadow-sm flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-green via-brand-blue to-brand-accent"></div>
          <div className="w-20 h-20 bg-brand-green-light rounded-full border-4 border-white flex items-center justify-center font-black text-brand-green-dark text-3xl uppercase shadow-md mt-2 mb-3">
            {formData.name.charAt(0)}
          </div>
          <h2 className="text-xl font-bold text-gray-800">{formData.name}</h2>
          <p className="text-sm font-semibold text-gray-400 mt-0.5">+91 {formData.phone}</p>
        </div>

        {/* Section 1: Personal Details */}
        <div className="bg-white rounded-3xl p-5 border border-brand-beige-dark shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-brand-beige-dark pb-2">
            <User className="w-5 h-5 text-brand-green" />
            <h3 className="font-extrabold text-brand-green-deep text-md">{t.personalDetails}</h3>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">
                {language === 'en' ? 'Full Name' : language === 'hi' ? 'पूरा नाम' : 'पूर्ण नाव'}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-brand-beige-dark rounded-xl focus:border-brand-green focus:outline-none font-semibold text-gray-800"
                />
              ) : (
                <p className="text-md font-bold text-gray-700">{formData.name}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">
                {language === 'en' ? 'Age' : language === 'hi' ? 'उम्र (वर्ष)' : 'वय (वर्षे)'}
              </label>
              {isEditing ? (
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleChange('age', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-brand-beige-dark rounded-xl focus:border-brand-green focus:outline-none font-semibold text-gray-800"
                />
              ) : (
                <p className="text-md font-bold text-gray-700">{formData.age} Years</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Land Details */}
        <div className="bg-white rounded-3xl p-5 border border-brand-beige-dark shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-brand-beige-dark pb-2">
            <MapPin className="w-5 h-5 text-brand-blue" />
            <h3 className="font-extrabold text-brand-green-deep text-md">{t.landDetails}</h3>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">
                  {language === 'en' ? 'State' : language === 'hi' ? 'राज्य' : 'राज्य'}
                </label>
                {isEditing ? (
                  <select
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    className="w-full px-2 py-2 border-2 border-brand-beige-dark rounded-xl focus:border-brand-green focus:outline-none font-semibold text-gray-700 bg-white"
                  >
                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                ) : (
                  <p className="text-md font-bold text-gray-700">{formData.state}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">
                  {language === 'en' ? 'District' : language === 'hi' ? 'जिला' : 'जिल्हा'}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => handleChange('district', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-brand-beige-dark rounded-xl focus:border-brand-green focus:outline-none font-semibold text-gray-800"
                  />
                ) : (
                  <p className="text-md font-bold text-gray-700">{formData.district}</p>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">
                {language === 'en' ? 'Land Size (Acres)' : language === 'hi' ? 'भूमि का आकार (एकड़)' : 'जमीन आकार (एकर)'}
              </label>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={formData.landSize}
                    onChange={(e) => handleChange('landSize', e.target.value)}
                    className="w-2/3 px-3 py-2 border-2 border-brand-beige-dark rounded-xl focus:border-brand-green focus:outline-none font-semibold text-gray-800"
                  />
                  <span className="text-sm font-bold text-gray-500">Acres</span>
                </div>
              ) : (
                <p className="text-md font-bold text-gray-700">{formData.landSize} Acres</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Crop and Income details */}
        <div className="bg-white rounded-3xl p-5 border border-brand-beige-dark shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-brand-beige-dark pb-2">
            <Sprout className="w-5 h-5 text-brand-accent" />
            <h3 className="font-extrabold text-brand-green-deep text-md">
              {language === 'en' ? 'Agriculture details' : language === 'hi' ? 'कृषि विवरण' : 'कृषी माहिती'}
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">
                {t.cropInfo}
              </label>
              {isEditing ? (
                <select
                  value={formData.cropType}
                  onChange={(e) => handleChange('cropType', e.target.value)}
                  className="w-full px-2 py-2 border-2 border-brand-beige-dark rounded-xl focus:border-brand-green focus:outline-none font-semibold text-gray-700 bg-white"
                >
                  {crops.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              ) : (
                <p className="text-md font-bold text-gray-700">{formData.cropType}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">
                {t.income}
              </label>
              {isEditing ? (
                <input
                  type="number"
                  value={formData.annualIncome}
                  onChange={(e) => handleChange('annualIncome', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-brand-beige-dark rounded-xl focus:border-brand-green focus:outline-none font-semibold text-gray-800"
                />
              ) : (
                <p className="text-md font-bold text-gray-700">₹ {Number(formData.annualIncome).toLocaleString('en-IN')} / Year</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 4: Bank Details */}
        <div className="bg-white rounded-3xl p-5 border border-brand-beige-dark shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-brand-beige-dark pb-2">
            <Building className="w-5 h-5 text-purple-600" />
            <h3 className="font-extrabold text-brand-green-deep text-md">{t.bankDetails}</h3>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">
                  {language === 'en' ? 'Bank Name' : language === 'hi' ? 'बैंक का नाम' : 'बँकेचे नाव'}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => handleChange('bankName', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-brand-beige-dark rounded-xl focus:border-brand-green focus:outline-none font-semibold text-gray-800"
                  />
                ) : (
                  <p className="text-md font-bold text-gray-700 text-sm">{formData.bankName}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">
                  IFSC Code
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.ifscCode}
                    onChange={(e) => handleChange('ifscCode', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-brand-beige-dark rounded-xl focus:border-brand-green focus:outline-none font-semibold text-gray-800 uppercase"
                  />
                ) : (
                  <p className="text-md font-bold text-gray-700">{formData.ifscCode}</p>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">
                {language === 'en' ? 'Account Number' : language === 'hi' ? 'खाता संख्या' : 'खाते क्रमांक'}
              </label>
              {isEditing ? (
                <input
                  type="password"
                  value={formData.accountNumber}
                  onChange={(e) => handleChange('accountNumber', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-brand-beige-dark rounded-xl focus:border-brand-green focus:outline-none font-semibold text-gray-800"
                />
              ) : (
                <p className="text-md font-bold text-gray-700 tracking-wider">
                  &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; {formData.accountNumber.slice(-4)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Save button visible only in edit mode */}
        {isEditing && (
          <button
            onClick={handleSave}
            className="w-full py-4 bg-brand-green hover:bg-brand-green-dark text-white text-lg font-bold rounded-2xl shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            <span>{t.save}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
