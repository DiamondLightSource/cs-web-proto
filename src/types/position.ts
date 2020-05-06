import { CSSProperties } from "react";

export type Position = AbsolutePosition | RelativePosition;

function invalidSize(size?: string): boolean {
  return size === "" || size === undefined;
}

export class AbsolutePosition {
  public x: string;
  public y: string;
  public width: string;
  public height: string;
  public margin: string;
  public padding: string;
  public minWidth: string;
  public maxWidth: string;
  public minHeight: string;

  public constructor(
    x: string,
    y: string,
    width: string,
    height: string,
    margin = "",
    padding = "",
    minWidth = "",
    maxWidth = "",
    minHeight = ""
  ) {
    if (
      invalidSize(x) ||
      invalidSize(y) ||
      invalidSize(width) ||
      invalidSize(height)
    ) {
      throw new Error(
        `Invalid AbsolutePosition (${x},${y},${width},${height})`
      );
    }
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.margin = margin;
    this.padding = padding;
    this.minWidth = minWidth;
    this.maxWidth = maxWidth;
    this.minHeight = minHeight;
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
      maxWidth: this.maxWidth,
      minHeight: this.minHeight
    };
  }

  public toString(): string {
    return `AbsolutePosition (${this.x},${this.y},${this.width},${this.height})`;
  }
}

export class RelativePosition {
  public width: string;
  public height: string;
  public margin: string;
  public padding: string;
  public minWidth: string;
  public maxWidth: string;
  public minHeight: string;

  public constructor(
    width = "",
    height = "",
    margin = "",
    padding = "",
    minWidth = "",
    maxWidth = "",
    minHeight = ""
  ) {
    this.width = width;
    this.height = height;
    this.margin = margin;
    this.padding = padding;
    this.minWidth = minWidth;
    this.maxWidth = maxWidth;
    this.minHeight = minHeight;
  }

  public css(): CSSProperties {
    return {
      position: "relative",
      width: this.width,
      height: this.height,
      margin: this.margin,
      padding: this.padding,
      minWidth: this.minWidth,
      maxWidth: this.maxWidth,
      minHeight: this.minHeight
    };
  }

  public toString(): string {
    return `RelativePosition (${this.width},${this.height})`;
  }
}
