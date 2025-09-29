import { loadStripe } from "@stripe/stripe-js";

// ⚠️ EDUCATIONAL PROJECT - TEST KEYS ONLY
// This project is for learning purposes only
// NEVER use live keys or deploy to production

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_YOUR_STRIPE_PUBLISHABLE_KEY_HERE"
).catch((error) => {
  console.warn("Stripe failed to load:", error);
  return null;
});

export default stripePromise;
