import React from "react";
import { useSelector } from "react-redux";
import { resolveMacros } from "../../macros";
import { MacroMap, CsState } from "../../redux/csState";

export interface MacroProps extends React.PropsWithChildren<any> {
  macroMap?: MacroMap;
  pvName?: string;
}

function resolveStrings(value: any, macroMap?: MacroMap): any {
  if (typeof value === "string" && macroMap != null) {
    return resolveMacros(value, macroMap);
  } else {
    return value;
  }
}

export const macroWrapper = <P extends object>(
  Component: React.FC<P>
): React.FC<any> => {
  // eslint-disable-next-line react/display-name
  return (props: MacroProps): JSX.Element => {
    // Resolve macros on every prop value.
    const globalMacros = useSelector(
      (state: CsState): MacroMap => state.macroMap
    );
    let allMacros = { ...globalMacros };
    if (props.macroMap != null) {
      allMacros = { ...allMacros, ...props.macroMap };
    }
    const rawPvName = props.pvName;
    const resolvedProps = Object.entries(props).map(([key, value]): [
      string,
      string
    ] => {
      return [key, resolveStrings(value, allMacros)];
    });
    const obj: MacroProps = Array.from(resolvedProps).reduce(
      (main, [key, value]): object => ({ ...main, [key]: value }),
      {}
    );
    obj.rawPvName = rawPvName;
    return <Component {...(obj as P)}></Component>;
  };
};
