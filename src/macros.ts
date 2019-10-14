import { MacroMap } from "./redux/csState";

function interpolate(
  str: string,
  substitutions: { [substitution: string]: string }
): string {
  const requiredMappings: string[] = [];

  const regexp = /\${(.*?)}/g;
  let result = null;
  while ((result = regexp.exec(str))) {
    requiredMappings.push(result[1]);
  }
  const missingMappings = requiredMappings.filter(
    (x: string): boolean => substitutions[x] === undefined
  );

  /* Allow missing macros to go unresolved. */
  for (var missing of missingMappings) {
    substitutions[missing] = "${" + missing + "}";
  }

  return str.replace(/\${(.*?)}/g, (x, g): string => substitutions[g]);
}

export function resolveMacros(
  unresolvedPvName: string,
  macroMap: MacroMap
): string {
  const resolved = interpolate(unresolvedPvName, macroMap);
  return resolved;
}
