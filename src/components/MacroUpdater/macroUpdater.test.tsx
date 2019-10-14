import React from "react";
import { MacroUpdater } from "./macroUpdater";
import { configure, mount, ReactWrapper } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { create, ReactTestRenderer } from "react-test-renderer";
import configureMockStore from "redux-mock-store";
import { Provider } from "react-redux";

configure({ adapter: new Adapter() });
const mockStore = configureMockStore();

let snapshot: ReactTestRenderer;
let wrapper: ReactWrapper;

beforeEach((): void => {
  const store = mockStore({
    macroMap: {
      a: "b"
    }
  });
  wrapper = mount(
    <Provider store={store}>
      <MacroUpdater />
    </Provider>
  );
  snapshot = create(
    <Provider store={store}>
      <MacroUpdater />
    </Provider>
  );
});

describe("<Input />", (): void => {
  test("it matches the snapshot", (): void => {
    expect(snapshot.toJSON()).toMatchSnapshot();
  });
  test("it renders two inputs", (): void => {
    expect(wrapper.find("input").length).toEqual(2);
  });
});
