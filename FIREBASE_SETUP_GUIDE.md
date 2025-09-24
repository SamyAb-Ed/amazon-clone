# 🔥 Firebase Authentication Setup Guide

## 🚨 Current Issue

Your authentication is failing because the Firebase configuration still contains placeholder values. You need to set up a real Firebase project to enable authentication.

## 🛠️ Quick Fix (Temporary)

I've created a **Mock Authentication** system that will work immediately for testing. The app now uses `MockAuth.js` instead of Firebase, so you can test the authentication flow right away.

**To test authentication now:**

1. Go to `/auth` in your browser
2. Enter any email and password (minimum 6 characters)
3. Click "Sign in" or "Create Account"
4. It should work immediately!

## 🔥 Setting Up Real Firebase (Recommended)

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Enter project name: `amazon-clone` (or any name you prefer)
4. **Disable Google Analytics** (optional, for simplicity)
5. Click **"Create project"**

### Step 2: Enable Authentication

1. In your Firebase project dashboard, click **"Authentication"** in the left sidebar
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Click on **"Email/Password"**
5. **Enable** the first toggle (Email/Password)
6. Click **"Save"**

### Step 3: Get Firebase Configuration

1. Click the **gear icon (⚙️)** next to "Project Overview"
2. Select **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **web icon (</>)** to add a web app
5. Enter app nickname: `amazon-clone-web`
6. **Don't check** "Set up Firebase Hosting" (we're using Vite)
7. Click **"Register app"**
8. **Copy the Firebase configuration object**

### Step 4: Update Your Configuration

Replace the placeholder values in `src/Components/Utility/FirebaseCompat.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key-here",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id",
};
```

### Step 5: Switch Back to Firebase

After updating the configuration, change the imports back to Firebase:

**In `src/Pages/Auth/Auth.jsx`:**

```javascript
import { auth } from "../../Components/Utility/FirebaseCompat";
```

**In `src/Components/Header/Header.jsx`:**

```javascript
import { auth } from "../Utility/FirebaseCompat";
```

**In `src/Components/Utility/AuthListener.jsx`:**

```javascript
import { auth } from "./FirebaseCompat";
```

## 🧪 Testing Your Setup

### With Mock Auth (Current)

- ✅ Works immediately
- ✅ No setup required
- ❌ Data not persisted
- ❌ Not production-ready

### With Real Firebase

- ✅ Production-ready
- ✅ Data persisted
- ✅ Real authentication
- ❌ Requires setup

## 🔍 Troubleshooting

### Common Errors:

1. **"Firebase: Error (auth/invalid-api-key)"**

   - Check that your API key is correct in the Firebase config

2. **"Firebase: Error (auth/domain-not-authorized)"**

   - Add your domain to authorized domains in Firebase Console > Authentication > Settings

3. **"Firebase: Error (auth/operation-not-allowed)"**

   - Make sure Email/Password authentication is enabled in Firebase Console

4. **"Firebase: Error (auth/user-not-found)"**
   - This is normal for sign-in attempts with non-existent users

## 📋 Next Steps

1. **Test with Mock Auth** (works now)
2. **Set up Firebase project** (when ready for production)
3. **Update configuration** with real Firebase values
4. **Switch back to Firebase** imports
5. **Test with real Firebase**

## 🎯 Current Status

- ✅ **Mock Authentication**: Working
- ⏳ **Firebase Setup**: Pending
- ✅ **UI/UX**: Complete
- ✅ **Error Handling**: Complete

The authentication system is fully functional with mock data. You can test all features immediately, and when you're ready for production, just follow the Firebase setup steps above!
