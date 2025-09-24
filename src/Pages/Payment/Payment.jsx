import React, { useContext, useState } from "react";
import "./Payment.css";
import LayOut from "../../Components/LayOut/LayOut";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import ProductCard from "../../Components/Product/ProductCard";
import { ActionType } from "../../Components/Utility/ActionType";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Stripe configuration
const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_your_publishable_key_here"
);

// Payment form component
function PaymentForm({ totalPrice, basket, dispatch }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Create payment intent on your server
      const response = await fetch(
        `http://localhost:5001/clone-aa27c/us-central1/api/payments/create?total=${Math.round(
          totalPrice * 100
        )}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { client_secret } = await response.json();

      // Confirm the payment
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(client_secret, {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        });

      if (stripeError) {
        setError(stripeError.message);
        setProcessing(false);
      } else if (paymentIntent.status === "succeeded") {
        setSucceeded(true);
        setError(null);
        setProcessing(false);

        // Clear the cart after successful payment
        basket.forEach((item) => {
          dispatch({ type: ActionType.RemoveFromBasket, item });
        });
      }
    } catch (err) {
      setError("An error occurred while processing your payment.");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment_form">
      <h3>Payment Information</h3>

      <div className="form_group">
        <label>Card Details:</label>
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
            },
          }}
        />
      </div>

      {error && <div className="error_message">{error}</div>}
      {succeeded && <div className="success_message">Payment successful!</div>}

      <button
        type="submit"
        disabled={!stripe || processing || basket?.length === 0}
        className="place_order_btn"
      >
        {processing ? "Processing..." : `Pay $${totalPrice.toFixed(2)}`}
      </button>
    </form>
  );
}

function Payment() {
  const [state, dispatch] = useContext(DataContext);
  const { basket } = state;

  // Calculate total price
  const totalPrice =
    basket?.reduce((amount, item) => {
      return amount + item.price * (item.quantity || 1);
    }, 0) || 0;

  return (
    <LayOut>
      <div className="payment_container">
        <h2>Checkout</h2>

        <div className="payment_content">
          {/* Order Summary */}
          <div className="order_summary">
            <h3>Order Summary</h3>
            {basket?.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              <>
                {basket?.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="order_item">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="item_image"
                    />
                    <div className="item_details">
                      <h4>{item.title}</h4>
                      <p>Quantity: {item.quantity || 1}</p>
                      <p>Price: ${item.price}</p>
                    </div>
                  </div>
                ))}

                <div className="total_section">
                  <h3>Total: ${totalPrice.toFixed(2)}</h3>
                </div>
              </>
            )}
          </div>

          {/* Payment Form with Stripe */}
          <Elements stripe={stripePromise}>
            <PaymentForm
              totalPrice={totalPrice}
              basket={basket}
              dispatch={dispatch}
            />
          </Elements>
        </div>
      </div>
    </LayOut>
  );
}

export default Payment;
