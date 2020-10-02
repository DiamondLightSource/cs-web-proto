import React from "react";

/* A simple dictionary from key to value. */
export interface MacroMap {
  [key: string]: string;
}

/**
 * This function compares two MacroMap objects, and returns true if all properties
 * are the same
 * @param first first MacroMap object
 * @param second second MacroMap object
 * @returns boolean, true if they match else false
 */
export function macrosEqual(first: MacroMap, second: MacroMap): boolean {
  const { DID: firstDid, ...firstOthers } = first;
  const { DID: secondDid, ...secondOthers } = second;

  for (const key in firstOthers) {
    if (first[key] !== second[key]) {
      return false;
    }
  }
  for (const key in secondOthers) {
    if (first[key] !== second[key]) {
      return false;
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

/**
 * This applies the mapping from unresolvedPvName (str) using the MacroMap provided (substitutions)
 * This function shouldn't be called directly and instead the wrapper function resolveMacros
 * should be used
 * @param str  string to run through the substitution process
 * @param substitutions substitutions to apply to the string
 */
function interpolate(
  str: string,
  substitutions: { [substitution: string]: string }
): string {
  const requiredMappings: string[] = [];

  // regex matches any pattern that start with $, is followed by { or (,
  // then has a series of characters with a closing after
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

  // apply substitutions to str
  return str.replace(regexp, (x, g): string => substitutions[g].toString());
}

/**
 * This maps an unresolvedPvName to the resolvedPvName, each macro in macroMap
 * is applied to the unresolvedPvName
 * Substitutions are made at all matching points, and if no mapping is provided
 * nothing is changed, ${} or $() are used to denote a substitution point
 * @param unresolvedPvName name to run through mapping
 * @param macroMap the mapping to apply to unresolvedPvName
 * @returns resolvedPvName: string (the name used in Coniql I believe)
 * @example unresolvedPvName: "AC${D}"
 * macroMap: {D: "F"}
 * resolveMacros(unresolvedPvName, macroMap) -> "ACF"
 */
export function resolveMacros(
  unresolvedPvName: string,
  macroMap: MacroMap
): string {
  const resolved: string = interpolate(unresolvedPvName, macroMap);
  return resolved;
}
