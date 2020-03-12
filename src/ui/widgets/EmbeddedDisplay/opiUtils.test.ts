// Should this be require enzyme ?
import {} from "enzyme";
import { xml2js, ElementCompact } from "xml-js";

import {
  opiParseMacros,
  opiParseColor,
  opiParsePrecision,
  opiParseBoolean,
  opiParseActions,
  xmlChildToWidget,
  OPI_WIDGET_MAPPING,
  opiGetWidgetId,
  opiParseRules
} from "./opiUtils";
import { WRITE_PV } from "../widgetActions";
import { Color } from "../../../types/color";
import { AbsolutePosition } from "../../../types/position";

describe("simple macros convert", (): void => {
  const xmlInput = "<macros><Test>Value</Test></macros>";
  const convertedXML: ElementCompact = xml2js(xmlInput, {
    compact: true
  });
  test("it collects the macro", (): void => {
    const macros = opiParseMacros("macros", convertedXML["macros"]);
    expect(macros).toEqual({ Test: "Value" });
  });

  test("it ignores when there are not macros", (): void => {
    const macros = opiParseMacros("macros", {});
    expect(macros).toEqual({});
  });
});

describe("rules conversion", (): void => {
  const xmlRules = `
    <rules>
      <rule name="OnOffBackgroundRule" prop_id="background_color" out_exp="false">
        <exp bool_exp="pv0 == 1">
          <value>
            <color name="Black" red="0" green="0" blue="0" />
          </value>
        </exp>
        <exp bool_exp="true">
          <value>
            <color name="Red" red="255" green="0" blue="0" />
          </value>
        </exp>
        <pv trig="true">PV1</pv>
      </rule>
    </rules>
`;
  const compactRules: ElementCompact = xml2js(xmlRules, {
    compact: true
  });
  test("it correctly converts rules", (): void => {
    expect(opiParseRules("rules", compactRules.rules)).toEqual([
      {
        name: "OnOffBackgroundRule",
        prop: "backgroundColor",
        outExp: false,
        pvs: [
          {
            pvName: "PV1",
            trigger: true
          }
        ],
        expressions: [
          {
            boolExp: "pv0 == 1",
            value: {
              color: {
                _attributes: { red: "0", green: "0", blue: "0", name: "Black" }
              }
            },
            convertedValue: Color.BLACK
          },
          {
            boolExp: "true",
            value: {
              color: {
                _attributes: { red: "255", green: "0", blue: "0", name: "Red" }
              }
            },
            convertedValue: Color.RED
          }
        ]
      }
    ]);
  });
});

describe("color conversion", (): void => {
  const xmlColor = '<color name="On" red="0" green="128" blue="0"></color>';
  const convertedColor = xml2js(xmlColor, {
    compact: true
  });
  test("it converts xml color to rgb string", (): void => {
    expect(opiParseColor("color", convertedColor)).toEqual(Color.GREEN);
  });
});

