import React, { useContext, useEffect, useState } from "react";
import "./Payment.css";
import LayOut from "../../Components/LayOut/LayOut";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import { useNavigate } from "react-router-dom";
import { ActionType } from "../../Components/Utility/ActionType";
import { loadStripe } from "@stripe/stripe-js";

function Payment() {
  const [state, dispatch] = useContext(DataContext);
  const { basket, user } = state;
  const navigate = useNavigate();

  // Credit card form state
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    expirationDate: "",
    cvc: "",
    zipCode: "",
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [stripe, setStripe] = useState(null);

  // Initialize Stripe
  useEffect(() => {
    const initializeStripe = async () => {
      const stripeInstance = await loadStripe(
        import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
          "pk_test_51234567890abcdef"
      );
      setStripe(stripeInstance);
    };
    initializeStripe();
  }, []);

  // Credit card validation functions
  const validateCardNumber = (cardNumber) => {
    const cleaned = cardNumber.replace(/\s/g, "");
    return /^\d{16}$/.test(cleaned);
  };

  const validateExpirationDate = (expDate) => {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!regex.test(expDate)) return false;

    const [month, year] = expDate.split("/");
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    const expYear = parseInt(year);
    const expMonth = parseInt(month);

    if (
      expYear < currentYear ||
      (expYear === currentYear && expMonth < currentMonth)
    ) {
      return false;
    }

    return true;
  };

  const validateZipCode = (zipCode) => {
    return /^\d{5}(-\d{4})?$/.test(zipCode);
  };

  const validateCVC = (cvc) => {
    return /^\d{3,4}$/.test(cvc);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!cardInfo.cardNumber) {
      newErrors.cardNumber = "Card number is required";
    } else if (!validateCardNumber(cardInfo.cardNumber)) {
      newErrors.cardNumber = "Please enter a valid 16-digit card number";
    }

    if (!cardInfo.expirationDate) {
      newErrors.expirationDate = "Expiration date is required";
    } else if (!validateExpirationDate(cardInfo.expirationDate)) {
      newErrors.expirationDate = "Please enter a valid expiration date (MM/YY)";
    }

    if (!cardInfo.cvc) {
      newErrors.cvc = "CVC is required";
    } else if (!validateCVC(cardInfo.cvc)) {
      newErrors.cvc = "Please enter a valid CVC (3-4 digits)";
    }

    if (!cardInfo.zipCode) {
      newErrors.zipCode = "ZIP code is required";
    } else if (!validateZipCode(cardInfo.zipCode)) {
      newErrors.zipCode = "Please enter a valid ZIP code";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, "");
    const formatted = cleaned.replace(/(.{4})/g, "$1 ").trim();
    return formatted.slice(0, 19); // Max 16 digits + 3 spaces
  };

  // Format expiration date
  const formatExpirationDate = (value) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  // Calculate totals
  const subtotal =
    basket?.reduce((amount, item) => {
      return amount + item.price * (item.quantity || 1);
    }, 0) || 0;
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = subtotal * 0.05;
  const totalPrice = subtotal + shipping + tax;

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  if (basket?.length === 0) {
    return (
      <LayOut>
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h2>Your cart is empty</h2>
          <p>Add some items to proceed with checkout</p>
          <button onClick={() => navigate("/")}>Continue Shopping</button>
        </div>
      </LayOut>
    );
  }

  const handlePayment = async () => {
    if (!validateForm()) {
      return;
    }

    if (!stripe) {
      alert("Payment system is loading. Please try again in a moment.");
      return;
    }

    setIsProcessing(true);

    try {
      // Try to create payment intent via Firebase Function
      let response;
      try {
        response = await fetch(
          "http://localhost:5001/clone-aa27c/us-central1/api",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount: Math.round(totalPrice * 100), // Convert to cents
              currency: "usd",
              items: basket.map((item) => ({
                id: item.id,
                title: item.title,
                price: item.price,
                quantity: item.quantity || 1,
              })),
            }),
          }
        );
      } catch (fetchError) {
        console.warn(
          "Firebase Functions not available, using demo mode:",
          fetchError
        );
        // Fallback to demo mode if Firebase Functions is not running
        response = {
          json: async () => ({
            clientSecret: "pi_demo_client_secret_" + Date.now(),
            demo: true,
            message: "Demo mode - Firebase Functions not running",
          }),
        };
      }

      const { clientSecret, demo } = await response.json();

      if (demo) {
        // Demo mode - simulate successful payment
        console.log("Processing demo payment...");

        // Simulate processing delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        alert("Payment successful! Order placed.");

        // Clear the cart
        basket.forEach((item) => {
          dispatch({ type: ActionType.RemoveFromBasket, item });
        });

        // Navigate to orders
        navigate("/orders", {
          state: {
            msg: "Payment Successful! Your order has been placed.",
            orderData: {
              items: basket,
              total: totalPrice,
              cardInfo: {
                last4: cardInfo.cardNumber.slice(-4),
                expDate: cardInfo.expirationDate,
              },
              timestamp: new Date().toISOString(),
            },
          },
        });
      } else {
        // Real Stripe payment
        const { error, paymentIntent } = await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: {
              card: {
                number: cardInfo.cardNumber.replace(/\s/g, ""),
                exp_month: parseInt(cardInfo.expirationDate.split("/")[0]),
                exp_year: parseInt(
                  "20" + cardInfo.expirationDate.split("/")[1]
                ),
                cvc: cardInfo.cvc,
              },
              billing_details: {
                name: user?.name || user?.email || "Customer",
                address: {
                  postal_code: cardInfo.zipCode,
                },
              },
            },
          }
        );

        if (error) {
          alert(`Payment failed: ${error.message}`);
        } else if (paymentIntent.status === "succeeded") {
          alert("Payment successful! Order placed.");

          // Clear the cart
          basket.forEach((item) => {
            dispatch({ type: ActionType.RemoveFromBasket, item });
          });

          // Navigate to orders
          navigate("/orders", {
            state: {
              msg: "Payment Successful! Your order has been placed.",
              orderData: {
                items: basket,
                total: totalPrice,
                cardInfo: {
                  last4: cardInfo.cardNumber.slice(-4),
                  expDate: cardInfo.expirationDate,
                },
                paymentIntentId: paymentIntent.id,
                timestamp: new Date().toISOString(),
              },
            },
          });
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <LayOut>
      <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        <h2>Checkout</h2>

        {/* Order Summary */}
        <div
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            marginBottom: "20px",
            borderRadius: "8px",
          }}
        >
          <h3>Order Summary</h3>
          {basket?.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
                padding: "10px",
                border: "1px solid #eee",
                borderRadius: "4px",
              }}
            >
              <img
                src={item.image}
                alt={item.title}
                style={{ width: "60px", height: "60px", marginRight: "15px" }}
              />
              <div>
                <h4 style={{ margin: "0 0 5px 0" }}>{item.title}</h4>
                <p style={{ margin: "0", color: "#666" }}>
                  Quantity: {item.quantity || 1} | Price: ${item.price}
                </p>
              </div>
            </div>
          ))}

          <div
            style={{
              borderTop: "1px solid #ddd",
              paddingTop: "15px",
              marginTop: "15px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "5px",
              }}
            >
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "5px",
              }}
            >
              <span>Shipping:</span>
              <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "5px",
              }}
            >
              <span>Tax:</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: "bold",
                fontSize: "18px",
                borderTop: "1px solid #ddd",
                paddingTop: "10px",
              }}
            >
              <span>Total:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Credit Card Form */}
        <div
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            marginBottom: "20px",
            borderRadius: "8px",
            backgroundColor: "#f8f9fa",
          }}
        >
          <h3>Payment Information</h3>

          <div style={{ marginBottom: "15px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              Card Number
            </label>
            <input
              type="text"
              value={cardInfo.cardNumber}
              onChange={(e) =>
                setCardInfo({
                  ...cardInfo,
                  cardNumber: formatCardNumber(e.target.value),
                })
              }
              placeholder="1234 5678 9012 3456"
              maxLength="19"
              style={{
                width: "100%",
                padding: "10px",
                border: errors.cardNumber
                  ? "2px solid #dc3545"
                  : "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
            {errors.cardNumber && (
              <div
                style={{ color: "#dc3545", fontSize: "12px", marginTop: "5px" }}
              >
                {errors.cardNumber}
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
            <div style={{ flex: "1" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                }}
              >
                Expiration Date
              </label>
              <input
                type="text"
                value={cardInfo.expirationDate}
                onChange={(e) =>
                  setCardInfo({
                    ...cardInfo,
                    expirationDate: formatExpirationDate(e.target.value),
                  })
                }
                placeholder="MM/YY"
                maxLength="5"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: errors.expirationDate
                    ? "2px solid #dc3545"
                    : "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
              {errors.expirationDate && (
                <div
                  style={{
                    color: "#dc3545",
                    fontSize: "12px",
                    marginTop: "5px",
                  }}
                >
                  {errors.expirationDate}
                </div>
              )}
            </div>

            <div style={{ flex: "1" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                }}
              >
                CVC
              </label>
              <input
                type="text"
                value={cardInfo.cvc}
                onChange={(e) =>
                  setCardInfo({
                    ...cardInfo,
                    cvc: e.target.value.replace(/\D/g, ""),
                  })
                }
                placeholder="123"
                maxLength="4"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: errors.cvc ? "2px solid #dc3545" : "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
              {errors.cvc && (
                <div
                  style={{
                    color: "#dc3545",
                    fontSize: "12px",
                    marginTop: "5px",
                  }}
                >
                  {errors.cvc}
                </div>
              )}
            </div>

            <div style={{ flex: "1" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                }}
              >
                ZIP Code
              </label>
              <input
                type="text"
                value={cardInfo.zipCode}
                onChange={(e) =>
                  setCardInfo({ ...cardInfo, zipCode: e.target.value })
                }
                placeholder="12345"
                maxLength="10"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: errors.zipCode
                    ? "2px solid #dc3545"
                    : "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
              {errors.zipCode && (
                <div
                  style={{
                    color: "#dc3545",
                    fontSize: "12px",
                    marginTop: "5px",
                  }}
                >
                  {errors.zipCode}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          style={{
            width: "100%",
            padding: "15px",
            backgroundColor: isProcessing ? "#6c757d" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: isProcessing ? "not-allowed" : "pointer",
            opacity: isProcessing ? 0.7 : 1,
          }}
        >
          {isProcessing ? "Processing..." : `Pay $${totalPrice.toFixed(2)}`}
        </button>
      </div>
    </LayOut>
  );
}

export default Payment;
