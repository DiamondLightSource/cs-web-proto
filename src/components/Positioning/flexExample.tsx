import React from "react";

import { PositionDescription, objectToPosition } from "./positioning";
//import { Label } from "../Label/label";
import { ConnectedStandaloneReadback } from "../Readback/readback";
import { ConnectedInput } from "../Input/input";
//import { ProgressBar } from "../ProgressBar/progressBar";
import { FlexContainer } from "../FlexContainer/flexContainer";

export const Blank: React.FC = (props: any): JSX.Element => (
  <div
    style={{
      position: "absolute",
      height: "100%",
      width: "100%",
      border: "solid 5px black",
      backgroundColor: "#dddddd",
      fontSize: "0.7vw"
    }}
  >
    {props.children}
  </div>
);

const compDict = {
  readback: ConnectedStandaloneReadback,
  input: ConnectedInput,
  flex: FlexContainer,
  Blank: Blank
};

const IonpScreen: PositionDescription = {
  type: "Blank",
  x: "0px",
  y: "0px",
  width: "100%",
  height: "100%",
  children: [
    {
      type: "flex",
      x: "0px",
      y: "0px",
      width: "100%",
      height: "100%",
      children: [
        {
          type: "input",
          flexible: true,
          width: "200px",
          height: "100px",
          pvName: "meta://metapv1"
        },
        {
          type: "readback",
          flexible: true,
          width: "200px",
          height: "100px",
          pvName: "meta://metapv1",
          precision: 3
        },
        {
          type: "readback",
          flexible: true,
          width: "400px",
          height: "100px",
          pvName: "meta://metapv1",
          precision: 3
        },
        {
          type: "readback",
          flexible: true,
          width: "400px",
          height: "100px",
          pvName: "meta://metapv1",
          precision: 3
        },
        {
          type: "readback",
          flexible: true,
          width: "400px",
          height: "150px",
          pvName: "meta://metapv1",
          precision: 3
        },
        {
          type: "readback",
          flexible: true,
          width: "400px",
          height: "100px",
          pvName: "meta://metapv1",
          precision: 3
        },
        {
          type: "readback",
          x: "500px",
          y: "500px",
          width: "400px",
          height: "100px",
          pvName: "meta://metapv1",
          precision: 3
        }
      ]
    }
  ]
};

export const Mapping: React.FC = (): JSX.Element => {
  let Mapped = objectToPosition(IonpScreen, compDict);
  return <div>{Mapped}</div>;
};
