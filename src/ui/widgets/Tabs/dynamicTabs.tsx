/**
 * A widget that shows files stored in the file context
 * under a specific 'location'.
 *
 * As the files are stored centrally, closing a tab in one such
 * widget will close it in other widgets showing the same location.
 *
 * See also the tab container widget and the dynamic page widget.
 */
import React, { useContext } from "react";

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

import { FileContext } from "../../../fileContext";
import { TabBar } from "./tabs";

export const DynamicTabsProps = {
  location: StringProp,
  maxHeight: StringOrNumPropOpt,
  maxWidth: StringOrNumPropOpt,
  minHeight: StringOrNumPropOpt,
  border: BorderPropOpt,
  backgroundColor: ColorPropOpt
};

export const DynamicTabsComponent = (
  props: InferWidgetProps<typeof DynamicTabsProps>
): JSX.Element => {
  const fileContext = useContext(FileContext);
  const tabState = fileContext.tabState[props.location];
  const containerStyle = {
    border: "1px solid lightgrey",
    height: "100%",
    width: "100%",
    overflow: "auto"
  };
  if (!tabState || tabState.fileDetails.length === 0) {
    return (
      <div style={containerStyle}>
        <h3>Dynamic tabs &quot;{props.location}&quot;: no file loaded.</h3>
      </div>
    );
  } else {
    const openTabs = tabState.fileDetails;
    const selectedTab = tabState.selectedTab;

    const children = Object.values(openTabs).map(([name, description]) => [
      <EmbeddedDisplay
        position={new RelativePosition()}
        file={{
          path: description?.path || "",
          defaultProtocol: description?.defaultProtocol ?? "ca",
          macros: description?.macros || {}
        }}
        key={name}
        scroll={false}
      />
    ]);
    const tabNames = openTabs.map(([name]) => name);
    const onTabSelected = (index: number): void => {
      fileContext.selectTab(props.location, index);
    };
    const onTabClosed = (index: number): void => {
      const [tabName, fileDesc] = openTabs[index];
      fileContext.removeTab(props.location, tabName, fileDesc);
    };

    return (
      <div style={containerStyle}>
        <TabBar
          tabNames={tabNames}
          selectedTab={selectedTab}
          onTabSelected={onTabSelected}
          onTabClosed={onTabClosed}
        ></TabBar>
        {children[selectedTab]}
      </div>
    );
  }
};

export const DynamicTabsWidgetProps = {
  ...DynamicTabsProps,
  ...WidgetPropType
};

export const DynamicTabs = (
  props: InferWidgetProps<typeof DynamicTabsWidgetProps>
): JSX.Element => <Widget baseWidget={DynamicTabsComponent} {...props} />;

registerWidget(DynamicTabs, DynamicTabsProps, "dynamictabs");
