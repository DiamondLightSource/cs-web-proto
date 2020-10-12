import React, { CSSProperties, useContext } from "react";

import { Widget } from "../widget";
import { WidgetPropType } from "../widgetProps";
import {
  InferWidgetProps,
  StringProp,
  BoolPropOpt,
  StringPropOpt,
  ColorPropOpt
} from "../propTypes";
import { registerWidget } from "../register";
import { BaseUrlContext } from "../../../baseUrl";

const ImageProps = {
  src: StringPropOpt,
  alt: StringPropOpt,
  fill: BoolPropOpt,
  backgroundColor: ColorPropOpt
};

export const ImageComponent = (
  props: InferWidgetProps<typeof ImageProps>
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
          width: imageSize,
          backgroundColor: props.backgroundColor?.rgbaString()
        }}
      />
    </div>
  );
};

const ImageWidgetProps = {
  ...ImageProps,
  ...WidgetPropType
};

export const Image = (
  props: InferWidgetProps<typeof ImageWidgetProps>
): JSX.Element => <Widget baseWidget={ImageComponent} {...props} />;

registerWidget(Image, ImageWidgetProps, "image");
