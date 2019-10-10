import React from "react";

import { AbsolutePositionDescription, objectToPosition } from "./positioning";
import { Readback } from "../Readback/readback";

const Blank: React.FC = (props: any): JSX.Element => (
  <div
    style={{
      position: "absolute",
      height: "100%",
      width: "100%",
      border: "solid 5px black"
    }}
  >
    {props.children}
  </div>
);

const RedBlock: React.FC = (props: any): JSX.Element => {
  let borderStyle = {};
  if (props.withBorder) {
    borderStyle = {
      border: "solid 5px pink"
    };
  }

  return (
    <div
      style={{
        position: "absolute",
        height: "100%",
        width: "100%",
        backgroundColor: "red",
        ...borderStyle
      }}
    >
      {props.children}
    </div>
  );
};

const BlueBlock: React.FC = (props: any): JSX.Element => (
  <div
    style={{
      position: "absolute",
      height: "100%",
      width: "100%",
      backgroundColor: "blue"
    }}
  >
    {props.children}
  </div>
);

const GreenBlock: React.FC = (props: any): JSX.Element => (
  <div
    style={{
      position: "absolute",
      height: "100%",
      width: "100%",
      backgroundColor: "green"
    }}
  >
    {props.children}
  </div>
);

const exampleDict: { [index: string]: any } = {
  "Red Block": RedBlock,
  "Blue Block": BlueBlock,
  "Green Block": GreenBlock,
  Blank: Blank,
  "Read Back": Readback
};

const PosOne: AbsolutePositionDescription = {
  type: "Red Block",
  x: "25%",
  y: "25%",
  width: "50%",
  height: "50%",
  withBorder: true
};

const PosTwo: AbsolutePositionDescription = {
  type: "Green Block",
  x: "25%",
  y: "25%",
  width: "50%",
  height: "50%",
  children: [PosOne]
};

const PosThree: AbsolutePositionDescription = {
  type: "Blue Block",
  x: 0,
  y: 0,
  width: "100%",
  height: "100%",
  children: [PosTwo]
};

const MapOne: AbsolutePositionDescription = {
  type: "Blank",
  x: 0,
  y: 0,
  width: "100%",
  height: "100%",
  children: [
    {
      type: "Blank",
      x: 0,
      y: 0,
      width: "50%",
      height: "100%",
      children: [PosThree]
    },
    {
      type: "Blank",
      x: "50%",
      y: 0,
      width: "50%",
      height: "100%",
      children: [
        {
          type: "Blank",
          x: 0,
          y: 0,
          width: "100%",
          height: "50%",
          children: [
            {
              type: "Red Block",
              x: 0,
              y: 0,
              width: "33%",
              height: "100%",
              withBorder: true
            },
            {
              type: "Green Block",
              x: "33%",
              y: 0,
              width: "33%",
              height: "100%"
            },
            {
              type: "Blue Block",
              x: "66%",
              y: 0,
              width: "34%",
              height: "100%"
            },
            {
              type: "Read Back",
              x: "25%",
              y: "40%",
              width: "50%",
              height: "20%",
              connected: true,
              value: {
                value: 101
              }
            }
          ]
        },
        {
          type: "Blank",
          x: 0,
          y: "50%",
          width: "100%",
          height: "50%",
          children: [PosThree]
        }
      ]
    }
  ]
};

export const Mapping: React.FC = (): JSX.Element => {
  let Mapped = objectToPosition(MapOne, exampleDict, {});

  return <div>{Mapped}</div>;
};
