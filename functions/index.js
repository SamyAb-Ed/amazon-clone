const { setGlobalOptions } = require("firebase-functions");
const { onRequest } = require("firebase-functions/https");
const logger = require("firebase-functions/logger");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

// Check if Stripe key is configured
const stripeKey = process.env.STRIPE_KEY || process.env.STRIPE_SECRET_KEY;
if (!stripeKey || stripeKey.includes("your_stripe_secret_key_here")) {
  console.warn(
    "⚠️  Stripe key not configured. Payment functions will return demo responses."
  );
}

const stripe =
  stripeKey && !stripeKey.includes("your_stripe_secret_key_here")
    ? require("stripe")(stripeKey)
    : null;

const app = express();

// Middlewares
app.use(cors({ origin: true }));
app.use(express.json());

// API routes
app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World" });
});

app.post("/payments/create", async (req, res) => {
  const total = req.query.total;

  if (!stripe) {
    // Return demo response when Stripe is not configured
    console.log("Demo mode: Returning mock payment intent");
    return res.status(201).json({
      clientSecret: "pi_demo_client_secret_" + Date.now(),
      demo: true,
      message:
        "This is a demo payment intent. Configure Stripe keys for real payments.",
    });
  }

  if (total > 0) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: "usd",
      });
      console.log("Payment Intent >>> ", paymentIntent);

      res.status(201).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error("Stripe error:", error);
      res.status(500).json({
        error: "Payment processing failed",
        message: error.message,
      });
    }
  } else {
    res.status(400).json({ message: "Invalid amount" });
  }
});

exports.api = onRequest(app);
