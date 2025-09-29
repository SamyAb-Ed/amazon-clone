import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { PaymentService } from "../../Utility/paymentService";
import classes from "./StripePayment.module.css";

// ⚠️ EDUCATIONAL PROJECT - TEST MODE ONLY
// Initialize Stripe with TEST keys only
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_51SAjX1QbeOMfJMMaMpIm0QPXwJiqDuKTeZq4N5sg6DQr4NtfKgRLpKJ2aCLcreQmE0Kh15XnjhxwadcXsU30S2hT00IUkgENjn"
).catch((error) => {
  console.warn("Stripe failed to load:", error);
  return null;
});

const CheckoutForm = ({
  totalAmount,
  onPaymentSuccess,
  onPaymentError,
  basket,
  user,
  addressData,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.error("Stripe or Elements not loaded:", {
        stripe: !!stripe,
        elements: !!elements,
      });
      setError(
        "Payment system not ready. Please refresh the page and try again."
      );
      return;
    }

    // Additional check for Stripe initialization
    if (!stripePromise) {
      console.error("Stripe promise not initialized");
      setError("Payment system failed to initialize. Please refresh the page.");
      return;
    }

    console.log("Starting payment process...");
    setProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    // Validate that card information is provided
    if (!cardElement) {
      setError(
        "Card element not found. Please refresh the page and try again."
      );
      setProcessing(false);
      return;
    }

    try {
      // Check if we should use demo mode or real Stripe
      const useDemoMode = true; // Temporarily enable demo mode for testing

      if (useDemoMode) {
        // DEMO MODE: Simulate payment process
        console.log("DEMO MODE: Starting payment process");
        const clientSecret = await PaymentService.createPaymentIntent(
          totalAmount
        );
        console.log("DEMO MODE: Simulating payment confirmation");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const mockPaymentIntent = {
          id: `pi_demo_${Date.now()}`,
          status: "succeeded",
          amount: Math.round(totalAmount * 100),
          currency: "usd",
          client_secret: clientSecret,
        };
        console.log("DEMO MODE: Payment successful:", mockPaymentIntent);
        onPaymentSuccess(mockPaymentIntent);
      } else {
        // REAL MODE: Use actual Stripe integration
        console.log("REAL MODE: Starting payment process");

        // Create payment intent
        const clientSecret = await PaymentService.createPaymentIntent(
          totalAmount
        );

        // Create payment method
        const { error: paymentMethodError, paymentMethod } =
          await stripe.createPaymentMethod({
            type: "card",
            card: cardElement,
          });

        if (paymentMethodError) {
          console.error("Payment method error:", paymentMethodError);
          setError(
            paymentMethodError.message ||
              "Invalid card information. Please check your card details."
          );
          setProcessing(false);
          return;
        }

        // Confirm payment with Stripe
        const { error: confirmError, paymentIntent } =
          await stripe.confirmCardPayment(clientSecret, {
            payment_method: paymentMethod.id,
          });

        if (confirmError) {
          setError(confirmError.message);
          onPaymentError(confirmError);
        } else if (paymentIntent.status === "succeeded") {
          console.log("REAL MODE: Payment successful:", paymentIntent);
          onPaymentSuccess(paymentIntent);
        } else {
          setError("Payment was not successful. Please try again.");
          onPaymentError(new Error("Payment not completed"));
        }
      }
    } catch (err) {
      console.error("Payment error:", err);
      console.error("Error details:", {
        message: err.message,
        stack: err.stack,
        name: err.name,
        cause: err.cause,
      });

      // More specific error messages
      let errorMessage = "An unexpected error occurred. Please try again.";

      if (err.message.includes("Failed to fetch")) {
        errorMessage =
          "Network error. Please check your internet connection and try again.";
      } else if (err.message.includes("Invalid API key")) {
        errorMessage =
          "Payment system configuration error. Please contact support.";
      } else if (err.message.includes("Your card was declined")) {
        errorMessage = "Your card was declined. Please try a different card.";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      onPaymentError(err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={classes.paymentForm}>
      <div
        style={{
          background: "#fff3cd",
          border: "1px solid #ffeaa7",
          borderRadius: "4px",
          padding: "10px",
          marginBottom: "15px",
          fontSize: "14px",
        }}
      >
        <strong>DEMO MODE:</strong> This is a demonstration. No real payment
        will be processed.
        <br />
        <strong>Use any card details:</strong> 4242 4242 4242 4242
        <br />
        <strong>Any future date for expiry, any 3 digits for CVC</strong>
        <br />
        <em>Orders will be saved to Firebase for testing purposes.</em>
      </div>

      <div className={classes.cardElementContainer}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
      </div>

      {error && <div className={classes.errorMessage}>{error}</div>}

      <button
        type="submit"
        disabled={!stripe || processing}
        className={classes.payButton}
      >
        {processing ? "Processing..." : `Pay $${totalAmount.toFixed(2)}`}
      </button>
    </form>
  );
};

const StripePayment = ({
  totalAmount,
  onPaymentSuccess,
  onPaymentError,
  basket,
  user,
  addressData,
}) => {
  if (!stripePromise) {
    return (
      <div className={classes.stripeError}>
        <div
          style={{
            background: "#fff3cd",
            border: "1px solid #ffeaa7",
            borderRadius: "4px",
            padding: "15px",
            marginBottom: "15px",
          }}
        >
          <strong>DEMO MODE:</strong> Stripe is not available. Using demo
          payment.
        </div>
        <p>
          Payment system is in demo mode. No real payment will be processed.
        </p>
        <button
          onClick={() => onPaymentSuccess({ id: "demo-payment" })}
          className={classes.demoButton}
          style={{
            background: "#007bff",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Complete Demo Payment
        </button>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        totalAmount={totalAmount}
        onPaymentSuccess={onPaymentSuccess}
        onPaymentError={onPaymentError}
        basket={basket}
        user={user}
        addressData={addressData}
      />
    </Elements>
  );
};

export default StripePayment;
