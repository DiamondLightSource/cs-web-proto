import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { MacroMap, resolveMacros, MacroContext } from "../../types/macros";
import { CsState } from "../../redux/csState";
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
function rescursiveResolve(props: MacroProps, macroMap: MacroMap): void {
  if (props === null) {
    return;
  }
  for (const [prop, value] of Object.entries(props)) {
    // Don't descend into child components.
    if (prop !== "children") {
      if (typeof value === "object") {
        if (Array.isArray(value)) {
          const newArray = value.map((member: any): any => {
            if (typeof member === "object") {
              rescursiveResolve(member, macroMap);
            } else if (typeof member === "string") {
              return resolveMacros(member, macroMap);
            }
            return member;
          });
          props[prop] = newArray;
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
  const displayMacros = useContext(MacroContext).macros;
  const globalMacros = useSelector(
    (state: CsState): MacroMap => state.macroMap
  );
  const allMacros = {
    ...globalMacros, // lower priority
    ...displayMacros // higher priority
  };
  const rawPvName = props.pvName;
  rescursiveResolve(props, allMacros);
  props.rawPvName = rawPvName;
  return props;
}
