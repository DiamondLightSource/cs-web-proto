import React from "react";
import { Widget } from "../widget";
import {
  InferWidgetProps,
  StringProp,
  StringPropOpt,
  FloatProp,
  MacrosProp,
  BorderPropOpt,
  ColorPropOpt
} from "../propTypes";
import { PVComponent, PVWidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import { EmbeddedDisplay } from "../EmbeddedDisplay/embeddedDisplay";
import { RelativePosition } from "../../../types/position";
import { GroupBoxComponent } from "../GroupBox/groupBox";
import { Border } from "../../../types/border";

export const LinkingContainerProps = {
  opiFile: StringProp,
  macroMap: MacrosProp,
  height: FloatProp,
  width: FloatProp,
  name: StringPropOpt,
  border: BorderPropOpt,
  backgroundColor: ColorPropOpt
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

  if (props?.border?.css().borderStyle === Border.GROUPBOX.css().borderStyle) {
    return (
      <GroupBoxComponent
        name={props.name ?? ""}
        backgroundColor={props.backgroundColor?.rgbaString()}
      >
        <EmbeddedDisplay file={file} position={position} />
      </GroupBoxComponent>
    );
  } else {
    return <EmbeddedDisplay file={file} position={position} />;
  }
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
