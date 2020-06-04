import {
  getUrlInfoFromHistory,
  putUrlInfoToHistory,
  UrlInfo,
  UrlPageDescription,
  updatePageDesciption,
  removePageDescription,
  updateTabDesciption,
  removeTabDescription
} from "./urlControl";
import { History } from "history";

const mockHistory = {
  location: {
    pathname: "mypath/"
  },
  push(path: string): void {
    this.location.pathname = path;
  }
} as History;

const mockInfo: UrlInfo = {
  page1: {
    filename: "page1",
    filetype: "json",
    macros: {}
  },
  page2: {
    filename: "page2",
    filetype: "bob",
    macros: {}
  },
  page3: {
    filename: "page3",
    filetype: "opi",
    macros: {
      device: "example device"
    }
  },
  tabs: {
    tabOne: {
      filename: "one",
      filetype: "json",
      macros: {}
    }
  }
};

beforeEach((): void => {
  mockHistory.location.pathname = "mypath/";
});

describe("interaction with history", (): void => {
  it("puts one description in history", (): void => {
    const desc: UrlPageDescription = {
      filename: "file",
      filetype: "json",
      macros: {
        device: "example device"
      }
    };
    const info: UrlInfo = {
      desc: desc
    };
    putUrlInfoToHistory(mockHistory, info);
    expect(mockHistory.location.pathname).toBe(
      "/" + encodeURIComponent(JSON.stringify(info))
    );
  });

  it("returns nothing when path is blank", (): void => {
    expect(getUrlInfoFromHistory(mockHistory)).toEqual({});
  });
  it("gets one page description properly", (): void => {
    const desc: UrlPageDescription = {
      filename: "file",
      filetype: "json",
      macros: {
        device: "example device"
      }
    };
    const info: UrlInfo = {
      desc: desc
    };
    putUrlInfoToHistory(mockHistory, info);
    expect(getUrlInfoFromHistory(mockHistory)).toEqual(info);
  });
  it("gets multiple page descriptions properly", (): void => {
    const desc: UrlPageDescription = {
      filename: "file",
      filetype: "json",
      macros: {
        device: "example device"
      }
    };
    const info: UrlInfo = {
      desc: desc,
      desc2: desc,
      desc3: desc
    };
    putUrlInfoToHistory(mockHistory, info);
    expect(getUrlInfoFromHistory(mockHistory)).toEqual(info);
  });
});

describe("modifying UrlInfo object", (): void => {
  it("adds a new page description", (): void => {
    const desc: UrlPageDescription = {
      filename: "page4",
      filetype: "json",
      macros: {}
    };
    const info = updatePageDesciption(mockInfo, "page4", desc);
    expect(info.page4).toStrictEqual(desc);
  });
  it("modifies and existing page description", (): void => {
    const desc: UrlPageDescription = {
      filename: "page4",
      filetype: "json",
      macros: {}
    };
    const info = updatePageDesciption(mockInfo, "page1", desc);
    expect(info.page1).toStrictEqual(desc);
  });
  it("removes an existing page description", (): void => {
    const info = removePageDescription(mockInfo, "page2");
    expect(info.page2).toBeUndefined();
  });

  it("adds a new tab container with page description", (): void => {
    const newTab: UrlPageDescription = {
      filename: "two",
      filetype: "json",
      macros: {}
    };
    const info = updateTabDesciption(mockInfo, "tabs_two", "tabTwo", newTab);
    expect(info.tabs_two).toStrictEqual({ tabTwo: newTab });
  });
  it("adds a new tab to an existing container", (): void => {
    const newTab: UrlPageDescription = {
      filename: "two",
      filetype: "json",
      macros: {}
    };
    const info = updateTabDesciption(mockInfo, "tabs", "tabTwo", newTab);
    expect(info.tabs).toStrictEqual({
      tabOne: {
        filename: "one",
        filetype: "json",
        macros: {}
      },
      tabTwo: newTab
    });
  });
  it("updates an existing tab in an existing container", (): void => {
    const newTab: UrlPageDescription = {
      filename: "two",
      filetype: "json",
      macros: {}
    };
    const info = updateTabDesciption(mockInfo, "tabs", "tabOne", newTab);
    expect(info.tabs).toStrictEqual({ tabOne: newTab });
  });
  it("removes an existing tab in an existing container", (): void => {
    const info = removeTabDescription(mockInfo, "tabs", "tabOne");
    expect(info.tabs).toStrictEqual({});
  });
  it("Adds a new tab and removes an old one", (): void => {
    const newTab: UrlPageDescription = {
      filename: "two",
      filetype: "json",
      macros: {}
    };
    const addedTabInfo = updateTabDesciption(
      mockInfo,
      "tabs",
      "tabTwo",
      newTab
    );
    const removedTabInfo = removeTabDescription(addedTabInfo, "tabs", "tabOne");
    expect(removedTabInfo.tabs).toStrictEqual({ tabTwo: newTab });
  });
});
