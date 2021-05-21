import log from "loglevel";
import { useEffect, useState } from "react";
import { MacroMap } from "../../../types/macros";
import { AbsolutePosition } from "../../../types/position";
import { errorWidget, WidgetDescription } from "../createComponent";
import { parseBob } from "./bobParser";
import { parseJson } from "./jsonParser";
import { parseOpi } from "./opiParser";

// Global cache. Should perhaps be put in a context.
const fileCache: FileCache = {};
const fetchPromises: FetchPromises = {};

interface File {
  path: string;
  macros: MacroMap;
  defaultProtocol: string;
}
const EMPTY_WIDGET: WidgetDescription = {
  type: "shape",
  position: new AbsolutePosition("0", "0", "0", "0")
};

interface FileCache {
  [key: string]: WidgetDescription;
}
interface FetchPromises {
  [key: string]: Promise<WidgetDescription>;
}

async function fetchAndConvert(
  filepath: string,
  protocol: string
): Promise<WidgetDescription> {
  const parentDir = filepath.substr(0, filepath.lastIndexOf("/"));
  const filePromise = await fetch(filepath);
  const fileExt = filepath.split(".").pop() || "json";
  const contents = await filePromise.text();
  let description = EMPTY_WIDGET;
  try {
    // Hack!
    if (contents.startsWith("<!DOCTYPE html>")) {
      throw new Error("File not found");
    }
    if (contents !== "") {
      // Convert the contents to widget description style object
      switch (fileExt) {
        case "bob":
          description = parseBob(contents, protocol, parentDir);
          break;
        case "json":
          description = parseJson(contents, protocol, parentDir);
          break;
        case "opi":
          description = parseOpi(contents, protocol, parentDir);
          break;
      }
    }
    return description;
  } catch (error) {
    const message = `Error parsing ${filepath}: ${error}.`;
    log.warn(message);
    log.warn(error);
    return errorWidget(message);
  }
}

/* Hook to retrieve opi file and convert into the standard
   WidgetDescription. If the file has previously been requested
   return a cached version. If file fetching is in progress
   wait for it to complete and use that version.

   See https://www.robinwieruch.de/react-hooks-fetch-data
   and https://www.smashingmagazine.com/2020/07/custom-react-hook-fetch-cache-data/
*/
export function useOpiFile(file: File): WidgetDescription {
  const fileExt = file.path.split(".").pop() || "json";
  const [contents, setContents] = useState<WidgetDescription>(EMPTY_WIDGET);

  useEffect((): void => {
    const fetchData = async (): Promise<void> => {
      if (fetchPromises.hasOwnProperty(file.path)) {
        // This resource has been requested; once the cached
        // promise has been resolved the fileCache should be
        // populated.
        await fetchPromises[file.path];
        setContents(fileCache[file.path]);
      } else {
        const fetchPromise = fetchAndConvert(file.path, file.defaultProtocol);
        // Populate the promises cache.
        fetchPromises[file.path] = fetchPromise;
        const contents = await fetchPromise;
        // Populate the file cache.
        fileCache[file.path] = contents;
        setContents(contents);
      }
    };
    fetchData();
  }, [file.path, file.defaultProtocol, fileExt]);

  return contents;
}
