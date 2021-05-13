import {
  SUBSCRIBE,
  Subscribe,
  WRITE_PV,
  WritePv,
  QueryDevice,
  QUERY_DEVICE
} from "./actions";
import { connectionMiddleware } from "./connectionMiddleware";
import { ddouble } from "../testResources";
import { DType } from "../types/dtypes";

const mockStore = { dispatch: jest.fn(), getState: jest.fn() };

const mockConnection = {
  subscribe: jest.fn(),
  putPv: jest.fn(),
  connect: jest.fn(),
  isConnected: jest.fn(),
  unsubscribe: jest.fn(),
  getDevice: jest.fn()
};

describe("connectionMiddleware", (): void => {
  beforeEach((): void => {
    mockConnection.subscribe.mockClear();
    mockConnection.connect.mockClear();
    mockConnection.putPv.mockClear();
    mockStore.dispatch.mockClear();
    mockConnection.getDevice.mockClear();
  });
  it("calls subscribe() when receiving Subscribe", (): void => {
    const middleware = connectionMiddleware(mockConnection);
    // nextHandler takes next() and returns the actual middleware function
    const nextHandler = middleware(mockStore);
    const mockNext = jest.fn();
    // actionHandler takes an action
    const actionHandler = nextHandler(mockNext);
    const subscribeAction: Subscribe = {
      type: SUBSCRIBE,
      payload: {
        pvName: "pv",
        componentId: "2",
        effectivePvName: "pv",
        type: { double: true }
      }
    };
    actionHandler(subscribeAction);
    expect(mockConnection.subscribe).toHaveBeenCalledTimes(1);
    // The action is passed on.
    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockNext.mock.calls[0][0].type).toEqual(SUBSCRIBE);
  });
  it("calls putPv() when receiving WritePv", (): void => {
    // Set up state
    mockStore.getState.mockReturnValue({ effectivePvNameMap: {} });
    const middleware = connectionMiddleware(mockConnection);
    // nextHandler takes next() and returns the actual middleware function
    const nextHandler = middleware(mockStore);
    const mockNext = jest.fn();
    // actionHandler takes an action
    const actionHandler = nextHandler(mockNext);
    const writeAction: WritePv = {
      type: WRITE_PV,
      payload: { pvName: "pv", value: ddouble(0) }
    };
    actionHandler(writeAction);
    expect(mockConnection.putPv).toHaveBeenCalledTimes(1);
    // The action is passed on.
    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockNext.mock.calls[0][0].type).toEqual(WRITE_PV);
  });

  it("calls getDevice() when receiving query device", (): void => {
    mockStore.getState.mockReturnValue({ deviceCache: {} });
    const middleware = connectionMiddleware(mockConnection);
    const nextHandler = middleware(mockStore);
    const mockNext = jest.fn();
    const actionHandler = nextHandler(mockNext);
    const queryAction: QueryDevice = {
      type: QUERY_DEVICE,
      payload: { device: "dev://device" }
    };
    actionHandler(queryAction);
    expect(mockConnection.getDevice).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockNext.mock.calls[0][0].type).toEqual(QUERY_DEVICE);
  });

  it("doesn't query when the current device is in cache", (): void => {
    mockStore.getState.mockReturnValue({
      deviceCache: { testDevice: new DType({ stringValue: "42" }) }
    });
    const middleware = connectionMiddleware(mockConnection);
    const nextHandler = middleware(mockStore);
    const mockNext = jest.fn();
    const actionHandler = nextHandler(mockNext);
    const queryAction: QueryDevice = {
      type: QUERY_DEVICE,
      payload: { device: "testDevice" }
    };
    actionHandler(queryAction);
    expect(mockConnection.getDevice).toHaveBeenCalledTimes(0);
  });
});
