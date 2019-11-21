import React, { ReactNode, useState } from "react";
import { Actions, ACTION_TYPE, executeAction } from "../../actions";
import classes from "./menuWrapper.module.css";

export const MenuWrapper = (props: {
  pvName: string;
  actions: Actions;
  children: ReactNode;
  style?: object;
}): JSX.Element => {
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
  const handleMouseLeave = (e: React.MouseEvent): void => {
    e.preventDefault();
    setContextOpen(false);
  };

  function triggerCallback(action: ACTION_TYPE): void {
    executeAction(action);
    setContextOpen(false);
  }

  function returnMenu(actions: Actions, x: number, y: number): JSX.Element {
    let entries = [];
    var length = actions.actions.length;
    for (let i = 0; i < length; i++) {
      entries.push(
        <div
          key={i}
          className={classes.customContextItem}
          onClick={(): void => triggerCallback(actions.actions[i])}
        >
          {actions.actions[i].description}
        </div>
      );
    }

    return (
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
      </div>
    );
  }

  if (contextOpen) {
    return (
      <div
        style={props.style}
        onContextMenu={handleClick}
        onMouseLeave={handleMouseLeave}
      >
        {returnMenu(props.actions, x, y)}
        {props.children}
      </div>
    );
  } else
    return (
      <div
        style={props.style}
        onContextMenu={handleClick}
        onMouseLeave={handleMouseLeave}
      >
        {props.children}
      </div>
    );
};
