import { loadStripe } from "@stripe/stripe-js";

// ⚠️ EDUCATIONAL PROJECT - TEST KEYS ONLY
// This project is for learning purposes only
// NEVER use live keys or deploy to production

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_51SAjX1QbeOMfJMMarYRJkX07hX6lHCKo9UnpevHGjtHgcBVtqKBaKWH9zysYnl92YWaE5ZexwA08nsMCcxy6Vvz200qdkg1tip"
).catch((error) => {
  console.warn("Stripe failed to load:", error);
  return null;
});

export default stripePromise;
