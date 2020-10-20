import React, { useContext } from "react";
import classes from "./tabs.module.css";
import { BaseUrlContext } from "../../../baseUrl";

export interface TabBarProps {
  tabNames: string[];
  selectedTab?: number;
  onTabSelected: (index: number) => void;
  // If onTabClosed is not provided then no close button
  // will be added to the tabs.
  onTabClosed?: (index: number) => void;
}

export const TabBar = (props: TabBarProps): JSX.Element => {
  const baseUrl = useContext(BaseUrlContext);
  return (
    <div className={classes.TabBar}>
      {props.tabNames.map(
        (tabName, index): JSX.Element => (
          <div
            key={index}
            onClick={(): void => {
              props.onTabSelected(index);
            }}
            className={
              index === props.selectedTab
                ? `${classes.Tab} ${classes.CloseableTab} ${classes.TabSelected}`
                : `${classes.Tab} ${classes.CloseableTab}`
            }
          >
            <p className={classes.CloseableTabText}>{tabName}</p>
            {props.onTabClosed && (
              <button
                className={classes.TabCloseButton}
                onClick={(event): void => {
                  props.onTabClosed?.(index);
                  event.stopPropagation();
                }}
              >
                <img
                  style={{ height: "15px", display: "block" }}
                  src={`${baseUrl}/img/x.png`}
                  alt="Close tab"
                ></img>
              </button>
            )}
          </div>
        )
      )}
    </div>
  );
};
