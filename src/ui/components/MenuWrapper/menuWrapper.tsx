import React, { ReactNode, useState, useContext } from "react";
import {
  WidgetActions,
  WidgetAction,
  executeAction,
  getActionDescription
} from "../../widgets/widgetActions";
import classes from "./menuWrapper.module.css";
import { FileContext } from "../../../fileContext";

export const MenuWrapper = (props: {
  pvName: string;
  actions: WidgetActions;
  children: ReactNode;
  style?: object;
}): JSX.Element => {
  const [contextOpen, setContextOpen] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const files = useContext(FileContext);

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

  function triggerCallback(action: WidgetAction): void {
    executeAction(action, files);
    setContextOpen(false);
  }

  function returnMenu(
    actions: WidgetActions,
    x: number,
    y: number
  ): JSX.Element {
    const entries = [];
    const length = actions.actions.length;
    for (let i = 0; i < length; i++) {
      entries.push(
        <div
          key={i}
          className={classes.customContextItem}
          onClick={(): void => triggerCallback(actions.actions[i])}
        >
          {getActionDescription(actions.actions[i])}
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
