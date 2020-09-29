import React from "react";
import { MacroMap, macrosEqual } from "./types/macros";

export interface FileDescription {
  // All information required for an embedded display
  path: string; // Name or file of path (without suffix ?)
  type: "json" | "opi" | "bob"; // File type - which parser and suffix
  macros: MacroMap; // Macros
  defaultProtocol: string; // Default PV prefix for parser
}

/**
 * Compare each property on two FileDescription objects
 * Return true if all properties are equal
 */
export function fileDescEqual(
  first: FileDescription,
  second: FileDescription
): boolean {
  if (first === undefined || second === undefined) {
    return false;
  }
  const val =
    first.path === second.path &&
    first.type === second.type &&
    first.defaultProtocol === second.defaultProtocol &&
    macrosEqual(first.macros, second.macros);
  return val;
}

export interface LocationCache {
  // Location (a string), contains a tuple of a string with a FileDescription
  [location: string]: [string, FileDescription];
}
export type FileContextType = {
  locations: LocationCache;
  addFile: (location: string, fileDesc: FileDescription, name: string) => void;
  removeFile: (location: string, fileDesc: FileDescription) => void;
};

// React.useContext(FileContext) gives access to each of the
// properties in initialState
const initialState: FileContextType = {
  locations: {},
  addFile: () => {},
  removeFile: () => {}
};
export const FileContext = React.createContext(initialState);
