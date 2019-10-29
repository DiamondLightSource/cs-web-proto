import { useState } from "react";
import PropTypes from "prop-types";
import log from "loglevel";

import {
  widgetDescriptionToComponent,
  WidgetDescription
} from "../Positioning/positioning";
import { Label } from "../Label/label";
import { Readback } from "../Readback/readback";
import { Input } from "../Input/input";
import { FlexContainer } from "../FlexContainer/flexContainer";
import { ProgressBar } from "../ProgressBar/progressBar";
import { SlideControl } from "../SlideControl/slideControl";
import { MenuButton } from "../MenuButton/menuButton";
import { MacroMap } from "../Widget/widget";
import { Display } from "../Display/display";
import { WidgetProps } from "../Widget/widget";
import { RequiredMacroMapProps } from "../Widget/widgetprops";

const EMPTY_WIDGET: WidgetDescription = {
  type: "empty",
  containerStyling: { position: "absolute", x: 0, y: 0, width: 0, height: 0 }
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

type RequiredMacroMap = PropTypes.InferProps<typeof RequiredMacroMapProps>;

type WidgetFromJsonProps = WidgetProps &
  RequiredMacroMap & {
    file: string;
  };

export const WidgetFromJson = (
  props: WidgetFromJsonProps
): JSX.Element | null => {
  const [json, setJson] = useState<WidgetDescription>(EMPTY_WIDGET);

  // Extract props
  let { file, macroMap } = props;

  if (json["type"] === "empty") {
    fetch(file)
      .then(
        (response): Promise<any> => {
          return response.json();
        }
      )
      .then((json): void => {
        setJson(json);
      });
  }
  const widgetDict = {
    readback: Readback,
    input: Input,
    label: Label,
    progressbar: ProgressBar,
    slidecontrol: SlideControl,
    menubutton: MenuButton,
    flexcontainer: FlexContainer,
    display: Display,
    empty: Display,
    widgetFromJSON: WidgetFromJson
  };

  let component: JSX.Element | null;
  try {
    component = widgetDescriptionToComponent(json, widgetDict, macroMap);
  } catch (e) {
    log.error(`Error converting JSON into components in ${file}`);
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
