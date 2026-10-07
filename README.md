# EcoSnap 🌿 — AI-Powered Campus Waste Disposal Decision Assistant

[![EcoSnap Final A+++ Upgrade](https://img.shields.io/badge/EcoSnap-Hackathon%20A%2B%2B%2B%20Readiness%20Pass-059669?style=for-the-badge)](https://github.com/)
[![Built With React & Vite](https://img.shields.io/badge/Built%20With-React%2019%20%7C%20Vite%208%20%7C%20TypeScript-0284c7?style=for-the-badge)](https://vitejs.dev/)
[![TensorFlow.js AI](https://img.shields.io/badge/AI%20Engine-TensorFlow.js%20MobileNet%20v2-9333ea?style=for-the-badge)](https://www.tensorflow.org/js)

> **"Scan waste. Make the right disposal decision in seconds."**  
> EcoSnap is a mobile-first, browser-native computer vision assistant designed for college campuses in India to guide students through the complete waste decision chain.

---

## 🎯 1. Product Vision & Audit Overview

### What EcoSnap Is (and Is Not)
EcoSnap is **not** merely a generic object labeler. It is an **AI Disposal Decision Assistant**.  
It answers the three critical questions every student faces after consuming an item:
1. **What is this item & what is its disposal category?**
2. **What exact preparation steps must I take before discarding it?** *(e.g. empty, rinse, separate lid, crush)*
3. **Which exact campus bin or drop-off point should I take it to?**

### Audit Findings & Architectural Honest Improvements
- **Real Browser AI Inference**: Uses TensorFlow.js (`@tensorflow/tfjs` + `@tensorflow-models/mobilenet` v2) running directly in the browser on live WebCam video streams or uploaded image files.
- **Image Input Handling**: Converts base64 uploads and canvas video frame captures into in-memory `HTMLImageElement` structures so MobileNet runs real predictions client-side.
- **Judge Demo Console**: Clearly separates normal live AI scanning from curated Judge Demo Console scenario presets.

---

## 🌟 2. Core Features & Unique Innovations

### 🔍 A. Advanced Scanner with Frame Snapping & Live Reticle (`src/components/ScannerModal.tsx`)
- Real canvas frame extraction from camera video streams.
- Image preview step with **"Run AI Decision Engine"** or **"Retake Photo"** options.
- Real-time status banners: `AI MODEL READY`, `AI ANALYZING`, `PREVIEW`, `LIVE SENSOR`.
- Touch-friendly 44px+ controls and background body scroll prevention on mobile viewports.

### 🌳 B. Unique Feature: Automated "Disposal Decision Trail" (`src/components/ResultCard.tsx`)
Shows an expandable, transparent decision path explaining **WHY** a recommendation was made:
```
FOUND (PET Plastic Bottle)
  → HAZARD CHECK? Passed (Non-toxic)
  → RECYCLABILITY EVALUATION? Passed (High Recovery Value)
  → PREPARATION ACTION? Drain liquids & crush container
  → FINAL ASSIGNED BIN: Blue Recycling Bin
```
Accompanied by a concise explanation paragraph and pre-disposal reuse suggestions.

### 🛡️ C. Safety & Confidence-Aware Rules
- **High Confidence ($\ge 75\%$)**: Renders direct disposal recommendations, bin badges, preparation steps, and campus drop-off point.
- **Medium Confidence ($45\% - 74\%$)**: Displays recommendations with a verification hint (*"Keep full item in frame under clear lighting"*).
- **Low Confidence ($< 45\%$)**: Renders [`LowConfidenceView.tsx`](file:///c:/Users/Himani%20Thakur/Desktop/ECOSNAP-HACKATHON/src/components/LowConfidenceView.tsx) to prevent wrong disposal claims. Invites user to retake photo or select item manually.

### ⚡ D. Prominent E-Waste Hazard Warnings
Hazardous materials (AA/AAA batteries, phone cables, chargers, earbuds) highlight an unmissable purple alert banner:
> ⚠️ **SPECIAL E-WASTE HAZARD WARNING**: *DANGER: Do NOT place in regular municipal waste bins! Heavy metals cause fire and groundwater toxicity. Take directly to the Central Library Drop Box.*

### 📍 E. Priority-Matched Campus Finder (`src/components/CampusView.tsx`)
- Automatically prioritizes collection points matching the scanned item's category.
- Pins a **"BEST MATCH FOR YOUR WASTE"** badge on top with distance sorting (30m, 120m, 250m) and landmark directions.

### 📊 F. Personalized Eco Dashboard & Gamification (`src/components/DashboardView.tsx`)
- Personalized opportunity insights (*"You've correctly segregated 4 PET bottles this week!"*).
- Eco Points (+12 to +30 pts per item) with celebration confetti.
- Carbon emissions avoided ($\text{g CO}_2\text{e}$ offset) with explicit methodology disclaimer notes.

---

## 🏗️ 3. Technical Stack & Local Setup

### Technology Stack
- **Frontend**: React 19, Vite 8, TypeScript 6
- **Styling**: Tailwind CSS v4, Lucide Icons, Glassmorphism design system
- **AI / Computer Vision**: TensorFlow.js MobileNet v2 in browser
- **Persistence**: LocalStorage

### Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Production Build
npm run build
```

---

## 🏆 4. Live Hackathon Demo Guide (15-Second Judge Flow)

1. **Scenario 1 — Plastic Water Bottle**:
   - Click **"🥤 Plastic Bottle"** in the top Judge Demo Console.
   - Result shows: **Plastic Water Bottle (PET)** $\rightarrow$ **94% Confidence** $\rightarrow$ **Blue Recycling Bin** $\rightarrow$ **Decision Trail** $\rightarrow$ **Main Canteen Waste Hub (30m away)** $\rightarrow$ **+12 Eco Points**.

2. **Scenario 2 — AA Battery (Hazardous E-Waste)**:
   - Click **"🔋 AA Battery"** in the Judge Demo Console.
   - Result shows: ⚠️ **SPECIAL E-WASTE HAZARD WARNING** $\rightarrow$ **Library E-Waste Drop Point (120m away)** $\rightarrow$ **+25 Eco Points**.

3. **Scenario 3 — Low Confidence Safety Test**:
   - Click **"❓ Low Confidence Item"**.
   - Result shows: *"I'm not completely sure"* safety view with manual fallback category selector.

---

## 📄 5. Final Quality Gate

- [x] Production build passes clean with `npm run build`
- [x] Zero TypeScript errors
- [x] Browser-side TensorFlow.js MobileNet inference
- [x] Frame snapping canvas preview & image upload support
- [x] Safety & confidence thresholds (High, Medium, Low)
- [x] E-Waste hazard warning banners
- [x] Automated Decision Trail node visualization
- [x] Priority-matched campus finder with distance sorting
- [x] Mobile-first touch responsive layout (320px – 1440px+)
- [x] LocalStorage persistence & Eco Dashboard

---

*EcoSnap — Built for College Sustainability Hackathon 2026.*
