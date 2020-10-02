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

import classes from "./tabs.module.css";
import { FileContext } from "../../../fileContext";
import { BaseUrlContext } from "../../../baseUrl";

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
  const baseUrl = useContext(BaseUrlContext);
  if (!fileContext.tabState[props.location]) {
    return (
      <div style={{ border: "1px solid black", minHeight: "50px" }}>
        <h3>Dynamic tabs &quot;{props.location}&quot;: no file loaded.</h3>
      </div>
    );
  } else {
    const openTabs = fileContext.tabState[props.location].fileDetails;
    const selectedTab = fileContext.tabState[props.location].selectedTab;

    // Using object map method found here: https://stackoverflow.com/questions/14810506/map-function-for-objects-instead-of-arrays
    const children = Object.fromEntries(
      Object.values(openTabs).map(([name, description]) => [
        name,
        <EmbeddedDisplay
          position={new RelativePosition()}
          file={{
            path: description?.path || "",
            type: description?.type || "json",
            defaultProtocol: description?.defaultProtocol ?? "ca",
            macros: description?.macros || {}
          }}
          key={name}
        />
      ])
    );

    return (
      <div>
        <div className={classes.TabBar}>
          {openTabs.map(
            ([tabName, description], index): JSX.Element => (
              <div
                key={index}
                onClick={(): void => {
                  fileContext.selectTab(props.location, tabName);
                }}
                className={
                  selectedTab === tabName
                    ? `${classes.Tab} ${classes.CloseableTab} ${classes.TabSelected}`
                    : `${classes.Tab} ${classes.CloseableTab}`
                }
              >
                <p className={classes.CloseableTabText}>{tabName}</p>
                <button
                  className={classes.TabCloseButton}
                  onClick={(event): void => {
                    fileContext.removeTab(props.location, description);
                    event.stopPropagation();
                  }}
                >
                  <img
                    style={{ height: "15px", display: "block" }}
                    src={`${baseUrl}/img/x.png`}
                    alt="Close tab"
                  ></img>
                </button>
              </div>
            )
          )}
        </div>
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
