import { useState } from "react";
import {
  objectToComponent,
  AbsolutePositionDescription,
  widgetDescriptionToComponent,
  WidgetDescription
} from "../Positioning/positioning";
import { MacroLabel, LabelWidget } from "../Label/label";
import { Blank } from "../Positioning/ionpExample";
import {
  ConnectedReadback,
  ConnectedCopyReadback,
  ConnectedStandaloneReadback,
  ConnectedReadbackWidget
} from "../Readback/readback";
import { ConnectedInput, ConnectedStandaloneInput } from "../Input/input";
import { FlexContainer } from "../FlexContainer/flexContainer";
import { MacroMap } from "../../redux/csState";
import { Display } from "../Display/display";

interface FromJsonProps {
  file: string;
  macroMap: MacroMap;
}

const EMPTY_DESC = {
  type: "empty",
  x: 0,
  y: 0,
  width: 0,
  height: 0
};

export const FromJson = (props: FromJsonProps): JSX.Element | null => {
  const [json, setJson] = useState<AbsolutePositionDescription>(EMPTY_DESC);

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
  const compDict = {
    blank: Blank,
    empty: Blank,
    label: MacroLabel,
    readback: ConnectedStandaloneReadback,
    connectedReadback: ConnectedReadback,
    connectedReadbackWidget: ConnectedReadbackWidget,
    connectedCopyReadback: ConnectedCopyReadback,
    input: ConnectedInput,
    connectedStandaloneInput: ConnectedStandaloneInput,
    flexContainer: FlexContainer,
    fromJSON: FromJson
  };

  return objectToComponent(json, compDict, props.macroMap);
};

const EMPTY_WIDGET: WidgetDescription = {
  type: "empty",
  containerStyling: { position: "absolute", x: 0, y: 0, width: 0, height: 0 }
};

export const WidgetFromJson = (props: FromJsonProps): JSX.Element | null => {
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
  console.log(json);
  const widgetDict = {
    readback: ConnectedReadbackWidget,
    label: LabelWidget,
    display: Display,
    empty: Display,
    widgetFromJSON: WidgetFromJson
  };

  return widgetDescriptionToComponent(json, widgetDict, props.macroMap);
};
