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
import { reducer, initialState } from "../Utility/Reducer";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  console.log("DataProvider - Current state:", state);
  console.log("DataProvider - Dispatch function:", typeof dispatch);

  return (
    <DataContext.Provider value={[state, dispatch]}>
      {children}
    </DataContext.Provider>
  );
};
