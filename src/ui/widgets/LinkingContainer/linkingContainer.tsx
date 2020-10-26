import React from "react";
import { Widget } from "../widget";
import { InferWidgetProps, StringProp, MacrosProp } from "../propTypes";
import { PVComponent, PVWidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import { EmbeddedDisplay } from "../EmbeddedDisplay/embeddedDisplay";
import { RelativePosition } from "../../../types/position";

export const LinkingContainerProps = {
  file: StringProp,
  macroMap: MacrosProp
};

export type LinkingContainerComponentProps = InferWidgetProps<
  typeof LinkingContainerProps
> &
  PVComponent;

export const LinkingContainerComponent = (
  props: LinkingContainerComponentProps
): JSX.Element => {
  const splitPath = props.file.split("/");

  const file = {
    path: splitPath[splitPath.length - 1],
    macros: props.macroMap,
    defaultProtocol: "ca"
  };

  const position = new RelativePosition();

  return <EmbeddedDisplay file={file} position={position} />;
  // return <div>{"stuff"}</div>;
};

const LinkingContainerWidgetProps = {
  ...LinkingContainerProps,
  ...PVWidgetPropType
};

export const LinkingContainer = (
  props: InferWidgetProps<typeof LinkingContainerWidgetProps>
): JSX.Element => <Widget baseWidget={LinkingContainerComponent} {...props} />;

registerWidget(
  LinkingContainer,
  LinkingContainerWidgetProps,
  "linkingcontainer"
);
