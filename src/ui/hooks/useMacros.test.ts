/* eslint no-template-curly-in-string: 0 */
import { useMacros } from "./useMacros";
import { MacroMap, MacroContextType } from "../../types/macros";
import { PV } from "../../types/pv";

// Mock useSelector to return a 'global' macro map.
jest.mock("react-redux", (): object => {
  return {
    useSelector: (): MacroMap => ({
      A: "B",
      C: "D"
    })
  };
});
// Mock useContext to return a 'display' macro map.
jest.mock("react", (): object => {
  return {
    createContext: (): void => {},
    useContext: (): MacroContextType => ({
      updateMacro: (name, value): void => {},
      macros: { C: "E" }
    })
  };
});

const actionsProp = {
  executeAsOne: false,
  actions: [
    {
      type: "WRITE_PV",
      pvName: "${C}:SUFFIX"
    }
  ]
};

describe("useMacros", (): void => {
  it("resolves display macros", (): void => {
    const props = { prop: "${C}b" };
    const resolvedProps = useMacros(props);
    expect(resolvedProps.prop).toEqual("Eb");
  });
  it("does not modify props", (): void => {
    const props = { prop: "${C}b" };
    useMacros(props);
    expect(props.prop).toEqual("${C}b");
  });
  it("resolves global macros", (): void => {
    const props = { prop: "${A}b" };
    const resolvedProps = useMacros(props);
    expect(resolvedProps.prop).toEqual("Bb");
  });
  it("prioritises display macros over global macros", (): void => {
    const props = { prop: "${C}x" };
    const resolvedProps = useMacros(props);
    expect(resolvedProps.prop).toEqual("Ex");
  });
  it("does not resolve missing macros in object", (): void => {
    const props = { prop: "${z}b" };
    const resolvedProps = useMacros(props);
    expect(resolvedProps.prop).toEqual("${z}b");
  });
  it("resolves macros in nested object", (): void => {
    const props = { prop: { subprop: "${C}b" } };
    // Use any type as prop.subprop is not actually a valid prop
    // and useMacros returns AnyProps.
    const resolvedProps: any = useMacros(props);
    expect(resolvedProps.prop.subprop).toEqual("Eb");
  });
  it("resolves macros in actions", (): void => {
    const props = { actions: actionsProp };
    const resolvedProps = useMacros(props);
    const action: any = resolvedProps?.actions?.actions[0];
    expect(action.pvName).toEqual("E:SUFFIX");
  });
  it("resolves macros in PV object", (): void => {
    const props = { pvName: new PV("PREFIX:${C}", "xxx") };
    const resolvedProps = useMacros(props);
    expect(resolvedProps?.pvName?.qualifiedName()).toEqual("xxx://PREFIX:E");
  });
  it("returns empty array for empty array", (): void => {
    const props = { arrayProp: [] };
    const resolvedProps = useMacros(props);
    expect(resolvedProps.arrayProp).toEqual([]);
  });
  it("prioritises display macros", (): void => {
    const props = { arrayProp: [] };
    const resolvedProps = useMacros(props);
    expect(resolvedProps.arrayProp).toEqual([]);
  });
  it("handles macros in arrays", (): void => {
    const props = { arrayProp: ["${C}b", "${z}b"] };
    const resolvedProps = useMacros(props);
    expect(resolvedProps.arrayProp).toEqual(["Eb", "${z}b"]);
  });
  it("handles macros in arrays of objects", (): void => {
    const props = {
      arrayProp: ["${z}b", { key: "${C}c" }]
    };
    const resolvedProps = useMacros(props);
    expect(resolvedProps.arrayProp).toEqual(["${z}b", { key: "Ec" }]);
  });
});
