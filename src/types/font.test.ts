import { Font, FontStyle } from "./font";

describe("Font", (): void => {
  it("returns the correct style for a simple font", (): void => {
    const font = new Font(10, FontStyle.Regular, "sans");
    const fontStyle = font.css();
    expect(fontStyle).toEqual({
      fontFamily: "sans,sans-serif",
      fontSize: "1rem",
      fontWeight: "normal",
      fontStyle: "normal"
    });
  });
  it("returns the correct style for a bold italic font", (): void => {
    const font = new Font(16, FontStyle.BoldItalic);
    const fontStyle = font.css();
    expect(fontStyle).toEqual({
      fontFamily: "Liberation sans,sans-serif",
      fontSize: "1.6rem",
      fontWeight: "bold",
      fontStyle: "italic"
    });
  });

  it("fontStyle is left out of CSSProperties when not input", (): void => {
    const font = new Font();
    expect(font).not.toHaveProperty("fontStyle");
  });
});
