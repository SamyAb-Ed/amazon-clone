import React, { useContext } from "react";
import classes from "./Cart.module.css";
import LayOut from "../../Components/LayOut/LayOut";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import CurrencyFormat from "../../Components/CurrencyFormat/CurrencyFormat";
import ProductCard from "../../Components/Product/ProductCard";
import { Link } from "react-router-dom";
import { ActionType } from "../../Components/Utility/ActionType";
import { IoIosArrowUp } from "react-icons/io";

const Cart = () => {
  const [state, dispatch] = useContext(DataContext);
  const { basket, user } = state;

  // Calculate total price properly
  const totalPrice =
    basket?.reduce((amount, item) => {
      return amount + item.price * (item.quantity || 1);
    }, 0) || 0;

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

  return (
    <LayOut>
      <section className={classes.container}>
        <div className={classes.cart_container}>
          <h2>Hello</h2>
          <h3>Your shopping basket</h3>
          <hr />

          {basket?.length === 0 ? (
            <h2>Oops, Your basket is empty</h2>
          ) : (
            basket?.map((item, index) => {
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
            })
          )}
        </div>
        {basket?.length !== 0 && (
          <div className={classes.subtotal}>
            <div>
              <p>
                Subtotal ({basket?.length} items):{" "}
                <strong>${totalPrice.toFixed(2)}</strong>
              </p>
            </div>
            <span>
              <input type="checkbox" />
              <small>This order contains a gift</small>
            </span>
            <Link to="/payments" className={classes.checkout_button}>
              Continue to checkout
            </Link>
          </div>
        )}
      </section>
    </LayOut>
  );
};

export default Cart;
