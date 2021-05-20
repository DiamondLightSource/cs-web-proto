import React from "react";
import classes from "./tabs.module.css";

export interface TabBarProps {
  tabNames: string[];
  selectedTab?: number;
  onTabSelected: (index: number) => void;
  // If onTabClosed is not provided then no close button
  // will be added to the tabs.
  onTabClosed?: (index: number) => void;
}

export const TabBar = (props: TabBarProps): JSX.Element => {
  return (
    <div className={classes.TabBar}>
      {props.tabNames.map(
        (tabName, index): JSX.Element => (
          <div
            key={index}
            title={tabName}
            onClick={(): void => {
              props.onTabSelected(index);
            }}
            // Close tab on middle click.
            onMouseDown={(e: React.MouseEvent): void => {
              if (e.button === 1) {
                props.onTabClosed?.(index);
              }
            }}
            className={
              index === props.selectedTab
                ? `${classes.Tab} ${classes.CloseableTab} ${classes.TabSelected}`
                : `${classes.Tab} ${classes.CloseableTab}`
            }
          >
            <span className={classes.CloseableTabText}>{tabName}</span>
            {props.onTabClosed && (
              <button
                className={classes.TabCloseButton}
                title="Close tab"
                onClick={(event): void => {
                  props.onTabClosed?.(index);
                  event.stopPropagation();
                }}
              >
                <img
                  style={{ height: "15px", display: "block" }}
                  src="/img/x.png"
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
