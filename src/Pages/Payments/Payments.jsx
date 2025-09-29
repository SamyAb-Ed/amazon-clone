import React, { useContext, useState } from "react";
import LayOut from "../../Components/LayOut/LayOut";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import CurrencyFormat from "../../Components/CurrencyFormat/CurrencyFormat";
import { useAuth } from "../../Components/AuthProvider/AuthProvider";
import { Type } from "../../Utility/action.type";
import StripePayment from "../../Components/StripePayment/StripePayment";
import classes from "./Payments.module.css";
import { useNavigate } from "react-router-dom";
import { PaymentService } from "../../Utility/paymentService";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51SAjX1QbeOMfJMMarYRJkX07hX6lHCKo9UnpevHGjtHgcBVtqKBaKWH9zysYnl92YWaE5ZexwA08nsMCcxy6Vvz200qdkg1tip"
);

const Payments = () => {
  const [{ basket }, dispatch] = useContext(DataContext);
  const { user } = useAuth();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [addressData, setAddressData] = useState({
    fullName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });

  const handlePaymentSuccess = async (paymentMethod) => {
    console.log("Payment successful:", paymentMethod);
    setPaymentSuccess(true);
    setPaymentError(null);

    try {
      // Create order data
      const orderData = {
        userId: user.uid,
        userEmail: user.email,
        items: basket.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity || 1,
          image: item.image,
        })),
        totalAmount: totalAmount,
        address: addressData,
        paymentStatus: "completed",
        orderDate: new Date().toISOString(),
        status: "completed",
      };

      // Save order to Firebase
      console.log("Saving order to Firebase:", orderData);
      const orderId = await PaymentService.saveOrderToFirebase(orderData);
      console.log("Order saved to Firebase with ID:", orderId);

      // Add the order to the local orders list
      dispatch({
        type: Type.ADD_ORDER,
        order: {
          id: orderId,
          ...orderData,
        },
      });

      // Clear the basket after successful payment
      dispatch({
        type: Type.EMPTY_BASKET,
      });

      alert("Payment successful! Your order has been placed.");
    } catch (error) {
      console.error("Error saving order:", error);
      setPaymentError(
        "Payment successful, but there was an error saving your order. Please contact support."
      );
    }
  };

  const handlePaymentError = (error) => {
    console.error("Payment failed:", error);
    setPaymentError(error.message || "Payment failed. Please try again.");
    setPaymentSuccess(false);
  };

  const totalAmount = basket.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );

  return (
    <LayOut>
      <div className={classes.payments_container}>
        <h1>Payment & Checkout</h1>

        {!user ? (
          <div className={classes.auth_required}>
            <h2>Please sign in to continue</h2>
            <p>You need to be signed in to complete your purchase.</p>
          </div>
        ) : (
          <div className={classes.checkout_content}>
            <div className={classes.order_summary}>
              <h2>Order Summary</h2>
              {basket.length === 0 ? (
                <p>Your cart is empty</p>
              ) : (
                <div>
                  {basket.map((item) => (
                    <div key={item.id} className={classes.order_item}>
                      <img src={item.image} alt={item.title} />
                      <div className={classes.item_details}>
                        <h3>{item.title}</h3>
                        <p>Quantity: {item.quantity || 1}</p>
                        <p>
                          Price: <CurrencyFormat amount={item.price} />
                        </p>
                        <p>
                          Total:{" "}
                          <CurrencyFormat
                            amount={item.price * (item.quantity || 1)}
                          />
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className={classes.total_section}>
                    <h3>
                      Total (
                      {basket.reduce(
                        (total, item) => total + (item.quantity || 1),
                        0
                      )}{" "}
                      items):
                      <CurrencyFormat
                        amount={basket.reduce(
                          (total, item) =>
                            total + item.price * (item.quantity || 1),
                          0
                        )}
                      />
                    </h3>
                  </div>
                </div>
              )}
            </div>

            <div className={classes.delivery_section}>
              <h2>Delivery Address</h2>
              <div className={classes.address_form}>
                <div className={classes.form_group}>
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="Abebe Kebede"
                    value={addressData.fullName}
                    onChange={(e) =>
                      setAddressData({
                        ...addressData,
                        fullName: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className={classes.form_group}>
                  <label>Street Address</label>
                  <input
                    type="text"
                    placeholder="Haile G/Selassie Avenue"
                    value={addressData.street}
                    onChange={(e) =>
                      setAddressData({ ...addressData, street: e.target.value })
                    }
                    required
                  />
                </div>
                <div className={classes.form_row}>
                  <div className={classes.form_group}>
                    <label>City</label>
                    <input
                      type="text"
                      placeholder="Bole"
                      value={addressData.city}
                      onChange={(e) =>
                        setAddressData({ ...addressData, city: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className={classes.form_group}>
                    <label>State</label>
                    <input
                      type="text"
                      placeholder="Addis Ababa"
                      value={addressData.state}
                      onChange={(e) =>
                        setAddressData({
                          ...addressData,
                          state: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div className={classes.form_row}>
                  <div className={classes.form_group}>
                    <label>ZIP Code</label>
                    <input
                      type="text"
                      placeholder="10001"
                      value={addressData.zipCode}
                      onChange={(e) =>
                        setAddressData({
                          ...addressData,
                          zipCode: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className={classes.form_group}>
                    <label>Country</label>
                    <input
                      type="text"
                      placeholder="Ethiopia"
                      value={addressData.country}
                      onChange={(e) =>
                        setAddressData({
                          ...addressData,
                          country: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div className={classes.form_group}>
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={addressData.phone}
                    onChange={(e) =>
                      setAddressData({ ...addressData, phone: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            </div>

            <div className={classes.payment_section}>
              <h2>Payment Information</h2>

              {paymentSuccess ? (
                <div className={classes.success_message}>
                  <h3>Payment Successful!</h3>
                  <p>
                    Your order has been placed and will be processed shortly.
                  </p>
                </div>
              ) : (
                <div className={classes.stripe_payment_container}>
                  <StripePayment
                    totalAmount={totalAmount}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                    basket={basket}
                    user={user}
                    addressData={addressData}
                  />

                  {paymentError && (
                    <div className={classes.payment_error}>{paymentError}</div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </LayOut>
  );
};

export default Payments;
