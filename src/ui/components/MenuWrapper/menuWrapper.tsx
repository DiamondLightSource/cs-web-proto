import React, { ReactNode, useState, useContext } from "react";
import {
  WidgetActions,
  WidgetAction,
  executeAction,
  getActionDescription
} from "../../widgets/widgetActions";
import classes from "./menuWrapper.module.css";
import { FileContext } from "../../../fileContext";

// Using ideas from
// https://www.pluralsight.com/guides/how-to-create-a-right-click-menu-using-react
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
    setContextOpen(contextOpen ? false : true);
    setX(e.nativeEvent.clientX);
    setY(e.nativeEvent.clientY);
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
          position: "fixed",
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
    // Cancel menu with a click anywhere other than on a context menu
    // item. If it is a context menu item then the menu will be
    // cancelled after executing.
    document.addEventListener(
      "mousedown",
      (event: MouseEvent) => {
        if (event.target instanceof HTMLDivElement) {
          if (event.target.classList.contains(classes.customContextItem)) {
            return;
          }
        }
        setContextOpen(false);
      },
      { once: true }
    );
  }

  return (
    <div style={props.style} onContextMenu={handleClick}>
      {contextOpen && returnMenu(props.actions, x, y)}
      {props.children}
    </div>
  );
};
