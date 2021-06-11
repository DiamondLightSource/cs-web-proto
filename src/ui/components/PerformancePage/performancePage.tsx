import React, { useEffect, useState } from "react";
import classes from "./performancePage.module.css";
import { RelativePosition } from "../../../types/position";
import { PV } from "../../../types/pv";
import { Readback } from "../../widgets/Readback/readback";
import { InputComponent } from "../input/input";

const SIMPLE_COMPONENTS = "simple-components";
const READBACKS = "readbacks";
type WidgetType = typeof SIMPLE_COMPONENTS | typeof READBACKS;
const ONE_PV = "one-pv";
const MULTIPLE_PVS = "multiple-pvs";
type ReadbackType = typeof ONE_PV | typeof MULTIPLE_PVS;
const DEFAULT_ROWS = 10;
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
      position={new RelativePosition(`${width}%`, `20px`)}
      pvName={new PV(pvName, "sim")}
    ></Readback>
  );
}

export const PerformancePage = (): JSX.Element => {
  const [rows, setRows] = useState(DEFAULT_ROWS);
  const [columns, setColumns] = useState(DEFAULT_COLUMNS);
  const [widgetType, setWidgetType] = useState<WidgetType>(READBACKS);
  const [readbackType, setReadbackType] = useState<ReadbackType>(ONE_PV);
  let child: JSX.Element;
  if (widgetType === SIMPLE_COMPONENTS) {
    child = <SimpleUpdaters rows={rows} columns={columns} />;
  } else {
    child = (
      <ReadbackWidgets
        rows={rows}
        columns={columns}
        differentPvs={readbackType === MULTIPLE_PVS}
      />
    );
  }

  return (
    <>
      <div className={classes.widgetContainer}>
        <div className={classes.widgetSelector}>
          <p>No. of rows:</p>
          <InputComponent
            value={rows.toString()}
            onEnter={(value: string) => setRows(parseFloat(value))}
          />
          <p>No. of columns:</p>
          <InputComponent
            value={columns.toString()}
            onEnter={(value: string) => setColumns(parseFloat(value))}
          />
          <div className={classes.radioButtonSet}>
            <input
              type="radio"
              id={SIMPLE_COMPONENTS}
              value={SIMPLE_COMPONENTS}
              checked={widgetType === SIMPLE_COMPONENTS}
              onChange={event =>
                setWidgetType(event.currentTarget.value as WidgetType)
              }
            ></input>
            <label htmlFor={SIMPLE_COMPONENTS}>Simple components</label>
            <input
              type="radio"
              id={READBACKS}
              value={READBACKS}
              checked={widgetType === READBACKS}
              onChange={event =>
                setWidgetType(event.currentTarget.value as WidgetType)
              }
            ></input>
            <label htmlFor={READBACKS}>PV Readbacks</label>
          </div>
          <div
            className={classes.radioButtonSet}
            style={{
              visibility: widgetType === READBACKS ? "visible" : "hidden"
            }}
          >
            <input
              type="radio"
              id={ONE_PV}
              value={ONE_PV}
              checked={readbackType === ONE_PV}
              onChange={event =>
                setReadbackType(event.currentTarget.value as ReadbackType)
              }
            ></input>
            <label htmlFor={ONE_PV}>One PV</label>
            <input
              type="radio"
              id={MULTIPLE_PVS}
              value={MULTIPLE_PVS}
              checked={readbackType === MULTIPLE_PVS}
              onChange={event =>
                setReadbackType(event.currentTarget.value as ReadbackType)
              }
            ></input>
            <label htmlFor={MULTIPLE_PVS}>Multiple PVs</label>
          </div>
        </div>
        {child}
      </div>
    </>
  );
};

const ReadbackWidgets = (props: {
  rows: number;
  columns: number;
  differentPvs: boolean;
}): JSX.Element => {
  const { rows, columns, differentPvs } = props;
  const widgets = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      const n = i * rows + j;
      const width = 100 / columns;
      const height = 100 / rows;
      widgets.push(readback(width, height, differentPvs, n));
    }
  }
  return (
    <div>
      <h1>Readback widgets using simulated PVs</h1>
      <div style={{ width: "100%", display: "flex", flexWrap: "wrap" }}>
        {widgets}
      </div>
    </div>
  );
};

const SimpleUpdaters = (props: {
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
      const width = 100 / columns;
      components.push(
        <div className={classes.simpleUpdater} style={{ width: `${width}%` }}>
          {value}
        </div>
      );
    }
  }
  return (
    <div>
      <h1>Simple React components</h1>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexWrap: "wrap"
        }}
      >
        {components}
      </div>
    </div>
  );
};
