import React, { useContext } from "react";

import { Widget } from "../widget";
import { PVWidgetPropType, PVComponent } from "../widgetProps";
import {
  InferWidgetProps,
  BoolPropOpt,
  StringPropOpt,
  ColorPropOpt,
  PositionProp,
  BoolProp,
  FloatPropOpt
} from "../propTypes";
import { registerWidget } from "../register";
import { LabelComponent } from "../Label/label";
import { BaseUrlContext } from "../../../baseUrl";
import { Color } from "../../../types/color";

const SvgImageProps = {
  src: StringPropOpt,
  width: FloatPropOpt,
  height: FloatPropOpt,
  showLabel: BoolProp
};

// TODO: There is probably some room to merge the existing image component
// together with this, would prefer to see how the pages look and to check
// all properties are accounted for before doing this
/**
 * A component for loading SVG files
 * @param props
 */
const SvgImageComponent = (
  props: InferWidgetProps<typeof SvgImageProps>
): JSX.Element => {
  const baseUrl = useContext(BaseUrlContext);
  let file = `img/${props.src}`;
  if (!file.startsWith("http")) {
    file = `${baseUrl}/${file}`;
  }

  const style: any = {};
  if (!props.showLabel) {
    style.width = `${props.width}px`;
    style.height = `${props.height}px`;
  }

  return (
    <div style={{ backgroundColor: "transparent" }}>
      <img src={file} alt={""} style={style} />
    </div>
  );
};

const SymbolProps = {
  src: StringPropOpt,
  alt: StringPropOpt,
  fill: BoolPropOpt,
  name: StringPropOpt,
  backgroundColor: ColorPropOpt,
  position: PositionProp,
  showLabel: BoolProp,
  width: FloatPropOpt,
  height: FloatPropOpt
};

export type SymbolComponentProps = InferWidgetProps<typeof SymbolProps> &
  PVComponent;

/**
 * This component combines the use of a svg with a label, and is used to replace
 * the MultistateMonitorWidget from CS-Studio
 * @param props
 */
export const SymbolComponent = (props: SymbolComponentProps): JSX.Element => {
  const { name, showLabel } = props;

  const background = props.backgroundColor || Color.WHITE;

  return (
    <div
      style={{
        backgroundColor: "transparent"
      }}
    >
      <SvgImageComponent {...props} />
      {showLabel && (
        <LabelComponent
          {...{ visible: true, backgroundColor: background }}
          text={name || ""}
        />
      )}
    </div>
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
