import {
  Border,
  BorderStyle,
  Color,
  DrawerWidget,
  EmbeddedDisplay,
  Font,
  FontStyle,
  OutlineContext,
  RelativePosition
} from "@dls-controls/cs-web-lib";
import React from "react";
import classes from "./header.module.css";

export const Header = (props: { drawer: boolean }): JSX.Element => {
  const { toggleOutlines } = React.useContext(OutlineContext);
  const children = [
    <EmbeddedDisplay
      position={new RelativePosition()}
      key="0"
      file={{ path: "json/drawer.json", defaultProtocol: "pva", macros: {} }}
    />
  ];
  return (
    <header className={classes.header}>
      <div className={classes.imgWrapper}>
        {props.drawer ? (
          <DrawerWidget
            text="Open screens"
            position={new RelativePosition(undefined, "4rem", "1rem")}
            font={new Font(20, FontStyle.Regular)}
            border={
              new Border(
                BorderStyle.Line,
                new Color("var(--diamond-yellow)"),
                3
              )
            }
            foregroundColor={new Color("var(--diamond-yellow)")}
            backgroundColor={new Color("var(--diamond-blue)")}
          >
            {children}
          </DrawerWidget>
        ) : (
          <a href="/">Back to app</a>
        )}
      </div>
      <h1 className={classes.h1}>
        <a href="/">cs-web-proto</a>
      </h1>
      <div className={classes.buttonWrapper}>
        <button
          className={classes.button}
          type="button"
          onClick={toggleOutlines}
        >
          Show outlines
        </button>
      </div>
    </header>
  );
};
