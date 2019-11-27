// Should this be require enzyme ?
import {} from "enzyme";
import convert from "xml-js";

import {
  bobMacrosToMacroMap,
  bobColor,
  bobColorsToColor,
  UnknownPropsObject,
  bobBackgroundColor,
  bobForegroundColor,
  bobPrecisionToNumber,
  bobVisibleToBoolen,
  bobActionToAction,
  bobHandleActions
} from "./bobConversionUtils";
import { WRITE_PV } from "../../actions";

describe("simple macros convert", (): void => {
  const xmlInput = "<macros><Test>Value</Test></macros>";
  const convertedXML = convert.xml2js(xmlInput, {
    compact: true
  });
  test("it collects the macro", (): void => {
    let props = { macroMap: {} };
    bobMacrosToMacroMap(convertedXML, props);
    expect(props.macroMap).toEqual({ Test: "Value" });
  });
});

describe("color conversion", (): void => {
  const xmlColor = '<color name="On" red="0" green="255" blue="0"></color>';
  const convertedColor = convert.xml2js(xmlColor, {
    compact: true
  });
  test("it converts xml color to rgb string", (): void => {
    expect(
      bobColorsToColor((convertedColor as { color: bobColor }).color)
    ).toEqual("rgb(0, 255, 0)");
  });

  test("background color correctly extracted", (): void => {
    const input = {
      background_color: convertedColor
    };
    const output: UnknownPropsObject = {};
    bobBackgroundColor(input, output);
    expect(output.backgroundColor).toBe("rgb(0, 255, 0)");
  });
  test("foreground color correctly extracted", (): void => {
    const input = {
      foreground_color: convertedColor
    };
    const output: UnknownPropsObject = {};
    bobForegroundColor(input, output);
    expect(output.color).toBe("rgb(0, 255, 0)");
  });
});

describe("precision conversion", (): void => {
  const xmlPrecision = "<precision>5</precision>";
  const convertedPrecision: UnknownPropsObject = convert.xml2js(xmlPrecision, {
    compact: true
  });

  test("it correctly gets the precision and turns it into a number", (): void => {
    const output: UnknownPropsObject = {};
    bobPrecisionToNumber(convertedPrecision, output);
    expect(output.precision).toBe(5);
  });
});

describe("visible conversion", (): void => {
  const xmlVisible = "<visible>true</visible>";
  const compactVisible: UnknownPropsObject = convert.xml2js(xmlVisible, {
    compact: true
  });
  const xmlInvisible = "<visible>false</visible>";
  const compactInvisible: UnknownPropsObject = convert.xml2js(xmlInvisible, {
    compact: true
  });

  test("it correctly converts visibility when true", (): void => {
    const output: UnknownPropsObject = {};
    bobVisibleToBoolen(compactVisible, output);
    expect(output.visible).toBe(true);
  });
  test("it correctly converts visibility when false", (): void => {
    const output: UnknownPropsObject = {};
    bobVisibleToBoolen(compactInvisible, output);
    expect(output.visible).toBe(false);
  });
});

describe("actions conversion", (): void => {
  const xmlActions = `
  <actions>
  <action type="write_pv">
    <pv_name>testPV1</pv_name>
    <value>1</value>
    <description>Write pv1 to 1</description>
  </action>
  <action type="write_pv">
    <pv_name>testPV2</pv_name>
    <value>Testing</value>
    <description>Write pv2 to Testing</description>
  </action>
</actions>`;
  const compactActions: UnknownPropsObject = convert.xml2js(xmlActions, {
    compact: true
  });
  test("it correctly converts write PV actions", (): void => {
    expect(bobActionToAction(compactActions.actions.action)).toEqual({
      executeAsOne: false,
      actions: [
        {
          type: WRITE_PV,
          pvName: "testPV1",
          value: "1",
          description: "Write pv1 to 1"
        },
        {
          type: WRITE_PV,
          pvName: "testPV2",
          value: "Testing",
          description: "Write pv2 to Testing"
        }
      ]
    });
  });

  test("it correctly handles actions in props", (): void => {
    const output: UnknownPropsObject = {};
    bobHandleActions(compactActions, output);
    expect(output.actions).toEqual({
      executeAsOne: false,
      actions: [
        {
          type: WRITE_PV,
          pvName: "testPV1",
          value: "1",
          description: "Write pv1 to 1"
        },
        {
          type: WRITE_PV,
          pvName: "testPV2",
          value: "Testing",
          description: "Write pv2 to Testing"
        }
      ]
    });
  });
});
