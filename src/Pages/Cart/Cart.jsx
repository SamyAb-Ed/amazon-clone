import React, { useContext } from "react";
import LayOut from "../../Components/LayOut/LayOut";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import CurrencyFormat from "../../Components/CurrencyFormat/CurrencyFormat";
import { Type } from "../../Utility/action.type";
import classes from "./Cart.module.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Components/AuthProvider/AuthProvider";

const Cart = () => {
  const [{ basket }, dispatch] = useContext(DataContext);
  const navigate = useNavigate();
  const { user } = useAuth();

  const removeFromCart = (id) => {
    dispatch({
      type: Type.REMOVE_FROM_BASKET,
      id: id,
    });
  };

  const incrementItem = (id) => {
    dispatch({
      type: Type.INCREMENT_ITEM,
      id: id,
    });
  };

  const decrementItem = (id) => {
    dispatch({
      type: Type.DECREMENT_ITEM,
      id: id,
    });
  };
  const handleCheckout = (e) => {
    e.preventDefault();

    try {
      if (basket.length === 0) {
        alert(
          "Your cart is empty! Add some items before proceeding to checkout."
        );
        return;
      }

      // Check if user is authenticated
      if (!user) {
        alert("Please sign in to proceed to checkout.");
        navigate("/auth/signin");
        return;
      }

      // Navigate to payments page
      navigate("/payments");
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <LayOut>
      <div className={classes.cart_container}>
        <div className={classes.cart_left}>
          <h2>Shopping Cart</h2>
          {basket.length === 0 ? (
            <div className={classes.empty_cart}>
              <h3>Your cart is empty</h3>
              <p>Add some items to get started!</p>
            </div>
          ) : (
            basket.map((item) => (
              <div key={item.id} className={classes.cart_item}>
                <img src={item.image} alt={item.title} />
                <div className={classes.item_info}>
                  <h3>{item.title}</h3>
                  {item.description && (
                    <p className={classes.item_description}>
                      {item.description.length > 200
                        ? `${item.description.substring(0, 200)}...`
                        : item.description}
                    </p>
                  )}
                  <div className={classes.price}>
                    <CurrencyFormat amount={item.price} />
                  </div>

                  <div className={classes.quantity_controls}>
                    <button
                      onClick={() => decrementItem(item.id)}
                      className={classes.quantity_button}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className={classes.quantity_display}>
                      Qty: {item.quantity || 1}
                    </span>
                    <button
                      onClick={() => incrementItem(item.id)}
                      className={classes.quantity_button}
                    >
                      +
                    </button>
                  </div>

                  <div className={classes.item_total}>
                    <strong>
                      Item Total:{" "}
                      <CurrencyFormat
                        amount={item.price * (item.quantity || 1)}
                      />
                    </strong>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className={classes.remove_button}
                  >
                    Remove from Cart
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className={classes.cart_right}>
          {basket.length > 0 && (
            <div className={classes.subtotal}>
              <h3>
                Subtotal (
                {basket.reduce(
                  (total, item) => total + (item.quantity || 1),
                  0
                )}{" "}
                items):
              </h3>
              <CurrencyFormat
                amount={basket.reduce(
                  (total, item) => total + item.price * (item.quantity || 1),
                  0
                )}
              />
            </div>
          )}

          <button
            onClick={handleCheckout}
            className={classes.checkout_button}
            disabled={basket.length === 0}
          >
            {basket.length === 0
              ? "Add items to checkout"
              : "Proceed to Checkout"}
          </button>
        </div>
      </div>
    </LayOut>
  );
};

export default Cart;
