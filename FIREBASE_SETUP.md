# Firebase Authentication Setup Guide

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "amazon-clone")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication

1. In your Firebase project dashboard, click on "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" authentication:
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

## 3. Get Your Firebase Configuration

1. In your Firebase project dashboard, click on the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click on the web icon (</>) to add a web app
5. Enter your app nickname (e.g., "amazon-clone-web")
6. Click "Register app"
7. Copy the Firebase configuration object

## 4. Update Your Firebase Configuration

Replace the placeholder values in `src/Components/Utility/Firebase.js` with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id",
};
```

## 5. Security Rules (Optional but Recommended)

In the Firebase Console, go to "Firestore Database" and set up security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 6. Test Your Setup

1. Start your development server: `npm run dev`
2. Navigate to `/auth` in your browser
3. Try creating a new account
4. Try signing in with the created account
5. Check the Firebase Console > Authentication to see registered users

## Features Included

✅ **Email/Password Authentication**

- User registration with email and password
- User login with email and password
- Password validation (minimum 6 characters)
- Email format validation

✅ **User State Management**

- Automatic user state persistence
- Real-time authentication state updates
- User profile information (name, email, avatar)

✅ **Error Handling**

- Comprehensive Firebase error messages
- User-friendly error display
- Form validation

✅ **Security Features**

- Firebase security rules
- Secure authentication tokens
- Automatic session management

## Troubleshooting

### Common Issues:

1. **"Firebase: Error (auth/invalid-api-key)"**

   - Check that your API key is correct in the Firebase config

2. **"Firebase: Error (auth/domain-not-authorized)"**

   - Add your domain to authorized domains in Firebase Console > Authentication > Settings

3. **"Firebase: Error (auth/operation-not-allowed)"**

   - Make sure Email/Password authentication is enabled in Firebase Console

4. **CORS Errors**
   - Add your localhost domain to authorized domains in Firebase Console

### Getting Help:

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Firebase Console](https://console.firebase.google.com/)

## Next Steps

After setting up Firebase authentication, you can:

1. Add more authentication methods (Google, Facebook, etc.)
2. Implement user profile management
3. Add password reset functionality
4. Set up user roles and permissions
5. Integrate with Firestore for user data storage
