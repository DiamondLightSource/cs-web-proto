import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { MacroMap, resolveMacros, MacroContext } from "../../types/macros";
import { CsState } from "../../redux/csState";
import { PV } from "../../types/pv";
import { AnyProps } from "../widgets/widgetProps";

export interface MacroProps extends React.PropsWithChildren<any> {
  macroMap?: MacroMap;
  pvName?: PV;
}

/*
 * Return a copy of the props object with resolved macros, recursing
 * into any arrays and objects.
 * Do not descend into child components as this is called for each widget.
 */
function recursiveResolve(props: MacroProps, macroMap: MacroMap): AnyProps {
  // Shallow clone of props object with the same prototype. This is
  // important for when a prop object is an ES6 class e.g. Font or Color.
  const resolvedProps = Object.assign(
    Object.create(Object.getPrototypeOf(props)),
    props
  );
  // Allow substitutions of the widget's props as well as macros.
  macroMap = { ...props, ...macroMap };
  for (const [prop, value] of Object.entries(props)) {
    // Don't descend into child components.
    if (prop === "children") {
      resolvedProps[prop] = value;
    } else {
      if (typeof value === "object") {
        if (Array.isArray(value)) {
          const newArray = value.map((member: any): any => {
            if (typeof member === "object") {
              return recursiveResolve(member, macroMap);
            } else if (typeof member === "string") {
              return resolveMacros(member, macroMap);
            }
            return member;
          });
          resolvedProps[prop] = newArray;
        } else {
          resolvedProps[prop] = recursiveResolve(value, macroMap);
        }
      } else if (typeof value === "string") {
        const resolved = resolveMacros(value, macroMap);
        resolvedProps[prop] = resolved;
        // Store resolved string in macroMap to avoid
        // having to re-resolve later.
        macroMap[prop] = resolved;
      } else {
        resolvedProps[prop] = value;
      }
    }
  }
  return resolvedProps;
}

export function useMacros<P extends MacroProps>(props: P): AnyProps {
  const displayMacros = useContext(MacroContext).macros;
  const globalMacros = useSelector(
    (state: CsState): MacroMap => state.globalMacros
  );
  const allMacros = {
    ...globalMacros, // lower priority
    ...displayMacros, // higher priority
    // Temporary special case for pv_name in macros.
    pvName: props.pvName?.name || "",
    pv_name: props.pvName?.name || ""
  };
  return recursiveResolve(props, allMacros);
}
