import { Border, BorderStyle } from "./border";
import { Color } from "./color";

describe("Border", () => {
  it("creates the correct style", (): void => {
    const border = new Border(BorderStyle.Line, Color.RED, 1);
    expect(border.css()).toEqual({
      borderStyle: "solid",
      borderWidth: "1px",
      borderColor: "rgba(255, 0, 0, 255)"
    });
  });
});
