/* eslint no-template-curly-in-string: 0 */
import React from "react";
import { useMacros } from "./useMacros";
import { PV } from "../../types/pv";
import { contextRender } from "../../testResources";

/* Use one of the techniques described here for testing hooks without
  excessive mocking.
  https://kentcdodds.com/blog/how-to-test-custom-react-hooks
*/
export function substituteMacros(props: Record<string, unknown>): any {
  let resolvedProps = {};
  function MacrosTester(): JSX.Element {
    resolvedProps = useMacros(props);
    return <div></div>;
  }
  contextRender(<MacrosTester />);
  return resolvedProps;
}

const actionsProp = {
  executeAsOne: false,
  actions: [
    {
      type: "WRITE_PV",
      writePvInfo: {
        pvName: "${c}:SUFFIX",
        value: 1
      }
    },
    {
      type: "WRITE_PV",
      writePvInfo: {
        pvName: "$(pv_name)",
        value: 1
      }
    }
  ]
};

describe("useMacros", (): void => {
  it("resolves display macros", (): void => {
    const props = { prop: "${a}b" };
    const resolvedProps = substituteMacros(props);
    expect(resolvedProps.prop).toEqual("Ab");
  });
  it("handles nested macros", (): void => {
    // ${e} is ${a}, which in turn is A.
    const props = { prop: "${e}b" };
    const resolvedProps = substituteMacros(props);

    expect(resolvedProps.prop).toEqual("Ab");
  });
  it("resolves global macros", (): void => {
    const props = { prop: "${d}b" };
    const resolvedProps = substituteMacros(props);
    expect(resolvedProps.prop).toEqual("Eb");
  });
  it("prioritises display macros over global macros", (): void => {
    const props = { prop: "${c}b" };
    const resolvedProps = substituteMacros(props);
    expect(resolvedProps.prop).toEqual("Cb");
  });
  it("does not modify props", (): void => {
    const props = { prop: "${a}b" };
    substituteMacros(props);
    expect(props.prop).toEqual("${a}b");
  });
  it("does not resolve missing macros in object", (): void => {
    const props = { prop: "${z}b" };
    const resolvedProps = substituteMacros(props);
    expect(resolvedProps.prop).toEqual("${z}b");
  });
  it("changes parentheses in missing macro to braces", (): void => {
    const props = { prop: "$(z)b" };
    const resolvedProps = substituteMacros(props);
    expect(resolvedProps.prop).toEqual("${z}b");
  });
  it("resolves macros in nested object", (): void => {
    const props = { prop: { subprop: "${b}b" } };
    // Use any type as prop.subprop is not actually a valid prop
    // and useMacros returns AnyProps.
    const resolvedProps: any = substituteMacros(props);
    expect(resolvedProps.prop.subprop).toEqual("Bb");
  });
  it("resolves macros in actions", (): void => {
    const props = { pvName: new PV("hello", "loc"), actions: actionsProp };
    const resolvedProps = substituteMacros(props);
    const action1: any = resolvedProps?.actions?.actions[0];
    expect(action1.writePvInfo.pvName).toEqual("C:SUFFIX");
    const action2: any = resolvedProps?.actions?.actions[1];
    // Note loc:// prefix is missed here.
    expect(action2.writePvInfo.pvName).toEqual("hello");
  });
  it("resolves macros in PV object", (): void => {
    const props = { pvName: new PV("PREFIX:${c}", "xxx") };
    const resolvedProps = substituteMacros(props);
    expect(resolvedProps?.pvName?.qualifiedName()).toEqual("xxx://PREFIX:C");
  });
  it("returns empty array for empty array", (): void => {
    const props = { arrayProp: [] };
    const resolvedProps = substituteMacros(props);
    expect(resolvedProps.arrayProp).toEqual([]);
  });
  it("handles macros in arrays", (): void => {
    const props = { arrayProp: ["${c}b", "${z}b"] };
    const resolvedProps = substituteMacros(props);
    expect(resolvedProps.arrayProp).toEqual(["Cb", "${z}b"]);
  });
  it("handles macros in arrays of objects", (): void => {
    const props = {
      arrayProp: ["${z}b", { key: "${c}D" }]
    };
    const resolvedProps = substituteMacros(props);
    expect(resolvedProps.arrayProp).toEqual(["${z}b", { key: "CD" }]);
  });
});
