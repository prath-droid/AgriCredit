export const schemesData = [
  {
    id: "kcc",
    name: {
      en: "Kisan Credit Card (KCC) Loan",
      hi: "किसान क्रेडिट कार्ड (KCC) ऋण",
      mr: "किसान क्रेडिट कार्ड (KCC) कर्ज"
    },
    category: "crop",
    maxAmount: "₹3,00,000",
    interestRate: "4% p.a.",
    repayment: "Flexible (dependent on harvesting season)",
    eligibilityDesc: {
      en: "All farmers - individuals/joint borrowers, tenant farmers, & sharecroppers.",
      hi: "सभी किसान - व्यक्तिगत/संयुक्त उधारकर्ता, किरायेदार किसान और बटाईदार।",
      mr: "सर्व शेतकरी - वैयक्तिक/संयुक्त कर्जदार, कुळ शेतकरी आणि भागीदारीतील शेतकरी."
    },
    documents: [
      { name: "Aadhaar Card", nameHi: "आधार कार्ड", nameMr: "आधार कार्ड" },
      { name: "Land Record (7/12 Extract)", nameHi: "भूमि रिकॉर्ड (7/12 उतरा)", nameMr: "जमीन उतारा (७/१२)" },
      { name: "Bank Passbook", nameHi: "बैंक पासबुक", nameMr: "बँक पासबुक" }
    ],
    benefits: {
      en: [
        "Low interest rate of 4% (after prompt interest subvention)",
        "No collateral required for loans up to ₹1.6 Lakhs",
        "Includes crop insurance cover against natural calamities"
      ],
      hi: [
        "4% की कम ब्याज दर (त्वरित भुगतान पर छूट के बाद)",
        "₹1.6 लाख तक के ऋण के लिए किसी जमानत की आवश्यकता नहीं है",
        "प्राकृतिक आपदाओं के खिलाफ फसल बीमा कवर शामिल है"
      ],
      mr: [
        "४% कमी व्याजदर (वेळेवर कर्ज परतफेड केल्यास मिळणाऱ्या सवलतीनंतर)",
        "१.६ लाख रुपयांपर्यंतच्या कर्जासाठी कोणत्याही हमीदाराची गरज नाही",
        "नैसर्गिक आपत्तींविरूद्ध पीक विमा संरक्षण समाविष्ट"
      ]
    },
    aiExplain: {
      en: "Namaskar! Based on your profile, you are eligible for the Kisan Credit Card Loan. You can receive up to 3 Lakh rupees at a very low interest rate of 4 percent. Required documents are your Aadhaar Card, Bank Passbook, and Land Record. Would you like to start the application?",
      hi: "नमस्कार! आपकी प्रोफाइल के अनुसार, आप किसान क्रेडिट कार्ड ऋण के लिए पात्र हैं। आप 4 प्रतिशत की बहुत कम ब्याज दर पर 3 लाख रुपये तक प्राप्त कर सकते हैं। आवश्यक दस्तावेज आधार कार्ड, बैंक पासबुक और आपका भूमि रिकॉर्ड हैं। क्या आप आवेदन शुरू करना चाहते हैं?",
      mr: "नमस्कार! तुमच्या प्रोफाइलनुसार, तुम्ही किसान क्रेडिट कार्ड कर्जासाठी पात्र आहात. तुम्हाला ४ टक्के या अत्यंत कमी व्याजदराने ३ लाख रुपयांपर्यंतचे कर्ज मिळू शकते. आवश्यक कागदपुत्रे म्हणजे आधार कार्ड, बँक पासबुक आणि तुमचा जमिनीचा उतारा. तुम्ही अर्ज सुरू करू इच्छिता का?"
    }
  },
  {
    id: "aif",
    name: {
      en: "Agriculture Infrastructure Fund (AIF)",
      hi: "कृषि अवसंरचना कोष (AIF)",
      mr: "कृषी पायाभूत सुविधा निधी (AIF)"
    },
    category: "infrastructure",
    maxAmount: "₹2 Crores",
    interestRate: "6% - 9% p.a.",
    repayment: "Up to 7 Years",
    eligibilityDesc: {
      en: "Primary Agricultural Credit Societies, FPOs, Agri-entrepreneurs, and Startups.",
      hi: "प्राथमिक कृषि ऋण समितियां, एफपीओ, कृषि-उद्यमी और स्टार्टअप।",
      mr: "प्राथमिक कृषी पतसंस्था, एफपीओ, कृषी-उद्योजक आणि स्टार्ट-अप्स."
    },
    documents: [
      { name: "Aadhaar Card", nameHi: "आधार कार्ड", nameMr: "आधार कार्ड" },
      { name: "Detailed Project Report (DPR)", nameHi: "विस्तृत परियोजना रिपोर्ट (DPR)", nameMr: "सविस्तर प्रकल्प अहवाल (DPR)" },
      { name: "Land Ownership Proof", nameHi: "भूमि स्वामित्व प्रमाण", nameMr: "जमीन मालकी हक्क पुरावा" },
      { name: "Pan Card", nameHi: "पैन कार्ड", nameMr: "पॅन कार्ड" }
    ],
    benefits: {
      en: [
        "3% interest subvention per annum for loans up to ₹2 Crores",
        "Credit guarantee coverage from CGTMSE",
        "Funding for post-harvest management and cold storages"
      ],
      hi: [
        "₹2 करोड़ तक के ऋण के लिए प्रति वर्ष 3% ब्याज छूट",
        "CGTMSE से क्रेडिट गारंटी कव्हरेज",
        "कटाई के बाद प्रबंधन और कोल्ड स्टोरेज के लिए वित्तीय सहायता"
      ],
      mr: [
        "२ कोटी रुपयांपर्यंतच्या कर्जावर प्रतिवर्षी ३% व्याज सवलत",
        "CGTMSE कडून क्रेडिट गॅरंटी कव्हरेज",
        "काढणीपश्चात व्यवस्थापन आणि शीतगृहांच्या उभारणीसाठी कर्ज"
      ]
    },
    aiExplain: {
      en: "Hello. The Agriculture Infrastructure Fund provides financial support for building cold storage, warehouse facilities, and sorting units. You can get up to 2 Crore rupees with a 3 percent interest subsidy. It requires a detailed project report. Let me know if you would like me to guide you through drafting your project details.",
      hi: "नमस्ते। कृषि अवसंरचना कोष कोल्ड स्टोरेज, वेयरहाउस सुविधाओं और सॉर्टिंग यूनिटों के निर्माण के लिए वित्तीय सहायता प्रदान करता है। आप 3 प्रतिशत ब्याज छूट के साथ 2 करोड़ रुपये तक पा सकते हैं। इसके लिए एक विस्तृत परियोजना रिपोर्ट की आवश्यकता होती है। क्या आप परियोजना विवरण तैयार करने में सहायता चाहते हैं?",
      mr: "नमस्कार. कृषी पायाभूत सुविधा निधी कोल्ड स्टोरेज, वेअरहाऊस आणि सॉर्टिंग युनिट्स बांधण्यासाठी आर्थिक मदत देतो. तुम्हाला ३ टक्के व्याज सवलतीसह २ कोटी रुपयांपर्यंतचे कर्ज मिळू शकते. यासाठी सविस्तर प्रकल्प अहवाल आवश्यक आहे. प्रकल्पाची माहिती भरण्यासाठी मी तुम्हाला मदत करू का?"
    }
  },
  {
    id: "acabc",
    name: {
      en: "Agri-Clinics & Agri-Business Centres (ACABC)",
      hi: "कृषि क्लिनिक और कृषि व्यवसाय केंद्र (ACABC)",
      mr: "कृषी दवाखाने आणि कृषी व्यवसाय केंद्रे (ACABC)"
    },
    category: "entrepreneurship",
    maxAmount: "₹20,00,000",
    interestRate: "Competitive Bank Rates",
    repayment: "5 to 10 Years",
    eligibilityDesc: {
      en: "Unemployed agricultural graduates, diploma holders, and science graduates.",
      hi: "बेरोजगार कृषि स्नातक, डिप्लोमा धारक और विज्ञान स्नातक।",
      mr: "बेरोजगार कृषी पदवीधर, पदविका धारक आणि विज्ञान पदवीधर."
    },
    documents: [
      { name: "Aadhaar Card", nameHi: "आधार कार्ड", nameMr: "आधार कार्ड" },
      { name: "Agri-degree or Diploma Certificate", nameHi: "कृषि डिग्री या डिप्लोमा प्रमाण पत्र", nameMr: "कृषी पदवी किंवा पदविका प्रमाणपत्र" },
      { name: "Bank Passbook", nameHi: "बैंक पासबुक", nameMr: "बैंक पासबुक" }
    ],
    benefits: {
      en: [
        "Composite subsidy of 36% for general category",
        "44% subsidy for SC/ST, women, and North-East regions",
        "Aims to set up agricultural service clinics to assist local farmers"
      ],
      hi: [
        "सामान्य श्रेणी के लिए 36% की समग्र सब्सिडी",
        "एससी/एसटी, महिलाओं और उत्तर-पूर्वी क्षेत्रों के लिए 44% सब्सिडी",
        "स्थानीय किसानों की सहायता के लिए कृषि सेवा क्लीनिक स्थापित करना"
      ],
      mr: [
        "सर्वसाधारण प्रवर्गासाठी ३६% अनुदान",
        "अनुसूचित जाती/जमाती, महिला आणि ईशान्येकडील राज्यांसाठी ४४% अनुदान",
        "स्थानिक शेतकऱ्यांना मदत करण्यासाठी कृषी सेवा केंद्रे सुरू करणे"
      ]
    },
    aiExplain: {
      en: "Greetings. If you are an agricultural graduate or diploma holder, you can receive up to 20 Lakh rupees to start your agri-business clinic. General candidates get a 36 percent capital subsidy, and women or SC/ST candidates get a 44 percent subsidy. This is supported by the NABARD scheme. Would you like to check if your degree makes you eligible?",
      hi: "नमस्कार। यदि आप कृषि स्नातक या डिप्लोमा धारक हैं, तो आप अपना कृषि-व्यवसाय क्लिनिक शुरू करने के लिए 20 लाख रुपये तक प्राप्त कर सकते हैं। सामान्य श्रेणी को 36% और महिलाओं या SC/ST को 44% की सब्सिडी मिलती है। क्या आप अपनी पात्रता जांचना चाहते हैं?",
      mr: "नमस्कार. जर तुम्ही कृषी पदवीधर किंवा पदविका धारक असाल, तर तुम्ही तुमचा कृषी व्यवसाय सुरू करण्यासाठी २० लाख रुपयांपर्यंतचे कर्ज मिळवू शकता. सामान्य उमेदवारांना ३६% आणि महिला किंवा SC/ST उमेदवारांना ४४% अनुदान मिळते. तुम्हाला तुमची पात्रता तपासायची आहे का?"
    }
  },
  {
    id: "nlm",
    name: {
      en: "National Livestock Mission (NLM) Loan",
      hi: "राष्ट्रीय पशुधन मिशन (NLM) ऋण",
      mr: "राष्ट्रीय पशुधन मिशन (NLM) कर्ज"
    },
    category: "livestock",
    maxAmount: "₹50,00,000",
    interestRate: "8% p.a. average",
    repayment: "5 to 7 Years",
    eligibilityDesc: {
      en: "Farmers, Entrepreneurs, NGOs, and cooperatives involved in poultry, sheep, goat, or pig farming.",
      hi: "पोल्ट्री, भेड़, बकरी या सुअर पालन में शामिल किसान, उद्यमी, गैर सरकारी संगठन और सहकारी समितियां।",
      mr: "कुक्कुटपालन, शेळी-मेंढी किंवा वराहपालनात गुंतलेले शेतकरी, उद्योजक आणि सहकारी संस्था."
    },
    documents: [
      { name: "Aadhaar Card", nameHi: "आधार कार्ड", nameMr: "आधार कार्ड" },
      { name: "Land Record / Lease Deed", nameHi: "भूमि रिकॉर्ड / पट्टा विलेख", nameMr: "जमीन उतारा किंवा भाडेपट्टा करार" },
      { name: "Animal Husbandry Certificate (If any)", nameHi: "पशुपालन प्रमाणपत्र (यदि कोई हो)", nameMr: "पशुपालन प्रमाणपत्र (असल्यास)" },
      { name: "Project Business Plan", nameHi: "परियोजना व्यवसाय योजना", nameMr: "व्यवसाय योजना अहवाल" }
    ],
    benefits: {
      en: [
        "Up to 50% capital subsidy on machinery and livestock breeding infrastructure",
        "Assistance for establishing fodder block making units",
        "Direct benefit transfer (DBT) of subsidy amount to bank account"
      ],
      hi: [
        "मशीनरी और पशुधन प्रजनन बुनियादी ढांचे पर 50% तक पूंजीगत सब्सिडी",
        "चारा ब्लॉक बनाने वाली इकाइयों की स्थापना के लिए सहायता",
        "सब्सिडी राशि सीधे बैंक खाते में ट्रांसफर"
      ],
      mr: [
        "यंत्रसामग्री आणि पशुधन पैदास पायाभूत सुविधांवर ५०% पर्यंत भांडवली अनुदान",
        "चारा ब्लॉक बनवणाऱ्या युनिट्सच्या स्थापनेसाठी मदत",
        "अनुदानाची रक्कम थेट बँक खात्यात वर्ग (DBT)"
      ]
    },
    aiExplain: {
      en: "Namaskar. The National Livestock Mission offers up to 50 Lakh rupees with an incredible 50 percent capital subsidy for starting poultry, sheep, goat, or pig farming facilities. This includes funding for automated cages and breeding stock. Required documents are Aadhaar, Land ownership or lease, and your animal husbandry training certificate. Shall we apply?",
      hi: "नमस्कार। राष्ट्रीय पशुधन मिशन पोल्ट्री, भेड़, बकरी या सुअर पालन सुविधाओं को शुरू करने के लिए 50% पूंजीगत सब्सिडी के साथ 50 लाख रुपये तक प्रदान करता है। आवश्यक दस्तावेज आधार, भूमि स्वामित्व या पट्टा, और पशुपालन प्रमाणपत्र हैं। क्या हम आवेदन प्रक्रिया शुरू करें?",
      mr: "नमस्कार. राष्ट्रीय पशुधन मिशन शेळी-मेंढी, कुक्कुट किंवा वराहपालन सुरू करण्यासाठी ५०% पर्यंतच्या अनुदानासह ५० लाख रुपयांपर्यंत कर्ज देते. आवश्यक कागदपत्रे आधार, जमीन मालकी किंवा भाडेपट्टा आणि प्रशिक्षण प्रमाणपत्र आहेत. आपण अर्ज प्रक्रिया सुरू करायची का?"
    }
  }
];
