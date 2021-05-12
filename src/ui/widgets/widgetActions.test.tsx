import {
  WRITE_PV,
  getActionDescription,
  WritePv,
  executeActions,
  WidgetActions
} from "./widgetActions";
import { writePv } from "../hooks/useSubscription";
import { DType } from "../../types/dtypes";

jest.mock(
  "../hooks/useSubscription",
  (): Record<string, (pvName: string, value: DType) => void> => {
    return {
      writePv: jest.fn()
    };
  }
);

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

export const ACTIONS_EX_FIRST = {
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
  it.each<[number, WidgetActions]>([
    [2, ACTIONS_EX_AS_ONE],
    [1, ACTIONS_EX_FIRST]
  ])("executes %d actions", (num, actions): void => {
    executeActions(actions);
    expect(writePv).toHaveBeenCalledTimes(num);
  });
});
