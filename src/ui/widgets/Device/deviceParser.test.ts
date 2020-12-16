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
  test("Empty label fills in with placeholder", (): void => {
    expect(createLabel()).toMatch(`"text":"-"`);
  });

  test("Value is placed into label", (): void => {
    expect(createLabel("ValueHere")).toMatch("Value Here");
  });
});

describe("createReadback", (): void => {
  test("Empty pv fills in with placeholder", (): void => {
    expect(createReadback()).toMatch(`"pvName": ""`);
  });

  test("pv is placed into readback", (): void => {
    expect(createReadback("PvName")).toMatch(`"pvName": "PvName"`);
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
          id: "ca://BL21I-OP-MIRR-01:YAW.RBV"
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
          id: "ca://BL21I-OP-MIRR-01:YAW.LVIO"
        },
        __typename: "NamedChild"
      },
      {
        name: "Direction",
        label: "Direction",
        child: {
          __typename: "Channel",
          id: "ca://BL21I-OP-MIRR-01:YAW.DIR"
        },
        __typename: "NamedChild"
      }
    ],
    __typename: "Device"
  }
};
describe("parseResponseIntoObject", (): void => {
  test("properties are extracted", (): void => {
    const [deviceName, pvIds, groups] = parseResponseIntoObject(
      fakeResponseJson
    );
    expect(deviceName).toEqual("M1Yaw");
    expect(groups).toEqual({
      Limits: ["LimitViolation"]
    });
    expect(pvIds).toEqual({
      Readback: "ca://BL21I-OP-MIRR-01:YAW.RBV",
      LimitViolation: "ca://BL21I-OP-MIRR-01:YAW.LVIO",
      Direction: "ca://BL21I-OP-MIRR-01:YAW.DIR"
    });
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
    expect(component).toMatch(`"type": "groupbox"`);
    expect(component).toMatch(`"name": "Device"`);
    expect(component).toMatch(`"children": []`);
  });

  test("response is parsed", (): void => {
    const component = parseResponse(fakeResponseJson);
    expect(component).toMatch(`"name": "M1 Yaw"`);

    // Check labels corresponding to PVs are present
    expect(component).toMatch("Direction");
    expect(component).toMatch("Limit Violation");
    expect(component).toMatch("Readback");

    // Check group label is present
    expect(component).toMatch("Limits");

    // Check PV names are present
    expect(component).toMatch("ca://BL21I-OP-MIRR-01:YAW.RBV");
    expect(component).toMatch("ca://BL21I-OP-MIRR-01:YAW.LVIO");
    expect(component).toMatch("ca://BL21I-OP-MIRR-01:YAW.DIR");
  });
});
