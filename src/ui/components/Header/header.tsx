import React from "react";
import { ThemeContext } from "../../../themeContext";
import classes from "./header.module.css";

export const Header = (): JSX.Element => {
  const { toggle } = React.useContext(ThemeContext);
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
        <button type="button" onClick={toggle}>
          Toggle Theme
        </button>
      </div>
    </header>
  );
};
