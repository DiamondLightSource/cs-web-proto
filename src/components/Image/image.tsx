import React, { CSSProperties } from "react";
import PropTypes from "prop-types";

import {
  Component,
  Widget,
  WidgetPropType,
  InferWidgetProps
} from "../Widget/widget";

const ImageProps = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  fill: PropTypes.bool
};

export const ImageComponent = (
  props: PropTypes.InferProps<typeof ImageProps> & Component
): JSX.Element => {
  let imageSize = undefined;
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
        src={props.src || undefined}
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

Image.propTypes = ImageWidgetProps;
