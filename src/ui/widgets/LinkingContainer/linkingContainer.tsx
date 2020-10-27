import React from "react";
import { Widget } from "../widget";
import {
  InferWidgetProps,
  StringProp,
  StringPropOpt,
  FloatProp,
  MacrosProp,
  FloatPropOpt
} from "../propTypes";
import { PVComponent, PVWidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import { EmbeddedDisplay } from "../EmbeddedDisplay/embeddedDisplay";
import { RelativePosition } from "../../../types/position";
import { GroupBoxComponent } from "../GroupBox/groupBox";

export const LinkingContainerProps = {
  opiFile: StringProp,
  macroMap: MacrosProp,
  height: FloatProp,
  width: FloatProp,
  name: StringPropOpt
};

export type LinkingContainerComponentProps = InferWidgetProps<
  typeof LinkingContainerProps
> &
  PVComponent;

export const LinkingContainerComponent = (
  props: LinkingContainerComponentProps
): JSX.Element => {
  const splitPath = props.opiFile.split("/");

  const file = {
    path: splitPath[splitPath.length - 1],
    macros: props.macroMap,
    defaultProtocol: "ca"
  };

  const position = new RelativePosition(
    `${props.width}px`,
    `${props.height}px`
  );

  return (
    <GroupBoxComponent name={props.name ?? ""}>
      <EmbeddedDisplay file={file} position={position} />
    </GroupBoxComponent>
  );
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
