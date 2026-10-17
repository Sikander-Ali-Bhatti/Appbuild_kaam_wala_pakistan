# Kaam Wala Pakistan (کام والا پاکستان)
### Complete Service Marketplace Website & Mobile Application

A modern, secure, and responsive service marketplace connecting customers across Pakistan with skilled local artisans and technicians — electricians, plumbers, AC technicians, carpenters, solar technicians, mobile repair specialists, bike mechanics, and more.

---

## 🌟 Key Principles & Free Business Model

- **100% Free Platform**: No registration fees, no subscriptions, no commissions, and no paywalls.
- **Direct Contact**: Customers can directly Call or WhatsApp technicians with a single click.
- **Direct Settlement**: Customers pay workers directly in PKR (Cash, EasyPaisa, or JazzCash).
- **Admin Verification**: Worker phone numbers, CNIC format, and stated skills are screened before appearing on public search listings.
- **Pakistani Localization**: Covers all Pakistani provinces, major cities, and neighborhood towns with PKR currency formatting and English / Roman Urdu / Urdu language options.
- **Mobile First & Companion App**: Full responsive web app + complete native React Native / Expo app in `/mobile` + an interactive in-browser Android App Simulator.

---

## 👥 User Roles & Seed Testing Credentials

You can test all user roles immediately using the **"Switch Role / Demo"** button on the top banner or via login:

| Role | Email | Password | What You Can Test |
|---|---|---|---|
| **Administrator** | `admin@kaamwala.pk` | `Admin@12345` | Worker approval queue, approve/reject with reasons, suspend/reactivate profiles, manage users, bookings & customer complaints. |
| **Worker (Approved)** | `tariq.electrician@gmail.com` | `Worker@12345` | Muhammad Tariq (Electrician in Lahore). Accept/reject booking requests, mark jobs completed, toggle availability, edit visiting charges and skills. |
| **Worker (Pending)** | `zahid.pending@gmail.com` | `Worker@12345` | Zahid Iqbal (Electrician awaiting admin approval). Test the verification queue and approval banner. |
| **Customer** | `ahmed.khan@gmail.com` | `Customer@12345` | Ahmed Khan (Lahore). Search workers by city, book appointments, cancel bookings, leave reviews & ratings, save favorites. |

---

## 🚀 Beginner-Friendly Windows Setup Guide

### 1. Prerequisites on Windows:
- Install **Node.js** (LTS version 18 or 20) from [nodejs.org](https://nodejs.org).
- Open **PowerShell** or **Command Prompt** (cmd.exe).

### 2. Clone or Extract the Project:
```powershell
cd C:\Projects\kaam-wala-pakistan
```

### 3. Install Backend & Website Dependencies:
```powershell
npm install
```

### 4. Configure Environment Variables:
Copy `.env.example` to `.env`:
```powershell
copy .env.example .env
```

### 5. Run the Full-Stack Application:
```powershell
npm run dev
```
Open **`http://localhost:3000`** in Google Chrome or Microsoft Edge. Both the Express API and the Vite React frontend run together!

---

## 📱 Mobile Application (Android / iOS)

The Android APK is built and ready for immediate download! Both the native Android application and the React Native / Expo codebase are included.

### Option A: Direct APK Download & Installation (Android Phone)
1. **Download the APK file**: Click **"📱 Download Android APK"** on the website or download directly at:
   - Web URL: `http://localhost:3000/api/download/apk` (or `/downloads/kaam-wala-pakistan.apk`)
   - File Name: `kaam-wala-pakistan.apk` (Package: `com.kaamwalapakistan.app`, Size: ~33 KB)
2. **When prompted on Android Chrome**: Tap **"Download anyway"** (Standard Android notice for non-Play Store APKs).
3. **Open the downloaded file**: Tap the download notification or locate it in your Android **Files / Downloads** app.
4. **Enable Unknown Apps**: If Android displays a security prompt, tap **Settings** and toggle ON **"Allow from this source"**.
5. **Install & Launch**: Tap **"Install"**, then tap **"Open"** to start using Kaam Wala Pakistan!

### Option B: Interactive In-Browser Mobile Simulator
Click the **"App Simulator"** button in the website header or footer to test the simulated mobile app across Google Pixel, Samsung Galaxy, or Budget Android screen sizes.

### Option C: Rebuilding the Android APK Locally
Run the automated build script:
```powershell
npm run build:apk
# or: bash build-apk.sh
```

### Option D: Run with React Native & Expo (Cross-Platform)
1. Install **Expo Go** from Google Play Store on your Android phone.
2. In PowerShell / terminal:
   ```powershell
   cd mobile
   npm install
   npx expo start
   ```
3. Scan the QR code with your phone camera or the Expo Go app.

---

## 🗄️ Database Architecture & Storage

- **Data Persistence**: Data is automatically managed in `data/database.json`.
- **Pre-seeded Pakistani Data**: Pre-configured with realistic Pakistani artisans, phone numbers (`03XX-XXXXXXX`), CNICs, visiting charges in PKR, and real customer reviews.
- **Security**: Passwords are encrypted using salted `bcryptjs` hashing. Protected endpoints require JSON Web Tokens (JWT).
- **Production Migration (PostgreSQL)**: The data layer is decoupled in `server/db.ts`. For production PostgreSQL deployment, connection strings can be configured via environment variables.

---

## ⚙️ Future Monetization — Kept Disabled

In accordance with project requirements, all monetization features are disabled initially. The platform operates 100% free of charge.

The feature toggles reside in `src/config/features.ts`:
```typescript
export const PLATFORM_CONFIG = {
  features: {
    enablePaidSubscriptions: false,
    enableCommissions: false,
    enableFeaturedFee: false,
    enablePaymentGateway: false,
  }
};
```
When future phases are authorized, these flags can be activated without disrupting core marketplace workflows.

---

## 🇵🇰 Coverage Across Pakistan

- **Provinces & Territories**:
  - Punjab (Lahore, Rawalpindi, Faisalabad, Multan, Gujranwala, Sialkot, etc.)
  - Sindh (Karachi, Hyderabad, Sukkur, Larkana)
  - Khyber Pakhtunkhwa (Peshawar, Abbottabad, Mardan, Swat)
  - Balochistan (Quetta, Gwadar)
  - Islamabad Capital Territory (Islamabad F/G/I sectors, Bahria Town, DHA)
  - Gilgit-Baltistan (Gilgit, Skardu)
  - Azad Jammu & Kashmir (Muzaffarabad, Mirpur)

---

## 📄 License
Apache-2.0. Built for the artisans and people of Pakistan.
