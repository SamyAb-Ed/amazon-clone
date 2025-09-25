import React, { createContext, useReducer, useEffect, useState } from "react";
import { auth } from "../Utility/Firebase";
import { reducer, initialState } from "../Utility/Reducer";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(true);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("Auth state changed:", user);
      setLoading(false);

      if (user) {
        dispatch({ type: "SET_USER", user });
      } else {
        dispatch({ type: "SIGN_OUT" });
      }
    });

    return () => unsubscribe();
  }, []);

  console.log("DataProvider - Current state:", state);
  console.log("DataProvider - User:", state.user);
  console.log("DataProvider - Auth loading:", loading);

  return (
    <DataContext.Provider value={[state, dispatch, loading]}>
      {children}
    </DataContext.Provider>
  );
};
