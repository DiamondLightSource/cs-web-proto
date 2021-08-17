/* A component to load files directly. */

import React, { useContext } from "react";
import log from "loglevel";

import { errorWidget, widgetDescriptionToComponent } from "../createComponent";
import { Color } from "../../../types/color";
import { Border, BorderStyle } from "../../../types/border";
import {
  MacroContext,
  MacroContextType,
  resolveMacros
} from "../../../types/macros";
import { RelativePosition } from "../../../types/position";
import { WidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import {
  InferWidgetProps,
  FilePropType,
  BoolPropOpt,
  StringPropOpt
} from "../propTypes";
import { GroupBoxComponent } from "../GroupBox/groupBox";
import { useOpiFile } from "./useOpiFile";
import { useId } from "react-id-generator";

const EmbeddedDisplayProps = {
  ...WidgetPropType,
  file: FilePropType,
  name: StringPropOpt,
  scroll: BoolPropOpt
};

export const EmbeddedDisplay = (
  props: InferWidgetProps<typeof EmbeddedDisplayProps>
): JSX.Element => {
  const description = useOpiFile(props.file);
  const id = useId();

  log.debug(description);

  // Apply the height to the top level if relative layout and none have been provided
  if (props.position instanceof RelativePosition) {
    props.position.height = props.position.height || description.height;
    props.position.width = props.position.width || description.width;
  }

  // Apply the height to the top level if relative layout and none have been provided
  if (props.position instanceof RelativePosition) {
    props.position.height = props.position.height || description.height;
    props.position.width = props.position.width || description.width;
  }
  let component: JSX.Element;
  try {
    component = widgetDescriptionToComponent({
      type: "display",
      position: props.position,
      backgroundColor: new Color("rgb(200,200,200"),
      border:
        props.border ?? new Border(BorderStyle.Line, new Color("white"), 1),
      overflow: props.scroll ? "scroll" : "hidden",
      children: [description]
    });
  } catch (e) {
    const message = `Error loading ${props.file.path}: ${e}.`;
    log.warn(message);
    log.warn(e);
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
      ...embeddedDisplayMacros, // higher priority
      LCID: id.toString() // highest priority
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
        <GroupBoxComponent name={resolvedName} compat={true}>
          {component}
        </GroupBoxComponent>
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
