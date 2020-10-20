import { createCanvas } from "canvas";
import log from "loglevel";

export class Color {
  private r: number;
  private g: number;
  private b: number;
  private a: number;

  public static WHITE = new Color(255, 255, 255);
  public static GREY = new Color(220, 220, 220);
  public static BLACK = new Color(0, 0, 0);
  public static RED = new Color(255, 0, 0);
  public static GREEN = new Color(0, 128, 0);
  public static BLUE = new Color(0, 0, 255);
  public static YELLOW = new Color(255, 255, 0);
  public static PURPLE = new Color(127, 0, 127);
  public static PINK = new Color(255, 192, 203);
  public static ORANGE = new Color(255, 165, 0);
  public static TRANSPARENT = new Color(0, 0, 0, 0);

  public static DISCONNECTED = Color.fromName("var(--disconnected)");
  public static INVALID = Color.fromName("var(--invalid)");
  public static WARNING = Color.fromName("var(--warning)");
  public static ALARM = Color.fromName("var(--alarm)");
  public static CHANGING = Color.fromName("var(--changing)");

  /**
   * Use the browser to compute colours from names.
   * @param cssColorName string representing the color name
   * @returns hex code for the corresponding color, or #000000 if not possible
   * @example fromName("red") -> "#FF0000"
   */
  public static fromName(cssColorName: string): string {
    let ctx = document.createElement("canvas").getContext("2d");
    if (!ctx) {
      // Fall back to the canvas npm package.
      ctx = createCanvas(100, 100).getContext("2d");
    }
    if (ctx) {
      // settings fillstyle with string name
      ctx.fillStyle = cssColorName;
      // then accessing the name is converted to hex color code
      return ctx.fillStyle;
    } else {
      log.warn(
        `Failed to parse color name ${cssColorName} using canvas element.`
      );
      return "#000000";
    }
  }

  /**
   * Parses multiple different color formats into a new
   * Color object
   * @param cssColor string hex code "#FF0000", or rgb code "rgb(100, 53, 195)",
   * or transparent "transparent", or css color "red"
   * @returns new Color object from parsed color, or black if color is not found
   */
  public static parse(cssColor: string): Color {
    let r = 0;
    let g = 0;
    let b = 0;
    if (cssColor.startsWith("#")) {
      let intRep = parseInt(cssColor.slice(1), 16);
      b = Math.floor(intRep % 256);
      intRep /= 256;
      g = Math.floor(intRep % 256);
      intRep /= 256;
      r = Math.floor(intRep);
    } else if (cssColor.startsWith("rgb")) {
      // expected format "rgb(100, 53, 195)"
      const parts = cssColor.match(/rgb\((.*), (.*), (.*)\)/);
      if (parts !== null) {
        r = parseInt(parts[1]);
        g = parseInt(parts[2]);
        b = parseInt(parts[3]);
      }
    } else if (cssColor === "transparent") {
      return Color.TRANSPARENT;
    } else {
      return this.parse(this.fromName(cssColor));
    }

    return new Color(r, g, b);
  }

  public constructor(r: number, g: number, b: number, a = 255) {
    if (r < 0 || r > 255) {
      throw new Error(`r value ${r} out of range`);
    } else if (g < 0 || g > 255) {
      throw new Error(`g value ${g} out of range`);
    } else if (b < 0 || b > 255) {
      throw new Error(`b value ${b} out of range`);
    }

    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  public rgbaString(): string {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }
}
