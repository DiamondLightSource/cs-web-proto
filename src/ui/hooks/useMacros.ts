import React from "react";
import { useSelector } from "react-redux";
import { resolveMacros } from "../../types/macros";
import { MacroMap, CsState } from "../../redux/csState";
import { PV } from "../../types/pv";

export interface MacroProps extends React.PropsWithChildren<any> {
  macroMap?: MacroMap;
  pvName?: PV;
  rawPvName?: PV;
}

/*
 * Resolve macros in place for all strings in the props object, recursing
 * into any arrays and objects.
 * Do not descend into child components as this is called for each widget.
 */
function rescursiveResolve(props: any, macroMap: MacroMap): void {
  if (props === null) {
    return;
  }
  for (const [prop, value] of Object.entries(props)) {
    // Don't descend into child components.
    if (prop !== "children") {
      if (typeof value === "object") {
        if (Array.isArray(value)) {
          value.forEach((member: object): void =>
            rescursiveResolve(member, macroMap)
          );
        } else {
          rescursiveResolve(value, macroMap);
        }
      } else if (typeof value === "string") {
        props[prop] = resolveMacros(value, macroMap);
      }
    }
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
  const rawPvName = props.pvName;
  rescursiveResolve(props, allMacros);
  props.rawPvName = rawPvName;
  return props;
}
