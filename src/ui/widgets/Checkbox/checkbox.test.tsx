import React from "react";
import { CheckboxComponent, CheckboxProps } from "./checkbox";
import renderer, { ReactTestRenderer } from "react-test-renderer";
import { render, fireEvent, screen } from "@testing-library/react";
import { InferWidgetProps } from "../propTypes";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Checkbox as MaterialCheckbox } from "@material-ui/core";
import { ensureWidgetsRegistered } from "..";
ensureWidgetsRegistered();

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
    const { asFragment } = render(
      <CheckboxComponent {...checkboxProps} readonly={true} connected={true} />
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it("doesn't create a label if there is no text", (): void => {
    const checkboxProps: CheckboxComponentProps = {};

    render(
      <CheckboxComponent {...checkboxProps} readonly={true} connected={true} />
    );

    expect((): void => {
      screen.getByRole("checkbox", {
        name: /Here is a label/i
      });
    }).toThrowErrorMatchingSnapshot();
  });

  it("creates a label when there is text", (): void => {
    const checkboxProps: CheckboxComponentProps = {
      label: "Here is a label",
      width: 15,
      height: 20
    };

    render(
      <CheckboxComponent {...checkboxProps} readonly={true} connected={true} />
    );

    expect(
      screen.getByRole("checkbox", {
        name: /Here is a label/i
      })
    ).toBeInTheDocument();
  });

  describe("user input changes properties", (): void => {
    it("clicking on checkbox toggles it", (): void => {
      const checkboxProps: CheckboxComponentProps = {
        label: "Here is a label",
        width: 15,
        height: 20
      };

      render(
        <CheckboxComponent
          {...checkboxProps}
          connected={true}
          readonly={true}
        />
      );

      const items: any = screen.getByRole("checkbox", {
        name: /Here is a label/i
      });

      expect(items.checked).toBe(false);
      fireEvent.click(items);
      expect(items.checked).toBe(true);
    });
  });
});
