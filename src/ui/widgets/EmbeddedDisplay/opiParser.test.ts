import { parseOpiWidget } from "./opiParser";
import { xml2js } from "xml-js";
import { Color } from "../../../types/color";
import { Label } from "..";
import { Border } from "../../../types/border";
import { Rule } from "../../../types/props";

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
    <scale_options>
      <width_scalable>true</width_scalable>
      <height_scalable>true</height_scalable>
      <keep_wh_ratio>false</keep_wh_ratio>
    </scale_options>
    <scripts />
    <text>Label</text>
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

  const element = xml2js(labelString, { compact: true });

  it("parses a label widget", (): void => {
    const widget = parseOpiWidget(element);
    console.log(widget);
    expect(widget.type).toEqual(Label);
    // Boolean type
    expect(widget.visible).toEqual(true);
    // Number type
    expect(widget.height).toEqual(20);
    // Color type
    expect(widget.foregroundColor).toEqual(Color.BLACK);
    // Unrecognised property not passed on.
    expect(widget.wuid).toEqual(undefined);
    // No border
    expect(widget.border).toEqual(Border.NONE);
    // No actions
    expect(widget.actions.actions.length).toEqual(0);
    // One rule
    expect(widget.rules.length).toEqual(1);
    const rule: Rule = widget.rules[0];
    expect(rule.name).toEqual("Rule");
    expect(rule.prop).toEqual("text");
    expect(rule.outExp).toEqual(true);
    expect(rule.pvs[0].pvName).toEqual("loc://test");
    expect(rule.pvs[0].trigger).toEqual(true);
  });
});
