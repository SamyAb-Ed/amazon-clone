import { useEffect, useContext } from "react";
import { auth } from "./MockAuth";
import { DataContext } from "../DataProvider/DataProvider";
import { ActionType } from "./ActionType";

const AuthListener = ({ children }) => {
  const [state, dispatch] = useContext(DataContext);

  console.log("AuthListener - Dispatch function:", typeof dispatch);
  console.log("AuthListener - State:", state);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("AuthListener - Auth state changed:", user);
      if (user) {
        // User is signed in
        const userData = {
          id: user.uid,
          name: user.displayName || "User",
          email: user.email,
          avatar: user.photoURL || "https://via.placeholder.com/40",
        };
        console.log("AuthListener - Dispatching SetUser:", userData);
        dispatch({ type: ActionType.SetUser, user: userData });
      } else {
        // User is signed out
        console.log("AuthListener - Dispatching SignOut");
        dispatch({ type: ActionType.SignOut });
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [dispatch]);

  return children;
};

export default AuthListener;
