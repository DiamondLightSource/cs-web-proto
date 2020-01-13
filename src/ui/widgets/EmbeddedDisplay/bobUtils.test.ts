import { bobToWidgets } from "./bobUtils";

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
      position: "absolute",
      x: "0px",
      y: "0px",
      width: "200px",
      height: "350px",
      children: [
        {
          type: "testwidget",
          name: "Test Widget",
          pvName: "ca://TESTPV", // eslint-disable-line @typescript-eslint/camelcase
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
