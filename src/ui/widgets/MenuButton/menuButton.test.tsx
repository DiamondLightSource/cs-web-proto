import React from "react";
import { MenuButtonComponent, MenuButtonProps } from "./menuButton";
import { configure, shallow, ShallowWrapper } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { create, ReactTestRenderer } from "react-test-renderer";
import { dtimeNow, DAlarm, DType, DDisplay } from "../../../types/dtypes";

configure({ adapter: new Adapter() });

let snapshot: ReactTestRenderer;
let enumwrapper: ShallowWrapper<MenuButtonProps>;
let labelwrapper: ShallowWrapper<MenuButtonProps>;

beforeEach((): void => {
  const mock = (_: any): void => {
    // pass
  };
  const menubutton = (
    <MenuButtonComponent
      connected={true}
      value={
        new DType(
          { doubleValue: 0 },
          DAlarm.NONE,
          dtimeNow(),
          new DDisplay({
            choices: ["zero", "one", "two", "three", "four", "five"]
          })
        )
      }
      readonly={false}
      onChange={mock}
    />
  );
  const menuButtonLabel = (
    <MenuButtonComponent
      connected={true}
      label="menulabel"
      readonly={false}
      onChange={mock}
    />
  );
  enumwrapper = shallow(menubutton);
  labelwrapper = shallow(menuButtonLabel);
  snapshot = create(menubutton);
});

describe("<MenuButton />", (): void => {
  test("it matches the snapshot", (): void => {
    expect(snapshot.toJSON()).toMatchSnapshot();
  });

  test("it renders a basic element", (): void => {
    const select = enumwrapper.find("select");
    expect(select.get(0).type).toEqual("select");
    expect(select.prop("value")).toEqual(0);
  });

  test("it renders all the choices", (): void => {
    const options = enumwrapper.find("option");
    expect(options.length).toBe(6);
  });
  test("it passes through the correct index", (): void => {
    const mock = (_: any): void => {
      // pass
    };
    const menubuttonwrap = shallow(
      <MenuButtonComponent
        connected={true}
        value={
          new DType(
            { doubleValue: 5 },
            DAlarm.NONE,
            dtimeNow(),
            new DDisplay({
              choices: ["zero", "one", "two", "three", "four", "five"]
            })
          )
        }
        readonly={false}
        onChange={mock}
      />
    );
    const select = menubuttonwrap.find("select");
    expect(select.get(0).type).toEqual("select");
    expect(select.prop("value")).toEqual(5);
  });
  test("it uses a label", (): void => {
    const select = labelwrapper.find("select");
    expect(select.prop("value")).toEqual(0);
    const options = labelwrapper.find("option");
    expect(options.length).toBe(1);
    expect(options.text()).toBe("menulabel");
  });

  test("preventDefault is not called when enabled", (): void => {
    const mockPreventDefault = jest.fn();
    const event = { preventDefault: mockPreventDefault };
    enumwrapper.find("select").simulate("mousedown", event);
    expect(mockPreventDefault).not.toHaveBeenCalled();
  });
  test("preventDefault is called when disabled", (): void => {
    const mockPreventDefault = jest.fn();
    const event = { preventDefault: mockPreventDefault };
    labelwrapper.find("select").simulate("mousedown", event);
    expect(mockPreventDefault).toHaveBeenCalled();
  });
});
