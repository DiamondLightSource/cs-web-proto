import { Label } from "..";
import { parseJson } from "./jsonParser";
import { RelativePosition, AbsolutePosition } from "../../../types/position";
import { Font, FontStyle } from "../../../types/font";
import { Border, BorderStyle } from "../../../types/border";
import { Color } from "../../../types/color";
import { PV } from "../../../types/pv";
import { WidgetDescription } from "../createComponent";

const PREFIX = "prefix";

describe("json widget parser", (): void => {
  const displayString = `{
  "type": "display",
  "position": "relative",
  "overflow": "auto",
  "border": {
    "style": "line",
    "width": 3,
    "color": "red"
  },
  "font": {
    "size": "13",
    "style": "bold"
  }
}`;

  /* We need to import widgets to register them... */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const label = Label;

  it("parses a display widget", (): void => {
    const widget = parseJson(displayString, "ca", PREFIX);
    expect(widget.type).toEqual("display");
    // Position type
    expect(widget.position).toEqual(new RelativePosition());
    // Font type not present on Display widget.
    expect(widget.font).toBeUndefined();
  });

  const fontLabelString = `{
    "type": "display",
    "children": [
      {
        "type": "label",
        "position": "absolute",
        "x": "10",
        "y": "20",
        "width": "30",
        "height": "40",
        "font": {
          "size": 13,
          "style": "bold"
        }
      }
    ]
  }`;
  it("handles font and position on a label widget", (): void => {
    const widget = parseJson(fontLabelString, "ca", PREFIX)
      .children?.[0] as WidgetDescription;
    expect(widget.font).toEqual(new Font(13, FontStyle.Bold));
    expect(widget.position).toEqual(
      new AbsolutePosition("10", "20", "30", "40")
    );
  });
  const ruleString = `{
    "type": "display",
    "rules": [
      {
        "name": "border rule",
        "prop": "border",
        "outExp": false,
        "pvs": [
          {
            "pvName": "loc://rulepv",
            "trigger": true
          }
        ],
        "expressions": [
          {
            "boolExp": "pv0 > 0",
            "value": {
              "style": "line",
              "width": 1,
              "color": "red"
            }
          }
        ]
      }
    ]
  }`;
  it("handles a rule on a display widget", (): void => {
    const widget = parseJson(ruleString, "ca", PREFIX);
    const rule = {
      name: "border rule",
      prop: "border",
      outExp: false,
      pvs: [
        {
          pvName: PV.parse("loc://rulepv"),
          trigger: true
        }
      ],
      expressions: [
        {
          boolExp: "pv0 > 0",
          value: {
            style: "line",
            width: 1,
            color: "red"
          },
          convertedValue: new Border(BorderStyle.Line, new Color("red"), 1)
        }
      ]
    };
    expect(widget.rules[0]).toEqual(rule);
  });
});
