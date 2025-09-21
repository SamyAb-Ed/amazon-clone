// App.tsx 18:50 onwards about App.jsx

import React, { useReducer } from "react";
import "./App.css";

function App() {
  let initaliState = 0;
  const [state, dispatch] = useReducer(reducer, initaliState, init);

  function init(a) {
    return { count: a };
  } 

  function reducer(state, action) {
    switch (action.type) {
      case "increment":
        return { count: state.count + 1 };
      case "decrement":
        return { count: state.count - 1 };
      case "reset":
        return init(initaliState); 
      default:
        throw new Error();
    }
  }

  return (
    <>
      <h1>Count: {state.count}</h1>
      <button
        onClick={() => dispatch({ type: "reset", payload: initaliState })}
      >
        Reset {/* Fixed: Added button text */}
      </button>
      <button onClick={() => dispatch({ type: "decrement" })}>decrease</button>
      <button onClick={() => dispatch({ type: "increment" })}>increase</button>
    </>
  ); // Fixed: Removed extra dash
}

export default App;
