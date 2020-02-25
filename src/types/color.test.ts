import { Color } from "./color";

describe("Color", (): void => {
  // This test fails because we can't create elements in testing.
  it.each<[string, Color]>([
    ["green", Color.BLACK],
    ["red", Color.BLACK]
  ])("fails to parse color names correctly", (name, expectedColor): void => {
    expect(Color.parse(name)).toEqual(expectedColor);
  });

  it.each<[string, Color]>([
    ["#000000", Color.BLACK],
    ["#ff0000", Color.RED]
  ])("parses hex color codes correctly", (name, expectedColor): void => {
    expect(Color.parse(name)).toEqual(expectedColor);
  });

  it.each<[Color, string]>([
    [Color.BLACK, "rgba(0, 0, 0, 255)"],
    [Color.BLUE, "rgba(0, 0, 255, 255)"]
  ])("renders rgba color codes correctly", (color, expectedCode): void => {
    expect(color.rgbaString()).toEqual(expectedCode);
  });
});
