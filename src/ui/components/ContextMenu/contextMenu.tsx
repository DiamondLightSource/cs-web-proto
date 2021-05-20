import React from "react";
import {
  WidgetActions,
  WidgetAction,
  getActionDescription
} from "../../widgets/widgetActions";
import classes from "./contextMenu.module.css";

export function ContextMenu(props: {
  actions: WidgetActions;
  coordinates: [number, number];
  triggerCallback: (action: WidgetAction) => void;
}): JSX.Element {
  const { actions, coordinates } = props;
  const [x, y] = coordinates;
  const entries = [];
  const length = props.actions.actions.length;
  for (let i = 0; i < length; i++) {
    entries.push(
      <div
        key={i}
        className={classes.customContextItem}
        onClick={(): void => props.triggerCallback(actions.actions[i])}
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
        top: `${y}px`,
        left: `${x}px`
      }}
    >
      {entries}
    </div>
  );
}
