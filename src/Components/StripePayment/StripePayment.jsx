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
    "pk_test_YOUR_STRIPE_PUBLISHABLE_KEY_HERE"
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
      return;
    }

    setProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    // Validate that card information is provided
    if (!cardElement || !cardElement._complete) {
      setError("You should provide a valid card number to proceed");
      setProcessing(false);
      return;
    }

    // Additional validation to check if card element has valid data
    const { error: cardError } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (cardError) {
      setError("You should provide a valid card number to proceed");
      setProcessing(false);
      return;
    }

    try {
      // Check if we should use demo mode or real Stripe
      const useDemoMode = false; // Use real Stripe integration

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
          setError(paymentMethodError.message);
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
      setError("An unexpected error occurred. Please try again.");
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
        will be processed. You can use any card details for testing.
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
