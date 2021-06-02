import React from "react";
import { ActionButtonComponent } from "./actionButton";
import { create } from "react-test-renderer";
import { fireEvent, render, waitFor } from "@testing-library/react";

const mock = jest.fn();
const actionButton = <ActionButtonComponent text={"hello"} onClick={mock} />;

describe("<ActionButton />", (): void => {
  test("it matches the snapshot", (): void => {
    const snapshot = create(actionButton);
    expect(snapshot.toJSON()).toMatchSnapshot();
  });

  test("it renders a button", (): void => {
    const { getByRole } = render(actionButton);
    const button = getByRole("button") as HTMLButtonElement;
    expect(button.textContent).toEqual("hello");
  });

  test("function called on click", async (): Promise<void> => {
    const { getByRole } = render(actionButton);
    const button = getByRole("button") as HTMLButtonElement;
    fireEvent.click(button);
    await waitFor(() => expect(mock).toHaveBeenCalled());
  });
});
