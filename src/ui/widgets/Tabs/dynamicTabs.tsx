import React, { useState } from "react";

import { Widget } from "../widget";
import { WidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import {
  InferWidgetProps,
  StringOrNumPropOpt,
  BorderPropOpt,
  ColorPropOpt,
  StringProp
} from "../propTypes";
import { EmbeddedDisplay } from "../EmbeddedDisplay/embeddedDisplay";
import { RelativePosition } from "../../../types/position";

import classes from "./navigationTabs.module.css";
import { useHistory } from "react-router-dom";
import { getUrlInfoFromHistory } from "../urlControl";

export const DynamicTabsProps = {
  routePath: StringProp,
  maxHeight: StringOrNumPropOpt,
  maxWidth: StringOrNumPropOpt,
  minHeight: StringOrNumPropOpt,
  border: BorderPropOpt,
  backgroundColor: ColorPropOpt
};

export const DynamicTabsComponent = (
  props: InferWidgetProps<typeof DynamicTabsProps>
): JSX.Element => {
  const history = useHistory();
  const currentUrlInfo = getUrlInfoFromHistory(history);
  const [childIndex, setIndex] = useState(0);

  const tabs = currentUrlInfo[props.routePath] ?? {};

  const children = Object.values(tabs).map((child, index) => (
    <EmbeddedDisplay
      position={new RelativePosition()}
      file={child?.filename || ""}
      filetype={child?.filetype || "json"}
      defaultProtocol="pva"
      macros={child?.macros}
      key={index}
    />
  ));

  return (
    <div>
      <div className={classes.Bar}>
        {Object.keys(tabs).map(
          (key, index): JSX.Element => (
            <button
              onClick={(): void => {
                setIndex(index);
              }}
              className={classes.Button}
              style={index === childIndex ? { borderStyle: "inset" } : {}}
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

export const DynamicTabsWidgetProps = {
  ...DynamicTabsProps,
  ...WidgetPropType
};

export const DynamicTabs = (
  props: InferWidgetProps<typeof DynamicTabsWidgetProps>
): JSX.Element => <Widget baseWidget={DynamicTabsComponent} {...props} />;

registerWidget(DynamicTabs, DynamicTabsProps, "dynamictabs");
