/* A provider that allows switching on and off of outlines for
 * widgets. This is a development tool but will be useful for
 * the time being.
 */
import React, { createContext, useState } from "react";

const initialState = {
  showOutlines: false,
  toggleOutlines: (): void => {}
};

export const OutlineContext = createContext(initialState);

export const OutlineProvider: React.FC<Record<string, unknown>> = ({
  children
}: any): JSX.Element => {
  const [showOutlines, setShowOutlines] = useState(
    localStorage.getItem("showOutlines") === "true"
  );

  const toggleOutlines = (): void => {
    const toggledValue = !showOutlines;
    localStorage.setItem("showOutlines", JSON.stringify(toggledValue));
    setShowOutlines(toggledValue);
  };

  // All descendants of OutlineContext.Provider re-render whenever
  // the value property changes (whole app wrapped hence theme
  // everywhere will change)
  return (
    <OutlineContext.Provider value={{ showOutlines, toggleOutlines }}>
      {children}
    </OutlineContext.Provider>
  );
};
