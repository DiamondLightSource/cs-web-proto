import { Label } from "..";
import { parseJson } from "./jsonParser";
import { RelativePosition } from "../../../types/position";
import { Font, FontStyle } from "../../../types/font";
import { Border, BorderStyle } from "../../../types/border";
import { Color } from "../../../types/color";

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
    const widget = parseJson(displayString);
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
        "font": {
          "size": 13,
          "style": "bold"
        }
      }
    ]
  }`;
  it("handles font and position on a label widget", (): void => {
    const widget = parseJson(fontLabelString).children[0];
    expect(widget.font).toEqual(new Font(13, FontStyle.Bold));
    expect(widget.position).toEqual(new RelativePosition());
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
    const widget = parseJson(ruleString);
    const rule = {
      name: "border rule",
      prop: "border",
      outExp: false,
      pvs: [
        {
          pvName: "loc://rulepv",
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
          // Color parsing doesn't work in tests: see color.test.ts.
          convertedValue: new Border(BorderStyle.Line, Color.BLACK, 1)
        }
      ]
    };
    expect(widget.rules[0]).toEqual(rule);
  });
});
