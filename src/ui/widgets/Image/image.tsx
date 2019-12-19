import React, { CSSProperties, useContext } from "react";

import { Component, Widget, WidgetPropType } from "../widget";
import {
  InferWidgetProps,
  StringProp,
  BoolPropOpt,
  StringPropOpt
} from "../propTypes";
import { registerWidget } from "../register";
import { BaseUrlContext } from "../../../baseUrl";

const ImageProps = {
  src: StringProp,
  alt: StringPropOpt,
  fill: BoolPropOpt
};

export const ImageComponent = (
  props: InferWidgetProps<typeof ImageProps> & Component
): JSX.Element => {
  const baseUrl = useContext(BaseUrlContext);
  console.log(`base url ${baseUrl}`);
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
    textAlign: "left",
    ...props.style
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

const ImageWidgetProps = {
  ...ImageProps,
  ...WidgetPropType
};

export const Image = (
  props: InferWidgetProps<typeof ImageWidgetProps>
): JSX.Element => <Widget baseWidget={ImageComponent} {...props} />;

registerWidget(Image, ImageWidgetProps, "image");
