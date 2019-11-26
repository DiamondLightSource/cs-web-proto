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
import { Label } from "../Label/label";

export interface DynamicParams {
  json: string;
  macros?: string;
}

export function DynamicPageFetch({
  match
}: RouteComponentProps<DynamicParams>): JSX.Element {
  var file = "http://localhost:3000/" + match.params.json + ".json";
  var map = match.params.macros && JSON.parse(match.params.macros);
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
  routePath: PropTypes.string
};

// Generic display widget to put other things inside
const DynamicPageComponent = (
  props: InferWidgetProps<typeof DynamicPageProps> & Component
): JSX.Element => (
  <div style={props.style}>
    <Route
      path={`*/${props.routePath}/:json/:macros`}
      render={routeProps => (
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
                width: "20px",
                height: "20px",
                backgroundColor: "green"
              }}
            >
              <Label
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
                      type: "OPEN_PAGE",
                      location: "right",
                      page: "ionpExample",
                      description: "Close",
                      macros: '{"device":"SR03A-VA-IONP-01"}'
                    }
                  ]
                }}
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
