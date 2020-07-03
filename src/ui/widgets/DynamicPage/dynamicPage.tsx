import React from "react";
import log from "loglevel";
import { useHistory } from "react-router-dom";

import { Widget, commonCss } from "../widget";
import { WidgetPropType } from "../widgetProps";
import { ActionButton } from "../ActionButton/actionButton";
import { CLOSE_PAGE } from "../widgetActions";
import { registerWidget } from "../register";
import {
  StringProp,
  InferWidgetProps,
  BorderPropOpt,
  FileDescription
} from "../propTypes";
import { EmbeddedDisplay } from "../EmbeddedDisplay/embeddedDisplay";
import { Color } from "../../../types/color";
import { RelativePosition } from "../../../types/position";
import { getUrlInfoFromHistory } from "../urlControl";

const DynamicPageProps = {
  routePath: StringProp,
  border: BorderPropOpt
};

// Generic display widget to put other things inside
const DynamicPageComponent = (
  props: InferWidgetProps<typeof DynamicPageProps>
): JSX.Element => {
  const style = commonCss(props);
  const history = useHistory();
  const currentUrlInfo = getUrlInfoFromHistory(history);

  let file;
  try {
    file = currentUrlInfo[props.routePath] as FileDescription;
  } catch (error) {
    log.warn(currentUrlInfo);
    log.warn(error);
    return <div></div>;
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
                    name: props.routePath,
                    location: props.routePath,
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
