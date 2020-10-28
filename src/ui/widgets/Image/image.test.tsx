import React from "react";
import { ImageComponent } from "./image";
import { shallow, ShallowWrapper } from "enzyme";
import renderer, { create, ReactTestRenderer } from "react-test-renderer";
import { DEFAULT_BASE_URL } from "../../../baseUrl";

let snapshot: ReactTestRenderer;
let wrapper: ShallowWrapper;

beforeEach((): void => {
  const image = <ImageComponent src="myimage" />;
  wrapper = shallow(image);
  snapshot = create(image);
});

describe("<ImageComponent />", (): void => {
  test("it matches the snapshot", (): void => {
    expect(snapshot.toJSON()).toMatchSnapshot();
  });

  test("it renders a basic element", (): void => {
    expect(wrapper.type()).toEqual("div");
  });

  test("it contains an image element", (): void => {
    expect(wrapper.childAt(0).type()).toEqual("img");
  });

  test("its source is passed through properly", (): void => {
    expect(wrapper.childAt(0).prop("src")).toEqual(
      `${DEFAULT_BASE_URL}/img/myimage`
    );
  });

  test("it passes alternative text through", (): void => {
    expect(
      shallow(<ImageComponent src="test" alt="test text" />)
        .childAt(0)
        .prop("alt")
    ).toEqual("test text");
  });

  test("it has 100% height and width when set to fill", (): void => {
    const image = <ImageComponent src="myimage" fill={true} />;
    wrapper = shallow(image);
    expect(wrapper.childAt(0).prop("style").height).toEqual("100%");
    expect(wrapper.childAt(0).prop("style").width).toEqual("100%");
  });

  test("width and height override fill property", (): void => {
    const imageProps = {
      src: "test",
      width: "20px",
      height: "15px"
    };

    const imageRenderedProps = renderer
      .create(<ImageComponent {...imageProps} />)
      .root.findByType("img").props;

    expect(imageRenderedProps.style.height).toBe("15px");
    expect(imageRenderedProps.style.width).toBe("20px");
  });

  test("flips and rotations are applied", (): void => {
    const imageProps = {
      src: "test",
      flipHorizontal: true,
      flipVertical: true,
      rotation: 45
    };

    const imageRenderedProps = renderer
      .create(<ImageComponent {...imageProps} />)
      .root.findByType("img").props;

    expect(imageRenderedProps.style.transform).toBe(
      "rotate(45deg) scaleX(-1) scaleY(-1)"
    );
  });
});
