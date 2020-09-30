import React, { useContext, useState } from "react";

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
import {
  FileContext,
  FileDescription,
  fileDescEqual
} from "../../../fileContext";

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
  const [selectedTab, setSelectedTab] = useState<string>("");
  const [selectedTabExt, setSelectedTabExt] = useState<string>("");
  const [openTabs, setOpenTabs] = useState<[string, FileDescription][]>([]);
  const [name, locationFile] = fileContext.locations[props.location] ?? [
    "",
    undefined
  ];
  const tabJustOpened = name !== "" && selectedTabExt !== name;

  if (tabJustOpened) {
    setSelectedTab(name);
    setSelectedTabExt(name);
  }

  let matched = false;
  for (const [, tab] of openTabs) {
    if (fileDescEqual(locationFile, tab)) {
      matched = true;
    }
  }
  if (tabJustOpened && !matched && locationFile !== undefined) {
    const tabsCopy = openTabs.slice();
    tabsCopy.push([name, locationFile]);
    setOpenTabs(tabsCopy);
  }

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

  if (openTabs.length === 0) {
    return (
      <div style={{ border: "1px solid black", minHeight: "50px" }}>
        <h3>Dynamic tabs "{props.location}": no file loaded.</h3>
      </div>
    );
  } else {
    return (
      <div>
        <div className={classes.TabBar}>
          {openTabs.map(
            ([tabName, description], index): JSX.Element => (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between"
                }}
                className={classes.Tab}
                key={index}
              >
                <button
                  onClick={(): void => {
                    for (const [name1] of Object.values(openTabs)) {
                      if (name1 === tabName) {
                        setSelectedTab(tabName);
                      }
                    }
                  }}
                  className={
                    selectedTab === tabName
                      ? `${classes.Tab} ${classes.TabSelected}`
                      : classes.Tab
                  }
                >
                  {tabName}
                </button>
                <div
                  style={{
                    position: "relative",
                    width: "40px",
                    height: "100%",
                    flexShrink: 0
                  }}
                >
                  <button
                    style={{
                      color: "#ff3333",
                      backgroundColor: "#ffffff"
                    }}
                    onClick={(): void => {
                      const filteredTabs = openTabs.filter(([name, desc]) => {
                        return !fileDescEqual(description, desc);
                      });
                      setOpenTabs(filteredTabs);
                      // Keep the last tab open if there are any left
                      const lastTab = filteredTabs.slice(-1)[0];
                      setSelectedTab(lastTab ? lastTab[0] : "");
                    }}
                  >
                    X
                  </button>
                </div>
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
