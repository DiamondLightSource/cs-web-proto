import React from "react";
import { useSelector } from "react-redux";
import { resolveMacros } from "../macros";
import { MacroMap, CsState } from "../redux/csState";

export interface MacroProps extends React.PropsWithChildren<any> {
  // Takes null as well to allow for PropTypes weirdness
  macroMap?: MacroMap | null;
  pvName?: string;
}

function resolveStrings(value: any, macroMap?: MacroMap): any {
  if (typeof value === "string" && macroMap != null) {
    return resolveMacros(value, macroMap);
  } else {
    return value;
  }
}

export function useMacros(props: MacroProps): MacroProps {
  const globalMacros = useSelector(
    (state: CsState): MacroMap => state.macroMap
  );
  let allMacros = { ...globalMacros };
  if (props.macroMap) {
    allMacros = { ...allMacros, ...props.macroMap };
  }
  let resolvedProps: any = {};
  const rawPvName = props.pvName;
  Object.entries(props).forEach(([key, value]): void => {
    resolvedProps[key] = resolveStrings(value, allMacros);
  });
  if (rawPvName != null) {
    resolvedProps.rawPvName = rawPvName;
  }
  return resolvedProps;
}
