import { Font, FontStyle } from "./font";

describe("Font", (): void => {
  it("returns the correct style for a simple font", (): void => {
    const font = new Font(FontStyle.Regular, 10, "sans");
    const fontStyle = font.asStyle();
    expect(fontStyle).toEqual({
      fontFamily: "sans",
      fontSize: "1rem",
      fontWeight: "normal",
      fontStyle: "normal"
    });
  });
  it("returns the correct style for a bold italic font", (): void => {
    const font = new Font(FontStyle.BoldItalic, 16);
    const fontStyle = font.asStyle();
    expect(fontStyle).toEqual({
      fontFamily: "Liberation sans",
      fontSize: "1.6rem",
      fontWeight: "bold",
      fontStyle: "italic"
    });
  });
});
