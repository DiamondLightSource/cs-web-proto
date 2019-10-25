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
    let resolvedProps: any = {};
    const rawPvName = props.pvName;
    Object.entries(props).map(([key, value]): void => {
      resolvedProps[key] = resolveStrings(value, allMacros);
    });
    if (rawPvName != null) {
      resolvedProps.rawPvName = rawPvName;
    }
    return <Component {...(resolvedProps as P)}></Component>;
  };
};

export function useMacros<P extends MacroProps>(props: MacroProps): P {
  const globalMacros = useSelector(
    (state: CsState): MacroMap => state.macroMap
  );
  let allMacros = { ...globalMacros };
  if (props.macroMap != null) {
    allMacros = { ...allMacros, ...props.macroMap };
  }
  let resolvedProps: any = {};
  const rawPvName = props.pvName;
  Object.entries(props).map(([key, value]): void => {
    resolvedProps[key] = resolveStrings(value, allMacros);
  });
  if (rawPvName != null) {
    resolvedProps.rawPvName = rawPvName;
  }
  return resolvedProps;
}
