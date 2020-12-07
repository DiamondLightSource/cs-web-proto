import { CSSProperties } from "react";
import { Color } from "./color";

export enum BorderStyle {
  None,
  Line,
  Outset,
  Dashed,
  Dotted,
  GroupBox
}

const CssBorders: { [key in BorderStyle]: string } = {
  [BorderStyle.None]: "none",
  [BorderStyle.Line]: "solid",
  [BorderStyle.Outset]: "outset",
  [BorderStyle.Dashed]: "dashed",
  [BorderStyle.Dotted]: "dotted",
  // This should already be handled by adding a fieldset element around,
  // although this work is not complete.
  [BorderStyle.GroupBox]: "none"
};

export class Border {
  public static NONE = new Border(BorderStyle.None, Color.BLACK, 0);
  public static GROUPBOX = new Border(BorderStyle.GroupBox, Color.BLACK, 0);

  public style: BorderStyle;
  public color: Color;
  // This will render a border width in pixels. I expect that we will revisit this
  // at some later point, possibly to allow or fix to rems.
  public width: number;
  public radius?: number;

  public constructor(
    style: BorderStyle,
    color: Color,
    width: number,
    radius?: number
  ) {
    this.style = style;
    this.color = color;
    this.width = width;
    this.radius = radius;
  }

  public css(): CSSProperties {
    return {
      borderStyle: CssBorders[this.style],
      borderWidth: `${this.width}px`,
      borderColor: this.color.toString(),
      borderRadius: this.radius ? `${this.radius}px` : undefined
    };
  }
}
