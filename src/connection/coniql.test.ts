import { ApolloClient } from "apollo-client";
import {
  ConiqlPvPlugin,
  ConiqlStatus,
  ConiqlTime,
  ConiqlBase64Array,
  ConiqlDevicePlugin
} from "./coniql";
import { DType } from "../types/dtypes";

/* This mocks the observable returned by apolloclient.subscribe().
   Its subscribe method calls the next() method on its parameter
   with the data expected to be returned by Coniql. */
class MockObservable {
  private float?: number;
  private string?: string;
  private array?: ConiqlBase64Array;
  private time?: ConiqlTime;
  private status?: ConiqlStatus;

  public constructor(
    float?: number,
    string?: string,
    array?: ConiqlBase64Array,
    time?: ConiqlTime,
    status?: ConiqlStatus
  ) {
    this.float = float;
    this.string = string;
    this.array = array;
    this.time = time;
    this.status = status;
  }

  public subscribe(x: any): void {
    x.next({
      data: {
        subscribeChannel: {
          value: {
            float: this.float,
            string: this.string,
            base64Array: this.array
          },
          time: this.time
        }
      }
    });
  }
}

describe("ConiqlDevicePlugin", (): void => {
  let cp: ConiqlDevicePlugin;
  let mockConnUpdate: jest.Mock;
  let mockValUpdate: jest.Mock;
  let mockDevUpdate: jest.Mock;
  beforeEach((): void => {
    cp = new ConiqlDevicePlugin("x.y.z:1000");
    mockConnUpdate = jest.fn();
    mockValUpdate = jest.fn();
    mockDevUpdate = jest.fn();
    cp.connect(mockConnUpdate, mockValUpdate, mockDevUpdate);
  });

  it("subscribes to a device", (): void => {
    ApolloClient.prototype.subscribe = jest.fn(
      (_): MockObservable => new MockObservable(42)
    ) as jest.Mock;
    cp.subscribe("pvDevice", {});
    expect(ApolloClient.prototype.subscribe).toHaveBeenCalled();
    expect(mockDevUpdate).toHaveBeenCalledWith(
      "pvDevice",
      new DType({
        stringValue: JSON.stringify({
          subscribeChannel: {
            value: {
              float: 42
            }
          }
        })
      })
    );
  });
});

describe("ConiqlPvPlugin", (): void => {
  let cp: ConiqlPvPlugin;
  let mockConnUpdate: jest.Mock;
  let mockValUpdate: jest.Mock;
  let mockDevUpdate: jest.Mock;
  beforeEach((): void => {
    cp = new ConiqlPvPlugin("a.b.c:100");
    mockConnUpdate = jest.fn();
    mockValUpdate = jest.fn();
    mockDevUpdate = jest.fn();
    cp.connect(mockConnUpdate, mockValUpdate, mockDevUpdate);
  });

  it("handles update to value", (): void => {
    ApolloClient.prototype.subscribe = jest.fn(
      (_): MockObservable => new MockObservable(42)
    ) as jest.Mock;
    cp.subscribe("hello", { string: true });
    expect(ApolloClient.prototype.subscribe).toHaveBeenCalled();
    expect(mockValUpdate).toHaveBeenCalledWith(
      "hello",
      new DType({ doubleValue: 42 }, undefined, undefined, undefined, true)
    );
  });

  it("handles update to array value", (): void => {
    ApolloClient.prototype.subscribe = jest.fn(
      (_): MockObservable =>
        new MockObservable(
          undefined,
          undefined,
          // Corresponds to Int32Array with values [0, 1, 2]
          {
            numberType: "INT32",
            base64: "AAAAAAEAAAACAAAA"
          }
        )
    ) as jest.Mock;
    cp.subscribe("hello", { string: true });
    expect(ApolloClient.prototype.subscribe).toHaveBeenCalled();
    expect(mockValUpdate).toHaveBeenCalledWith(
      "hello",
      new DType(
        { arrayValue: Int32Array.from([0, 1, 2]) },
        undefined,
        undefined,
        undefined,
        true
      )
    );
  });

  it("handles update to time", (): void => {
    ApolloClient.prototype.subscribe = jest.fn(
      (_): MockObservable =>
        new MockObservable(undefined, undefined, undefined, {
          datetime: new Date(2017, 1, 1)
        })
    ) as jest.Mock;
    cp.subscribe("hello", { string: true });
    expect(ApolloClient.prototype.subscribe).toHaveBeenCalled();
    const calls = mockValUpdate.mock.calls;
    expect(calls.length).toBe(1);
    const [pv, value] = mockValUpdate.mock.calls[0];
    expect(pv).toBe("hello");
    expect(value.time?.datetime?.getFullYear()).toBe(2017);
  });
});
