import { bobToWidgets } from "./bobUtils";
import { AbsolutePosition } from "../../../types/position";

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

    expect(bobToWidgets(xmlBob)).toEqual({
      type: "display",
      name: "Display",
      position: new AbsolutePosition("0px", "0px", "200px", "350px"),
      children: [
        {
          type: "testwidget",
          name: "Test Widget",
          pvName: "TESTPV",
          position: new AbsolutePosition("99px", "199px", "299px", "399px"),
          children: []
        }
      ]
    });
  });
});
