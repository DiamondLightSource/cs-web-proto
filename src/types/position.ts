import { CSSProperties } from "react";

export type Position = AbsolutePosition | RelativePosition;

export class AbsolutePosition {
  public x: string;
  public y: string;
  public width: string;
  public height: string;
  public margin: string;
  public padding: string;
  public minWidth: string;
  public maxWidth: string;

  public constructor(
    x: string,
    y: string,
    width: string,
    height: string,
    margin = "",
    padding = "",
    minWidth = "",
    maxWidth = ""
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.margin = margin;
    this.padding = padding;
    this.minWidth = minWidth;
    this.maxWidth = maxWidth;
  }

  public css(): CSSProperties {
    return {
      position: "absolute",
      top: this.y,
      left: this.x,
      width: this.width,
      height: this.height,
      margin: this.margin,
      padding: this.padding,
      minWidth: this.minWidth,
      maxWidth: this.maxWidth
    };
  }
}

export class RelativePosition {
  public width: string;
  public height: string;
  public margin: string;
  public padding: string;
  public minWidth: string;
  public maxWidth: string;

  public constructor(
    width = "",
    height = "",
    margin = "",
    padding = "",
    minWidth = "",
    maxWidth = ""
  ) {
    this.width = width;
    this.height = height;
    this.margin = margin;
    this.padding = padding;
    this.minWidth = minWidth;
    this.maxWidth = maxWidth;
  }

  public css(): CSSProperties {
    return {
      position: "relative",
      width: this.width,
      height: this.height,
      margin: this.margin,
      padding: this.padding,
      minWidth: this.minWidth,
      maxWidth: this.maxWidth
    };
  }
}