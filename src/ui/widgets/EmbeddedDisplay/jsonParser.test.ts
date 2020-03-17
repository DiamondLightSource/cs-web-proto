import { Label } from "..";
import { parseJson } from "./jsonParser";
import log from "loglevel";
import { RelativePosition } from "../../../types/position";

describe("json widget parser", (): void => {
  const displayString = `{
  "type": "display",
  "position": "relative",
  "overflow": "auto",
  "border": {
    "style": "line",
    "width": 3,
    "color": "red"
  }
}`;

  /* We need to import widgets to register them... */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const label = Label;

  it("parses a display widget", (): void => {
    log.setLevel("debug");
    const widget = parseJson(displayString);
    console.log(widget);
    expect(widget.type).toEqual("display");
    // Boolean type
    expect(widget.position).toEqual(new RelativePosition());
  });
});