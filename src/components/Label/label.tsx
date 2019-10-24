import React from "react";

import classes from "./label.module.css";
import { macroWrapper } from "../MacroWrapper/macroWrapper";
import { MacroMap } from "../../redux/csState";

import { Widget, WidgetInterface } from "../Widget/widget";

export const Label = (props: {
  text: string | number;
  style?: object;
}): JSX.Element => (
  // Simple component to display text - defaults to black text and dark grey background
  <div className={`Label ${classes.Label}`} style={props.style}>
    {props.text}
  </div>
);

interface MacroLabelProps {
  text: string | number;
  style?: object;
  macroMap: MacroMap;
}

export const MacroLabel: React.FC<MacroLabelProps> = macroWrapper(Label);

interface LabelWidgetProps {
  text: string | number;
}

export const LabelWidget = (
  props: LabelWidgetProps & WidgetInterface
): JSX.Element => <Widget baseWidget={Label} {...props} />;
