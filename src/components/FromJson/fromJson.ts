import { useState } from "react";
import {
  objectToComponent,
  AbsolutePositionDescription
} from "../Positioning/positioning";
import { MacroLabel } from "../Label/label";
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
