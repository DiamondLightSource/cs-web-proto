import React from "react";
import PropTypes from "prop-types";
import { vtypeToString } from "../../vtypes/utils";
// used for className={`MyComponent ${classes.MyComponent}`}
// import classes from "./mycomponent.module.css";
import {
  InferWidgetProps,
  PVComponent,
  PVWidget,
  WidgetPropType,
  PVWidgetPropType
} from "../Widget/widget";

const RawADFFViewerProps = {
  label: PropTypes.string
};

export type RawADFFViewerComponentProps = InferWidgetProps<
  typeof RawADFFViewerProps
> &
  PVComponent;

export const RawADFFViewerComponent = (
  props: RawADFFViewerComponentProps
): JSX.Element => (
  <div style={props.style}>
    {props.label}
    <img
      src={vtypeToString(props.value)}
      style={{
        width: "100%",
        height: "100%"
      }}
      alt="ffmpeg stream"
    />
  </div>
);

const RawADFFViewerWidgetProps = {
  ...RawADFFViewerProps,
  ...PVWidgetPropType
};

// This widget uses the PV value as a URL to the video stream
export const RawADFFViewer = (
  props: InferWidgetProps<typeof RawADFFViewerWidgetProps>
): JSX.Element => <PVWidget baseWidget={RawADFFViewerComponent} {...props} />;

RawADFFViewer.propTypes = RawADFFViewerWidgetProps;

const ADFFViewerProps = {
  prefix: PropTypes.string.isRequired,
  ...RawADFFViewerProps
};

const ADFFViewerWidgetProps = {
  ...ADFFViewerProps,
  ...WidgetPropType
};

// This widget takes a prefix for a FFmpeg plugin and derives
// the needed PV to instanciate a RawADFFViewerComponent
export const ADFFViewer = (
  props: InferWidgetProps<typeof ADFFViewerWidgetProps>
): JSX.Element => (
  <RawADFFViewer pvName={`${props.prefix}:MJPG_URL_RBV`} {...props} />
);

ADFFViewer.propTypes = ADFFViewerWidgetProps;
