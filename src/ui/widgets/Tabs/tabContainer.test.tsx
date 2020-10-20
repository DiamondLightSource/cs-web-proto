import React from "react";
import log from "loglevel";

import { render, fireEvent } from "@testing-library/react";
import { TabContainerComponent } from "./tabContainer";
import { Provider } from "react-redux";
import { store } from "../../../redux/store";
import { ensureWidgetsRegistered } from "..";
ensureWidgetsRegistered();

describe("<TabContainer>", (): void => {
  it("renders one child", () => {
    const child = {
      type: "label",
      position: "relative",
      text: "hello"
    };
    const { queryByText } = render(
      <Provider store={store}>
        <TabContainerComponent tabs={{ one: child }} />
      </Provider>
    );

    expect(queryByText("hello")).toBeInTheDocument();
  });
  it("renders error widget for incorrect child", () => {
    const child = {
      type: "image"
    };
    // Suppress logging for expected error.
    log.setLevel("error");
    const { queryByText } = render(
      <Provider store={store}>
        <TabContainerComponent tabs={{ one: child }} />
      </Provider>
    );
    log.setLevel("info");

    expect(queryByText(/Error/)).toBeInTheDocument();
  });
  it("changes tabs on click", () => {
    const child1 = {
      type: "label",
      position: "relative",
      text: "hello"
    };
    const child2 = {
      type: "label",
      position: "relative",
      text: "bye"
    };
    const { queryByText } = render(
      <Provider store={store}>
        <TabContainerComponent tabs={{ one: child1, two: child2 }} />
      </Provider>
    );

    expect(queryByText("hello")).toBeInTheDocument();
    fireEvent.click(queryByText("two") as HTMLDivElement);
    expect(queryByText("bye")).toBeInTheDocument();
  });
});
