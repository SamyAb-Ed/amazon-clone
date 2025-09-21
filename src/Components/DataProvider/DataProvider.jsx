// import React, { createContext, useReducer } from "react";

// export const DataContext = createContext();

// export const DataProvider = ({ children, reducer, initialState }) => {
//   return (
//     <DataContext.Provider value={useReducer(reducer, initialState)}>
//       {children}
//     </DataContext.Provider>
//   );
// };


import React, { createContext, useReducer } from "react";

export const DataContext = createContext();

// Built-in initial state
const initialState = {
  basket: [],
  user: null,
};

// Built-in reducer
const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_BASKET":
      return {
        ...state,
        basket: [...state.basket, action.item],
      };
    case "REMOVE_FROM_BASKET":
      return {
        ...state,
        basket: state.basket.filter((item) => item.id !== action.id),
      };
    default:
      return state;
  }
};

export const DataProvider = ({ children }) => {
  return (
    <DataContext.Provider value={useReducer(reducer, initialState)}>
      {children}
    </DataContext.Provider>
  );
};