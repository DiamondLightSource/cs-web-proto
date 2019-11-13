import React, { useState, useEffect } from "react";

export const lightTheme = {
  "--colour-text": "#000000",
  "--colour-secondary-text": "#000000",
  "--colour-background": "#F7F9FB",
  "--colour-secondary-background": "#8FC1E3"
};

export const darkTheme = {
  "--colour-text": "#FFFFFF",
  "--colour-secondary-text": "#FFFFFF",
  "--colour-background": "#282828",
  "--colour-secondary-background": "#0C0032"
};

const initialState = {
  dark: false,
  theme: lightTheme,
  toggle: (): void => {}
};

export const ThemeContext = React.createContext(initialState);

export const ThemeProvider: React.FC<{}> = ({ children }: any): JSX.Element => {
  const [dark, setIsDark] = useState(false);

  useEffect((): void => {
    const dark = localStorage.getItem("dark") === "true";
    setIsDark(dark);
  }, [dark]);

  const toggle = (): void => {
    const isDark = !dark;
    localStorage.setItem("dark", JSON.stringify(isDark));
    setIsDark(isDark);
    const theme: any = dark ? lightTheme : darkTheme;
    Object.keys(theme).forEach(function(key): void {
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
};
