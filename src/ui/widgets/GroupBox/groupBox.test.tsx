import React from "react";
import { GroupBoxComponent } from "./groupBox";
import { create } from "react-test-renderer";
import { Color } from "../../../types/color";
import { render } from "@testing-library/react";

describe("<GroupingContainerComponent />", (): void => {
  test("it matches the snapshot", (): void => {
    const snapshot = create(
      <GroupBoxComponent name={"Test"} backgroundColor={Color.WHITE} />
    );
    expect(snapshot.toJSON()).toMatchSnapshot();
  });

  test("it renders the title", (): void => {
    const grouping = <GroupBoxComponent name={"Test"} />;
    const { getByText } = render(grouping);
    expect(getByText("Test")).toBeInTheDocument();
  });

  test("it renders child div with text", (): void => {
    const childText = "Testing Child Component";
    const groupingWithChild = (
      <GroupBoxComponent name={"Test"}>
        <div>{childText}</div>
      </GroupBoxComponent>
    );
    const { getByText } = render(groupingWithChild);
    expect(getByText("Test")).toBeInTheDocument();
  });
});
