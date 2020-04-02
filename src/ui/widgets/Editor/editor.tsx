import React, { useState } from "react";

import { widgetDescriptionToComponent } from "../createComponent";
import { WidgetPropType } from "../widgetProps";
import { InferWidgetProps } from "../propTypes";
import { registerWidget } from "../register";
import { parseJson } from "../EmbeddedDisplay/jsonParser";

const EditorProps = {
  ...WidgetPropType
};

export const Editor = (
  props: InferWidgetProps<typeof EditorProps>
): JSX.Element => {
  const [inputJson, setInputJson] = useState(
    JSON.stringify(
      {
        type: "label",
        position: "relative",
        width: "100%",
        font: {
          style: "bold"
        },
        backgroundColor: "transparent",
        text: "Preview goes here"
      },
      null,
      "  "
    )
  );
  const [preview, setPreview] = useState(<div>Your preview goes here!</div>);
  const [consoleText, setConsoleText] = useState("Console output");

  function generatePreview(event: React.MouseEvent<HTMLButtonElement>): void {
    try {
      JSON.parse(inputJson);
    } catch (e) {
      console.log(e);
      setConsoleText(e.message);
    }
    setConsoleText("JSON Parsed Correctly");
    setInputJson(JSON.stringify(JSON.parse(inputJson), null, "  "));
    try {
      const previewWidgetDesc = parseJson(inputJson, "pva");
      const previewWidget = widgetDescriptionToComponent(previewWidgetDesc);
      setPreview(previewWidget);
    } catch (e) {
      console.log(e);
      setConsoleText(e.message);
    }
  }

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        height: "500px",
        border: "solid 2px black",
        justifyContent: "space-around"
      }}
    >
      <div
        style={{
          position: "relative",
          height: "100%",
          width: "48%",
          display: "flex",
          flexFlow: "column"
        }}
      >
        <textarea
          style={{ height: "65%", width: "100%", verticalAlign: "top" }}
          value={inputJson}
          onChange={(event): void => setInputJson(event.target.value)}
        />
        <button style={{ height: "10%" }} onClick={generatePreview}>
          Preview
        </button>
        <div
          style={{
            height: "25%",
            width: "100%",
            font: "1.5rem Helvetica",
            overflow: "auto",
            padding: "2%",
            border: "1px solid black",
            backgroundColor: "#cccccc"
          }}
        >
          {consoleText}
        </div>
      </div>

      <div
        style={{
          position: "relative",
          height: "100%",
          width: "48%",
          overflow: "auto",
          border: "1px solid black"
        }}
      >
        {preview}
      </div>
    </div>
  );
};

registerWidget(Editor, EditorProps, "editor");
