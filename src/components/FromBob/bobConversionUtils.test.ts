// Should this be require enzyme ?
import {} from "enzyme";
import convert from "xml-js";

import {
  bobMacrosToMacroMap,
  BobColor,
  bobColorsToColor,
  UnknownPropsObject,
  bobBackgroundColor,
  bobForegroundColor,
  bobPrecisionToNumber,
  bobVisibleToBoolen,
  bobActionToAction,
  bobHandleActions,
  bobChildToWidgetChild,
  convertBobToWidgetDescription
} from "./bobConversionUtils";
import { WRITE_PV } from "../../widgetActions";

describe("simple macros convert", (): void => {
  const xmlInput = "<macros><Test>Value</Test></macros>";
  const convertedXML = convert.xml2js(xmlInput, {
    compact: true
  });
  test("it collects the macro", (): void => {
    const props = { macroMap: {} };
    bobMacrosToMacroMap(convertedXML, props);
    expect(props.macroMap).toEqual({ Test: "Value" });
  });

  test("it ignores when there are not macros", (): void => {
    const props = {};
    bobMacrosToMacroMap({}, props);
    expect(props).toEqual({});
  });
});

describe("color conversion", (): void => {
  const xmlColor = '<color name="On" red="0" green="255" blue="0"></color>';
  const convertedColor = convert.xml2js(xmlColor, {
    compact: true
  });
  test("it converts xml color to rgb string", (): void => {
    expect(
      bobColorsToColor((convertedColor as { color: BobColor }).color)
    ).toEqual("rgb(0, 255, 0)");
  });

  test("background color correctly extracted", (): void => {
    const input = {
      background_color: convertedColor // eslint-disable-line @typescript-eslint/camelcase
    };
    const output: UnknownPropsObject = {};
    bobBackgroundColor(input, output);
    expect(output.backgroundColor).toBe("rgb(0, 255, 0)");
  });
  test("foreground color correctly extracted", (): void => {
    const input = {
      foreground_color: convertedColor // eslint-disable-line @typescript-eslint/camelcase
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

describe("bob child conversion", (): void => {
  test("it converts a simple widget", (): void => {
    const xmlWidget = `
    <widget type="testwidget" version="2.0.0">
      <name>Test Widget</name>
      <pv_name>TESTPV</pv_name>
      <x>99</x>
      <y>199</y>
      <width>299</width>
      <height>399</height>
    </widget>`;
    const compactWidget: UnknownPropsObject = convert.xml2js(xmlWidget, {
      compact: true
    });

    expect(bobChildToWidgetChild(compactWidget.widget)).toEqual({
      type: "testwidget",
      name: "Test Widget",
      pv_name: "TESTPV", // eslint-disable-line @typescript-eslint/camelcase
      position: "absolute",
      x: "99px",
      y: "199px",
      width: "299px",
      height: "399px",
      children: []
    });
  });

  test("it converts a simple widget with key subsitutions", (): void => {
    const xmlWidget = `
    <widget type="testwidget" version="2.0.0">
      <name>Test Widget</name>
      <pv_name>TESTPV</pv_name>
      <x>99</x>
      <y>199</y>
      <width>299</width>
      <height>399</height>
    </widget>`;
    const compactWidget: UnknownPropsObject = convert.xml2js(xmlWidget, {
      compact: true
    });

    expect(
      bobChildToWidgetChild(compactWidget.widget, {}, { pv_name: "pvName" }) // eslint-disable-line @typescript-eslint/camelcase
    ).toEqual({
      type: "testwidget",
      name: "Test Widget",
      pvName: "TESTPV",
      position: "absolute",
      x: "99px",
      y: "199px",
      width: "299px",
      height: "399px",
      children: []
    });
  });

  test("it converts a simple widget with function subsitutions", (): void => {
    const xmlWidget = `
    <widget type="testwidget" version="2.0.0">
      <name>Test Widget</name>
      <pv_name>TESTPV</pv_name>
      <x>99</x>
      <y>199</y>
      <width>299</width>
      <foreground_color>
        <color name="On" red="0" green="255" blue="0">
        </color>
      </foreground_color>
      <background_color>
        <color name="Grid" red="128" green="128" blue="128">
        </color>
      </background_color>
      <height>399</height>
    </widget>`;
    const compactWidget: UnknownPropsObject = convert.xml2js(xmlWidget, {
      compact: true
    });

    expect(
      bobChildToWidgetChild(
        compactWidget.widget,
        {
          background_color: bobBackgroundColor, // eslint-disable-line @typescript-eslint/camelcase
          foreground_color: bobForegroundColor // eslint-disable-line @typescript-eslint/camelcase
        },
        { pv_name: "pvName" } // eslint-disable-line @typescript-eslint/camelcase
      )
    ).toEqual({
      type: "testwidget",
      name: "Test Widget",
      pvName: "TESTPV",
      position: "absolute",
      x: "99px",
      y: "199px",
      width: "299px",
      height: "399px",
      color: "rgb(0, 255, 0)",
      backgroundColor: "rgb(128, 128, 128)",
      children: []
    });
  });

  test("it converts a widget with a child", (): void => {
    const xmlWidget = `
    <widget type="parent" version="2.0.0">
        <name>Parent Widget</name>
        <x>100</x>
        <y>200</y>
        <width>300</width>
        <height>400</height>
        <widget type="testwidget" version="2.0.0">
            <name>Test Widget</name>
            <pv_name>TESTPV</pv_name>
            <x>99</x>
            <y>199</y>
            <width>299</width>
            <height>399</height>
        </widget>
    </widget>`;
    const compactWidget: UnknownPropsObject = convert.xml2js(xmlWidget, {
      compact: true
    });

    expect(bobChildToWidgetChild(compactWidget.widget)).toEqual({
      type: "parent",
      name: "Parent Widget",
      position: "absolute",
      x: "100px",
      y: "200px",
      width: "300px",
      height: "400px",
      children: [
        {
          type: "testwidget",
          name: "Test Widget",
          pv_name: "TESTPV", // eslint-disable-line @typescript-eslint/camelcase
          position: "absolute",
          x: "99px",
          y: "199px",
          width: "299px",
          height: "399px",
          children: []
        }
      ]
    });
  });

  test("it converts a widget with multiple children", (): void => {
    const xmlWidget = `
    <widget type="parent" version="2.0.0">
        <name>Parent Widget</name>
        <x>100</x>
        <y>200</y>
        <width>300</width>
        <height>400</height>
        <widget type="testwidget" version="2.0.0">
            <name>Test Widget</name>
            <pv_name>TESTPV</pv_name>
            <x>99</x>
            <y>199</y>
            <width>299</width>
            <height>399</height>
        </widget>
        <widget type="testwidget" version="2.0.0">
            <name>Test Widget</name>
            <pv_name>TESTPV</pv_name>
            <x>999</x>
            <y>899</y>
            <width>799</width>
            <height>699</height>
        </widget>
    </widget>`;
    const compactWidget: UnknownPropsObject = convert.xml2js(xmlWidget, {
      compact: true
    });

    expect(bobChildToWidgetChild(compactWidget.widget)).toEqual({
      type: "parent",
      name: "Parent Widget",
      position: "absolute",
      x: "100px",
      y: "200px",
      width: "300px",
      height: "400px",
      children: [
        {
          type: "testwidget",
          name: "Test Widget",
          pv_name: "TESTPV", // eslint-disable-line @typescript-eslint/camelcase
          position: "absolute",
          x: "99px",
          y: "199px",
          width: "299px",
          height: "399px",
          children: []
        },
        {
          type: "testwidget",
          name: "Test Widget",
          pv_name: "TESTPV", // eslint-disable-line @typescript-eslint/camelcase
          position: "absolute",
          x: "999px",
          y: "899px",
          width: "799px",
          height: "699px",
          children: []
        }
      ]
    });
  });
});

describe("bob conversion", (): void => {
  test("it converts a simple bob file", (): void => {
    const xmlBob = `
    <?xml version="1.0" encoding="UTF-8"?>
    <display version="2.0.0">
        <name>Display</name>
        <width>200</width>
        <height>350</height>
        <widget type="testwidget" version="2.0.0">
            <name>Test Widget</name>
            <pv_name>TESTPV</pv_name>
            <x>99</x>
            <y>199</y>
            <width>299</width>
            <height>399</height>
        </widget>
    </display>
    `;

    expect(convertBobToWidgetDescription(xmlBob)).toEqual({
      type: "display",
      name: "Display",
      position: "absolute",
      x: "0px",
      y: "0px",
      width: "200px",
      height: "350px",
      children: [
        {
          type: "testwidget",
          name: "Test Widget",
          pv_name: "TESTPV", // eslint-disable-line @typescript-eslint/camelcase
          position: "absolute",
          x: "99px",
          y: "199px",
          width: "299px",
          height: "399px",
          children: []
        }
      ]
    });
  });
});
