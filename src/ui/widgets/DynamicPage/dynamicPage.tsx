import React, { useContext } from "react";
import log from "loglevel";

import { Widget, commonCss } from "../widget";
import { WidgetPropType } from "../widgetProps";
import { ActionButton } from "../ActionButton/actionButton";
import { CLOSE_PAGE } from "../widgetActions";
import { registerWidget } from "../register";
import { StringProp, InferWidgetProps, BorderPropOpt } from "../propTypes";
import { EmbeddedDisplay } from "../EmbeddedDisplay/embeddedDisplay";
import { Color } from "../../../types/color";
import { RelativePosition } from "../../../types/position";
import { FileContext } from "../../../fileContext";

const DynamicPageProps = {
  location: StringProp,
  border: BorderPropOpt
};

// Generic display widget to put other things inside
export const DynamicPageComponent = (
  props: InferWidgetProps<typeof DynamicPageProps>
): JSX.Element => {
  const style = commonCss(props);
  const fileContext = useContext(FileContext);

  let file;
  try {
    file = fileContext.locations[props.location][1];
  } catch (error) {
    log.warn(fileContext);
    log.warn(error);
    return (
      <div style={{ border: "1px solid black", minHeight: "100px", ...style }}>
        <h3>Dynamic page "{props.location}": no file loaded.</h3>
      </div>
    );
  }

  return (
    <div style={style}>
      <div
        style={{
          position: "relative",
          height: "30px"
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "5px",
            top: "5px",
            width: "40px",
            height: "20px",
            backgroundColor: "green"
          }}
        >
          <ActionButton
            position={new RelativePosition()}
            backgroundColor={Color.parse("#ff3333")}
            foregroundColor={Color.parse("#ffffff")}
            actions={{
              executeAsOne: false,
              actions: [
                {
                  type: CLOSE_PAGE,
                  dynamicInfo: {
                    name: props.location,
                    location: props.location,
                    file: file,
                    description: "Close"
                  }
                }
              ]
            }}
            text="X"
          />
        </div>
      </div>
      <EmbeddedDisplay file={file} position={new RelativePosition()} />
    </div>
  );
};

const DynamicPageWidgetProps = {
  ...DynamicPageProps,
  ...WidgetPropType
};

export const DynamicPageWidget = (
  props: InferWidgetProps<typeof DynamicPageWidgetProps>
): JSX.Element => <Widget baseWidget={DynamicPageComponent} {...props} />;

registerWidget(DynamicPageWidget, DynamicPageWidgetProps, "dynamicpage");
