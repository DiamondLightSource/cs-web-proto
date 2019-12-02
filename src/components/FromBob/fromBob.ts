/* Provide the same component as fromJson but converting bob files and
providing a useful widget dictionary */

import { useState } from "react";
import PropTypes from "prop-types";
import log from "loglevel";

import {
  WidgetDescription,
  widgetDescriptionToComponent
} from "../Positioning/positioning";
import { Label } from "../Label/label";
import { Readback } from "../Readback/readback";
import { Input } from "../Input/input";
import { Display } from "../Display/display";
import { Shape } from "../Shape/shape";
import { GroupingContainer } from "../GroupingContainer/groupingContainer";
import { WidgetPropType, InferWidgetProps } from "../Widget/widget";
import {
  bobAvoidStyleProp,
  bobBackgroundColor,
  bobForegroundColor,
  bobHandleActions,
  bobMacrosToMacroMap,
  bobPrecisionToNumber,
  bobVisibleToBoolean,
  bobTransparentToBoolean,
  convertBobToWidgetDescription
} from "./bobConversionUtils";

const EMPTY_WIDGET: WidgetDescription = {
  type: "empty",
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

const WidgetFromBobProps = {
  file: PropTypes.string.isRequired,
  ...WidgetPropType
};

export const WidgetFromBob = (
  props: InferWidgetProps<typeof WidgetFromBobProps>
): JSX.Element => {
  const [bob, setBob] = useState<string>("");

  // Extract props
  let { file, macroMap } = props;

  if (bob === "") {
    fetch(file)
      .then(
        (response): Promise<any> => {
          return response.text();
        }
      )
      .then((bob): void => {
        setBob(bob);
      });
  }
  const widgetDict = {
    textupdate: Readback,
    "org.csstudio.opibuilder.widgets.TextUpdate": Readback,
    textentry: Input,
    "org.csstudio.opibuilder.widgets.TextInput": Input,
    label: Label,
    "org.csstudio.opibuilder.widgets.Label": Label,
    group: GroupingContainer,
    "org.csstudio.opibuilder.widgets.groupingContainer": GroupingContainer,
    display: Display,
    rectangle: Shape,
    "org.csstudio.opibuilder.widgets.Rectangle": Shape,
    empty: Display,
    widgetFromBob: WidgetFromBob
  };

  const functionSubstitutions = {
    macros: bobMacrosToMacroMap,
    background_color: bobBackgroundColor, // eslint-disable-line @typescript-eslint/camelcase
    foreground_color: bobForegroundColor, // eslint-disable-line @typescript-eslint/camelcase
    precision: bobPrecisionToNumber,
    visible: bobVisibleToBoolean,
    transparent: bobTransparentToBoolean,
    style: bobAvoidStyleProp,
    actions: bobHandleActions
  };

  const keySubstitutions = {
    pv_name: "pvName" // eslint-disable-line @typescript-eslint/camelcase
  };

  let component: JSX.Element;
  try {
    let bobDescription;
    if (bob === "") {
      bobDescription = EMPTY_WIDGET;
    } else {
      // Convert the bob to widget description style object
      bobDescription = convertBobToWidgetDescription(
        bob,
        functionSubstitutions,
        keySubstitutions
      );
    }
    log.info(bobDescription);

    // Apply the Bob height to the top level if relative layout and none have been provided
    if (props.containerStyling.position === "relative") {
      props.containerStyling.height =
        props.containerStyling.height || bobDescription.height;
      props.containerStyling.width =
        props.containerStyling.width || bobDescription.width;
    }

    // Overflow set to scroll only if needed
    // If height or width is defined and is smaller than Bob
    const overflow =
      props.containerStyling.position === "absolute" &&
      (bobDescription.height > (props.containerStyling.height || 0) ||
        bobDescription.width > (props.containerStyling.width || 0))
        ? "scroll"
        : "visible";

    component = widgetDescriptionToComponent(
      {
        type: "display",
        containerStyling: props.containerStyling,
        widgetStyling: props.widgetStyling,
        overflow: overflow,
        children: [bobDescription]
      },
      widgetDict,
      macroMap
    );
  } catch (e) {
    log.error(`Error converting Bob into components in ${file}`);
    log.error(e.msg);
    log.error(e.object);
    component = widgetDescriptionToComponent(
      ERROR_WIDGET,
      widgetDict,
      macroMap
    );
  }

  return component;
};

WidgetFromBob.propTypes = WidgetFromBobProps;
