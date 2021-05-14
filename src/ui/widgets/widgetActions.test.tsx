import {
  getActionDescription,
  executeActions,
  WidgetActions
} from "./widgetActions";
import * as useSubscription from "../hooks/useSubscription";
import {
  ACTIONS_EX_AS_ONE,
  ACTIONS_EX_FIRST,
  WRITE_PV_ACTION,
  WRITE_PV_ACTION_NO_DESC
} from "../../testResources";

const mockWritePv = jest
  .spyOn(useSubscription, "writePv")
  .mockImplementation(jest.fn());

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
    expect(mockWritePv).toHaveBeenCalledTimes(num);
  });
});
