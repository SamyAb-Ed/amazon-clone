import React, {createContext, useReducer, useContext, useEffect } from "react";
import { cartReducer} from "../../Components/Utility/Reducer";
import {
    ADD_TO_CART,
    REMOVE_FROM_CART,
    INCREMENT_QUANTITY,
    DECREMENT_QUANTITY,
    CLEAR_CART,
} from "../../Components/Utility/ActionType";

const CardContext = createContext();
export function CartProvider({ children }) {
    const [cartItems, dispatch] = useReducer(cartReducer, [], () => {
        const localData = localStorage.getItem("cartItems");
        return localData ? JSON.parse(localData) : [];
    });
    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);
    const addToCart = (product) => {
        dispatch({ type: ADD_TO_CART, payload: product });
    };
    const removeFromCart = (productId) => {
        dispatch({ type: REMOVE_FROM_CART, payload: productId });
    };
    const incrementQuantity = (productId) => {
        dispatch({ type: INCREMENT_QUANTITY, payload: productId });
    };
    const decrementQuantity = (productId) => {
        dispatch({ type: DECREMENT_QUANTITY, payload: productId });
    };
    const clearCart = () => {
        dispatch({ type: CLEAR_CART });
    };
    return (
        <CardContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                incrementQuantity,
                decrementQuantity,
                clearCart,
            }}
        >
            {children}
        </CardContext.Provider>
    );
}