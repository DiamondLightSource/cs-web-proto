export enum FontStyle {
  Regular,
  Bold,
  Italic,
  BoldItalic
}

export class Font {
  private size: number;
  private style: FontStyle;
  private typeface: string;
  private name?: string;

  public constructor(
    size: number,
    style?: FontStyle,
    typeface?: string,
    name?: string
  ) {
    this.typeface = typeface ?? "Liberation sans";
    this.style = style ?? FontStyle.Regular;
    this.size = size;
    this.name = name;
  }

  public css(): object {
    const fontWeight =
      this.style === FontStyle.Bold || this.style === FontStyle.BoldItalic
        ? "bold"
        : "normal";
    const fontStyle =
      this.style === FontStyle.Italic || this.style === FontStyle.BoldItalic
        ? "italic"
        : "normal";
    return {
      fontFamily: this.typeface,
      fontSize: `${this.size / 10}rem`,
      fontWeight: fontWeight,
      fontStyle: fontStyle
    };
  }
}
