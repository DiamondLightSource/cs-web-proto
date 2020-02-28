import { Font, FontStyle } from "./font";

describe("Font", (): void => {
  it("returns the correct style for a simple font", (): void => {
    const font = new Font(10, FontStyle.Regular, "sans");
    const fontStyle = font.asStyle();
    expect(fontStyle).toEqual({
      fontFamily: "sans",
      fontSize: "1rem",
      fontWeight: "normal",
      fontStyle: "normal"
    });
  });
  it("returns the correct style for a bold italic font", (): void => {
    const font = new Font(16, FontStyle.BoldItalic);
    const fontStyle = font.asStyle();
    expect(fontStyle).toEqual({
      fontFamily: "Liberation sans",
      fontSize: "1.6rem",
      fontWeight: "bold",
      fontStyle: "italic"
    });
  });
});
