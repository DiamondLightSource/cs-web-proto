import React, { ReactElement } from "react";
import PropTypes from "prop-types";
import log from "loglevel";
import Drawer from "@material-ui/core/Drawer";

import { Widget } from "../widget";
import { WidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import {
  InferWidgetProps,
  ChoicePropOpt,
  StringOrNumPropOpt,
  FontPropOpt,
  StringPropOpt,
} from "../propTypes";

export const DrawerProps = {
  anchor: ChoicePropOpt(["left", "right", "top", "bottom"]),
  drawerWidth: StringOrNumPropOpt,
  drawerMaxWidth: StringOrNumPropOpt,
  font: FontPropOpt,
  text: StringPropOpt,
  children: PropTypes.arrayOf(PropTypes.element),
};

export const DrawerComponent = (
  props: InferWidgetProps<typeof DrawerProps>
): JSX.Element => {
  const [drawOpen, setDrawOpen] = React.useState(false);

  // To satisfy the typing for the literals
  type anchorType = "left" | "right" | "top" | "bottom";

  return (
    <React.Fragment>
      <button
        onClick={() => setDrawOpen(true)}
        style={{ height: "100%", width: "100%", ...props.font?.css() }}
      >
        {props.text ?? "\u2630"}
      </button>
      <Drawer
        anchor={(props.anchor ?? "left") as anchorType}
        open={drawOpen}
        onClose={() => setDrawOpen(false)}
      >
        <div
          style={{
            width: props.drawerWidth ?? "80vw",
            maxWidth: props.drawerMaxWidth ?? "400px",
          }}
        >
          {props.children}
        </div>
      </Drawer>
    </React.Fragment>
  );
};

export const DrawerWidgetProps = {
  ...DrawerProps,
  ...WidgetPropType,
};

export const DrawerWidget = (
  props: InferWidgetProps<typeof DrawerWidgetProps>
): JSX.Element => <Widget baseWidget={DrawerComponent} {...props} />;

registerWidget(DrawerWidget, DrawerWidgetProps, "drawer");
