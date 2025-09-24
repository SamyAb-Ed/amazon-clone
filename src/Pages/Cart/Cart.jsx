import React, { useContext, useState } from "react";
import classes from "./Cart.module.css";
import LayOut from "../../Components/LayOut/LayOut";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import CurrencyFormat from "../../Components/CurrencyFormat/CurrencyFormat";
import ProductCard from "../../Components/Product/ProductCard";
import { Link, useNavigate } from "react-router-dom";
import { ActionType } from "../../Components/Utility/ActionType";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { FiShoppingBag, FiTrash2 } from "react-icons/fi";

const Cart = () => {
  const [state, dispatch] = useContext(DataContext);
  const { basket, user } = state;
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate totals
  const totalPrice =
    basket?.reduce((amount, item) => {
      return amount + item.price * (item.quantity || 1);
    }, 0) || 0;

  const totalItems =
    basket?.reduce((total, item) => {
      return total + (item.quantity || 1);
    }, 0) || 0;

  const shippingCost = totalPrice > 50 ? 0 : 5.99;
  const tax = totalPrice * 0.08; // 8% tax
  const finalTotal = totalPrice + shippingCost + tax;

  // Add item to cart (increment quantity)
  const increment = (item) => {
    dispatch({ type: ActionType.AddToBasket, item });
  };

  // Remove item from cart completely
  const removeItem = (item) => {
    // Remove all instances of this item
    const newBasket = basket.filter((basketItem) => basketItem.id !== item.id);
    // Since we don't have a "remove all" action, we'll use a workaround
    // by dispatching multiple remove actions
    basket
      .filter((basketItem) => basketItem.id === item.id)
      .forEach(() => {
        dispatch({ type: ActionType.RemoveFromBasket, item });
      });
  };

  // Decrement quantity (remove one instance)
  const decrement = (item) => {
    dispatch({ type: ActionType.RemoveFromBasket, item });
  };

  // Clear entire cart
  const clearCart = () => {
    basket.forEach((item) => {
      removeItem(item);
    });
  };

  // Handle checkout
  const handleCheckout = () => {
    if (!user) {
      // Redirect to login if not authenticated
      navigate("/auth");
      return;
    }
    if (basket.length === 0) {
      return;
    }
    navigate("/payments");
  };

  return (
    <LayOut>
      <section className={classes.container}>
        <div className={classes.cart_header}>
          <h2>Hello{user ? `, ${user.displayName || user.email}` : ""}</h2>
          <h3>Your shopping basket</h3>
          {basket?.length > 0 && (
            <div className={classes.cart_actions}>
              <button onClick={clearCart} className={classes.clear_cart_btn}>
                <FiTrash2 /> Clear Cart
              </button>
            </div>
          )}
        </div>
        <hr />

        {basket?.length === 0 ? (
          <div className={classes.empty_cart}>
            <FiShoppingBag className={classes.empty_cart_icon} />
            <h2>Your basket is empty</h2>
            <p>Add some items to get started!</p>
            <Link to="/" className={classes.continue_shopping_btn}>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className={classes.cart_items}>
              {basket?.map((item, index) => {
                return (
                  <ProductCard
                    key={`${item.id}-${index}`}
                    product={item}
                    isCartItem={true}
                    showAddButton={false}
                    showDescription={true}
                    quantity={item.quantity || 1}
                    onIncrement={increment}
                    onDecrement={decrement}
                    onRemove={removeItem}
                  />
                );
              })}
            </div>

            <div className={classes.order_summary}>
              <h3>Order Summary</h3>
              <div className={classes.summary_row}>
                <span>Subtotal ({totalItems} items):</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className={classes.summary_row}>
                <span>Shipping:</span>
                <span>
                  {shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className={classes.summary_row}>
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <hr />
              <div className={classes.summary_row_total}>
                <span>Total:</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>

              {totalPrice < 50 && (
                <div className={classes.free_shipping_note}>
                  <small>
                    Add ${(50 - totalPrice).toFixed(2)} more for FREE shipping!
                  </small>
                </div>
              )}

              <div className={classes.gift_option}>
                <input type="checkbox" id="gift" />
                <label htmlFor="gift">This order contains a gift</label>
              </div>

              <button
                onClick={handleCheckout}
                className={classes.checkout_button}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : `Proceed to Checkout`}
              </button>
            </div>
          </>
        )}
      </section>
    </LayOut>
  );
};

export default Cart;
