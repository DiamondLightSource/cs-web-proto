import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./app";
import { ThemeProvider } from "./themeContext";

ReactDOM.render(
  // Website wrapped in ThemeProvider so dark and light mode is
  // available anywhere in the app
  <ThemeProvider>
    <App />
  </ThemeProvider>,
  document.getElementById("root")
);
