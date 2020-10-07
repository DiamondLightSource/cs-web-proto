import { Color } from "../../../types/color";
import { Border } from "../../../types/border";
import { Rule } from "../../../types/props";
import { Label } from "..";
import { parseOpi } from "./opiParser";
import { AbsolutePosition, RelativePosition } from "../../../types/position";

describe("opi widget parser", (): void => {
  const displayString = `
  <display typeId="org.csstudio.opibuilder.Display" version="1.0.0">
    <x>10</x>
    <y>20</y>
    <width>30</width>
    <height>40</height>
  </display>`;
  it("parses a display widget", (): void => {
    const displayWidget = parseOpi(displayString, "ca");
    expect(displayWidget.position).toEqual(
      new RelativePosition("30px", "40px")
    );
  });
  const labelString = `
  <display typeId="org.csstudio.opibuilder.Display" version="1.0.0">
    <x>0</x>
    <y>0</y>
    <height>20</height>
    <width>20</width>
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
    </widget>
  </display>`;

  /* We need to import widgets to register them, but don't need
     the actual variable. */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const label = Label;
  it("parses a label widget", (): void => {
    const widget = parseOpi(labelString, "ca").children[0];
    expect(widget.type).toEqual("label");
    // Boolean type
    expect(widget.visible).toEqual(true);
    // String type
    expect(widget.text).toEqual("Hello");
    // Position type
    expect(widget.position).toEqual(
      new AbsolutePosition("370px", "20px", "120px", "20px")
    );
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
  <display typeId="org.csstudio.opibuilder.Display" version="1.0.0">
    <x>0</x>
    <y>0</y>
    <height>20</height>
    <width>20</width>
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
    </widget>
  </display>`;

  it("parses a widget with a rule", (): void => {
    const widget = parseOpi(ruleString, "ca").children[0];
    expect(widget.rules.length).toEqual(1);
    const rule: Rule = widget.rules[0];
    expect(rule.name).toEqual("Rule");
    expect(rule.prop).toEqual("text");
    expect(rule.outExp).toEqual(true);
    expect(rule.pvs[0].pvName.qualifiedName()).toEqual("loc://test");
    expect(rule.pvs[0].trigger).toEqual(true);
    expect(rule.expressions[0].value).toEqual({ _text: "pv0" });
    expect(rule.expressions[0].convertedValue).toEqual("pv0");
  });
  const childString = `
  <display typeId="org.csstudio.opibuilder.Display" version="1.0.0">
    <x>0</x>
    <y>0</y>
    <height>20</height>
    <width>20</width>
    <widget typeId="org.csstudio.opibuilder.widgets.Label" version="1.0.0">
      <text>hello</text>
      <widget typeId="org.csstudio.opibuilder.widgets.Label" version="1.0.0">
        <text>bye</text>
      </widget>
    </widget>
  </display>`;

  it("parses a widget with a child widget", (): void => {
    const widget = parseOpi(childString, "ca").children[0];
    expect(widget.children?.length).toEqual(1);
  });

  const actionString = `
  <display typeId="org.csstudio.opibuilder.Display" version="1.0.0">
    <x>0</x>
    <y>0</y>
    <height>20</height>
    <width>20</width>
    <widget typeId="org.csstudio.opibuilder.widgets.ActionButton" version="2.0.0">
      <actions hook="false" hook_all="false">
        <action type="OPEN_WEBPAGE">
          <hyperlink>https://confluence.diamond.ac.uk/x/ZVhRBQ</hyperlink>
          <description>Launch Help</description>
        </action>
      </actions>
    </widget>
  </display>`;

  it("parses a widget with an action", (): void => {
    const widget = parseOpi(actionString, "ca").children[0];
    expect(widget.actions.actions.length).toEqual(1);
    const action = widget.actions.actions[0];
    expect(action.type).toEqual("OPEN_WEBPAGE");
    expect(action.openWebpageInfo.url).toEqual(
      "https://confluence.diamond.ac.uk/x/ZVhRBQ"
    );
    expect(action.openWebpageInfo.description).toEqual("Launch Help");
  });
  const inputString = `
  <display typeId="org.csstudio.opibuilder.Display" version="1.0.0">
    <x>0</x>
    <y>0</y>
    <height>20</height>
    <width>20</width>
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
    </widget>
  </display>`;

  it("parses an input widget", (): void => {
    const widget = parseOpi(inputString, "ca").children[0];
    expect(widget.textAlign).toEqual("right");
    // Adds ca:// prefix.
    expect(widget.pvName.qualifiedName()).toEqual("ca://SR-CS-RFFB-01:RFSTEP");
  });

  const invalidString = `
  <display typeId="org.csstudio.opibuilder.Display" version="1.0.0">
    <x>0</x>
    <y>0</y>
    <height>20</height>
    <width>20</width>
    <widget typeId="org.csstudio.opibuilder.widgets.TextInput" version="2.0.0">
      <text />
    </widget>
  </display>`;
  it("doesn't parse an invalid string", (): void => {
    const widget = parseOpi(invalidString, "ca").children[0];
    expect(widget.text).toBeUndefined();
  });
  const invalidBool = `
  <display typeId="org.csstudio.opibuilder.Display" version="1.0.0">
    <x>0</x>
    <y>0</y>
    <height>20</height>
    <width>20</width>
    <widget typeId="org.csstudio.opibuilder.widgets.TextInput" version="2.0.0">
      <text />
      <show_units>not-a-bool</show_units>
    </widget>
  </display>`;
  it("doesn't parse an invalid bool", (): void => {
    const widget = parseOpi(invalidBool, "ca").children[0];
    expect(widget.showUnits).toBeUndefined();
  });
});
