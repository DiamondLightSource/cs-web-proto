import {
  wordSplitter,
  createLabel,
  createReadback,
  parseResponseIntoObject,
  parseResponse,
  Response
} from "./deviceParser";

describe("wordSplitter", (): void => {
  test("Splits a word and trims spaces", (): void => {
    const before = "WordSplitter";
    const after = "Word Splitter";
    expect(wordSplitter(before)).toEqual(after);
  });

  test("Splits multiple words", (): void => {
    const before = "HereAreSomeWords";
    const after = "Here Are Some Words";
    expect(wordSplitter(before)).toEqual(after);
  });
});

describe("createLabel", (): void => {
  test("Value is placed into label", (): void => {
    expect(createLabel("ValueHere").text).toBe("Value Here");
  });
});

describe("createReadback", (): void => {
  test("pv is placed into readback", (): void => {
    expect(createReadback("PvName").pvName).toBe("PvName");
  });
});

const fakeResponseJson: Response = {
  getDevice: {
    id: "M1Yaw",
    children: [
      {
        name: "Readback",
        label: "Readback",
        child: {
          __typename: "Channel",
          id: "ca://BL21I-OP-MIRR-01:YAW.RBV",
          display: {
            description: "Readback",
            widget: "TEXTUPDATE"
          }
        },
        __typename: "NamedChild"
      },
      {
        name: "Limits",
        label: "Limits",
        child: {
          __typename: "Group",
          layout: "BOX",
          children: [{ name: "LimitViolation", __typename: "NamedChild" }]
        },
        __typename: "NamedChild"
      },
      {
        name: "LimitViolation",
        label: "Limit Violation",
        child: {
          __typename: "Channel",
          id: "ca://BL21I-OP-MIRR-01:YAW.LVIO",
          display: {
            description: "Limit Violation",
            widget: "TEXTUPDATE"
          }
        },
        __typename: "NamedChild"
      },
      {
        name: "Direction",
        label: "Direction",
        child: {
          __typename: "Channel",
          id: "ca://BL21I-OP-MIRR-01:YAW.DIR",
          display: {
            description: "Direction",
            widget: "TEXTUPDATE"
          }
        },
        __typename: "NamedChild"
      }
    ],
    __typename: "Device"
  }
};
describe("parseResponseIntoObject", (): void => {
  test("properties are extracted", (): void => {
    const [deviceName, pvIds, groups] =
      parseResponseIntoObject(fakeResponseJson);
    expect(deviceName).toEqual("M1Yaw");
    expect(groups).toEqual({
      Limits: ["LimitViolation"]
    });
    expect(Object.values(pvIds).map(channel => channel.id)).toEqual([
      "ca://BL21I-OP-MIRR-01:YAW.RBV",
      "ca://BL21I-OP-MIRR-01:YAW.LVIO",
      "ca://BL21I-OP-MIRR-01:YAW.DIR"
    ]);
  });

  test("empty response returns empty objects", (): void => {
    const [deviceName, pvIds, groups] = parseResponseIntoObject({} as Response);
    expect(deviceName).toEqual("");
    expect(pvIds).toEqual({});
    expect(groups).toEqual({});
  });
});

describe("parseResponse", (): void => {
  test("empty response gives empty groupbox", (): void => {
    const component = parseResponse({} as Response);
    expect(component.type).toBe("groupbox");
    expect(component.name).toBe("Device");
    expect(component.children[0].children.length).toBe(0);
  });

  test("response is parsed", (): void => {
    const component = parseResponse(fakeResponseJson);
    expect(component.name).toMatch("M1 Yaw");

    const children = component.children[0].children;

    // Individual pvs are first
    expect(children[0].text).toBe("Readback");
    expect(children[1].pvName).toBe("ca://BL21I-OP-MIRR-01:YAW.RBV");
    expect(children[2].text).toBe("Direction");
    expect(children[3].pvName).toBe("ca://BL21I-OP-MIRR-01:YAW.DIR");

    // Groups are next
    const subChild = children[4].children[0].children;
    expect(subChild[0].text).toBe("Limit Violation");
    expect(subChild[1].pvName).toBe("ca://BL21I-OP-MIRR-01:YAW.LVIO");
  });
});
