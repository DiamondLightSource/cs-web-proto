import { Label } from "..";
import { parseJson } from "./jsonParser";
import log from "loglevel";
import { RelativePosition } from "../../../types/position";
import { Font, FontStyle } from "../../../types/font";

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
    log.setLevel("debug");
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
});
