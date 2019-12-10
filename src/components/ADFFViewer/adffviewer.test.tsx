import React from "react";
import { RawADFFViewerComponent, ADFFViewer } from "./adffviewer";
import { configure, shallow, ShallowWrapper } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { stringToVtype } from "../../vtypes/utils";
import { create, ReactTestRenderer } from "react-test-renderer";

configure({ adapter: new Adapter() });

let wrapper: ShallowWrapper<ReadbackComponentProps>;
let rawSnapshot: ReactTestRenderer;
let rawWrapper: ShallowWrapper<ReadbackComponentProps>;
const FAKE_URL = "http://fakeurl.com/video.mjpeg";
const FAKE_PV_PREFIX = "pv-prefix-1";
const FAKE_PV = `${FAKE_PV_PREFIX}:MJPG_URL_RBV`;

beforeEach((): void => {
  const rawADFFViewerComponent = (
    <RawADFFViewerComponent
      connected={true}
      readonly={true}
      value={stringToVtype(FAKE_URL)}
    />
  );

  const adffviewer = (
    <ADFFViewer
      prefix={FAKE_PV_PREFIX}
      containerStyling={{
        position: "absolute",
        x: "100px",
        y: "100px",
        width: "200px",
        height: "200px"
      }}
    />
  );

  rawWrapper = shallow(rawADFFViewerComponent);
  rawSnapshot = create(rawADFFViewerComponent);
  wrapper = shallow(adffviewer);
});

describe("<RawADFFViewerComponent />", (): void => {
  test("it matches the snapshot", (): void => {
    expect(rawSnapshot.toJSON()).toMatchSnapshot();
  });

  test("it renders a basic element", (): void => {
    // there is at least one img that could render the stream
    const img = rawWrapper.find("img");
    expect(img.length).toBeGreaterThan(0);
  });

  test("Element uses provided URL", (): void => {
    const img = rawWrapper.find("img");
    expect(img.props().src).toEqual(FAKE_URL);
  });
});

describe("<ADFFViewer />", (): void => {
  test("It derives the proper PV name", (): void => {
    expect(wrapper.props().pvName).toEqual(FAKE_PV);
  });
});
