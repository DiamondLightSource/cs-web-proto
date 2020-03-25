/* eslint no-template-curly-in-string: 0 */
import { useMacros } from "./useMacros";
import { MacroMap, MacroContextType } from "../../types/macros";

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
    const resolvedProps = useMacros(props);
    expect(resolvedProps.prop.subprop).toEqual("Eb");
  });
  it("resolves macros in actions", (): void => {
    const props = { actions: actionsProp };
    const resolvedProps = useMacros(props);
    expect(resolvedProps.actions.actions[0].pvName).toEqual("E:SUFFIX");
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
