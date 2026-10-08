# 🌾 AgriCredit (कृषिसेतु)

### AI-Powered Multilingual Farm Loan & Subsidy Assistance Platform

**AgriCredit** is an intelligent, voice-first agricultural financing platform designed to help Indian farmers and rural entrepreneurs seamlessly discover, evaluate eligibility for, and apply for government farm loans, subsidies, and credit schemes.

---

## 📌 Problem Statement

Smallholder farmers across rural India face severe hurdles when accessing formal agricultural credit:

1. **Digital & Functional Illiteracy**: Traditional government portals are text-heavy and complex.
2. **Language Barriers**: Complex banking documentation is rarely available in regional vernacular dialects (Hindi, Marathi, etc.).
3. **Opaque Eligibility Criteria**: Farmers frequently spend days visiting bank branches only to discover they are ineligible for specific schemes.
4. **Scattered Application Workflows**: Document submission (Aadhaar, Bank Passbook, 7/12 Land Records) is fragmented and non-transparent.

---

## 💡 Solution Overview

**AgriCredit** bridges the digital-rural divide by offering:

- 🎙️ **Multilingual AI Voice Assistant**: Natural voice guidance in **English, Hindi, and Marathi**, powered by **Google Gemini 1.5 Flash** with a dual-engine Text-to-Speech (TTS) pipeline.
- ⚡ **Instant Eligibility Evaluation**: A 4-step interactive wizard pre-evaluates eligibility for major schemes (Kisan Credit Card, PM-KISAN, Agri-Infrastructure Fund, NLM).
- 📁 **Digital Document Manager**: One-stop upload and verification hub for Aadhaar, Bank Passbook, and Land 7/12 records integrated with Cloudinary storage.
- 📊 **Real-time Application Tracker**: Live status updates from submission to bank approval.
- 🚀 **Full-Stack REST Architecture**: Modular Node.js / Express / Prisma ORM backend connected to PostgreSQL database.

---

## 🔄 Process Flow & User Journey

```
 ┌────────────────┐     ┌──────────────────┐     ┌──────────────────────┐
 │  Language      │ ──> │   User Auth      │ ──> │   Farmer Dashboard   │
 │  Selection     │     │  (OTP / Guest)   │     │  & Scheme Directory  │
 └────────────────┘     └──────────────────┘     └──────────────────────┘
                                                            │
                                                            ▼
 ┌────────────────┐     ┌──────────────────┐     ┌──────────────────────┐
 │  Application   │ <── │ Upload Documents │ <── │  Instant Eligibility │
 │  Tracking      │     │ (7/12, Aadhaar)  │     │  Evaluation Wizard   │
 └────────────────┘     └──────────────────┘     └──────────────────────┘
         ▲                                                  │
         └──────────────────────────────────────────────────┘
                 🎙️ Multilingual Gemini AI Voice Assistant
                 (Continuous Narration in Hi / Mr / En)
```

---

## 🏗️ System Architecture

```
 🌐 Client Layer (React 19 + Vite 8 + Tailwind CSS v4)
  ├── Multilingual Context & Voice Assistant Engine (SpeechSynthesis + Online TTS Fallback)
  ├── Google Gemini 1.5 Flash API (AI Guidance & Query Resolution)
  └── Supabase JS Client (Real-time application & notification events)
                         │
                         ▼ REST HTTP (Port 5000)
 ⚙️ Backend Layer (Node.js + Express.js)
  ├── JWT Auth Middleware & Mobile OTP Handler
  ├── Profile Management & Loan Schemes API
  ├── Cloudinary Media Upload Controller
  └── Prisma ORM Client
                         │
                         ▼ SQL Queries
 🗄️ Database Layer (PostgreSQL Database - Supabase / Neon)
```

---

## 🛠️ Technology Stack

| Layer                          | Technology                                                                       |
| ------------------------------ | -------------------------------------------------------------------------------- |
| **Frontend Framework**         | React 19, Vite 8                                                                 |
| **Styling & Icons**            | Tailwind CSS v4, Lucide React                                                    |
| **AI & Voice Engine**          | Google Gemini 1.5 Flash, Web Speech API (`SpeechSynthesis`), Google TTS Fallback |
| **Backend Runtime**            | Node.js (v18+), Express.js                                                       |
| **Database & ORM**             | PostgreSQL, Prisma ORM (v5)                                                      |
| **Authentication & Real-time** | JSON Web Tokens (JWT), Supabase                                                  |
| **Media Storage**              | Cloudinary & Multer                                                              |

---

## 🚀 How to Run the Project

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

---

### 1. Environment Setup

Copy `.env.example` to create `.env` in the root directory:

```env
VITE_SUPABASE_URL="https://your-supabase-url.supabase.co"
VITE_SUPABASE_ANON_KEY="your_supabase_anon_key"
VITE_GEMINI_API_KEY="your_google_gemini_api_key"
```

Create `backend/.env` in the `backend/` directory:

```env
PORT=5000
DATABASE_URL="postgresql://username:password@localhost:5432/AgriCredit?schema=public"
JWT_SECRET="YOUR_SUPER_SECURE_JWT_SECRET_KEY"
SUPABASE_URL="https://your-supabase-url.supabase.co"
```

---

### 2. Start Backend API Server

Open terminal and navigate to the backend directory:

```bash
cd backend
npm install
npx prisma generate
npm run dev
```

The Express server will start on **http://localhost:5000**.

---

### 3. Start Frontend Development Server

Open a new terminal window in the project root:

```bash
npm install
npm run dev
```

The React frontend application will launch at **http://localhost:5173**.

---

## 🔌 API Endpoints Reference

| Method | Endpoint                | Description                               |
| ------ | ----------------------- | ----------------------------------------- |
| `GET`  | `/`                     | API Health Check                          |
| `POST` | `/api/auth/send-otp`    | Request mobile OTP for login              |
| `POST` | `/api/auth/verify-otp`  | Verify OTP and return JWT token           |
| `GET`  | `/api/profile`          | Retrieve farmer profile details           |
| `POST` | `/api/profile`          | Create or update farmer profile           |
| `GET`  | `/api/applications`     | List active loan applications             |
| `POST` | `/api/applications`     | Submit a new scheme application           |
| `POST` | `/api/documents/upload` | Upload supporting land/identity documents |
| `POST` | `/api/assistant/chat`   | Query AI Voice Assistant                  |

---

## 🛡️ License

Distributed under the MIT License. Built for the SKH Hackathon 2026.
