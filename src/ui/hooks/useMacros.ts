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
 * Return a copy of the props object with resolved macros, recursing
 * into any arrays and objects.
 * Do not descend into child components as this is called for each widget.
 */
function rescursiveResolve(props: MacroProps, macroMap: MacroMap): void {
  if (props === null) {
    return;
  }
  // Shallow clone of props with the same prototype.
  const resolvedProps = Object.assign(
    Object.create(Object.getPrototypeOf(props)),
    props
  );
  // Allow substitutions of the widget's props as well as macros.
  macroMap = { ...props, ...macroMap };
  // console.log(macroMap);
  for (const [prop, value] of Object.entries(props)) {
    // Don't descend into child components.
    if (prop === "children") {
      resolvedProps[prop] = value;
    } else {
      if (typeof value === "object") {
        if (Array.isArray(value)) {
          const newArray = value.map((member: any): any => {
            if (typeof member === "object") {
              return rescursiveResolve(member, macroMap);
            } else if (typeof member === "string") {
              return resolveMacros(member, macroMap);
            }
            return member;
          });
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
  const displayMacros = useContext(MacroContext).macros;
  const globalMacros = useSelector(
    (state: CsState): MacroMap => state.macroMap
  );
  const allMacros = {
    ...globalMacros, // lower priority
    ...displayMacros // higher priority
  };
  const rawPvName = props.pvName;
  const newProps: any = rescursiveResolve(props, allMacros);
  newProps.rawPvName = rawPvName;
  return newProps;
}
