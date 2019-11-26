/* eslint no-template-curly-in-string: 0 */
import { useMacros } from "./useMacros";
import { MacroMap } from "../redux/csState";

// Mock useSelector to return a 'global' macro map.
jest.mock("react-redux", (): object => {
  return {
    useSelector: (): MacroMap => ({
      A: "B"
    })
  };
});

const macroMap: MacroMap = {
  a: "b",
  c: "d"
};

const actionsProp = {
  executeAsOne: false,
  actions: [
    {
      type: "WRITE_PV",
      pvName: "${a}:SUFFIX"
    }
  ]
};

describe("useMacros", (): void => {
  it("resolves macros", (): void => {
    const props = { prop: "${a}b", macroMap: macroMap };
    const resolvedProps = useMacros(props);
    expect(resolvedProps.prop).toEqual("bb");
  });
  it("resolves global macros", (): void => {
    const props = { prop: "${A}b", macroMap: macroMap };
    const resolvedProps = useMacros(props);
    expect(resolvedProps.prop).toEqual("Bb");
  });
  it("prefers local to global macros", (): void => {
    const props = { prop: "${A}b", macroMap: { A: "C" } };
    const resolvedProps = useMacros(props);
    expect(resolvedProps.prop).toEqual("Cb");
  });
  it("does not resolve missing macros in object", (): void => {
    const props = { prop: "${z}b", macroMap: macroMap };
    const resolvedProps = useMacros(props);
    expect(resolvedProps.prop).toEqual("${z}b");
  });
  it("resolves macros in nested object", (): void => {
    const props = { prop: { subprop: "${a}b" }, macroMap: macroMap };
    const resolvedProps = useMacros(props);
    expect(resolvedProps.prop.subprop).toEqual("bb");
  });
  it("resolves macros in actions", (): void => {
    const props = { actions: actionsProp, macroMap: macroMap };
    const resolvedProps = useMacros(props);
    expect(resolvedProps.actions.actions[0].pvName).toEqual("b:SUFFIX");
  });
  it("returns empty array for empty array", (): void => {
    const props = { arrayProp: [], macroMap: macroMap };
    const resolvedProps = useMacros(props);
    expect(resolvedProps.arrayProp).toEqual([]);
  });
});
