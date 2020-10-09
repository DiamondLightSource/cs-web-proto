import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./app";
import { ThemeProvider } from "./themeContext";
import { OutlineProvider } from "./outlineContext";
import { FileProvider } from "./fileContext";

ReactDOM.render(
  // App wrapped in various providers that allows use of their
  // contexts by any component in the app.
  <FileProvider>
    <OutlineProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </OutlineProvider>
  </FileProvider>,
  document.getElementById("root")
);
