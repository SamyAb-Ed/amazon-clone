import React, { useContext, useState, useEffect } from "react";
import "./Payment.css";
import LayOut from "../../Components/LayOut/LayOut";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import ProductCard from "../../Components/Product/ProductCard";
import { useNavigate } from "react-router-dom";
import { ActionType } from "../../Components/Utility/ActionType";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiCreditCard,
  FiTruck,
  FiMapPin,
} from "react-icons/fi";
import { db } from "../../Components/Utility/Firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Stripe configuration
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_your_publishable_key_here"
);

// Payment form component
function PaymentForm({ totalPrice, basket, dispatch, user, shippingInfo }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [succeeded, setSucceeded] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // Redirect if cart is empty
  useEffect(() => {
    if (basket?.length === 0) {
      navigate("/cart");
    }
  }, [basket, navigate]);

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

      if (!response.ok) {
        throw new Error("Failed to create payment intent");
      }

      const { clientSecret } = await response.json();

      // Confirm the payment
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: user?.displayName || user?.email,
              email: user?.email,
            },
          },
        });

      if (stripeError) {
        setError(stripeError.message);
        setProcessing(false);
      } else if (paymentIntent.status === "succeeded") {
        setSucceeded(true);
        setError(null);
        setProcessing(false);

        // Save order to Firebase
        try {
          const orderData = {
            userId: user?.uid,
            userEmail: user?.email,
            items: basket,
            amount: totalPrice,
            shipping: shippingInfo,
            paymentIntentId: paymentIntent.id,
            status: "confirmed",
            createdAt: serverTimestamp(),
          };

          const docRef = await addDoc(collection(db, "orders"), orderData);
          setOrderId(docRef.id);

          // Optional: Also save to user's personal orders collection
          try {
            await addDoc(collection(db, "users", user.uid, "orders"), {
              orderId: docRef.id,
              basket: basket,
              amount: totalPrice,
              created: serverTimestamp(),
              paymentIntentId: paymentIntent.id,
              status: "confirmed",
            });
          } catch (userOrderError) {
            console.log(
              "User order tracking failed, but main order saved:",
              userOrderError
            );
          }

          // Clear the cart after successful payment
          basket.forEach((item) => {
            dispatch({ type: ActionType.RemoveFromBasket, item });
          });

          // Navigate to orders page with success message
          navigate("/orders", {
            state: { msg: "Payment Successful! Your order has been placed." },
          });
        } catch (firebaseError) {
          console.error("Error saving order:", firebaseError);
          setError(
            "Payment succeeded but failed to save order. Please contact support."
          );
        }
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError(
        err.message || "An error occurred while processing your payment."
      );
      setProcessing(false);
    }
  };

  if (succeeded) {
    return (
      <div className="payment_success">
        <FiCheckCircle className="success_icon" />
        <h3>Payment Successful!</h3>
        <p>Your order has been confirmed and will be processed shortly.</p>
        {orderId && <p className="order_id">Order ID: {orderId}</p>}
        <p className="redirect_message">Redirecting to order details...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="payment_form">
      <div className="payment_header">
        <FiCreditCard className="payment_icon" />
        <h3>Payment Information</h3>
      </div>

      <div className="form_group">
        <label>Card Details:</label>
        <div className="card_element_container">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#fa755a",
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="error_message">
          <FiAlertCircle className="error_icon" />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing || basket?.length === 0}
        className="place_order_btn"
      >
        {processing ? (
          <>
            <div className="spinner"></div>
            Processing...
          </>
        ) : (
          `Pay $${totalPrice.toFixed(2)}`
        )}
      </button>

      <div className="security_note">
        <small>🔒 Your payment information is secure and encrypted</small>
      </div>
    </form>
  );
}

function Payment() {
  const [state, dispatch] = useContext(DataContext);
  const { basket, user } = state;
  const navigate = useNavigate();
  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  // Calculate totals
  const subtotal =
    basket?.reduce((amount, item) => {
      return amount + item.price * (item.quantity || 1);
    }, 0) || 0;

  const shippingCost = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08; // 8% tax
  const totalPrice = subtotal + shippingCost + tax;

  const totalItems =
    basket?.reduce((total, item) => {
      return total + (item.quantity || 1);
    }, 0) || 0;

  if (basket?.length === 0) {
    return (
      <LayOut>
        <div className="payment_container">
          <div className="empty_cart_message">
            <h2>Your cart is empty</h2>
            <p>Add some items to proceed with checkout</p>
            <button
              onClick={() => navigate("/")}
              className="continue_shopping_btn"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </LayOut>
    );
  }

  return (
    <LayOut>
      <div className="payment_container">
        <div className="checkout_header">
          <h2>Checkout</h2>
          <div className="checkout_steps">
            <div className="step active">
              <FiMapPin />
              <span>Shipping</span>
            </div>
            <div className="step active">
              <FiCreditCard />
              <span>Payment</span>
            </div>
            <div className="step">
              <FiCheckCircle />
              <span>Confirmation</span>
            </div>
          </div>
        </div>

        <div className="payment_content">
          {/* Shipping Information */}
          <div className="shipping_section">
            <div className="section_header">
              <FiTruck className="section_icon" />
              <h3>Shipping Information</h3>
            </div>
            <div className="shipping_form">
              <div className="form_row">
                <div className="form_group">
                  <label>Address</label>
                  <input
                    type="text"
                    value={shippingInfo.address}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        address: e.target.value,
                      })
                    }
                    placeholder="123 Main St"
                    required
                  />
                </div>
              </div>
              <div className="form_row">
                <div className="form_group">
                  <label>City</label>
                  <input
                    type="text"
                    value={shippingInfo.city}
                    onChange={(e) =>
                      setShippingInfo({ ...shippingInfo, city: e.target.value })
                    }
                    placeholder="New York"
                    required
                  />
                </div>
                <div className="form_group">
                  <label>State</label>
                  <input
                    type="text"
                    value={shippingInfo.state}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        state: e.target.value,
                      })
                    }
                    placeholder="NY"
                    required
                  />
                </div>
                <div className="form_group">
                  <label>ZIP Code</label>
                  <input
                    type="text"
                    value={shippingInfo.zipCode}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        zipCode: e.target.value,
                      })
                    }
                    placeholder="10001"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="order_summary">
            <h3>Order Summary</h3>
            {basket?.map((item, index) => (
              <div key={`${item.id}-${index}`} className="order_item">
                <img src={item.image} alt={item.title} className="item_image" />
                <div className="item_details">
                  <h4>{item.title}</h4>
                  <p>Quantity: {item.quantity || 1}</p>
                  <p>Price: ${item.price}</p>
                </div>
              </div>
            ))}

            <div className="order_totals">
              <div className="total_row">
                <span>Subtotal ({totalItems} items):</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="total_row">
                <span>Shipping:</span>
                <span>
                  {shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="total_row">
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="total_row final_total">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Form with Stripe */}
          <div className="payment_section">
            <Elements stripe={stripePromise}>
              <PaymentForm
                totalPrice={totalPrice}
                basket={basket}
                dispatch={dispatch}
                user={user}
                shippingInfo={shippingInfo}
              />
            </Elements>
          </div>
        </div>
      </div>
    </LayOut>
  );
}

export default Payment;