describe("precision conversion", (): void => {
  const xmlPrecision = "<precision>5</precision>";
  const convertedPrecision: ElementCompact = xml2js(xmlPrecision, {
    compact: true
  });

  test("it correctly gets the precision and turns it into a number", (): void => {
    const output = opiParsePrecision("precision", convertedPrecision.precision);
    expect(output).toBe(5);
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
  const compactActions: ElementCompact = xml2js(xmlActions, {
    compact: true
  });
  test("it correctly converts write PV actions", (): void => {
    expect(opiParseActions("actions", compactActions.actions)).toEqual({
      executeAsOne: false,
      actions: [
        {
          type: WRITE_PV,
          writePvInfo: {
            pvName: "testPV1",
            value: "1",
            description: "Write pv1 to 1"
          }
        },
        {
          type: WRITE_PV,
          writePvInfo: {
            pvName: "testPV2",
            value: "Testing",
            description: "Write pv2 to Testing"
          }
        }
      ]
    });
  });
  test("it correctly converts actions which execute as one", (): void => {
    const xmlActions = `
    <actions execute_as_one="true">
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
    const compactActions: ElementCompact = xml2js(xmlActions, {
      compact: true
    });
    expect(opiParseActions("actions", compactActions.actions)).toEqual({
      executeAsOne: true,
      actions: [
        {
          type: WRITE_PV,
          writePvInfo: {
            pvName: "testPV1",
            value: "1",
            description: "Write pv1 to 1"
          }
        },
        {
          type: WRITE_PV,
          writePvInfo: {
            pvName: "testPV2",
            value: "Testing",
            description: "Write pv2 to Testing"
          }
        }
      ]
    });
  });
});

describe("opi child conversion", (): void => {
  test("it converts a simple widget", (): void => {
    const xmlWidget = `
    <widget typeId="testwidget" version="2.0.0">
      <name>Test Widget</name>
      <pv_name>TESTPV</pv_name>
      <x>99</x>
      <y>199</y>
      <width>299</width>
      <height>399</height>
    </widget>`;
    const compactWidget: ElementCompact = xml2js(xmlWidget, {
      compact: true
    });

    expect(
      xmlChildToWidget(compactWidget.widget, opiGetWidgetId, OPI_WIDGET_MAPPING)
    ).toEqual({
      type: "testwidget",
      name: "Test Widget",
      pv_name: "TESTPV", // eslint-disable-line @typescript-eslint/camelcase
      position: new AbsolutePosition("99px", "199px", "299px", "399px"),
      children: []
    });
  });

  test("it converts a simple widget with key subsitutions", (): void => {
    const xmlWidget = `
    <widget typeId="testwidget" version="2.0.0">
      <name>Test Widget</name>
      <pv_name>TESTPV</pv_name>
      <x>99</x>
      <y>199</y>
      <width>299</width>
      <height>399</height>
    </widget>`;
    const compactWidget: ElementCompact = xml2js(xmlWidget, {
      compact: true
    });

    expect(
      xmlChildToWidget(
        compactWidget.widget,
        opiGetWidgetId,
        OPI_WIDGET_MAPPING,
        {},
        { pv_name: "pvName" } // eslint-disable-line @typescript-eslint/camelcase
      )
    ).toEqual({
      type: "testwidget",
      name: "Test Widget",
      pvName: "TESTPV",
      position: new AbsolutePosition("99px", "199px", "299px", "399px"),
      children: []
    });
  });

  const trueWidget = `
    <widget typeId="testwidget" version="2.0.0">
      <name>Test Widget</name>
      <true_or_false>true</true_or_false>
    </widget>`;
  const falseWidget = `
    <widget typeId="testwidget" version="2.0.0">
      <name>Test Widget</name>
      <true_or_false>false</true_or_false>
    </widget>`;

  test.each<[boolean, string]>([
    [true, trueWidget],
    [false, falseWidget]
  ])(
    "it converts a simple widget with %s boolean prop",
    (expected, widgetXml): void => {
      const compactWidget: ElementCompact = xml2js(widgetXml, {
        compact: true
      });

      expect(
        xmlChildToWidget(
          compactWidget.widget,
          opiGetWidgetId,
          OPI_WIDGET_MAPPING,
          { true_or_false: opiParseBoolean }, // eslint-disable-line @typescript-eslint/camelcase
          {}
        )
      ).toEqual({
        type: "testwidget",
        name: "Test Widget",
        position: new AbsolutePosition("0px", "0px", "0px", "0px"),
        true_or_false: expected, // eslint-disable-line @typescript-eslint/camelcase
        children: []
      });
    }
  );
  test("it throws error if boolean invalid", (): void => {
    const invalidBoolWidget = `
    <widget typeId="testwidget" version="2.0.0">
      <name>Test Widget</name>
      <true_or_false>not-a-bool</true_or_false>
    </widget>`;
    const compactWidget: ElementCompact = xml2js(invalidBoolWidget, {
      compact: true
    });
    expect((): void => {
      xmlChildToWidget(
        compactWidget.widget,
        opiGetWidgetId,
        OPI_WIDGET_MAPPING,
        {
          true_or_false: opiParseBoolean // eslint-disable-line @typescript-eslint/camelcase
        },
        {}
      );
    }).toThrow();
  });
  test("it converts a simple widget with function subsitutions", (): void => {
    const xmlWidget = `
    <widget typeId="testwidget" version="2.0.0">
      <name>Test Widget</name>
      <pv_name>TESTPV</pv_name>
      <x>99</x>
      <y>199</y>
      <width>299</width>
      <foreground_color>
        <color name="On" red="0" green="128" blue="0">
        </color>
      </foreground_color>
      <background_color>
        <color name="Grid" red="128" green="128" blue="128">
        </color>
      </background_color>
      <height>399</height>
    </widget>`;
    const compactWidget: ElementCompact = xml2js(xmlWidget, {
      compact: true
    });

    expect(
      xmlChildToWidget(
        compactWidget.widget,
        opiGetWidgetId,
        OPI_WIDGET_MAPPING,
        {
          background_color: opiParseColor, // eslint-disable-line @typescript-eslint/camelcase
          foreground_color: opiParseColor // eslint-disable-line @typescript-eslint/camelcase
        },
        {
          pv_name: "pvName", // eslint-disable-line @typescript-eslint/camelcase
          background_color: "backgroundColor", // eslint-disable-line @typescript-eslint/camelcase
          foreground_color: "color" // eslint-disable-line @typescript-eslint/camelcase
        }
      )
    ).toEqual({
      type: "testwidget",
      name: "Test Widget",
      pvName: "TESTPV",
      position: new AbsolutePosition("99px", "199px", "299px", "399px"),
      color: Color.GREEN,
      backgroundColor: new Color(128, 128, 128),
      children: []
    });
  });

  test("it converts a widget with a child", (): void => {
    const xmlWidget = `
    <widget typeId="parent" version="2.0.0">
        <name>Parent Widget</name>
        <x>100</x>
        <y>200</y>
        <width>300</width>
        <height>400</height>
        <widget typeId="testwidget" version="2.0.0">
            <name>Test Widget</name>
            <pv_name>TESTPV</pv_name>
            <x>99</x>
            <y>199</y>
            <width>299</width>
            <height>399</height>
        </widget>
    </widget>`;
    const compactWidget: ElementCompact = xml2js(xmlWidget, {
      compact: true
    });

    expect(
      xmlChildToWidget(compactWidget.widget, opiGetWidgetId, OPI_WIDGET_MAPPING)
    ).toEqual({
      type: "parent",
      name: "Parent Widget",
      position: new AbsolutePosition("100px", "200px", "300px", "400px"),
      children: [
        {
          type: "testwidget",
          name: "Test Widget",
          pv_name: "TESTPV", // eslint-disable-line @typescript-eslint/camelcase
          position: new AbsolutePosition("99px", "199px", "299px", "399px"),
          children: []
        }
      ]
    });
  });

  test("it converts a widget with multiple children", (): void => {
    const xmlWidget = `
    <widget typeId="parent" version="2.0.0">
        <name>Parent Widget</name>
        <x>100</x>
        <y>200</y>
        <width>300</width>
        <height>400</height>
        <widget typeId="testwidget" version="2.0.0">
            <name>Test Widget</name>
            <pv_name>TESTPV</pv_name>
            <x>99</x>
            <y>199</y>
            <width>299</width>
            <height>399</height>
        </widget>
        <widget typeId="testwidget" version="2.0.0">
            <name>Test Widget</name>
            <pv_name>TESTPV</pv_name>
            <x>999</x>
            <y>899</y>
            <width>799</width>
            <height>699</height>
        </widget>
    </widget>`;
    const compactWidget: ElementCompact = xml2js(xmlWidget, {
      compact: true
    });

    expect(
      xmlChildToWidget(compactWidget.widget, opiGetWidgetId, OPI_WIDGET_MAPPING)
    ).toEqual({
      type: "parent",
      name: "Parent Widget",
      position: new AbsolutePosition("100px", "200px", "300px", "400px"),
      children: [
        {
          type: "testwidget",
          name: "Test Widget",
          pv_name: "TESTPV", // eslint-disable-line @typescript-eslint/camelcase
          position: new AbsolutePosition("99px", "199px", "299px", "399px"),
          children: []
        },
        {
          type: "testwidget",
          name: "Test Widget",
          pv_name: "TESTPV", // eslint-disable-line @typescript-eslint/camelcase
          position: new AbsolutePosition("999px", "899px", "799px", "699px"),
          children: []
        }
      ]
    });
  });
});
