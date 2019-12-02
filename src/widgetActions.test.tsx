import { WRITE_PV, getActionDescription, WritePv } from "./widgetActions";

const WRITE_PV_ACTION: WritePv = {
  type: WRITE_PV,
  pvName: "PV",
  value: "value",
  description: "write value to PV"
};

const WRITE_PV_ACTION_NO_DESC: WritePv = {
  type: WRITE_PV,
  pvName: "PV",
  value: "value"
};

describe("getActionDescription", (): void => {
  it("returns description if present", (): void => {
    const desc = getActionDescription(WRITE_PV_ACTION);
    expect(desc).toEqual(WRITE_PV_ACTION.description);
  });
  it("generates description if not present", (): void => {
    const desc = getActionDescription(WRITE_PV_ACTION_NO_DESC);
    expect(desc).toEqual("Write value to PV");
  });
});
