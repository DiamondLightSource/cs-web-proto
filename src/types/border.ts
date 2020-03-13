import { Color } from "./color";

export enum BorderStyle {
  None,
  Line,
  Dashed,
  Dotted,
  GroupBox
}

const CssBorders: { [key in BorderStyle]: string } = {
  [BorderStyle.None]: "none",
  [BorderStyle.Line]: "solid",
  [BorderStyle.Dashed]: "dashed",
  [BorderStyle.Dotted]: "dotted",
  [BorderStyle.GroupBox]: "ridge"
};

export class Border {
  private style: BorderStyle;
  private color: Color;
  // This will render a border width in pixels. I expect that we will revisit this
  // at some later point, possibly to allow or fix to rems.
  private width: number;

  public constructor(style: BorderStyle, color: Color, width: number) {
    this.style = style;
    this.color = color;
    this.width = width;
  }

  public css(): object {
    return {
      borderStyle: CssBorders[this.style],
      borderWidth: `${this.width}px`,
      borderColor: this.color.rgbaString()
    };
  }
}
