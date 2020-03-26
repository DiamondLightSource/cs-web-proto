// File with useful functions for manipulating the path

import { MacroMap } from "../../redux/csState";
import { History } from "history";

export interface UrlPageDescription {
  filename: string;
  filetype: "json" | "opi" | "bob";
  macros: MacroMap;
}

export interface UrlInfo {
  [key: string]: UrlPageDescription;
}

// Functions for getting/putting url from/to history object
export function getUrlInfoFromHistory(history: History): UrlInfo {
  const info = history.location.pathname
    .split("/")
    .slice(1)
    .join("/");

  if (info === "") {
    return {};
  } else {
    return JSON.parse(decodeURIComponent(info)) as UrlInfo;
  }
}

export function putUrlInfoToHistory(history: History, info: UrlInfo): void {
  history.push("/" + encodeURIComponent(JSON.stringify(info)));
}

// Add or update a page
export function updatePageDesciption(
  info: UrlInfo,
  page: string,
  desc: UrlPageDescription
): UrlInfo {
  return { ...info, [page]: desc };
}

// Remove a page
export function removePageDescription(info: UrlInfo, page: string): UrlInfo {
  const { [page]: value, ...remainingInfo } = info;
  return remainingInfo;
}
