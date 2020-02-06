import React, { useContext } from "react";
import log from "loglevel";
import { Route, RouteComponentProps } from "react-router-dom";

import { Widget } from "../widget";
import { WidgetPropType } from "../widgetProps";
import { ActionButton } from "../ActionButton/actionButton";
import { CLOSE_PAGE } from "../widgetActions";
import { registerWidget } from "../register";
import { StringProp, InferWidgetProps } from "../propTypes";
import { BaseUrlContext } from "../../../baseUrl";
import { EmbeddedDisplay } from "../EmbeddedDisplay/embeddedDisplay";
import { Color } from "../../../types/color";

export interface DynamicParams {
  json: string;
  macros?: string;
}

export function DynamicPageFetch({
  match
}: RouteComponentProps<DynamicParams>): JSX.Element {
  const baseUrl = useContext(BaseUrlContext);
  const file = `${baseUrl}/json/${match.params.json}.json`;
  let map = {};
  try {
    map = match.params.macros && JSON.parse(match.params.macros);
  } catch (error) {
    log.warn(match.params.json);
    log.warn(error);
  }
  return (
    <EmbeddedDisplay
      file={file}
      filetype="json"
      macroMap={map}
      positionStyle={{
        position: "relative",
        height: "",
        width: "",
        margin: "",
        padding: "",
        border: "",
        minWidth: "",
        maxWidth: ""
      }}
    />
  );
}

const DynamicPageProps = {
  routePath: StringProp
};

// Generic display widget to put other things inside
const DynamicPageComponent = (
  props: InferWidgetProps<typeof DynamicPageProps>
): JSX.Element => (
  <div style={{ width: "100%", height: "100%" }}>
    <Route
      path={`*/${props.routePath}/:json/:macros`}
      render={(routeProps): JSX.Element => (
        <div>
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
                positionStyle={{
                  position: "relative",
                  height: "",
                  width: "",
                  margin: "",
                  padding: "",
                  border: "",
                  minWidth: "",
                  maxWidth: ""
                }}
                backgroundColor={Color.parse("#ff3333")}
                foregroundColor={Color.parse("#ffffff")}
                actions={{
                  executeAsOne: false,
                  actions: [
                    {
                      type: CLOSE_PAGE,
                      closePageInfo: {
                        location: props.routePath,
                        description: "Close"
                      }
                    }
                  ]
                }}
                pvName=""
                text="X"
              />
            </div>
          </div>
          <DynamicPageFetch {...routeProps} />
        </div>
      )}
    />
  </div>
);

const DynamicPageWidgetProps = {
  ...DynamicPageProps,
  ...WidgetPropType
};

export const DynamicPageWidget = (
  props: InferWidgetProps<typeof DynamicPageWidgetProps>
): JSX.Element => <Widget baseWidget={DynamicPageComponent} {...props} />;

registerWidget(DynamicPageWidget, DynamicPageWidgetProps, "dynamicpage");
