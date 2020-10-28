import React, { CSSProperties, useContext } from "react";

import { Widget } from "../widget";
import { WidgetPropType } from "../widgetProps";
import {
  InferWidgetProps,
  StringProp,
  BoolPropOpt,
  StringPropOpt,
  FloatPropOpt
} from "../propTypes";
import { registerWidget } from "../register";
import { BaseUrlContext } from "../../../baseUrl";

const ImageProps = {
  src: StringProp,
  alt: StringPropOpt,
  fill: BoolPropOpt,
  width: StringPropOpt,
  height: StringPropOpt,
  rotation: FloatPropOpt,
  flipHorizontal: BoolPropOpt,
  flipVertical: BoolPropOpt
};

export const ImageComponent = (
  props: InferWidgetProps<typeof ImageProps>
): JSX.Element => {
  const { rotation = 0, flipHorizontal, flipVertical } = props;

  const baseUrl = useContext(BaseUrlContext);
  let file = `img/${props.src}`;
  if (!file.startsWith("http")) {
    file = `${baseUrl}/${file}`;
  }
  let imageSize: any = undefined;
  let overflow = "auto";
  if (props.fill) {
    imageSize = "100%";
    overflow = "hidden";
  }

  const style: CSSProperties = {
    overflow,
    textAlign: "left"
  };

  return (
    <div style={style}>
      <img
        src={file}
        alt={props.alt || undefined}
        style={{
          height: props.height ?? imageSize,
          width: props.width ?? imageSize,
          transform: `rotate(${rotation}deg) scaleX(${
            flipHorizontal ? -1 : 1
          }) scaleY(${flipVertical ? -1 : 1})`
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
