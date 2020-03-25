import {
  getUrlInfoFromHistory,
  putUrlInfoToHistory,
  UrlInfo,
  UrlPageDescription,
  updatePageDesciption,
  removePageDescription
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
    macroMap: {}
  },
  page2: {
    filename: "page2",
    filetype: "bob",
    macroMap: {}
  },
  page3: {
    filename: "page3",
    filetype: "opi",
    macroMap: {
      device: "example device"
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
      macroMap: {
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
      macroMap: {
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
      macroMap: {
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
      macroMap: {}
    };
    const info = updatePageDesciption(mockInfo, "page4", desc);
    expect(info.page4).toStrictEqual(desc);
  });
  it("modifies and existing page description", (): void => {
    const desc: UrlPageDescription = {
      filename: "page4",
      filetype: "json",
      macroMap: {}
    };
    const info = updatePageDesciption(mockInfo, "page1", desc);
    expect(info.page1).toStrictEqual(desc);
  });
  it("removes an existing page description", (): void => {
    const info = removePageDescription(mockInfo, "page2");
    expect(info.page2).toBeUndefined();
  });
});
