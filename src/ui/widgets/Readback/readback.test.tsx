import React from "react";
import { ReadbackComponent, ReadbackComponentProps } from "./readback";
import { configure, shallow, ShallowWrapper } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { create, ReactTestRenderer } from "react-test-renderer";
import { LabelComponent } from "../Label/label";
import { dstring } from "../../../setupTests";

configure({ adapter: new Adapter() });

let snapshot: ReactTestRenderer;
let wrapper: ShallowWrapper<ReadbackComponentProps>;

beforeEach((): void => {
  const readback = (
    <ReadbackComponent
      connected={true}
      readonly={false}
      value={dstring("3.14159265359")}
      precision={2}
    />
  );
  wrapper = shallow(readback);
  snapshot = create(readback);
});

describe("<Readback />", (): void => {
  test("it matches the snapshot", (): void => {
    expect(snapshot.toJSON()).toMatchSnapshot();
  });

  test("it applies precision to numbers", (): void => {
    const labelComponent = wrapper.find(LabelComponent);
    expect(labelComponent.props().text).toEqual("3.14");
  });
});
