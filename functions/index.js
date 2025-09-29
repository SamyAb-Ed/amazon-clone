const { onRequest } = require("firebase-functions/https");
const logger = require("firebase-functions/logger");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const admin = require("firebase-admin");

// Updated: Force redeployment to show "Successful create operation"
const { setGlobalOptions } = require("firebase-functions");

setGlobalOptions({ maxInstances: 10 });

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

dotenv.config();

// Use environment variable for Stripe secret key
const stripe = require("stripe")(
  process.env.STRIPE_KEY || "sk_test_YOUR_STRIPE_SECRET_KEY_HERE"
);

const app = express();

// Enable CORS with specific configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3006",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3006",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);
app.use(express.json());

// Basic GET route for the root path
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Stripe API is running!",
  });
});

// Create payment intent endpoint
app.post("/api/payment/create", async (req, res) => {
  try {
    // Total is retrieved from the query parameters, it should be the amount in cents
    const total = parseInt(req.query.total);

    if (total > 0) {
      // Create a Payment Intent with Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: "usd",
      });

      // Respond with a 201 (Created) status and the client secret
      res.status(201).json({
        clientSecret: paymentIntent.client_secret,
      });
    } else {
      // Respond with a 403 (Forbidden) status if total is not positive
      res.status(403).json({
        message: "total must be greater than 0",
      });
    }
  } catch (error) {
    logger.error("Error creating payment intent:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// The app is exported as a Firebase Function
exports.api = onRequest(app);
