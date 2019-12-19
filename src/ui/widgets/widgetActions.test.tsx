import {
  WRITE_PV,
  getActionDescription,
  WritePv,
  executeActions,
  WidgetActions
} from "./widgetActions";
import { writePv } from "../hooks/useSubscription";

jest.mock("../hooks/useSubscription", (): object => {
  return {
    writePv: jest.fn()
  };
});

const WRITE_PV_ACTION: WritePv = {
  type: WRITE_PV,
  writePvInfo: {
    pvName: "PV",
    value: "value",
    description: "write value to PV"
  }
};

const WRITE_PV_ACTION_NO_DESC: WritePv = {
  type: WRITE_PV,
  writePvInfo: {
    pvName: "PV",
    value: "value"
  }
};

const ACTIONS_EX_AS_ONE = {
  actions: [WRITE_PV_ACTION, WRITE_PV_ACTION_NO_DESC],
  executeAsOne: true
};

const ACTIONS_EX_FIRST = {
  actions: [WRITE_PV_ACTION, WRITE_PV_ACTION_NO_DESC],
  executeAsOne: false
};

describe("getActionDescription", (): void => {
  it("returns description if present", (): void => {
    const desc = getActionDescription(WRITE_PV_ACTION);
    expect(desc).toEqual(WRITE_PV_ACTION.writePvInfo.description);
  });
  it("generates description if not present", (): void => {
    const desc = getActionDescription(WRITE_PV_ACTION_NO_DESC);
    expect(desc).toEqual("Write value to PV");
  });
});

describe("executeActions", (): void => {
  it.each<[WidgetActions, number]>([
    [ACTIONS_EX_AS_ONE, 2],
    [ACTIONS_EX_FIRST, 3] // cumulative? we should reset it
  ])("executes %d actions", (actions, num): void => {
    executeActions(actions);
    expect(writePv).toHaveBeenCalledTimes(num);
  });
});
