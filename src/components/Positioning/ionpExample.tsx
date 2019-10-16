import React from "react";

import { AbsolutePositionDescription, objectToComponent } from "./positioning";
import { MacroLabel } from "../Label/label";
import { Readback } from "../Readback/readback";
import { Input } from "../Input/input";
import { ProgressBar } from "../ProgressBar/progressBar";
import { vdouble } from "../../vtypes/vtypes";
import { vstring } from "../../vtypes/string";

export const Blank: React.FC = (props: any): JSX.Element => (
  <div
    style={{
      position: "absolute",
      height: "100%",
      width: "100%",
      border: "solid 5px black",
      backgroundColor: "#dddddd",
      fontSize: "0.7vw",
      boxSizing: "border-box",
      ...props.style
    }}
  >
    {props.children}
  </div>
);

const compDict = {
  activeXTextClass: MacroLabel,
  TextupdateClass: Readback,
  activeXTextDspClass: Input,
  activeBarClass: ProgressBar,
  Blank: Blank
};

const IonpScreen: AbsolutePositionDescription = {
  type: "Blank",
  x: "136px",
  y: "100px",
  width: "328px",
  height: "468px",
  children: [
    {
      type: "activeXTextClass",
      x: 0,
      y: 0,
      width: "328px",
      height: "32px",
      text: "${device}",
      style: {
        textAlign: "center",
        fontSize: "1.2vw",
        backgroundColor: "#bdf57d"
      }
    },
    {
      type: "activeXTextClass",
      x: "16px",
      y: "68px",
      width: "60px",
      height: "16px",
      text: "Pressure"
    },
    {
      type: "TextupdateClass",
      x: "96px",
      y: "64px",
      width: "72px",
      height: "22px",
      connected: true,
      value: vdouble(1.2e-10)
    },
    {
      type: "activeBarClass",
      x: "172px",
      y: "64px",
      width: "140px",
      height: "22px",
      min: -12,
      max: 3,
      value: vdouble(-9),
      fontStyle: {
        fontSize: "0.8vw"
      }
    },
    {
      type: "activeXTextClass",
      x: "16px",
      y: "96px",
      width: "42px",
      height: "16px",
      text: "Status"
    },
    {
      type: "TextupdateClass",
      x: "96px",
      y: "92px",
      width: "216px",
      height: "22px",
      connected: true,
      value: vstring("Running")
    },
    {
      type: "activeXTextClass",
      x: "16px",
      y: "124px",
      width: "72px",
      height: "16px",
      text: "Error Code"
    },
    {
      type: "TextupdateClass",
      x: "96px",
      y: "120px",
      width: "216px",
      height: "22px",
      connected: true,
      value: vstring("OK")
    },
    {
      type: "activeXTextClass",
      x: "16px",
      y: "152px",
      width: "50px",
      height: "16px",
      text: "Voltage"
    },
    {
      type: "TextupdateClass",
      x: "96px",
      y: "148px",
      width: "72px",
      height: "22px",
      connected: true,
      value: vstring("6637 V")
    },
    {
      type: "activeXTextClass",
      x: "16px",
      y: "179px",
      width: "50px",
      height: "16px",
      text: "Current"
    },
    {
      type: "activeXTextClass",
      x: "16px",
      y: "208px",
      width: "62px",
      height: "16px",
      text: "Strapping"
    },
    {
      type: "TextupdateClass",
      x: "96px",
      y: "176px",
      width: "72px",
      height: "22px",
      connected: true,
      value: vstring("610.0e-9")
    },
    {
      type: "TextupdateClass",
      x: "96px",
      y: "204px",
      width: "72px",
      height: "22px",
      connected: true,
      value: vstring("7000V")
    }
  ]
};

export const Mapping: React.FC = (): JSX.Element => {
  let Mapped = objectToComponent(IonpScreen, compDict, {
    device: "SR03A-VA-IONP-01"
  });
  return <div>{Mapped}</div>;
};
