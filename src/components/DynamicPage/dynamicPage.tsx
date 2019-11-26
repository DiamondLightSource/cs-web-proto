import React from "react";
import PropTypes from "prop-types";
import { Route, RouteComponentProps } from "react-router-dom";

import {
  Component,
  Widget,
  WidgetPropType,
  InferWidgetProps
} from "../Widget/widget";
import { WidgetFromJson } from "../FromJson/fromJson";
import { ActionButton } from "../ActionButton/actionButton";
import { CLOSE_PAGE } from "../../widgetActions";

export interface DynamicParams {
  json: string;
  macros?: string;
}

export function DynamicPageFetch({
  match
}: RouteComponentProps<DynamicParams>): JSX.Element {
  const file = "http://localhost:3000/" + match.params.json + ".json";
  const map = match.params.macros && JSON.parse(match.params.macros);
  return (
    <WidgetFromJson
      file={file}
      macroMap={map}
      containerStyling={{
        position: "relative",
        height: "",
        width: "",
        margin: "",
        padding: "",
        border: ""
      }}
    />
  );
}

const DynamicPageProps = {
  routePath: PropTypes.string.isRequired
};

// Generic display widget to put other things inside
const DynamicPageComponent = (
  props: InferWidgetProps<typeof DynamicPageProps> & Component
): JSX.Element => (
  <div style={props.style}>
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
                containerStyling={{
                  position: "relative",
                  height: "",
                  width: "",
                  margin: "",
                  padding: "",
                  border: ""
                }}
                widgetStyling={{
                  textAlign: "center",
                  fontWeight: "bold",
                  backgroundColor: "#ff3333",
                  color: "#ffffff"
                }}
                actions={{
                  executeAsOne: false,
                  actions: [
                    {
                      type: CLOSE_PAGE,
                      location: props.routePath,
                      description: "Close"
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

DynamicPageWidget.propTypes = DynamicPageWidgetProps;
