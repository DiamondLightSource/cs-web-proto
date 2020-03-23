import React, { useState } from "react";
import PropTypes from "prop-types";
import log from "loglevel";

import classes from "./slideshow.module.css";
import { Widget } from "../widget";
import { WidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import { ChildrenPropOpt, InferWidgetProps } from "../propTypes";

const SlideshowProps = {
  children: PropTypes.arrayOf(PropTypes.element)
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
    <div className={classes.Slideshow}>
      <button
        style={{
          position: "absolute",
          right: "0px",
          top: "10%",
          height: "80%",
          width: "8%",
          textAlign: "center",
          overflow: "hidden"
        }}
        onClick={() =>
          setChildIndex(nextChildIndex(childIndex, props.children?.length ?? 0))
        }
      >
        ▶
      </button>
      <button
        style={{
          position: "absolute",
          left: "0px",
          top: "10%",
          height: "80%",
          width: "8%",
          textAlign: "center",
          overflow: "hidden"
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
          position: "absolute",
          left: "10%",
          width: "80%",
          height: "100%",
          display: "flex"
        }}
      >
        {props.children?.[childIndex]}
      </div>
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
