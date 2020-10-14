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

import { TabBar } from "./tabs";

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
        defaultProtocol: "pva",
        macros: child?.macros || {}
      }}
      key={index}
    />
  ));
  const tabNames = Object.keys(props.tabs);
  const onTabSelected = (tabName: string): void => {
    setIndex(tabNames.indexOf(tabName));
  };

  return (
    <div>
      <TabBar
        tabNames={tabNames}
        selectedTab={tabNames[childIndex]}
        onTabSelected={onTabSelected}
      ></TabBar>
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
