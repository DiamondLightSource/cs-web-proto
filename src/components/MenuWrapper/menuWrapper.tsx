import React, { ReactNode, useState } from "react";
import classes from "./menuWrapper.module.css";

function itemCallback() {
  alert("clicked on item 1");
}

export interface ActionMap {
  [index: number]: {
    label: string;
    callback: () => void;
  };
}

let items: ActionMap = {
  0: { label: "item1", callback: itemCallback },
  1: { label: "item2", callback: itemCallback }
};

function triggerCallback(key: number) {
  alert(key);
}

function returnMenu(items: ActionMap, x: number, y: number) {
  let entries = [];

  for (let [index, item] of Object.entries(items)) {
    var idx: number = 0;
    var label: any = "";
    for (let [key, value] of Object.entries(item)) {
      if (key == "label") {
        idx = entries.length;
        label = value;
      }
      if (key == "callback") {
        entries.push(
          <div key={idx} className={classes.customContextItem}>
            {label}
          </div>
        );
      }
    }
  }

  return (
    <div>
      <div
        className={classes.customContext}
        style={{
          position: "absolute",
          zIndex: 1000,
          top: `${y}px`,
          left: `${x}px`
        }}
      >
        {entries}
        <div
          key="4"
          className={classes.customContextItem}
          onClick={() => triggerCallback(0)}
        >
          hello
        </div>
        <div key="5" className={classes.customContextItem}>
          test
        </div>{" "}
        <div key="6" className={classes.customContextItem}>
          temp
        </div>
      </div>
    </div>
  );
}

export const MenuWrapper = (props: {
  pvName: string;
  children: ReactNode;
}): JSX.Element => {
  let { pvName } = props;

  const [contextOpen, setContextOpen] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const handleClick = (e: React.MouseEvent): void => {
    e.preventDefault();
    if (e.button === 2) {
      setContextOpen(contextOpen ? false : true);
      setX(e.nativeEvent.offsetX);
      setY(e.nativeEvent.offsetY);
    }
  };

  if (contextOpen) {
    return (
      <div>
        <div>{returnMenu(items, x, y)}</div>
        <div onContextMenu={handleClick}>{props.children}</div>
      </div>
    );
  } else return <div onContextMenu={handleClick}>{props.children}</div>;
};
