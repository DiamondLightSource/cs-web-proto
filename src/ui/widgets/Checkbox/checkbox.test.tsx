import React from "react";
import { CheckboxComponent, CheckboxProps } from "./checkbox";
import renderer, { ReactTestRenderer } from "react-test-renderer";
import { InferWidgetProps } from "../propTypes";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { LabelComponent } from "../Label/label";
import { mount, shallow } from "enzyme";
import { Checkbox as MaterialCheckbox } from "@material-ui/core";
import { act } from "react-dom/test-utils";

const checkboxRenderer = (checkboxProps: any): ReactTestRenderer => {
  return renderer.create(
    <CheckboxComponent {...checkboxProps} readonly={true} />
  );
};

type CheckboxComponentProps = InferWidgetProps<typeof CheckboxProps>;

describe("<CheckboxComponent />", (): void => {
  it("default properties are applied", (): void => {
    const testRenderer = checkboxRenderer({});

    const form = testRenderer.root.findByType(FormControlLabel);

    expect(form.props.style).toEqual({ width: "10px", height: "10px" });

    const checkbox = testRenderer.root.findByType(MaterialCheckbox);

    expect(checkbox.props.checked).toBe(false);
    expect(checkbox.props.disableRipple).toBe(true);
  });

  it("height and width are applied to style", (): void => {
    const checkboxProps: CheckboxComponentProps = {
      width: 15,
      height: 20
    };

    const testRenderer = checkboxRenderer(checkboxProps);

    const form = testRenderer.root.findByType(FormControlLabel);

    const formStyle = form.props.style;

    expect(formStyle.width).toBe("15px");
    expect(formStyle.height).toBe("20px");
  });

  it("matches snapshot", (): void => {
    const checkboxProps: CheckboxComponentProps = {
      label: "Here is a label",
      width: 15,
      height: 20
    };

    const renderedCheckbox = checkboxRenderer(checkboxProps);
    expect(renderedCheckbox).toMatchSnapshot();
  });

  it("doesn't create a label if there is no text", (): void => {
    const testRenderer = checkboxRenderer({});

    const findLabel = (): void => {
      testRenderer.root.findByType(LabelComponent);
    };

    expect(findLabel).toThrowErrorMatchingSnapshot();

    const formProps = testRenderer.root.findByType(FormControlLabel).props;

    expect(formProps).toHaveProperty("label");
    expect(formProps.label).toBeUndefined();
    expect.assertions(3);
  });

  it("creates a label when there is text", (): void => {
    const testRenderer = checkboxRenderer({ label: "stuff" });

    const label = testRenderer.root.findByType(LabelComponent);
    expect(label.props.text).toBe("stuff");
  });

  it("styling is applied", (): void => {
    const wrapper = mount(
      <CheckboxComponent {...({} as any)} readonly={true} />
    );

    const findComponent = (): any => wrapper.find(MaterialCheckbox);
    expect(findComponent().props().checked).toBe(false);

    expect(findComponent().props().classes).toEqual({
      root: "makeStyles-root-1",
      checked: "makeStyles-checked-2"
    });
  });

  describe("user input changes properties", (): void => {
    it("clicking on checkbox toggles it", (): void => {
      const wrapper = mount(
        <CheckboxComponent {...({ label: "stuff" } as any)} readonly={true} />
      );

      const findComponent = (): any => wrapper.find(MaterialCheckbox);
      expect(findComponent().props().checked).toBe(false);

      // Method 1
      // act(() => {
      // findComponent()
      // .props()
      // .onChange();
      // });
      // Method 2
      // findComponent().simulate("change");
      // Method 3
      findComponent().simulate("change", {
        target: { name: "checked", value: true }
      });

      expect(findComponent().props().checked).toBe(true);
    });
  });
});
