import React, { useState } from "react";
import PropTypes from "prop-types";

import { Widget } from "../widget";
import { WidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import {
  InferWidgetProps,
  StringOrNumPropOpt,
  BorderPropOpt,
  ColorPropOpt,
  FilePropType
} from "../propTypes";
import { EmbeddedDisplay } from "../EmbeddedDisplay/embeddedDisplay";
import { RelativePosition } from "../../../types/position";

import classes from "./tabs.module.css";

export const NavigationTabsProps = {
  tabs: PropTypes.objectOf(FilePropType).isRequired,
  maxHeight: StringOrNumPropOpt,
  maxWidth: StringOrNumPropOpt,
  minHeight: StringOrNumPropOpt,
  border: BorderPropOpt,
  backgroundColor: ColorPropOpt
};

export const NavigationTabsComponent = (
  props: InferWidgetProps<typeof NavigationTabsProps>
): JSX.Element => {
  const [childIndex, setIndex] = useState(0);

  const children = Object.values(props.tabs).map((child, index) => (
    <EmbeddedDisplay
      position={new RelativePosition()}
      file={{
        path: child?.path || "",
        type: child?.type || "json",
        defaultProtocol: "pva",
        macros: child?.macros || {}
      }}
      key={index}
    />
  ));

  return (
    <div>
      <div className={classes.TabBar}>
        {Object.keys(props.tabs).map(
          (key, index): JSX.Element => (
            <button
              onClick={(): void => {
                setIndex(index);
              }}
              className={
                index === childIndex
                  ? `${classes.Tab} ${classes.TabSelected}`
                  : classes.Tab
              }
              key={index}
            >
              {key}
            </button>
          )
        )}
      </div>
      {children[childIndex]}
    </div>
  );
};

export const NavigationTabsWidgetProps = {
  ...NavigationTabsProps,
  ...WidgetPropType
};

export const NavigationTabs = (
  props: InferWidgetProps<typeof NavigationTabsWidgetProps>
): JSX.Element => <Widget baseWidget={NavigationTabsComponent} {...props} />;

registerWidget(NavigationTabs, NavigationTabsProps, "navigationtabs");
