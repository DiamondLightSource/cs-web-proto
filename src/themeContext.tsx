import React, { useState } from "react";

// 28/09/20 Not sure if there is a better way to define this type
export interface Theme {
  [property: string]: string;
}

export const lightTheme: Theme = {
  "--colour-text": "#000000",
  "--colour-secondary-text": "#000000",
  "--colour-background": "#F7F9FB",
  "--colour-secondary-background": "#8FC1E3"
};

export const darkTheme: Theme = {
  "--colour-text": "#FFFFFF",
  "--colour-secondary-text": "#FFFFFF",
  "--colour-background": "#282828",
  "--colour-secondary-background": "#0C0032"
};

function applyTheme(theme: Theme): void {
  Object.keys(theme).forEach((key: string): void => {
    const value: string = theme[key];
    document.documentElement.style.setProperty(key, value);
  });
}

// These properties are accessible when using ThemeContext
// const { dark, applyTheme } = React.useContext(ThemeContext);
const initialState = {
  dark: false,
  theme: lightTheme,
  toggleTheme: (): void => {},
  applyTheme
};

export const ThemeContext = React.createContext(initialState);

/**
 * Switches between the dark and light theme and stores user
 * preference, toggle accessed using
 * const { toggle } = useContext(ThemeContext)
 */
export const ThemeProvider: React.FC<Record<string, unknown>> = ({
  children
}: any): JSX.Element => {
  // dark represents dark mode or light mode
  const [dark, setIsDark] = useState(localStorage.getItem("dark") === "true");

  const toggleTheme = (): void => {
    const isDark = !dark;
    localStorage.setItem("dark", JSON.stringify(isDark));
    setIsDark(isDark);
    const theme: Theme = dark ? lightTheme : darkTheme;
    applyTheme(theme);
  };

  const theme: Theme = dark ? lightTheme : darkTheme;

  // All descendents of ThemeContext.provider re-render whenever
  // the value property changes (whole app wrapped hence theme
  // everywhere will change)
  return (
    <ThemeContext.Provider value={{ dark, theme, toggleTheme, applyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
