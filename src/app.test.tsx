// Specifically disable some eslint rules
/* eslint unicorn/filename-case: 0 */ // --> OFF

import React from "react";
import ReactDOM from "react-dom";
import App from "./app";

it("renders without crashing", (): void => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
