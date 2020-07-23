import React from "react";

/* A simple dictionary from key to value. */
export interface MacroMap {
  [key: string]: string;
}

export function macrosEqual(first: MacroMap, second: MacroMap): boolean {
  // TODO why are the DIDs not matching?
  const { DID: firstDid, ...firstOthers } = first;
  const { DID: secondDid, ...secondOthers } = first;
  for (const key in firstOthers) {
    if (first.hasOwnProperty(key)) {
      if (first[key] !== second[key]) {
        return false;
      }
    }
  }
  for (const key in secondOthers) {
    if (second.hasOwnProperty(key)) {
      if (first[key] !== second[key]) {
        return false;
      }
    }
  }
  return true;
}

/* The MacroContext, used for providing macros to children of
   container widgets.

   Descendants can update the macros of the nearest provider using
   the updateMacro() function.
*/
export interface MacroContextType {
  macros: MacroMap;
  updateMacro: (key: string, value: string) => void;
}
export const MacroContext = React.createContext<MacroContextType>({
  macros: {},
  updateMacro: (key: string, value: string) => {}
});

function interpolate(
  str: string,
  substitutions: { [substitution: string]: string }
): string {
  const requiredMappings: string[] = [];

  const regexp = /\$[{(](.*?)[})]/g;
  let result = null;
  while ((result = regexp.exec(str))) {
    requiredMappings.push(result[1]);
  }
  const missingMappings = requiredMappings.filter(
    (x: string): boolean => substitutions[x] === undefined
  );

  /* Allow missing macros to go unresolved. */
  for (const missing of missingMappings) {
    substitutions[missing] = "${" + missing + "}";
  }

  return str.replace(/\$[{(](.*?)[})]/g, (x, g): string =>
    substitutions[g].toString()
  );
}

export function resolveMacros(
  unresolvedPvName: string,
  macroMap: MacroMap
): string {
  const resolved = interpolate(unresolvedPvName, macroMap);
  return resolved;
}
