/* A component to load files directly. */

import React, { useState, useContext } from "react";
import log from "loglevel";

import {
  WidgetDescription,
  widgetDescriptionToComponent
} from "../createComponent";
import { MacroMap } from "../../../redux/csState";
import { WidgetPropType } from "../widget";
import { bobToWidgets } from "./bobUtils";
import { opiToWidgets } from "./opiUtils";
import { registerWidget } from "../register";
import { StringProp, InferWidgetProps, ChoiceProp } from "../propTypes";
import { BaseUrlContext } from "../../../baseUrl";

const EMPTY_WIDGET: WidgetDescription = {
  type: "shape",
  position: "absolute",
  x: 0,
  y: 0,
  width: 0,
  height: 0
};

const ERROR_WIDGET: WidgetDescription = {
  type: "label",
  position: "relative",
  fontWeight: "bold",
  backgroundColor: "red",
  text: "Error"
};

const EmbeddedDisplayProps = {
  ...WidgetPropType,
  file: StringProp,
  filetype: ChoiceProp(["json", "bob", "opi"])
};

export const EmbeddedDisplay = (
  props: InferWidgetProps<typeof EmbeddedDisplayProps>
): JSX.Element => {
  const [contents, setContents] = useState<string>("");
  const [renderedFile, setFile] = useState("");
  const [currentMacros, setMacros] = useState<MacroMap>({});
  const baseUrl = useContext(BaseUrlContext);

  let file: string;
  if (!props.file.startsWith("http")) {
    file = `${baseUrl}/${props.filetype}/${props.file}`;
  } else {
    file = props.file;
  }

  // Using directly from React for testing purposes
  React.useEffect((): (() => void) => {
    // Will be set on the first render
    let mounted = true;
    if (file !== renderedFile) {
      fetch(file)
        .then(
          (response): Promise<any> => {
            return response.text();
          }
        )
        .then((text): void => {
          // Check component is still mounted when result comes back
          if (mounted) {
            setContents(text);
            setFile(file);
            setMacros(props.macroMap as MacroMap);
          }
        });
    }

    // Clean up function
    return (): void => {
      mounted = false;
    };
  });

  if (props.macroMap !== currentMacros) {
    setMacros(props.macroMap as MacroMap);
  }

  let component: JSX.Element;
  try {
    let description;
    if (contents === "") {
      description = EMPTY_WIDGET;
    } else {
      // Convert the contents to widget description style object
      switch (props.filetype) {
        case "bob":
          description = bobToWidgets(contents);
          break;
        case "json":
          description = JSON.parse(contents);
          break;
        case "opi":
          description = opiToWidgets(contents);
          break;
      }
    }
    log.info(description);

    // Apply the height to the top level if relative layout and none have been provided
    if (props.containerStyling.position === "relative") {
      props.containerStyling.height =
        props.containerStyling.height || description.height;
      props.containerStyling.width =
        props.containerStyling.width || description.width;
    }

    // Overflow set to scroll only if needed
    // If height or width is defined and is smaller than Bob
    const overflow =
      props.containerStyling.position === "absolute" &&
      (description.height > (props.containerStyling.height || 0) ||
        description.width > (props.containerStyling.width || 0))
        ? "scroll"
        : "visible";

    component = widgetDescriptionToComponent(
      {
        type: "display",
        containerStyling: props.containerStyling,
        widgetStyling: props.widgetStyling,
        overflow: overflow,
        children: [description]
      },
      props.macroMap
    );
  } catch (e) {
    log.error(`Error converting file ${file} into components:`);
    log.error(e);
    log.error(e.msg);
    log.error(e.object);
    component = widgetDescriptionToComponent(ERROR_WIDGET, props.macroMap);
  }

  return component;
};

registerWidget(EmbeddedDisplay, EmbeddedDisplayProps, "embeddedDisplay");