import { loadStripe } from "@stripe/stripe-js";

// ⚠️ EDUCATIONAL PROJECT - TEST KEYS ONLY
// This project is for learning purposes only
// NEVER use live keys or deploy to production

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_51SAjX1QbeOMfJMMaMpIm0QPXwJiqDuKTeZq4N5sg6DQr4NtfKgRLpKJ2aCLcreQmE0Kh15XnjhxwadcXsU30S2hT00IUkgENjn"
).catch((error) => {
  console.warn("Stripe failed to load:", error);
  return null;
});

export default stripePromise;
