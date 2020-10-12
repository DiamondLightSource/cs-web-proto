import React, { CSSProperties, useContext } from "react";

import { Widget } from "../widget";
import { WidgetPropType } from "../widgetProps";
import {
  InferWidgetProps,
  StringProp,
  BoolPropOpt,
  StringPropOpt
} from "../propTypes";
import { registerWidget } from "../register";
import { BaseUrlContext } from "../../../baseUrl";

const SymbolProps = {
  src: StringProp,
  alt: StringPropOpt,
  fill: BoolPropOpt
};

export const SymbolComponent = (
  props: InferWidgetProps<typeof SymbolProps>
): JSX.Element => {
  const baseUrl = useContext(BaseUrlContext);
  let file = `img/${props.src}`;
  if (!file.startsWith("http")) {
    file = `${baseUrl}/${file}`;
  }
  let imageSize: any = undefined;
  let overflow = "auto";
  if (props.fill === true) {
    imageSize = "100%";
    overflow = "hidden";
  }

  const style: CSSProperties = {
    overflow: overflow,
    textAlign: "left"
  };

  return (
    <div style={style}>
      <img
        src={file}
        alt={props.alt || undefined}
        style={{
          height: imageSize,
          width: imageSize
        }}
      />
    </div>
  );
};

const SymbolWidgetProps = {
  ...SymbolProps,
  ...WidgetPropType
};

export const Symbol = (
  props: InferWidgetProps<typeof SymbolWidgetProps>
): JSX.Element => <Widget baseWidget={SymbolComponent} {...props} />;

registerWidget(Symbol, SymbolWidgetProps, "symbol");
