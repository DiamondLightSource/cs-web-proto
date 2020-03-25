import React from "react";

/* A simple dictionary from key to value. */
export interface MacroMap {
  [key: string]: string;
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

  return str.replace(/\$[{(](.*?)[})]/g, (x, g): string => substitutions[g]);
}

export function resolveMacros(
  unresolvedPvName: string,
  macroMap: MacroMap
): string {
  const resolved = interpolate(unresolvedPvName, macroMap);
  return resolved;
}
