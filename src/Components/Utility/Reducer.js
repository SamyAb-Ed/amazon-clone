import { ActionType } from "./ActionType";

export const initialState = {
  basket: [],
  user: null,
};

export const reducer = (state, action) => {
  switch (action.type) {
    case ActionType.AddToBasket:
      const existingItem = state.basket.find(
        (item) => item.id === action.item.id
      );
      if (!existingItem) {
        return {
          ...state,
          basket: [...state.basket, { ...action.item, quantity: 1 }],
        };
      } else {
        return {
          ...state,
          basket: state.basket.map((item) =>
            item.id === action.item.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
    case ActionType.RemoveFromBasket:
      const itemToRemove = state.basket.find(
        (item) => item.id === action.item.id
      );
      if (itemToRemove) {
        if (itemToRemove.quantity > 1) {
          // Decrease the quantity by 1
          return {
            ...state,
            basket: state.basket.map((item) =>
              item.id === action.item.id
                ? { ...item, quantity: item.quantity - 1 }
                : item
            ),
          };
        } else {
          // Remove the item from the basket if quantity is 1
          return {
            ...state,
            basket: state.basket.filter((item) => item.id !== action.item.id),
          };
        }
      }
      return state;
    case ActionType.SetUser:
      return {
        ...state,
        user: action.user,
      };
    case ActionType.SignOut:
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};
