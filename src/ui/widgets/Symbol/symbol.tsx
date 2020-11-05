import React from "react";

import { useCommonCss, Widget } from "../widget";
import { PVWidgetPropType, PVComponent } from "../widgetProps";
import {
  InferWidgetProps,
  BoolPropOpt,
  StringPropOpt,
  ColorPropOpt,
  BoolProp,
  FloatPropOpt,
  BorderPropOpt,
  StringProp,
  ChoicePropOpt,
  FontPropOpt
} from "../propTypes";
import { registerWidget } from "../register";
import { ImageComponent } from "../Image/image";
import { LabelComponent } from "../Label/label";
import { Color } from "../../../types/color";

const SymbolProps = {
  src: StringProp,
  alt: StringPropOpt,
  backgroundColor: ColorPropOpt,
  showLabel: BoolProp,
  labelPosition: ChoicePropOpt([
    "top",
    "left",
    "center",
    "right",
    "bottom",
    "top left",
    "top right",
    "bottom left",
    "bottom right"
  ]),
  border: BorderPropOpt,
  value: FloatPropOpt,
  rotation: FloatPropOpt,
  flipHorizontal: BoolPropOpt,
  flipVertical: BoolPropOpt,
  visible: BoolPropOpt,
  stretchToFit: BoolPropOpt,
  fitToWidth: BoolPropOpt,
  fitToHeight: BoolPropOpt,
  font: FontPropOpt
};

export type SymbolComponentProps = InferWidgetProps<typeof SymbolProps> &
  PVComponent;

/**
 * This component combines the use of a svg with a label, and is used to replace
 * the MultistateMonitorWidget from CS-Studio
 * @param props
 */
export const SymbolComponent = (props: SymbolComponentProps): JSX.Element => {
  const style = useCommonCss(props as any);

  let alignItems = "center";
  let justifyContent = "center";
  switch (props.labelPosition) {
    case "top":
      alignItems = "start";
      break;
    case "right":
      justifyContent = "end";
      break;
    case "bottom":
      alignItems = "end";
      break;
    case "left":
      justifyContent = "start";
      break;
    case "top right":
      alignItems = "start";
      justifyContent = "end";
      break;
    case "bottom right":
      alignItems = "end";
      justifyContent = "end";
      break;
    case "bottom left":
      alignItems = "end";
      justifyContent = "start";
      break;
    case "top left":
      alignItems = "start";
      justifyContent = "start";
      break;
  }

  return (
    <>
      <ImageComponent {...props} />
      {props.showLabel && (
        <>
          <div
            style={{
              ...style,
              backgroundColor: "transparent",
              position: "absolute",
              height: "100%",
              width: "100%",
              top: 0,
              left: 0,
              display: "flex",
              alignItems,
              justifyContent
            }}
          >
            <div style={{ padding: "5%" }}>
              <LabelComponent
                {...props}
                backgroundColor={Color.TRANSPARENT}
                text={props.value?.getStringValue()}
              ></LabelComponent>
            </div>
          </div>
        </>
      )}
    </>
  );
};

const SymbolWidgetProps = {
  ...SymbolProps,
  ...PVWidgetPropType
};

export const Symbol = (
  props: InferWidgetProps<typeof SymbolWidgetProps>
): JSX.Element => <Widget baseWidget={SymbolComponent} {...props} />;

registerWidget(Symbol, SymbolWidgetProps, "symbol");
