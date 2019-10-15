import React from "react";
import { MenuButton, MenuButtonProps } from "./menuButton";
import { configure, shallow, ShallowWrapper } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { create, ReactTestRenderer } from "react-test-renderer";
import { venumOf, vstringOf, vdoubleOf } from "../../vtypes/vtypes";
import { ALARM_NONE } from "../../vtypes/alarm";
import { timeNow } from "../../vtypes/time";

configure({ adapter: new Adapter() });

let snapshot: ReactTestRenderer;
let enumwrapper: ShallowWrapper<MenuButtonProps>;
let stringwrapper: ShallowWrapper<MenuButtonProps>;
let numberwrapper: ShallowWrapper<MenuButtonProps>;

beforeEach((): void => {
  const mock = (_: any): void => {
    // pass
  };
  const menubutton = (
    <MenuButton
      connected={true}
      value={venumOf(
        0,
        ["zero", "one", "two", "three", "four", "five"],
        ALARM_NONE,
        timeNow()
      )}
      onChange={mock}
    />
  );
  const menuButtonString = (
    <MenuButton
      connected={true}
      value={vstringOf("testing enum")}
      onChange={mock}
    />
  );
  const menuButtonNumber = (
    <MenuButton connected={true} value={vdoubleOf(3.14159)} onChange={mock} />
  );
  enumwrapper = shallow(menubutton);
  stringwrapper = shallow(menuButtonString);
  numberwrapper = shallow(menuButtonNumber);
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
      <MenuButton
        connected={true}
        value={venumOf(
          5,
          ["zero", "one", "two", "three", "four", "five"],
          ALARM_NONE,
          timeNow()
        )}
        onChange={mock}
      />
    );
    const select = menubuttonwrap.find("select");
    expect(select.get(0).type).toEqual("select");
    expect(select.prop("value")).toEqual(5);
  });
  test("it takes VString", (): void => {
    const select = stringwrapper.find("select");
    expect(select.prop("value")).toEqual(0);
    const options = stringwrapper.find("option");
    expect(options.length).toBe(1);
    expect(options.text()).toBe("testing enum");
  });

  test("it takes VDouble", (): void => {
    const select = numberwrapper.find("select");
    expect(select.prop("value")).toEqual(0);
    const options = numberwrapper.find("option");
    expect(options.length).toBe(1);
    expect(options.text()).toBe("3.14159");
  });
  test("it is enabled on VEnum", (): void => {
    const select = enumwrapper.find("select");
    expect(select.prop("disabled")).toEqual(false);
  });
  test("it is disabled on VString", (): void => {
    const select = stringwrapper.find("select");
    expect(select.prop("disabled")).toEqual(true);
  });

  test("it is disabled on VDouble", (): void => {
    const select = numberwrapper.find("select");
    expect(select.prop("disabled")).toEqual(true);
  });
});
