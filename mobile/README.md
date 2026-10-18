# Kaam Wala Pakistan — Android & iOS Mobile Application

This directory contains the complete React Native / Expo mobile application for **Kaam Wala Pakistan**.

---

## 📱 Features Included

- **Home Screen**: Popular service categories (Electrician, Plumber, AC Repair, Solar Technician, Carpenter, etc.) with Urdu subtitles.
- **Worker Search & Filters**: Search by keyword, category, city, and area in Pakistan.
- **Worker Profile Screen**: Experience, rating, visiting fee in PKR, and verified status.
- **Direct Phone Call**: One-tap native dialer integration (`tel:03XXXXXXXXX`).
- **Direct WhatsApp Chat**: One-tap WhatsApp deep link with pre-filled greeting.
- **Bookings Management**: View active and historical booking requests.
- **Shared API**: Seamlessly connects to the same backend and database as the web application.

---

## 🚀 Quick Start (Running Locally with Expo)

### Prerequisites:
- Node.js (v18 or v20+)
- Android Smartphone with **Expo Go** app installed from Google Play Store, or Android Studio Emulator.

### 1. Install Dependencies
```bash
cd mobile
npm install
```

### 2. Configure Backend URL
Open `mobile/src/api.ts` and set your computer's local network IP address (e.g. `http://192.168.1.100:3000`) or production domain so your phone can reach the Express backend:

```typescript
export const API_BASE_URL = 'http://192.168.1.100:3000';
```

### 3. Start Expo Dev Server
```bash
npx expo start
```

Scan the QR code displayed in the terminal using the **Expo Go** app on your Android phone!

---

## 📦 How to Build an Android APK (Release / Play Store)

We use Expo Application Services (EAS Build) to generate standalone APKs and AAB bundles.

### Step 1: Install EAS CLI
```bash
npm install -g eas-cli
```

### Step 2: Log in to Expo
```bash
eas login
```

### Step 3: Configure Project
```bash
eas build:configure
```

### Step 4: Generate Installable Android APK
Run this command to build a direct `.apk` file that can be installed on any Android device without Google Play:
```bash
eas build -p android --profile preview
```

### Step 5: Generate Google Play Store AAB Bundle
```bash
eas build -p android --profile production
```

Download the resulting APK from your Expo dashboard and install it directly on any Android smartphone!
