import React, { useState, ReactElement } from "react";
import PropTypes from "prop-types";
import log from "loglevel";

import { Widget } from "../widget";
import { WidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import {
  ChoicePropOpt,
  InferWidgetProps,
  StringOrNumPropOpt,
  BorderPropOpt,
  ColorPropOpt,
  StringProp,
  MacrosProp
} from "../propTypes";
import { EmbeddedDisplay } from "../EmbeddedDisplay/embeddedDisplay";
import { RelativePosition } from "../../../types/position";

export const NavigationTabsProps = {
  tabs: PropTypes.objectOf(
    PropTypes.shape({
      filename: PropTypes.string.isRequired,
      filetype: PropTypes.oneOf(["bob", "opi", "json"]).isRequired,
      macros: MacrosProp
    })
  ).isRequired,
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

  console.log(props.tabs);

  console.log(childIndex);

  const children = Object.values(props.tabs).map((child) => (
    <EmbeddedDisplay
      position={new RelativePosition()}
      file={child?.filename || ""}
      filetype={child?.filetype || "json"}
      defaultProtocol="pva"
      macros={child?.macros}
    />
  ));

  return (
    <div>
      {Object.keys(props.tabs).map(
        (key, index): JSX.Element => (
          <button
            onClick={(): void => {
              setIndex(index);
            }}
            key={index}
          >
            {key}
          </button>
        )
      )}
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
