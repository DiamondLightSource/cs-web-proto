import React, { useState } from "react";
import PropTypes from "prop-types";
import log from "loglevel";

import { Widget } from "../widget";
import { WidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import {
  InferWidgetProps,
  StringOrNumPropOpt,
  BorderPropOpt,
  ColorPropOpt
} from "../propTypes";
import { errorWidget } from "../EmbeddedDisplay/embeddedDisplay";
import { parseJson } from "../EmbeddedDisplay/jsonParser";
import { widgetDescriptionToComponent } from "../createComponent";

import classes from "./navigationTabs.module.css";

export const TabContainerProps = {
  tabs: PropTypes.objectOf(PropTypes.object).isRequired,
  maxHeight: StringOrNumPropOpt,
  maxWidth: StringOrNumPropOpt,
  minHeight: StringOrNumPropOpt,
  border: BorderPropOpt,
  backgroundColor: ColorPropOpt
};

export const TabContainerComponent = (
  props: InferWidgetProps<typeof TabContainerProps>
): JSX.Element => {
  const [childIndex, setIndex] = useState(0);

  console.log(props.tabs);

  try {
    // TODO: Find out if this repeated calculation can be done in the useMemo hook for measurable performance gains
    const children = Object.values(props.tabs).map((child, index) =>
      widgetDescriptionToComponent(
        parseJson(JSON.stringify(child), "pva"),
        index
      )
    );

    return (
      <div>
        <div className={classes.Bar}>
          {Object.keys(props.tabs).map(
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
  } catch (e) {
    const message = `Error transforming children into components`;
    log.error(message);
    log.error(e);
    log.error(e.msg);
    log.error(e.details);
    return widgetDescriptionToComponent(errorWidget(message));
  }
};

export const TabContainerWidgetProps = {
  ...TabContainerProps,
  ...WidgetPropType
};

export const TabContainer = (
  props: InferWidgetProps<typeof TabContainerWidgetProps>
): JSX.Element => <Widget baseWidget={TabContainerComponent} {...props} />;

registerWidget(TabContainer, TabContainerProps, "tabcontainer");
