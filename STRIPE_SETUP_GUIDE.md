# Stripe Payment Integration Setup Guide

## Overview

Your Amazon clone now has Stripe payment integration set up with Firebase Cloud Functions. This guide will help you complete the setup.

## Prerequisites

1. A Stripe account (create one at https://stripe.com)
2. Firebase project upgraded to Blaze plan (pay-as-you-go)

## Step 1: Get Your Stripe Keys

1. Go to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** > **API keys**
3. Copy your **Publishable key** (starts with `pk_test_` for test mode)
4. Copy your **Secret key** (starts with `sk_test_` for test mode)

## Step 2: Configure Environment Variables

### Frontend (.env file)

Update the `.env` file in your project root:

```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
```

### Backend (functions/.env file)

Update the `functions/.env` file:

```env
STRIPE_KEY=sk_test_your_actual_secret_key_here
```

## Step 3: Upgrade Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (`clone-aa27c`)
3. Go to **Usage and billing**
4. Click **Upgrade to Blaze plan**
5. Follow the prompts to set up billing

## Step 4: Deploy Firebase Functions

After upgrading to Blaze plan, deploy your functions:

```bash
firebase deploy --only functions
```

## Step 5: Test the Integration

1. Start your React app:

   ```bash
   npm start
   ```

2. Add items to your cart and go to the payment page
3. Use Stripe test card numbers:
   - **Success**: 4242 4242 4242 4242
   - **Decline**: 4000 0000 0000 0002
   - Use any future expiry date and any 3-digit CVC

## API Endpoints

Your payment API will be available at:

```
https://us-central1-clone-aa27c.cloudfunctions.net/api/payments/create
```

## File Structure

```
├── functions/
│   ├── index.js          # Firebase Cloud Functions
│   ├── .env              # Stripe secret key
│   └── package.json      # Dependencies
├── src/Pages/Payment/
│   ├── Payment.jsx       # Updated with Stripe integration
│   └── Payment.css       # Styling for payment form
├── .env                  # Stripe publishable key
└── STRIPE_SETUP_GUIDE.md # This guide
```

## Security Notes

- Never commit your `.env` files to version control
- Use test keys during development
- Switch to live keys only when ready for production
- The secret key should only be used in your backend (Firebase Functions)

## Troubleshooting

### Common Issues:

1. **"Your project must be on the Blaze plan"**

   - Upgrade your Firebase project to Blaze plan

2. **"Invalid API key"**

   - Check that your Stripe keys are correct
   - Ensure you're using the right keys (test vs live)

3. **CORS errors**

   - The Firebase Functions already include CORS configuration
   - Make sure your domain is allowed in Stripe dashboard

4. **Payment fails**
   - Check the browser console for errors
   - Verify the Firebase Functions are deployed
   - Check Firebase Functions logs: `firebase functions:log`

## Next Steps

1. Test with real Stripe test cards
2. Implement order history/confirmation
3. Add email notifications
4. Switch to live mode when ready for production

## Support

- [Stripe Documentation](https://stripe.com/docs)
- [Firebase Functions Documentation](https://firebase.google.com/docs/functions)
- [Stripe React Documentation](https://stripe.com/docs/stripe-js/react)

