import React from "react";
import { MenuButtonComponent } from "./menuButton";
import { create } from "react-test-renderer";
import { dtimeNow, DAlarm, DType, DDisplay } from "../../../types/dtypes";
import { ACTIONS_EX_FIRST, WRITE_PV_ACTION } from "../../../testResources";
import { fireEvent, render } from "@testing-library/react";

const mock = jest.fn();
beforeEach((): void => {
  mock.mockReset();
});

function getMenubuttonComponent(
  value?: number,
  readonly?: boolean
): JSX.Element {
  const val = value ?? 0;
  const disabled = readonly ?? false;
  return (
    <MenuButtonComponent
      connected={true}
      value={
        new DType(
          { doubleValue: val },
          DAlarm.NONE,
          dtimeNow(),
          new DDisplay({
            choices: ["zero", "one", "two", "three", "four", "five"]
          })
        )
      }
      readonly={disabled}
      pvName="testpv"
      actionsFromPv={true}
      onChange={mock}
    />
  );
}

const menuButtonActions = (
  <MenuButtonComponent
    connected={false}
    readonly={false}
    actionsFromPv={false}
    actions={ACTIONS_EX_FIRST}
    label="menu button with label"
    onChange={mock}
  />
);

describe("<MenuButton />", (): void => {
  test("it matches the snapshot", (): void => {
    const snapshot = create(getMenubuttonComponent());
    expect(snapshot.toJSON()).toMatchSnapshot();
  });

  test("it renders all the choices", (): void => {
    const { getByRole } = render(getMenubuttonComponent());
    const select = getByRole("combobox");
    expect(select.childElementCount).toBe(6);
  });
  test("it renders actions", (): void => {
    const { getByRole } = render(menuButtonActions);
    const select = getByRole("combobox");
    expect(select.firstChild?.textContent).toEqual("menu button with label");
    // Two actions plus label.
    expect(select.childElementCount).toBe(3);
  });
  test("it renders the option with the correct index", (): void => {
    const { getByText } = render(getMenubuttonComponent(5));
    expect((getByText("zero") as HTMLOptionElement).selected).toBe(false);
    expect((getByText("five") as HTMLOptionElement).selected).toBe(true);
  });

  test("function called on click", async (): Promise<void> => {
    const { getByRole } = render(menuButtonActions);
    // Select the 1st option (0th option is the label)
    fireEvent.change(getByRole("combobox"), {
      target: { value: 1 }
    });
    expect(mock).toHaveBeenCalledWith(WRITE_PV_ACTION);
  });
  test("preventDefault called on mousedown when widget is disabled", async (): Promise<void> => {
    const { getByRole } = render(getMenubuttonComponent(0, true));
    const mockPreventDefault = jest.fn();
    const event = new MouseEvent("mousedown", { bubbles: true });
    event.preventDefault = mockPreventDefault;
    fireEvent(getByRole("combobox"), event);
    expect(mockPreventDefault).toHaveBeenCalled();
  });
});
