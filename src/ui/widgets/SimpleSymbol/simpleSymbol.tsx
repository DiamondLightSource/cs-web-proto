import React, { useContext } from "react";

import { Widget } from "../widget";
import { PVWidgetPropType, PVComponent } from "../widgetProps";
import {
  InferWidgetProps,
  BoolPropOpt,
  ColorPropOpt,
  FloatPropOpt,
  BorderPropOpt,
  StringProp,
  FontPropOpt,
  ActionsPropType,
  IntProp
} from "../propTypes";
import { registerWidget } from "../register";
import { executeActions, WidgetActions } from "../widgetActions";
import { MacroContext } from "../../../types/macros";
import { FileContext } from "../../../fileContext";

const SimpleSymbolProps = {
  imageFile: StringProp,
  imageIndex: IntProp,
  width: IntProp,
  height: IntProp,
  backgroundColor: ColorPropOpt,
  border: BorderPropOpt,
  rotation: FloatPropOpt,
  visible: BoolPropOpt,
  stretchToFit: BoolPropOpt,
  actions: ActionsPropType,
  font: FontPropOpt
};

export type SimpleSymbolComponentProps = InferWidgetProps<
  typeof SimpleSymbolProps
> &
  PVComponent;

/* Simple widget that copies the EdmSymbol widget: use an image file with
   all show the nth segment
   of an image file.
*/
export const SimpleSymbolComponent = (
  props: SimpleSymbolComponentProps
): JSX.Element => {
  const files = useContext(FileContext);
  const parentMacros = useContext(MacroContext).macros;
  function onClick(event: React.MouseEvent<HTMLDivElement>): void {
    if (props.actions !== undefined) {
      executeActions(props.actions as WidgetActions, files, parentMacros);
    }
  }
  // Render the imageIndex-th part of the larger png.
  const left = props.width * props.imageIndex;
  const right = props.width * (props.imageIndex + 1);
  const clip = `rect(0 ${right}px ${props.height}px ${left}px)`;
  const margin = `0 -${left}px 0 -${left}px`;

  return (
    <img
      src={props.imageFile}
      alt="Simple symbol widget"
      onClick={onClick}
      style={{
        width: `${props.width}px}`,
        height: `${props.height}px`,
        display: "block",
        position: "absolute",
        clip,
        margin
      }}
    />
  );
};

const SimpleSymbolWidgetProps = {
  ...SimpleSymbolProps,
  ...PVWidgetPropType
};

export const SimpleSymbol = (
  props: InferWidgetProps<typeof SimpleSymbolWidgetProps>
): JSX.Element => <Widget baseWidget={SimpleSymbolComponent} {...props} />;

registerWidget(SimpleSymbol, SimpleSymbolWidgetProps, "pngsymbol");
