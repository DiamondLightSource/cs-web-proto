import React from "react";
import { OutlineContext } from "../../../outlineContext";
import { ThemeContext } from "../../../themeContext";
import classes from "./header.module.css";

export const Header = (): JSX.Element => {
  const { toggleTheme } = React.useContext(ThemeContext);
  const { toggleOutlines } = React.useContext(OutlineContext);
  return (
    <header className={classes.header}>
      <div className={classes.imgWrapper}>
        <img
          src="img/Diamond_logo_col.jpg"
          alt="Diamond logo"
          className={classes.img}
        ></img>
      </div>
      <h1 className={classes.h1}>cs-web-proto</h1>
      <div className={classes.buttonWrapper}>
        <button type="button" onClick={toggleTheme}>
          Toggle Theme
        </button>
        <button type="button" onClick={toggleOutlines}>
          Show outlines
        </button>
      </div>
    </header>
  );
};
