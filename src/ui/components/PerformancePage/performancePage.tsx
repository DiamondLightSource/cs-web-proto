import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { RelativePosition } from "../../../types/position";
import { PV } from "../../../types/pv";
import { Readback } from "../../widgets/Readback/readback";

const DEFAULT_ROWS = 20;
const DEFAULT_COLUMNS = 10;

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

export const LoadPerformancePage = (): JSX.Element => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const rows = parseFloat(params.get("rows") ?? "") || DEFAULT_ROWS;
  const columns = parseFloat(params.get("columns") ?? "") || DEFAULT_COLUMNS;
  const differentPvs = params.get("differentPvs") === "true" ?? false;
  const simpleComponents = params.get("simpleComponents") === "true" ?? false;
  if (simpleComponents) {
    return <SimpleUpdaterPage rows={rows} columns={columns} />;
  }
  return (
    <PerformancePage
      rows={rows}
      columns={columns}
      differentPvs={differentPvs}
    />
  );
};

const PerformancePage = (props: {
  rows: number;
  columns: number;
  differentPvs: boolean;
}): JSX.Element => {
  const { rows, columns, differentPvs } = props;
  const widgets = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      const n = i * rows + j;
      const width = 100 / rows;
      const height = 100 / columns;
      widgets.push(readback(width, height, differentPvs, n));
    }
  }
  return (
    <div style={{ width: "80%", margin: "auto" }}>
      <h1>Readback widgets using simulated PVs</h1>
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

const SimpleUpdaterPage = (props: {
  rows: number;
  columns: number;
}): JSX.Element => {
  const { rows, columns } = props;
  const [value, setValue] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setValue((value + 1) % 100);
    }, 100);
    return () => {
      clearInterval(interval);
    };
  });
  const components = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      const width = 100 / rows;
      const height = 100 / columns;
      components.push(<MinUpdater width={width} height={height} val={value} />);
    }
  }
  return (
    <div style={{ width: "80%", margin: "auto" }}>
      <h1>Simple React components</h1>
      <div style={{ width: "100%", display: "flex", flexWrap: "wrap" }}>
        {components}
      </div>
    </div>
  );
};
