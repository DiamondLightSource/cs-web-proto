/**
 * A widget that displays widgets in a number of pre-defined
 * tabs.
 *
 * Previously we had a 'navigation tabs' widget that displayed
 * an embedded display in each tab, but that is easy to recreate
 * with this widget if needed.
 *
 * See also the dynamic tabs widget.
 */
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
import { parseObject } from "../EmbeddedDisplay/jsonParser";
import { errorWidget, widgetDescriptionToComponent } from "../createComponent";

import { TabBar } from "./tabs";

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

  // TODO: Find out if this repeated calculation can be done in the useMemo hook for measurable performance gains
  const children = Object.values(props.tabs).map((child, index) => {
    try {
      const childObject = parseObject(child, "ca");
      childObject["scroll"] = true;
      return widgetDescriptionToComponent(childObject, index);
    } catch (e) {
      const message = `Error transforming children into components`;
      log.warn(message);
      log.warn(e);
      return widgetDescriptionToComponent(errorWidget(message), index);
    }
  });

  const tabNames = Object.keys(props.tabs);
  const onTabSelected = (index: number): void => {
    setIndex(index);
  };

  return (
    <div>
      <TabBar
        tabNames={tabNames}
        selectedTab={childIndex}
        onTabSelected={onTabSelected}
      ></TabBar>
      {children[childIndex]}
    </div>
  );
};

export const TabContainerWidgetProps = {
  ...TabContainerProps,
  ...WidgetPropType
};

export const TabContainer = (
  props: InferWidgetProps<typeof TabContainerWidgetProps>
): JSX.Element => <Widget baseWidget={TabContainerComponent} {...props} />;

registerWidget(TabContainer, TabContainerProps, "tabcontainer");
