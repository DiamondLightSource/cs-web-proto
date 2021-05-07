import React, { CSSProperties } from "react";

import { commonCss, Widget } from "../widget";
import { WidgetPropType } from "../widgetProps";
import {
  InferWidgetProps,
  StringProp,
  BoolPropOpt,
  StringPropOpt,
  FloatPropOpt,
  FuncPropOpt
} from "../propTypes";
import { registerWidget } from "../register";

const ImageProps = {
  imageFile: StringProp,
  alt: StringPropOpt,
  stretchToFit: BoolPropOpt,
  fitToWidth: BoolPropOpt,
  fitToHeight: BoolPropOpt,
  rotation: FloatPropOpt,
  flipHorizontal: BoolPropOpt,
  flipVertical: BoolPropOpt,
  onClick: FuncPropOpt
};

export const ImageComponent = (
  props: InferWidgetProps<typeof ImageProps>
): JSX.Element => {
  const { rotation = 0, flipHorizontal, flipVertical } = props;

  const onClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    if (props.onClick) {
      props.onClick(event);
    }
  };

  let imageHeight: string | undefined = undefined;
  let imageWidth: string | undefined = undefined;
  const overflow = "hidden";
  if (props.stretchToFit) {
    imageWidth = "100%";
    imageHeight = "100%";
  } else if (props.fitToWidth) {
    imageWidth = "100%";
  } else if (props.fitToHeight) {
    imageHeight = "100%";
  }

  const style: CSSProperties = {
    ...commonCss(props as any),
    overflow,
    textAlign: "left",
    width: imageWidth,
    height: imageHeight
  };

  return (
    <div style={style} onClick={onClick}>
      <img
        src={props.imageFile}
        alt={props.alt || undefined}
        style={{
          width: imageWidth,
          height: imageHeight,
          display: "block",
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
