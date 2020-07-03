import React, { useState, useEffect } from "react";

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
import { ActionButton } from "../ActionButton/actionButton";
import { CLOSE_TAB } from "../widgetActions";
import { Color } from "../../../types/color";

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
  const [activeTab, setActiveTab] = useState("");
  const [tabNumber, setTabNumber] = useState(0);

  const tabs = currentUrlInfo[props.routePath] ?? {};

  // Using obect map method found here: https://stackoverflow.com/questions/14810506/map-function-for-objects-instead-of-arrays
  const children = Object.fromEntries(
    Object.entries(tabs).map(([key, child]) => [
      key,
      <EmbeddedDisplay
        position={new RelativePosition()}
        file={{
          path: child?.path + `.${child?.type}` || "",
          type: child?.type || "json",
          defaultProtocol: child?.defaultProtocol ?? "ca",
          macros: child?.macros || {}
        }}
        key={key}
      />
    ])
  );

  useEffect(() => {
    // If a new key has been added
    if (tabNumber < Object.keys(children).length) {
      // Open the new tab
      setActiveTab(Object.keys(children).slice(-1)[0]);
    }
    // Else if a key has been removed
    else if (tabNumber > Object.keys(children).length) {
      // If the active tab is still around, keep it open
      // Otherwise open the "last" tab
      setActiveTab(
        children[activeTab] ? activeTab : Object.keys(children).slice(-1)[0]
      );
    }

    setTabNumber(Object.keys(children).length);
  }, [children, activeTab, tabNumber]);

  return (
    <div>
      <div className={classes.Bar}>
        {Object.entries(tabs).map(
          ([key, child]): JSX.Element => (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between"
              }}
              className={classes.Button}
              key={key}
            >
              <button
                onClick={(): void => {
                  setActiveTab(key);
                }}
                style={{
                  borderStyle: activeTab === key ? "inset" : "",
                  flexGrow: 1,
                  fontSize: "2rem",
                  fontWeight: "bold"
                }}
              >
                {key}
              </button>
              <div
                style={{
                  position: "relative",
                  width: "40px",
                  height: "100%",
                  flexShrink: 0
                }}
              >
                <ActionButton
                  position={new RelativePosition("100%", "100%")}
                  backgroundColor={Color.parse("#ff3333")}
                  foregroundColor={Color.parse("#ffffff")}
                  actions={{
                    executeAsOne: false,
                    actions: [
                      {
                        type: CLOSE_TAB,
                        dynamicInfo: {
                          location: props.routePath,
                          name: key,
                          file: child.file
                        }
                      }
                    ]
                  }}
                  text="X"
                />
              </div>
            </div>
          )
        )}
      </div>
      {children[activeTab]}
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
