export enum FontStyle {
  Regular,
  Bold,
  Italic,
  BoldItalic
}

export class Font {
  private typeface: string;
  private name?: string;
  private style: FontStyle;
  private size: number;

  public constructor(
    style: FontStyle,
    size: number,
    typeface?: string,
    name?: string
  ) {
    this.typeface = typeface ? typeface : "Liberation sans";
    this.style = style;
    this.size = size;
    this.name = name;
  }

  public asStyle(): object {
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
