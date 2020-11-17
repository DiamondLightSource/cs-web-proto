/* A component to load files directly. */

import React, { useEffect, useState, useContext } from "react";
import log from "loglevel";

import {
  WidgetDescription,
  widgetDescriptionToComponent
} from "../createComponent";
import { Color } from "../../../types/color";
import { Border, BorderStyle } from "../../../types/border";
import { Font, FontStyle } from "../../../types/font";
import {
  MacroContext,
  MacroContextType,
  resolveMacros
} from "../../../types/macros";
import { RelativePosition, AbsolutePosition } from "../../../types/position";
import { WidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import {
  InferWidgetProps,
  FilePropType,
  BoolPropOpt,
  StringPropOpt
} from "../propTypes";
import { BaseUrlContext } from "../../../baseUrl";
import { parseOpi } from "./opiParser";
import { parseJson } from "./jsonParser";
import { parseBob } from "./bobParser";
import { GroupBoxComponent } from "../GroupBox/groupBox";

const EMPTY_WIDGET: WidgetDescription = {
  type: "shape",
  position: new AbsolutePosition("0", "0", "0", "0")
};

const ERROR_WIDGET: WidgetDescription = {
  type: "label",
  position: new RelativePosition(),
  font: new Font(16, FontStyle.Bold),
  backgroundColor: Color.RED,
  text: "Error"
};

export function errorWidget(message: string): WidgetDescription {
  return {
    ...ERROR_WIDGET,
    text: message
  };
}

const EmbeddedDisplayProps = {
  ...WidgetPropType,
  file: FilePropType,
  name: StringPropOpt,
  scroll: BoolPropOpt
};

export const EmbeddedDisplay = (
  props: InferWidgetProps<typeof EmbeddedDisplayProps>
): JSX.Element => {
  const [contents, setContents] = useState<string>("");
  const baseUrl = useContext(BaseUrlContext);
  const fileExt = props.file.path.split(".").pop();

  let file: string;
  if (!props.file.path.startsWith("http")) {
    file = `${baseUrl}/${fileExt}/${props.file.path}`;
  } else {
    file = props.file.path;
  }

  useEffect((): (() => void) => {
    // Will be set on the first render
    let mounted = true;
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
        }
      });

    // Clean up function
    return (): void => {
      mounted = false;
    };
  }, [file]);

  let component: JSX.Element;
  try {
    let description = EMPTY_WIDGET;
    if (contents !== "") {
      // Convert the contents to widget description style object
      switch (fileExt) {
        case "bob":
          description = parseBob(contents, props.file.defaultProtocol);
          break;
        case "json":
          description = parseJson(contents, props.file.defaultProtocol);
          break;
        case "opi":
          description = parseOpi(contents, props.file.defaultProtocol);
          break;
      }
    }
    log.debug(description);

    // Apply the height to the top level if relative layout and none have been provided
    if (props.position instanceof RelativePosition) {
      props.position.height = props.position.height || description.height;
      props.position.width = props.position.width || description.width;
    }

    component = widgetDescriptionToComponent({
      type: "display",
      position: props.position,
      border:
        props.border ?? new Border(BorderStyle.Line, new Color("lightgrey"), 1),
      overflow: props.scroll ? "scroll" : "visible",
      children: [description]
    });
  } catch (e) {
    const message = `Error converting file ${file} into components.`;
    log.warn(message);
    log.warn(e);
    log.warn(e.msg);
    log.warn(e.details);
    component = widgetDescriptionToComponent(errorWidget(message));
  }

  // Include and override parent macros with those from the prop.
  const parentMacros = useContext(MacroContext).macros;
  const embeddedDisplayMacros = props.file.macros ?? {};
  const embeddedDisplayMacroContext: MacroContextType = {
    // Currently not allowing changing the macros of an embedded display.
    updateMacro: (key: string, value: string): void => {},
    macros: {
      ...parentMacros, // lower priority
      ...embeddedDisplayMacros // higher priority
    }
  };

  // Awkward to have to do this manually. Can we make this more elegant?
  const resolvedName = resolveMacros(
    props.name ?? "",
    embeddedDisplayMacroContext.macros
  );

  if (props.border?.style === BorderStyle.GroupBox) {
    return (
      <MacroContext.Provider value={embeddedDisplayMacroContext}>
        <GroupBoxComponent name={resolvedName}>{component}</GroupBoxComponent>
      </MacroContext.Provider>
    );
  } else {
    return (
      <MacroContext.Provider value={embeddedDisplayMacroContext}>
        {component}
      </MacroContext.Provider>
    );
  }
};

registerWidget(EmbeddedDisplay, EmbeddedDisplayProps, "embeddedDisplay");
