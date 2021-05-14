import React from "react";
import { useRules } from "./useRules";
import { AnyProps } from "../widgets/widgetProps";
import { Rule } from "../../types/props";
import { PV } from "../../types/pv";
import { contextRender, ddouble } from "../../testResources";
import { DType } from "../../types/dtypes";
import { CsState } from "../../redux/csState";

function getRuleTester(props: any): JSX.Element {
  const RuleTester = (props: { id: string; rules: Rule[] }): JSX.Element => {
    const ruleProps = useRules(props as AnyProps);
    return <div>{ruleProps.text}</div>;
  };
  return <RuleTester {...props} />;
}

function getCsState(value: DType): CsState {
  return {
    valueCache: {
      "ca://PV1": {
        value: value,
        connected: true,
        readonly: false,
        initializingPvName: "ca://PV1"
      }
    },
    subscriptions: { "ca://PV1": [] },
    globalMacros: {},
    effectivePvNameMap: {},
    deviceCache: {}
  };
}

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
  it("doesn't change prop with simple rule", (): void => {
    const props = { id: "id1", rules: [rule], text: "neither" };
    const ruleTester = getRuleTester(props);
    const csState = getCsState(ddouble(0));
    const { getByText } = contextRender(ruleTester, {}, {}, csState);
    expect(getByText("no")).toBeInTheDocument();
  });
  it("changes prop with simple rule", (): void => {
    const props = { id: "id1", rules: [rule], text: "neither" };
    const ruleTester = getRuleTester(props);
    const csState = getCsState(ddouble(2));
    const { getByText } = contextRender(ruleTester, {}, {}, csState);
    expect(getByText("yes")).toBeInTheDocument();
  });

  it("uses output expression string", (): void => {
    const props = { id: "id1", rules: [outExpRule], text: "neither" };
    const ruleTester = getRuleTester(props);
    const csState = getCsState(ddouble(2));
    const { getByText } = contextRender(ruleTester, {}, {}, csState);
    expect(getByText("2")).toBeInTheDocument();
  });
});
