import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { DrawerComponent } from "./drawer";

test("drawer opens on click", async () => {
  // when passing contents as a list each item in the list
  // requires a key
  const contents = <div key={1}>Hello</div>;
  const { container, queryByText } = render(
    <DrawerComponent>{[contents]}</DrawerComponent>
  );

  // Drawer not present.
  expect(queryByText("Hello")).not.toBeInTheDocument();
  // Click the button
  fireEvent.click(container.querySelector("button") as HTMLButtonElement);
  // Wait for element transition.
  await waitFor((): void => {
    // Drawer present
    expect(queryByText("Hello")).toBeInTheDocument();
  });
});
