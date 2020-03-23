import React, { useState } from "react";
import PropTypes from "prop-types";
import log from "loglevel";

import classes from "./slideshow.module.css";
import { Widget } from "../widget";
import { WidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import {
  ChoicePropOpt,
  InferWidgetProps,
  StringOrNumPropOpt
} from "../propTypes";

const SlideshowProps = {
  children: PropTypes.arrayOf(PropTypes.element),
  overflow: ChoicePropOpt(["scroll", "hidden", "auto", "visible"]),
  maxHeight: StringOrNumPropOpt,
  maxWidth: StringOrNumPropOpt
};

export const SlideshowComponent = (
  props: InferWidgetProps<typeof SlideshowProps>
): JSX.Element => {
  const nextChildIndex = (index: number, length: number): number => {
    if (index + 1 < length) {
      return index + 1;
    } else {
      return 0;
    }
  };
  const previousChildIndex = (index: number, length: number): number => {
    if (index - 1 >= 0) {
      return index - 1;
    } else {
      return length - 1;
    }
  };

  const [childIndex, setChildIndex] = useState(0);

  log.warn(`Slideshow Index: ${childIndex}`);
  //   log.warn(props.children);

  return (
    <div
      className={classes.Slideshow}
      style={{
        maxWidth: props.maxWidth ?? "",
        maxHeight: props.maxHeight ?? ""
      }}
    >
      <button
        style={{
          position: "relative",
          height: "80%",
          width: "10%",
          maxWidth: "3rem",
          maxHeight: "5rem",
          textAlign: "center",
          overflow: "hidden",
          margin: "0.5rem",
          flexGrow: 0
        }}
        onClick={() =>
          setChildIndex(
            previousChildIndex(childIndex, props.children?.length ?? 0)
          )
        }
      >
        ◀
      </button>
      <div
        style={{
          position: "relative",
          width: "80%",
          height: "100%",
          maxHeight: props.maxHeight ?? "",
          display: "flex",
          flexGrow: 1,
          overflow: props.overflow ?? ""
        }}
      >
        {props.children?.[childIndex]}
      </div>
      <button
        style={{
          position: "relative",
          height: "80%",
          width: "10%",
          maxWidth: "3rem",
          maxHeight: "5rem",
          textAlign: "center",
          overflow: "hidden",
          margin: "0.5rem",
          flexGrow: 0
        }}
        onClick={() =>
          setChildIndex(nextChildIndex(childIndex, props.children?.length ?? 0))
        }
      >
        ▶
      </button>
    </div>
  );
};

const SlideshowWidgetProps = {
  ...SlideshowComponent,
  ...WidgetPropType
};

export const Slideshow = (
  props: InferWidgetProps<typeof SlideshowWidgetProps>
): JSX.Element => <Widget baseWidget={SlideshowComponent} {...props} />;

registerWidget(Slideshow, SlideshowWidgetProps, "slideshow");
