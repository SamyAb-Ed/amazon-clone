import React, { useState, createContext, useContext } from "react";
const colorContext = createContext();
export const useColor = () => {
    return useContext(colorContext);
}
export const ThemeProvider = ({ children }) => {
  const [color, setColor] = useState("light");
  const toggleColor = () => {
    setColor((prevColor) => (prevColor === "light" ? "dark" : "light"));
  };

  return (
    <colorContext.Provider value={{ color, toggleColor }}>
      {children}
    </colorContext.Provider>
  );
};