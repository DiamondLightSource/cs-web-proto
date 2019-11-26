import React from "react";
import { useSelector } from "react-redux";
import { resolveMacros } from "../macros";
import { MacroMap, CsState } from "../redux/csState";

export interface MacroProps extends React.PropsWithChildren<any> {
  macroMap?: MacroMap;
  pvName?: string;
}

function rescursiveResolve(props: object, macroMap: MacroMap): any {
  const resolvedProps: any = {};
  for (const [prop, value] of Object.entries(props)) {
    if (typeof value === "object" && !Array.isArray(value)) {
      resolvedProps[prop] = rescursiveResolve(value, macroMap);
    } else if (typeof value === "string") {
      resolvedProps[prop] = resolveMacros(value, macroMap);
    } else if (prop === "actions") {
      resolvedProps[prop] = (value as object[]).map(v =>
        rescursiveResolve(v, macroMap)
      );
    } else {
      resolvedProps[prop] = value;
    }
  }
  return resolvedProps;
}

export function useMacros<P extends MacroProps>(props: P): P {
  const globalMacros = useSelector(
    (state: CsState): MacroMap => state.macroMap
  );
  let allMacros = { ...globalMacros };
  if (props.macroMap) {
    allMacros = { ...allMacros, ...props.macroMap };
  }
  const rawPvName = props.pvName;
  const resolvedProps: any = rescursiveResolve(props, allMacros);
  resolvedProps.rawPvName = rawPvName;
  return resolvedProps;
}
