import React, { useState } from "react";
import log from "loglevel";

import {
  widgetDescriptionToComponent,
  WidgetDescription
} from "../Positioning/positioning";
import { MacroMap } from "../../redux/csState";
import { WidgetPropType } from "../Widget/widget";
import { widgets, registerWidget } from "../register";
import { StringProp, InferWidgetProps } from "../propTypes";

const EMPTY_WIDGET: WidgetDescription = {
  type: "empty",
  containerStyling: {
    position: "absolute",
    x: 0,
    y: 0,
    width: 0,
    height: 0
  }
};

const ERROR_WIDGET: WidgetDescription = {
  type: "label",
  containerStyling: { position: "relative" },
  widgetStyling: {
    fontWeight: "bold",
    backgroundColor: "red"
  },
  text: "Error"
};

const WidgetFromJsonProps = {
  file: StringProp,
  ...WidgetPropType
};

export const WidgetFromJson = (
  props: InferWidgetProps<typeof WidgetFromJsonProps>
): JSX.Element | null => {
  const [json, setJson] = useState<WidgetDescription>(EMPTY_WIDGET);
  const [renderedFile, setFile] = useState("");
  const [currentMacros, setMacros] = useState<MacroMap>({});

  // Extract props
  const { file, macroMap } = props;

  // Using directly from React for testing purposes
  React.useEffect((): (() => void) => {
    // Will be set on the first render
    let mounted = true;
    if (file !== renderedFile) {
      fetch(file)
        .then(
          (response): Promise<any> => {
            return response.json();
          }
        )
        .then((json): void => {
          // Check component is still mounted when result comes back
          if (mounted) {
            setJson(json);
            setFile(file);
            setMacros(macroMap as MacroMap);
          }
        });
    }

    // Clean up function
    return (): void => {
      mounted = false;
    };
  });

  if (macroMap !== currentMacros) {
    setMacros(macroMap as MacroMap);
  }

  const widgetDict = Object.assign(
    {},
    ...Object.entries(widgets).map(([k, v]): any => ({ [k]: v[0] }))
  );

  let component: JSX.Element | null;
  try {
    component = widgetDescriptionToComponent(json, widgetDict, currentMacros);
  } catch (e) {
    log.error(`Error converting JSON into components in ${file}`);
    log.error(e.msg);
    log.error(e.object);
    component = widgetDescriptionToComponent(
      ERROR_WIDGET,
      widgetDict,
      currentMacros
    );
  }

  return component;
};

registerWidget(WidgetFromJson, WidgetFromJsonProps, "widgetFromJSON");
