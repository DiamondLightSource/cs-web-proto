import React from "react";
import ReactDOM from "react-dom";
import App from "./app";

it("renders without crashing", (): void => {
  const div = app.createElement("div");
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
