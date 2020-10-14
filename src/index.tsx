import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./app";
import { ThemeProvider } from "./themeContext";
import { OutlineProvider } from "./outlineContext";
import { FileProvider } from "./fileContext";

ReactDOM.render(
  // App wrapped in various providers that allows use of their
  // contexts by any component in the app.
  <Router>
    <FileProvider>
      <OutlineProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </OutlineProvider>
    </FileProvider>
  </Router>,
  document.getElementById("root")
);
