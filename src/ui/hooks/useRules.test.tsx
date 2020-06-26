import React from "react";
import { useSelector } from "react-redux";
import { useRules } from "./useRules";
import { shallow } from "enzyme";
import { AnyProps } from "../widgets/widgetProps";
import { Rule } from "../../types/props";
import { PV } from "../../types/pv";
import { ddouble } from "../../setupTests";

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
// mocking before we have access to other imports (ddouble).
(useSelector as jest.Mock).mockImplementation((pvName: string): any => {
  return {
    "ca://PV1": [{ value: ddouble(0), connected: true, readonly: false }, "PV1"]
  };
});
const RuleTester = (props: { id: string; rules: Rule[] }): JSX.Element => {
  const ruleProps = useRules(props as AnyProps);
  return <div>{ruleProps.text}</div>;
};

const rule: Rule = {
  name: "rule",
  prop: "text",
  outExp: false,
  pvs: [{ pvName: new PV("PV1"), trigger: true }],
  expressions: [
    {
      boolExp: "pv0 > 1",
      value: "yes",
      convertedValue: "yes"
    },
    {
      boolExp: "true",
      value: "no",
      convertedValue: "no"
    }
  ]
};

const outExpRule: Rule = {
  name: "outexprule",
  prop: "text",
  outExp: true,
  pvs: [{ pvName: new PV("PV1"), trigger: true }],
  expressions: [
    {
      boolExp: "pv0 > 1",
      value: "pvStr0"
    },
    {
      boolExp: "true",
      value: '"no"'
    }
  ]
};

describe("useRules", (): void => {
  it("does't change prop with simple rule", (): void => {
    const props = { id: "id1", rules: [rule], text: "neither" };
    const hookTester = <RuleTester {...props}></RuleTester>;
    const hookTesterWrapper = shallow(hookTester);
    expect(hookTesterWrapper.find("div").text()).toEqual("no");
  });
  it("changes prop with simple rule", (): void => {
    // Awkward way of choosing return value for mocked function?
    (useSelector as jest.Mock).mockImplementation((pvName: string): any => {
      return {
        "ca://PV1": [
          { value: ddouble(2), connected: true, readonly: false },
          "PV"
        ]
      };
    });
    const props = { id: "id1", rules: [rule], text: "neither" };
    const hookTester = <RuleTester {...props}></RuleTester>;
    const hookTesterWrapper = shallow(hookTester);
    expect(hookTesterWrapper.find("div").text()).toEqual("yes");
  });

  it("uses output expression string", (): void => {
    // Awkward way of choosing return value for mocked function?
    (useSelector as jest.Mock).mockImplementation((pvName: string): any => {
      return {
        "ca://PV1": [
          { value: ddouble(0), connected: true, readonly: false },
          "PV"
        ]
      };
    });
    const props = { id: "id1", rules: [outExpRule], text: "neither" };
    const hookTester = <RuleTester {...props}></RuleTester>;
    const hookTesterWrapper = shallow(hookTester);
    expect(hookTesterWrapper.find("div").text()).toEqual("no");
  });
  it("uses output expression pvStr0", (): void => {
    // Awkward way of choosing return value for mocked function?
    (useSelector as jest.Mock).mockImplementation((pvName: string): any => {
      return {
        "ca://PV1": [
          { value: ddouble(2), connected: true, readonly: false },
          "PV"
        ]
      };
    });
    const props = { id: "id1", rules: [outExpRule], text: "neither" };
    const hookTester = <RuleTester {...props}></RuleTester>;
    const hookTesterWrapper = shallow(hookTester);
    expect(hookTesterWrapper.find("div").text()).toEqual("2");
  });
});
