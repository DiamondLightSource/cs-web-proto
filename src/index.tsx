import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./app";
import { ThemeProvider } from "./themeContext";
import { OutlineProvider } from "./outlineContext";

ReactDOM.render(
  // Website wrapped in ThemeProvider so dark and light mode is
  // available anywhere in the app
  <OutlineProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </OutlineProvider>,
  document.getElementById("root")
);
