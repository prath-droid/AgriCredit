import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Public Welcome Route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to AgriCredit API Portal" });
});

// Middleware to Authenticate JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Access token missing" });

  jwt.verify(
    token,
    process.env.JWT_SECRET || "fallback_secret",
    (err, user) => {
      if (err)
        return res.status(403).json({ error: "Token invalid or expired" });
      req.user = user;
      next();
    },
  );
};

/* 1. AUTHENTICATION ENDPOINTS (OTP & JWT) */
app.post("/api/auth/send-otp", async (req, res) => {
  const { phone } = req.body;
  if (!phone || phone.length !== 10) {
    return res
      .status(400)
      .json({ error: "Please enter a valid 10-digit mobile number" });
  }

  // Simulate generating standard 6 digit OTP (e.g. 123456)
  const mockOtp = "123456";
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  try {
    // Save OTP to DB or cache
    await prisma.user.upsert({
      where: { phone },
      update: { otpCode: mockOtp, otpExpiry },
      create: { phone, otpCode: mockOtp, otpExpiry },
    });

    res.json({ message: `OTP sent successfully. (Mock OTP: ${mockOtp})` });
  } catch (error) {
    console.error("Auth send-otp error:", error);
    res.status(500).json({ error: "Failed to process OTP request" });
  }
});

app.post("/api/auth/verify-otp", async (req, res) => {
  const { phone, code } = req.body;
  if (!phone || !code) {
    return res
      .status(400)
      .json({ error: "Phone number and verification code are required" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user || user.otpCode !== code) {
      return res.status(400).json({ error: "Invalid OTP code" });
    }

    // Clear OTP after successful use
    await prisma.user.update({
      where: { phone },
      data: { otpCode: null, otpExpiry: null },
    });

    const token = jwt.sign(
      { id: user.id, phone: user.phone, role: user.role },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "30d" },
    );

    res.json({
      token,
      user: { id: user.id, phone: user.phone, role: user.role },
    });
  } catch (error) {
    console.error("Auth verify-otp error:", error);
    res.status(500).json({ error: "Verification process failed" });
  }
});

/* 2. PROFILE MANAGEMENT ENDPOINTS */
app.get("/api/profile", authenticateToken, async (req, res) => {
  try {
    const profile = await prisma.farmerProfile.findUnique({
      where: { userId: req.user.id },
    });
    if (!profile)
      return res
        .status(404)
        .json({ message: "Profile not found. Please create one." });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: "Error loading profile data" });
  }
});

app.post("/api/profile", authenticateToken, async (req, res) => {
  const {
    name,
    age,
    state,
    district,
    landSize,
    cropType,
    annualIncome,
    bankName,
    accountNumber,
    ifscCode,
  } = req.body;

  try {
    const newProfile = await prisma.farmerProfile.upsert({
      where: { userId: req.user.id },
      update: {
        name,
        age: parseInt(age),
        state,
        district,
        landSize: parseFloat(landSize),
        cropType,
        annualIncome: parseFloat(annualIncome),
        bankName,
        accountNumber,
        ifscCode,
      },
      create: {
        name,
        age: parseInt(age),
        state,
        district,
        landSize: parseFloat(landSize),
        cropType,
        annualIncome: parseFloat(annualIncome),
        bankName,
        accountNumber,
        ifscCode,
        userId: req.user.id,
      },
    });
    res.json(newProfile);
  } catch (error) {
    console.error("Profile post error:", error);
    res.status(500).json({ error: "Failed to save profile record" });
  }
});

/* 3. LOAN APPLICATIONS ENDPOINTS */
app.get("/api/applications", authenticateToken, async (req, res) => {
  try {
    const list = await prisma.loanApplication.findMany({
      where: { userId: req.user.id },
      include: { documents: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve applications" });
  }
});

app.post("/api/applications", authenticateToken, async (req, res) => {
  const { schemeId } = req.body;
  if (!schemeId)
    return res.status(400).json({ error: "Scheme ID is required" });

  try {
    const newApp = await prisma.loanApplication.create({
      data: {
        schemeId,
        userId: req.user.id,
        status: "SUBMITTED",
      },
    });
    res.json(newApp);
  } catch (error) {
    res.status(500).json({ error: "Failed to submit loan request" });
  }
});

/* 4. DOCUMENTS MANAGER ENDPOINT (CLOUDINARY INTEGRATION) */
// Scaffolding description: In production, configure Multer upload parser with Cloudinary storage
app.post("/api/documents/upload", authenticateToken, async (req, res) => {
  // Simulates Cloudinary storage response mapping to PostgreSQL Document model
  const { docType, name, url, publicId, applicationId } = req.body;

  try {
    const savedDoc = await prisma.document.create({
      data: {
        name,
        docType,
        url, // Cloudinary file URL
        publicId, // Cloudinary resource deletion ID
        status: "PENDING",
        applicationId,
      },
    });

    res.json(savedDoc);
  } catch (error) {
    res.status(500).json({ error: "Failed to persist document meta details" });
  }
});

/* 5. AI VOICE CHAT ASSISTANT ENDPOINT */
app.post("/api/assistant/chat", async (req, res) => {
  const { query, language } = req.body;

  // Scaffolding integration with Gemini Pro API or fine-tuned model
  // Returns text and voice narration guidelines
  const responseData = {
    hi: {
      text: "किसान क्रेडिट कार्ड (KCC) भारत सरकार की कृषि ऋण योजना है। आप 4% ब्याज पर 3 लाख रुपये पा सकते हैं।",
      voiceText:
        "किसान क्रेडिट कार्ड भारत सरकार की कृषि ऋण योजना है। आप चार प्रतिशत ब्याज पर तीन लाख रुपये पा सकते हैं।",
    },
    mr: {
      text: "किसान क्रेडिट कार्ड (KCC) ही भारत सरकारची कृषी कर्ज योजना आहे. तुम्ही ४% व्याजाने ३ लाख रुपये मिळवू शकता.",
      voiceText:
        "किसान क्रेडिट कार्ड ही भारत सरकारची कृषी कर्ज योजना आहे. तुम्ही चार टक्के व्याजाने तीन लाख रुपये मिळवू शकता.",
    },
    en: {
      text: "The Kisan Credit Card (KCC) is a farm credit scheme. You can receive up to 3 Lakh rupees at a low 4% interest rate.",
      voiceText:
        "The Kisan Credit Card is a farm credit scheme. You can receive up to 3 Lakh rupees at a low 4 percent interest rate.",
    },
  };

  const selectedLang = language || "en";
  res.json({
    reply: responseData[selectedLang]?.text || responseData["en"].text,
    voiceNarration:
      responseData[selectedLang]?.voiceText || responseData["en"].voiceText,
  });
});

app.listen(PORT, () => {
  console.log(`Server executing successfully on port ${PORT}`);
});
