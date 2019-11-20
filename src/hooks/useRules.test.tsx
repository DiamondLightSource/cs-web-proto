import React from "react";
import { useSelector } from "react-redux";
import { Rule, useRules, RuleProps } from "./useRules";
import { shallow } from "enzyme";
import { vdouble } from "../vtypes/vtypes";

// Mock useSubscription.
jest.mock("./useSubscription", (): object => {
  return {
    useSubscription: jest.fn()
  };
});
// Mock useSelector.
jest.mock("react-redux", (): object => {
  return {
    useSelector: jest.fn()
  };
});
// This has to be done in a second step because Jest does the
// mocking before we have access to other imports (vdouble).
(useSelector as jest.Mock).mockImplementation((pvName: string): any => {
  return {
    PV1: [{ value: vdouble(2), connected: true, readonly: false }, "PV1"]
  };
});
const RuleTester = (props: RuleProps): JSX.Element => {
  const ruleProps = useRules(props);
  return <div>{ruleProps.text}</div>;
};

const rule: Rule = {
  condition: "pv1>1",
  trueState: "yes",
  falseState: "no",
  substitutionMap: {
    pv1: "PV1"
  },
  prop: "text"
};

describe("useRules", (): void => {
  it("does't change prop with simple rule", (): void => {
    const props = { id: "id1", rules: [rule], text: "neither" };
    const hookTester = <RuleTester {...props}></RuleTester>;
    const hookTesterWrapper = shallow(hookTester);
    expect(hookTesterWrapper.find("div").text()).toEqual("yes");
  });
  it("changes prop with simple rule", (): void => {
    // Awkward way of choosing return value for mocked function?
    (useSelector as jest.Mock).mockImplementation((pvName: string): any => {
      return {
        PV1: [{ value: vdouble(2), connected: true, readonly: false }, "PV"]
      };
    });
    const props = { id: "id1", rules: [rule], text: "neither" };
    const hookTester = <RuleTester {...props}></RuleTester>;
    const hookTesterWrapper = shallow(hookTester);
    expect(hookTesterWrapper.find("div").text()).toEqual("yes");
  });
});
