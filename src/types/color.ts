export class Color {
  private r: number;
  private g: number;
  private b: number;
  private a: number;

  public static WHITE = new Color(255, 255, 255);
  public static BLACK = new Color(0, 0, 0);
  public static RED = new Color(255, 0, 0);
  public static GREEN = new Color(0, 255, 0);
  public static BLUE = new Color(0, 0, 255);
  public static YELLOW = new Color(255, 255, 0);
  public static PURPLE = new Color(127, 0, 127);
  public static TRANSPARENT = new Color(0, 0, 0, 0);
  public static namedColors: { [key: string]: Color } = {
    white: Color.WHITE,
    black: Color.BLACK,
    red: Color.RED,
    green: Color.GREEN,
    blue: Color.BLUE,
    yellow: Color.YELLOW,
    purple: Color.PURPLE,
    transparent: Color.TRANSPARENT
  };

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
    } else if (cssColor in Color.namedColors) {
      return Color.namedColors[cssColor];
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
