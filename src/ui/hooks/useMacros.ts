import React from "react";
import { useSelector } from "react-redux";
import { resolveMacros } from "../../types/macros";
import { MacroMap, CsState } from "../../redux/csState";

export interface MacroProps extends React.PropsWithChildren<any> {
  macroMap?: MacroMap;
  pvName?: string;
}

function rescursiveResolve(props: object, macroMap: MacroMap): any {
  const resolvedProps: any = {};
  if (props === null) {
    return null;
  }
  for (const [prop, value] of Object.entries(props)) {
    // Don't descend into child components.
    if (prop === "children") {
      resolvedProps[prop] = value;
    } else {
      if (typeof value === "object") {
        if (Array.isArray(value)) {
          const newArray = value.map((member: object): object =>
            rescursiveResolve(member, macroMap)
          );
          resolvedProps[prop] = newArray;
        } else {
          resolvedProps[prop] = rescursiveResolve(value, macroMap);
        }
      } else if (typeof value === "string") {
        resolvedProps[prop] = resolveMacros(value, macroMap);
      } else {
        resolvedProps[prop] = value;
      }
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
