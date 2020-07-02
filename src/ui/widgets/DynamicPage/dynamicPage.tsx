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
  StringPropOpt,
  BorderPropOpt
} from "../propTypes";
import { EmbeddedDisplay } from "../EmbeddedDisplay/embeddedDisplay";
import { Color } from "../../../types/color";
import { RelativePosition } from "../../../types/position";
import { getUrlInfoFromHistory, UrlPageDescription } from "../urlControl";

const DynamicPageProps = {
  routePath: StringProp,
  defaultProtocol: StringPropOpt,
  border: BorderPropOpt
};

// Generic display widget to put other things inside
const DynamicPageComponent = (
  props: InferWidgetProps<typeof DynamicPageProps>
): JSX.Element => {
  const style = commonCss(props);
  const history = useHistory();
  const currentUrlInfo = getUrlInfoFromHistory(history);

  let pageDesc: UrlPageDescription;
  let file = "";
  let macros = {};
  try {
    pageDesc = currentUrlInfo[props.routePath] as UrlPageDescription;
    file = pageDesc.filename + `.${pageDesc.filetype}`;
    macros = pageDesc.macros ?? {};
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
                  closePageInfo: {
                    page: props.routePath,
                    description: "Close"
                  }
                }
              ]
            }}
            text="X"
          />
        </div>
      </div>
      <EmbeddedDisplay
        file={file}
        filetype="json"
        macros={macros}
        position={new RelativePosition()}
        defaultProtocol={props.defaultProtocol ?? "ca"}
      />
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
