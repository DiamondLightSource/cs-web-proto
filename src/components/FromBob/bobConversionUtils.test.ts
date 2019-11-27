// Should this be require enzyme ?
import {} from "enzyme";
import convert from "xml-js";

import { bobMacrosToMacroMap, bobColorsToColor } from "./bobConversionUtils";

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
    expect(bobColorsToColor(convertedColor.color)).toEqual("rgb(0, 255, 0)");
  });
});
