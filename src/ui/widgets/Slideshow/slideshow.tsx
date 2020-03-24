import React, { useState, ReactChildren } from "react";
import PropTypes from "prop-types";
import log from "loglevel";
import { CSSTransition, SwitchTransition } from "react-transition-group";

import classes from "./slideshow.module.css";
import fadeTransition from "./fade.module.css";
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

const SwitchableText = (props: { index: number; children: any }) => {
  return (
    <SwitchTransition mode="out-in">
      <CSSTransition
        classNames={fadeTransition}
        key={props.index}
        timeout={1000}
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
  const [childIndex, setChildIndex] = useState(0);

  log.warn(`Slideshow Index: ${childIndex}`);
  //   log.warn(props.children);

  return (
    <div>
      <h1>Click the button to transition the text below</h1>
      <SwitchableText index={childIndex}>{props.children}</SwitchableText>
      <button
        onClick={() =>
          childIndex >= 2 ? setChildIndex(0) : setChildIndex(childIndex + 1)
        }
      >
        toggle
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
