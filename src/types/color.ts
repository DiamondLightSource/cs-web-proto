export class Color {
  private r: number;
  private g: number;
  private b: number;

  public static parse(cssColor: string): Color {
    let r = 0;
    let g = 0;
    let b = 0;
    if (cssColor.startsWith("#")) {
      let intRep = parseInt(cssColor.slice(1), 16);
      r = Math.floor(intRep % 256);
      intRep /= 256;
      g = Math.floor(intRep % 256);
      intRep /= 256;
      b = Math.floor(intRep);
    } else if (cssColor.startsWith("rgb")) {
      const parts = cssColor.match(/rgb\((.*), (.*), (.*)\)/);
      if (parts !== null) {
        r = parseInt(parts[1]);
        g = parseInt(parts[2]);
        b = parseInt(parts[3]);
      }
    }

    return new Color(r, g, b);
  }

  public constructor(r: number, g: number, b: number) {
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
  }

  public rgbString(): string {
    return `rgb(${this.r}, ${this.g}, ${this.b})`;
  }
}

export const WHITE = new Color(255, 255, 255);
export const RED = new Color(255, 0, 0);
