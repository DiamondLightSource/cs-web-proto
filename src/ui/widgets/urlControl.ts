// File with useful functions for manipulating the path

import { History } from "history";
import { FileDescription } from "./propTypes";

export interface UrlInfo {
  [key: string]: FileDescription | UrlInfo;
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
  desc: FileDescription
): UrlInfo {
  return { ...info, [page]: desc };
}

// Remove a page
export function removePageDescription(info: UrlInfo, page: string): UrlInfo {
  const { [page]: value, ...remainingInfo } = info;
  return remainingInfo;
}

export function updateTabDesciption(
  info: UrlInfo,
  tab: string,
  page: string,
  desc: FileDescription
): UrlInfo {
  // Using pattern found at https://redux.js.org/recipes/structuring-reducers/immutable-update-patterns
  return { ...info, [tab]: { ...info[tab], [page]: desc } };
}

// Remove a page
export function removeTabDescription(
  info: UrlInfo,
  tab: string,
  page: string
): UrlInfo {
  const tabInfo = info[tab] as UrlInfo;
  const { [page]: value, ...remainingInfo } = tabInfo;
  return { ...info, [tab]: remainingInfo };
}
