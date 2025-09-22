import React, { useContext } from "react";
import "./Payment.css";
import LayOut from "../../Components/LayOut/LayOut";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import ProductCard from "../../Components/Product/ProductCard";
import { ActionType } from "../../Components/Utility/ActionType";

function Payment() {
  const [state, dispatch] = useContext(DataContext);
  const { basket } = state;

  // Calculate total price
  const totalPrice =
    basket?.reduce((amount, item) => {
      return amount + item.price * (item.quantity || 1);
    }, 0) || 0;

  const handlePlaceOrder = () => {
    alert(`Order placed successfully! Total: $${totalPrice.toFixed(2)}`);
    // Clear the cart after successful order
    basket.forEach((item) => {
      dispatch({ type: ActionType.RemoveFromBasket, item });
    });
  };

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

          {/* Payment Form */}
          <div className="payment_form">
            <h3>Payment Information</h3>
            <form>
              <div className="form_group">
                <label>Card Number:</label>
                <input type="text" placeholder="1234 5678 9012 3456" />
              </div>

              <div className="form_row">
                <div className="form_group">
                  <label>Expiry Date:</label>
                  <input type="text" placeholder="MM/YY" />
                </div>
                <div className="form_group">
                  <label>CVV:</label>
                  <input type="text" placeholder="123" />
                </div>
              </div>

              <div className="form_group">
                <label>Name on Card:</label>
                <input type="text" placeholder="John Doe" />
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                className="place_order_btn"
                disabled={basket?.length === 0}
              >
                Place Order - ${totalPrice.toFixed(2)}
              </button>
            </form>
          </div>
        </div>
      </div>
    </LayOut>
  );
}

export default Payment;
