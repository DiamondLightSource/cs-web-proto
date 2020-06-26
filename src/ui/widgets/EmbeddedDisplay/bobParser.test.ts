import { Color } from "../../../types/color";
import { Label } from "..";
import { AbsolutePosition } from "../../../types/position";
import { parseBob } from "./bobParser";
import { PV } from "../../../types/pv";

describe("opi widget parser", (): void => {
  const labelString = `
  <display version="2.0.0">
  <name>Display</name>
  <macros>
    <a>b</a>
  </macros>
  <x>0</x>
  <y>0</y>
  <width>300</width>
  <height>300</height>
  <widget type="label" version="2.0.0">
    <name>Label</name>
    <class>TITLE</class>
    <text>Hello</text>
    <width>550</width>
    <height>31</height>
    <visible>true</visible>
    <foreground_color>
      <color name="STOP" red="255" green="0" blue="0">
      </color>
    </foreground_color>
    <font>
      <font name="Header 1" family="Liberation Sans" style="BOLD" size="22.0">
      </font>
    </font>
    <x>10</x>
    <y>20</y>
    <not_a_property>hello</not_a_property>
  </widget>
  </display>`;

  /* We need to import widgets to register them... */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const label = Label;

  it("parses a label widget", (): void => {
    const widget = parseBob(labelString, "ca").children[0];
    expect(widget.type).toEqual("label");
    // Boolean type
    expect(widget.visible).toEqual(true);
    // String type
    expect(widget.text).toEqual("Hello");
    // Position type
    expect(widget.position).toEqual(
      new AbsolutePosition("10px", "20px", "550px", "31px")
    );
    // Color type
    expect(widget.foregroundColor).toEqual(Color.RED);
    // Unrecognised property not passed on.
    expect(widget.not_a_property).toEqual(undefined);
  });

  const readbackString = `
  <display version="2.0.0">
    <x>0</x>
    <y>0</y>
    <width>300</width>
    <height>300</height>
    <widget type="textupdate" version="2.0.0">
      <name>Text Update</name>
      <pv_name>abc</pv_name>
      <x>12</x>
      <y>62</y>
      <width>140</width>
      <height>50</height>
    </widget>
  </display>`;
  it("parses a readback widget", (): void => {
    const widget = parseBob(readbackString, "xxx").children[0];
    expect(widget.pvName).toEqual(PV.parse("xxx://abc"));
  });

  const noXString = `
  <display version="2.0.0">
    <y>0</y>
    <width>300</width>
    <height>300</height>
  </display>`;
  it("handles a missing dimension", (): void => {
    const display = parseBob(noXString, "xxx");
    // Is this correct?
    expect(display.x).toEqual(undefined);
  });
});
