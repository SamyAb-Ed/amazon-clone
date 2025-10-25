# Amazon Clone - E-commerce Application

A full-stack Amazon clone built with React, Firebase, and Stripe for payment processing.

## 🚀 Features

- **User Authentication**: Firebase Authentication with sign-in/sign-up
- **Product Catalog**: Browse products with categories and search
- **Shopping Cart**: Add/remove items, quantity management
- **Payment Processing**: Stripe integration for secure payments
- **Order Management**: View order history and status
- **Responsive Design**: Mobile-friendly interface

## 🛠️ Tech Stack

- **Frontend**: React, Vite, React Router
- **Backend**: Firebase Functions, Firestore
- **Authentication**: Firebase Auth
- **Payments**: Stripe
- **Styling**: CSS Modules

## 📋 Prerequisites

- Node.js (v16 or higher)
- Firebase account
- Stripe account

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/SamyAb-Ed/amazon-clone.git
cd amazon-clone
```

### 2. Install Dependencies

```bash
npm install
cd functions
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Create a `.env` file in the `functions` directory:

```env
STRIPE_KEY=sk_test_your_stripe_secret_key
```

### 4. Firebase Setup

1. Create a Firebase project
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Enable Firebase Functions
5. Update Firebase configuration in `src/Utility/firebase.js`

### 5. Stripe Setup

1. Create a Stripe account
2. Get your test API keys from the Stripe dashboard
3. Add keys to your environment variables

### 6. Run the Application

```bash
# Start the frontend
npm run dev

# Start Firebase Functions (in another terminal)
cd functions
npm run serve
```

## 🎯 Usage

1. **Sign Up/Sign In**: Create an account or sign in
2. **Browse Products**: Explore the product catalog
3. **Add to Cart**: Add items to your shopping cart
4. **Checkout**: Proceed to payment with Stripe
5. **View Orders**: Check your order history

## 🔒 Security Notes

- This project uses TEST keys only
- Never use live keys in development
- Environment variables are not committed to git
- API keys are stored securely

## 📝 License

This project is for educational purposes only.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For questions or issues, please open an issue on GitHub.
