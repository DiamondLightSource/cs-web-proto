/**
 * A widget that shows files stored in the file context under
 * a specific 'location'. Unlike the dynamic tabs widget, only
 * one file is shown.
 *
 * See also the dynamic tabs widget.
 */
import React, { useContext } from "react";

import { Widget, useCommonCss } from "../widget";
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
  const style = useCommonCss(props);
  const fileContext = useContext(FileContext);

  const file = fileContext.pageState[props.location];

  if (file === undefined) {
    return (
      <div style={{ border: "1px solid black", minHeight: "100px", ...style }}>
        <h3>Dynamic page &quot;{props.location}&quot;: no file loaded.</h3>
      </div>
    );
  } else {
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
  }
};

const DynamicPageWidgetProps = {
  ...DynamicPageProps,
  ...WidgetPropType
};

export const DynamicPageWidget = (
  props: InferWidgetProps<typeof DynamicPageWidgetProps>
): JSX.Element => <Widget baseWidget={DynamicPageComponent} {...props} />;

registerWidget(DynamicPageWidget, DynamicPageWidgetProps, "dynamicpage");
