import { useState } from "react";
import {
  widgetDescriptionToComponent,
  WidgetDescription
} from "../Positioning/positioning";
import { LabelWidget } from "../Label/label";
import { ConnectedReadbackWidget } from "../Readback/readback";
import { ConnectedInputWidget } from "../Input/input";
import { FlexContainerWidget } from "../FlexContainer/flexContainer";
import { ConnectedProgressBarWidget } from "../ProgressBar/progressBar";
import { ConnectedSlideControlWidget } from "../SlideControl/slideControl";
import { MenuButton } from "../MenuButton/menuButton";
import { MacroMap } from "../../redux/csState";
import { Display } from "../Display/display";
import { BaseWidgetInterface } from "../Widget/widget";

const EMPTY_WIDGET: WidgetDescription = {
  type: "empty",
  containerStyling: { position: "absolute", x: 0, y: 0, width: 0, height: 0 }
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
    readback: ConnectedReadbackWidget,
    input: ConnectedInputWidget,
    label: LabelWidget,
    progressbar: ConnectedProgressBarWidget,
    slidecontrol: ConnectedSlideControlWidget,
    menubutton: MenuButton,
    flexcontainer: FlexContainerWidget,
    display: Display,
    empty: Display,
    widgetFromJSON: WidgetFromJson
  };

  return widgetDescriptionToComponent(json, widgetDict, props.macroMap);
};
