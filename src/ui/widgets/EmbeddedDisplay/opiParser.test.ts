import { xml2js, ElementCompact } from "xml-js";
import { Color } from "../../../types/color";
import { Border } from "../../../types/border";
import { Rule } from "../../../types/props";
import { Label } from "..";
import { parseWidget } from "./parser";

describe("opi widget parser", (): void => {
  const labelString = `
  <widget typeId="org.csstudio.opibuilder.widgets.Label" version="1.0.0">
    <actions hook="false" hook_all="false" />
    <auto_size>false</auto_size>
    <background_color>
      <color name="Canvas" red="200" green="200" blue="200" />
    </background_color>
    <border_color>
      <color name="Black" red="0" green="0" blue="0" />
    </border_color>
    <border_style>0</border_style>
    <border_width>0</border_width>
    <enabled>true</enabled>
    <font>
      <opifont.name fontName="Liberation Sans" height="15" style="0" pixels="true">Default</opifont.name>
    </font>
    <foreground_color>
      <color name="Text: FG" red="0" green="0" blue="0" />
    </foreground_color>
    <height>20</height>
    <horizontal_alignment>1</horizontal_alignment>
    <name>Label</name>
    <rules />
    <scale_options>
      <width_scalable>true</width_scalable>
      <height_scalable>true</height_scalable>
      <keep_wh_ratio>false</keep_wh_ratio>
    </scale_options>
    <scripts />
    <text>Hello</text>
    <tooltip></tooltip>
    <transparent>true</transparent>
    <vertical_alignment>1</vertical_alignment>
    <visible>true</visible>
    <widget_type>Label</widget_type>
    <width>120</width>
    <wrap_words>false</wrap_words>
    <wuid>7f37486f:17080909483:-5484</wuid>
    <x>370</x>
    <y>20</y>
  </widget>`;

  const element: ElementCompact = xml2js(labelString, { compact: true });
  /* We need to import widgets to register them... */
  const label = Label;

  it("parses a label widget", (): void => {
    const widget = parseWidget(element.widget);
    console.log(widget);
    expect(widget.type).toEqual("label");
    // Boolean type
    expect(widget.visible).toEqual(true);
    // String type
    expect(widget.text).toEqual("Hello");
    // Position type
    expect(widget.height).toEqual("20px");
    // Color type
    expect(widget.foregroundColor).toEqual(Color.BLACK);
    // Unrecognised property not passed on.
    expect(widget.wuid).toEqual(undefined);
    // No border
    expect(widget.border).toEqual(Border.NONE);
    // No actions
    expect(widget.actions.actions.length).toEqual(0);
    // One rule
    expect(widget.rules.length).toEqual(0);
  });

  const ruleString = `
  <widget typeId="org.csstudio.opibuilder.widgets.Label" version="1.0.0">
    <rules>
      <rule name="Rule" prop_id="text" out_exp="true">
        <exp bool_exp="pv0&gt;5">
          <value>pv0</value>
        </exp>
        <exp bool_exp="true">
          <value>"nope"</value>
        </exp>
        <pv trig="true">loc://test</pv>
      </rule>
    </rules>
  </widget>`;

  const ruleElement: ElementCompact = xml2js(ruleString, { compact: true });
  it("parses a widget with a rule", (): void => {
    const widget = parseWidget(ruleElement.widget);
    expect(widget.rules.length).toEqual(1);
    const rule: Rule = widget.rules[0];
    expect(rule.name).toEqual("Rule");
    expect(rule.prop).toEqual("text");
    expect(rule.outExp).toEqual(true);
    expect(rule.pvs[0].pvName).toEqual("loc://test");
    expect(rule.pvs[0].trigger).toEqual(true);
    expect(rule.expressions[0].value).toEqual({ _text: "pv0" });
    expect(rule.expressions[0].convertedValue).toEqual("pv0");
  });
  const childString = `
  <widget typeId="org.csstudio.opibuilder.widgets.Label" version="1.0.0">
    <text>hello</text>
    <widget typeId="org.csstudio.opibuilder.widgets.Label" version="1.0.0">
      <text>bye</text>
    </widget>
  </widget>`;

  const childElement: ElementCompact = xml2js(childString, { compact: true });
  it("parses a widget with a child widget", (): void => {
    const widget = parseWidget(childElement.widget);
    expect(widget.children?.length).toEqual(1);
  });

  const actionString = `
  <widget typeId="org.csstudio.opibuilder.widgets.ActionButton" version="2.0.0">
    <actions hook="false" hook_all="false">
      <action type="OPEN_WEBPAGE">
        <hyperlink>https://confluence.diamond.ac.uk/x/ZVhRBQ</hyperlink>
        <description>Launch Help</description>
      </action>
    </actions>
  </widget>`;

  const actionElement: ElementCompact = xml2js(actionString, { compact: true });
  it("parses a widget with an action", (): void => {
    const widget = parseWidget(actionElement.widget);
    console.log(widget);
    expect(widget.actions.actions.length).toEqual(1);
    const action = widget.actions.actions[0];
    expect(action.type).toEqual("OPEN_WEBPAGE");
    expect(action.openWebpageInfo.url).toEqual(
      "https://confluence.diamond.ac.uk/x/ZVhRBQ"
    );
    expect(action.openWebpageInfo.description).toEqual("Launch Help");
  });
  const inputString = `
  <widget typeId="org.csstudio.opibuilder.widgets.TextInput" version="2.0.0">
    <confirm_message></confirm_message>
    <horizontal_alignment>2</horizontal_alignment>
    <limits_from_pv>false</limits_from_pv>
    <maximum>1.7976931348623157E308</maximum>
    <minimum>-1.7976931348623157E308</minimum>
    <multiline_input>false</multiline_input>
    <name>EDM TextInput</name>
    <precision>0</precision>
    <precision_from_pv>true</precision_from_pv>
    <pv_name>SR-CS-RFFB-01:RFSTEP</pv_name>
    <pv_value />
    <scale_options>
      <width_scalable>true</width_scalable>
      <height_scalable>true</height_scalable>
      <keep_wh_ratio>false</keep_wh_ratio>
    </scale_options>
    <selector_type>0</selector_type>
    <show_units>false</show_units>
    <style>0</style>
    <text></text>
    <tooltip>$(pv_name)
$(pv_value)</tooltip>
    <transparent>true</transparent>
    <visible>true</visible>
    <widget_type>Text Input</widget_type>
    <width>114</width>
    <wuid>-7ec79ac:158f319c58c:-7c7e</wuid>
    <x>197</x>
    <y>228</y>
  </widget>`;

  const inputElement: ElementCompact = xml2js(inputString, { compact: true });
  it("parses an input widget", (): void => {
    const widget = parseWidget(inputElement.widget);
    expect(widget.textAlign).toEqual("right");
    // Adds ca:// prefix.
    expect(widget.pvName).toEqual("ca://SR-CS-RFFB-01:RFSTEP");
  });
});
