/* A component to load files directly. */

import React, { useState, useContext } from "react";
import log from "loglevel";

import {
  WidgetDescription,
  widgetDescriptionToComponent
} from "../createComponent";
import { MacroMap } from "../../../redux/csState";
import { WidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import { StringProp, InferWidgetProps, ChoiceProp } from "../propTypes";
import { BaseUrlContext } from "../../../baseUrl";
import { Font, FontStyle } from "../../../types/font";
import { Color } from "../../../types/color";
import { parseOpi } from "./opiParser";
import { parseJson } from "./jsonParser";
import { RelativePosition, AbsolutePosition } from "../../../types/position";
import { parseBob } from "./bobParser";

const EMPTY_WIDGET: WidgetDescription = {
  type: "shape",
  position: new AbsolutePosition("0", "0", "0", "0")
};

const ERROR_WIDGET: WidgetDescription = {
  type: "label",
  position: new RelativePosition(),
  font: new Font(FontStyle.Bold, 16),
  backgroundColor: Color.RED,
  text: "Error"
};

const EmbeddedDisplayProps = {
  ...WidgetPropType,
  file: StringProp,
  filetype: ChoiceProp(["json", "bob", "opi"]),
  defaultProtocol: StringProp
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
    let description = EMPTY_WIDGET;
    if (contents !== "") {
      // Convert the contents to widget description style object
      switch (props.filetype) {
        case "bob":
          description = parseBob(contents, props.defaultProtocol);
          break;
        case "json":
          description = parseJson(contents, props.defaultProtocol);
          break;
        case "opi":
          description = parseOpi(contents, props.defaultProtocol);
          break;
      }
    }
    log.debug(description);

    // Apply the height to the top level if relative layout and none have been provided
    if (props.position instanceof RelativePosition) {
      props.position.height = props.position.height || description.height;
      props.position.width = props.position.width || description.width;
    }

    // Overflow set to scroll only if needed
    // If height or width is defined and is smaller than Bob
    const overflow =
      props.position instanceof AbsolutePosition &&
      (description.height > (props.position.height || 0) ||
        description.width > (props.position.width || 0))
        ? "scroll"
        : "visible";

    component = widgetDescriptionToComponent(
      {
        type: "display",
        position: props.position,
        border: props.border,
        overflow: overflow,
        children: [description]
      },
      props.macroMap
    );
  } catch (e) {
    log.error(`Error converting file ${file} into components:`);
    log.error(e);
    log.error(e.msg);
    log.error(e.details);
    component = widgetDescriptionToComponent(ERROR_WIDGET, props.macroMap);
  }

  return component;
};

registerWidget(EmbeddedDisplay, EmbeddedDisplayProps, "embeddedDisplay");
