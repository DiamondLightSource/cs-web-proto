import { UpdateThrottle, throttleMiddleware } from "./throttleMiddleware";
import {
  VALUE_CHANGED,
  CONNECTION_CHANGED,
  VALUES_CHANGED,
  ValueChanged,
  ConnectionChanged
} from "./actions";
import { ddouble } from "../testResources";

// Mock setInterval.
jest.useFakeTimers();
const mockStore = { dispatch: jest.fn(), getState: jest.fn() };

describe("UpdateThrottle", (): void => {
  beforeEach((): void => {
    mockStore.dispatch.mockClear();
  });
  it("collects updates", (): void => {
    const updater = new UpdateThrottle(1000);
    const payload1 = {
      pvName: "PV",
      value: ddouble(0)
    };
    const payload2 = {
      pvName: "PV",
      value: ddouble(1)
    };
    updater.queueUpdate(
      {
        type: VALUE_CHANGED,
        payload: payload1
      },
      mockStore
    );
    updater.queueUpdate(
      {
        type: VALUE_CHANGED,
        payload: payload2
      },
      mockStore
    );
    updater.sendQueue(mockStore);
    expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
    expect(mockStore.dispatch.mock.calls[0][0].type).toEqual(VALUES_CHANGED);
  });
});

describe("throttleMidddlware", (): void => {
  const updater = new UpdateThrottle(100);
  beforeEach((): void => {
    mockStore.dispatch.mockClear();
  });
  it("dispatches ValuesChanged when receiving ValueChanged", (): void => {
    const middleware = throttleMiddleware(updater);
    // nextHandler takes next() and returns the actual middleware function
    const nextHandler = middleware(mockStore);
    const mockNext = jest.fn();
    // actionHandler takes an action
    const actionHandler = nextHandler(mockNext);
    const valueAction: ValueChanged = {
      type: VALUE_CHANGED,
      payload: { pvName: "pv", value: ddouble(0) }
    };
    actionHandler(valueAction);

    // manually trigger the dispatch
    updater.sendQueue(mockStore);
    expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
    expect(mockStore.dispatch.mock.calls[0][0].type).toEqual(VALUES_CHANGED);
    // The value update is not passed on.
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("doesn't dispatch when receiving ConnectionChanged", (): void => {
    const middleware = throttleMiddleware(updater);
    // nextHandler takes next() and returns the actual middleware function
    const nextHandler = middleware(mockStore);
    const mockNext = jest.fn();
    // actionHandler takes an action
    const actionHandler = nextHandler(mockNext);
    const connectionAction: ConnectionChanged = {
      type: CONNECTION_CHANGED,
      payload: { pvName: "pv", value: { isReadonly: false, isConnected: true } }
    };
    actionHandler(connectionAction);
    expect(mockStore.dispatch).toHaveBeenCalledTimes(0);
    expect(mockNext).toHaveBeenCalledWith(connectionAction);
  });
});
