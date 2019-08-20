import React from "react";
import { useSelector } from "react-redux";
import { useSubscription } from "../../hooks/useCs";
import { CsState } from "../../redux/store";

import classes from "./ProgressBar.module.css";

export const ProgressBar = (props: {
  pvName: string;
  value: number;
  min: number;
  max: number;
  vertical?: boolean;
  color?: string;
  top?: string;
  left?: string;
  height?: string;
  width?: string;
  fontStyle?: object;
}) => {
  let {
    value = 0,
    min = 0,
    max = 100,
    vertical = false,
    color = "#00aa00",
    top = "0%",
    left = "0%",
    height = "100%",
    width = "100%",
    fontStyle = {}
  } = props;

  let barStyle = {
    top: top,
    left: left,
    height: height,
    width: width
  };

  let onPercent = ((value - min) / (max - min)) * 100.0;
  // Store styles in these variables
  let barColor = {
      "background-image": `linear-gradient(to top, ${color} 50%, #ffffff 130%)`
    },
    onStyle = {},
    offStyle = {};
  if (vertical === true) {
    onStyle = {
      ...barColor,
      width: "100%",
      height: `${onPercent}%`
    };
  } else {
    onStyle = {
      ...barColor,
      height: "100%",
      width: `${onPercent}%`
    };
  }

  let valueText = min < max ? value : "Check min and max values";

  return (
    <div className={classes.block} style={barStyle}>
      <div className={classes.off} style={offStyle} />
      <div className={classes.on} style={onStyle} />
      <div className={classes.label} style={fontStyle}>
        {valueText}
      </div>
    </div>
  );
};

export const ConnectedProgressBar = (props: {
  pvName: string;
}): JSX.Element => {
  useSubscription(props.pvName);
  const latestValue = useSelector((state: CsState): string => {
    let value = state.valueCache[props.pvName];
    if (value == null) {
      return "";
    } else {
      return value.value.toString();
    }
  });
  return (
    <ProgressBar
      pvName={props.pvName}
      value={parseFloat(latestValue)}
      min={0}
      max={100}
    />
  );
};
