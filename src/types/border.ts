import { Color } from "./color";

export enum BorderStyle {
  None,
  Line,
  GroupBox
}

const CssBorders: { [key in BorderStyle]: string } = {
  [BorderStyle.None]: "none",
  [BorderStyle.Line]: "solid",
  [BorderStyle.GroupBox]: "ridge"
};

export class Border {
  private style: BorderStyle;
  private color: Color;
  private width: number;

  public constructor(style: BorderStyle, color: Color, width: number) {
    this.style = style;
    this.color = color;
    this.width = width;
  }

  public asStyle(): object {
    return {
      borderStyle: CssBorders[this.style],
      borderWidth: `${this.width}px`,
      borderColor: this.color.rgbaString()
    };
  }
}
