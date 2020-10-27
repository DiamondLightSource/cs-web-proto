export class Color {
  private text: string;
  private name?: string;

  public static WHITE = Color.fromRgba(255, 255, 255);
  public static GREY = Color.fromRgba(220, 220, 220);
  public static BLACK = Color.fromRgba(0, 0, 0);
  public static RED = Color.fromRgba(255, 0, 0);
  public static GREEN = Color.fromRgba(0, 128, 0);
  public static BLUE = Color.fromRgba(0, 0, 255);
  public static YELLOW = Color.fromRgba(255, 255, 0);
  public static PURPLE = Color.fromRgba(127, 0, 127);
  public static PINK = Color.fromRgba(255, 192, 203);
  public static ORANGE = Color.fromRgba(255, 165, 0);
  public static TRANSPARENT = Color.fromRgba(0, 0, 0, 0);

  public static DISCONNECTED = new Color("var(--disconnected)");
  public static INVALID = new Color("var(--invalid)");
  public static WARNING = new Color("var(--warning)");
  public static ALARM = new Color("var(--alarm)");
  public static CHANGING = new Color("var(--changing)");
  public static UNDEFINED = new Color("var(--undefined)");

  public static fromRgba(r: number, g: number, b: number, a = 255): Color {
    if (r < 0 || r > 255) {
      throw new Error(`r value ${r} out of range`);
    } else if (g < 0 || g > 255) {
      throw new Error(`g value ${g} out of range`);
    } else if (b < 0 || b > 255) {
      throw new Error(`b value ${b} out of range`);
    }

    return new Color(`rgba(${r},${g},${b},${a})`);
  }

  public constructor(text: string, name?: string) {
    this.text = text;
    this.name = name;
  }

  public toString(): string {
    return this.text;
  }
}
