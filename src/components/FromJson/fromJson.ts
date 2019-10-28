import { useState } from "react";
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
import { MacroMap } from "../../redux/csState";
import { Display } from "../Display/display";
import { BaseWidgetInterface } from "../Widget/widget";

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

interface WidgetFromJsonProps extends BaseWidgetInterface {
  file: string;
  macroMap: MacroMap;
}

export const WidgetFromJson = (
  props: WidgetFromJsonProps
): JSX.Element | null => {
  const [json, setJson] = useState<WidgetDescription>(EMPTY_WIDGET);

  if (json["type"] === "empty") {
    fetch(props.file)
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
    component = widgetDescriptionToComponent(json, widgetDict, props.macroMap);
  } catch (e) {
    log.error(`Error converting JSON into components in ${props.file}`);
    log.error(e.msg);
    log.error(e.object);
    component = widgetDescriptionToComponent(
      ERROR_WIDGET,
      widgetDict,
      props.macroMap
    );
  }

  return component;
};
