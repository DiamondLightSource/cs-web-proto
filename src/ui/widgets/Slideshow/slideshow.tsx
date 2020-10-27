import React, { useState, ReactElement } from "react";
import PropTypes from "prop-types";
import log from "loglevel";
import { CSSTransition, SwitchTransition } from "react-transition-group";

import classes from "./slideshow.module.css";
import slideLeftTransition from "./slideLeft.module.css";
import slideRightTransition from "./slideRight.module.css";
import { Widget } from "../widget";
import { WidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import {
  ChoicePropOpt,
  InferWidgetProps,
  StringOrNumPropOpt,
  BorderPropOpt,
  ColorPropOpt
} from "../propTypes";

export const SlideshowProps = {
  children: PropTypes.arrayOf(PropTypes.element),
  overflow: ChoicePropOpt(["scroll", "hidden", "auto", "visible"]),
  maxHeight: StringOrNumPropOpt,
  maxWidth: StringOrNumPropOpt,
  minHeight: StringOrNumPropOpt,
  border: BorderPropOpt,
  backgroundColor: ColorPropOpt
};

export const SwitchableWidget = (props: {
  index: number;
  children: [ReactElement];
  transition: { readonly [key: string]: string };
}): JSX.Element => {
  return (
    <SwitchTransition mode="out-in">
      <CSSTransition
        classNames={props.transition}
        key={props.index}
        timeout={250}
        unmountOnExit
        mountOnEnter
      >
        {props.children[props.index]}
      </CSSTransition>
    </SwitchTransition>
  );
};

export const SlideshowComponent = (
  props: InferWidgetProps<typeof SlideshowProps>
): JSX.Element => {
  const nextChildIndex = (index: number, length: number): number => {
    setTransition(slideRightTransition);
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
  const [transition, setTransition] = useState(slideRightTransition);

  log.debug(`Slideshow Index: ${childIndex}`);

  return (
    <div
      className={classes.Slideshow}
      style={{
        maxWidth: props.maxWidth ?? "",
        maxHeight: props.maxHeight ?? "",
        minHeight: props.minHeight ?? "",
        ...props.border?.css(),
        backgroundColor: props.backgroundColor?.toString()
      }}
    >
      <button
        id="prev-button"
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
        onClick={(): void => {
          setTransition(slideLeftTransition);
          setChildIndex(
            previousChildIndex(childIndex, props.children?.length ?? 0)
          );
        }}
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
        <SwitchableWidget index={childIndex} transition={transition}>
          {props.children as [ReactElement]}
        </SwitchableWidget>
      </div>
      <button
        id="next-button"
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
        onClick={(): void => {
          setTransition(slideRightTransition);
          setChildIndex(
            nextChildIndex(childIndex, props.children?.length ?? 0)
          );
        }}
      >
        ▶
      </button>
    </div>
  );
};

export const SlideshowWidgetProps = {
  ...SlideshowProps,
  ...WidgetPropType
};

export const Slideshow = (
  props: InferWidgetProps<typeof SlideshowWidgetProps>
): JSX.Element => <Widget baseWidget={SlideshowComponent} {...props} />;

registerWidget(Slideshow, SlideshowWidgetProps, "slideshow");
