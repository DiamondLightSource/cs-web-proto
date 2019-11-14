import React from "react";
import { useSelector } from "react-redux";
import { resolveMacros } from "../macros";
import { MacroMap, CsState } from "../redux/csState";

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

export function useMacros<P extends MacroProps>(props: P): P {
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
