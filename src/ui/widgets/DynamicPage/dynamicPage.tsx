import React, { useContext } from "react";
import log from "loglevel";
import { Route, RouteComponentProps } from "react-router-dom";

import { Widget } from "../widget";
import { WidgetPropType } from "../widgetProps";
import { ActionButton } from "../ActionButton/actionButton";
import { CLOSE_PAGE } from "../widgetActions";
import { registerWidget } from "../register";
import { StringProp, InferWidgetProps, StringPropOpt } from "../propTypes";
import { BaseUrlContext } from "../../../baseUrl";
import { EmbeddedDisplay } from "../EmbeddedDisplay/embeddedDisplay";
import { Color } from "../../../types/color";
import { RelativePosition } from "../../../types/position";

export interface DynamicParams {
  json: string;
  macros?: string;
  defaultProtocol?: string;
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
      position={new RelativePosition()}
      defaultProtocol={match.params.defaultProtocol ?? "ca"}
    />
  );
}

const DynamicPageProps = {
  routePath: StringProp,
  defaultProtocol: StringPropOpt
};

// Generic display widget to put other things inside
const DynamicPageComponent = (
  props: InferWidgetProps<typeof DynamicPageProps>
): JSX.Element => {
  const { routePath, defaultProtocol } = props;
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Route
        path={`*/${routePath}/:json/:macros`}
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
                  position={new RelativePosition()}
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
                  text="X"
                />
              </div>
            </div>
            <DynamicPageFetch
              {...{ ...routeProps, defaultProtocol: defaultProtocol }}
            />
          </div>
        )}
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
