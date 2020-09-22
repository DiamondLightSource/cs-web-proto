import React, { useState } from "react";

export interface Theme {
  [property: string]: string;
}

export const lightTheme: Theme = {
  "--colour-text": "#000000",
  "--colour-secondary-text": "#000000",
  "--colour-background": "#F7F9FB",
  "--colour-secondary-background": "#8FC1E3",
};

export const darkTheme: Theme = {
  "--colour-text": "#FFFFFF",
  "--colour-secondary-text": "#FFFFFF",
  "--colour-background": "#282828",
  "--colour-secondary-background": "#0C0032",
};

function applyTheme(theme: Theme): void {
  Object.keys(theme).forEach((key: string): void => {
    const value: string = theme[key];
    document.documentElement.style.setProperty(key, value);
  });
}

const initialState = {
  dark: false,
  theme: lightTheme,
  toggle: (): void => {},
  applyTheme,
};

export const ThemeContext = React.createContext(initialState);

/**
 * Switches between the dark and light theme and stores user
 * preference, toggle accessed using
 * const { toggle } = useContext(ThemeContext)
 */
export const ThemeProvider: React.FC<{}> = ({ children }: any): JSX.Element => {
  const [dark, setIsDark] = useState(localStorage.getItem("dark") === "true");

  const toggle = (): void => {
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
    <ThemeContext.Provider value={{ dark, theme, toggle, applyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
