import React, { useState, useEffect } from "react";

export const lightTheme = {
  "--colour-text": "#000000",
  "--colour-secondary-text": "#000000",
  "--colour-background": "#FFFFFF"
};

export const darkTheme = {
  "--colour-text": "#FFFFFF",
  "--colour-secondary-text": "#FFFF00",
  "--colour-background": "#212121"
};

const initialState = {
  dark: false,
  theme: lightTheme,
  toggle: () => {}
};

export const ThemeContext = React.createContext(initialState);

export function ThemeProvider({ children }: any) {
  const [dark, setIsDark] = useState(false);

  useEffect(() => {
    const dark = localStorage.getItem("dark") === "true";
    setIsDark(dark);
  }, [dark]);

  const toggle = () => {
    const isDark = !dark;
    localStorage.setItem("dark", JSON.stringify(isDark));
    setIsDark(isDark);
    const theme: any = dark ? lightTheme : darkTheme;
    Object.keys(theme).forEach(key => {
      const value = theme[key];
      document.documentElement.style.setProperty(key, value);
    });
  };

  const theme = dark ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
