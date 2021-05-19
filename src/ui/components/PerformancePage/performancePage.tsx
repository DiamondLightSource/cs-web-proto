import React, { useEffect, useState } from "react";
import { RelativePosition } from "../../../types/position";
import { PV } from "../../../types/pv";
import { Input } from "../../widgets";
import { Readback } from "../../widgets/Readback/readback";

const ROWS = 20;
const COLUMNS = 10;

function readback(
  width: number,
  height: number,
  differentPvs: boolean,
  n: number
): JSX.Element {
  let pvName = "ramp";
  if (differentPvs) {
    pvName += `#${n}`;
  }
  return (
    <Readback
      position={new RelativePosition(`${width}%`, `${height}%`)}
      pvName={new PV(pvName, "sim")}
    ></Readback>
  );
}

export const PerformancePage = (props: {
  differentPvs: boolean;
}): JSX.Element => {
  const widgets = [];
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLUMNS; j++) {
      const n = i * ROWS + j;
      const width = 100 / ROWS;
      const height = 100 / COLUMNS;
      widgets.push(readback(width, height, props.differentPvs, n));
    }
  }
  return (
    <div style={{ width: "80%", margin: "auto" }}>
      <h1>Performance page</h1>
      <Input
        position={new RelativePosition()}
        pvName={new PV("loc://test(1)")}
      />
      <div style={{ width: "100%", display: "flex", flexWrap: "wrap" }}>
        {widgets}
      </div>
    </div>
  );
};

const MinUpdater = (props: {
  width: number;
  height: number;
  val: number;
}): JSX.Element => {
  return (
    <div
      style={{
        width: `${props.width}%`,
        height: `${props.height}%`,
        display: "flex",
        minHeight: "20px",
        backgroundColor: "#383838",
        color: "#00bb00",
        font: "14px helvetica"
      }}
    >
      {props.val}
    </div>
  );
};

export const MinUpdaterPage = (): JSX.Element => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setValue(value + 1);
    }, 100);
    return () => {
      clearInterval(interval);
    };
  });
  const widgets = [];
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLUMNS; j++) {
      const width = 100 / ROWS;
      const height = 100 / COLUMNS;
      widgets.push(<MinUpdater width={width} height={height} val={value} />);
    }
  }
  return (
    <div style={{ width: "80%", margin: "auto" }}>
      <h1>Performance page</h1>
      <div style={{ width: "100%", display: "flex", flexWrap: "wrap" }}>
        {widgets}
      </div>
    </div>
  );
};
