import { ApolloClient } from "@apollo/client";
import {
  ConiqlPlugin,
  ConiqlStatus,
  ConiqlTime,
  ConiqlBase64Array,
  DEVICE_QUERY
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

  public constructor(content: {
    float?: number;
    string?: string;
    array?: ConiqlBase64Array;
    time?: ConiqlTime;
    status?: ConiqlStatus;
  }) {
    const { float, string, array, time, status } = content;
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

describe("ConiqlPlugin", (): void => {
  let cp: ConiqlPlugin;
  let mockConnUpdate: jest.Mock;
  let mockValUpdate: jest.Mock;
  let mockDevUpdate: jest.Mock;
  beforeEach((): void => {
    cp = new ConiqlPlugin("a.b.c:100", false);
    mockConnUpdate = jest.fn();
    mockValUpdate = jest.fn();
    mockDevUpdate = jest.fn();
    cp.connect(mockConnUpdate, mockValUpdate, mockDevUpdate);
  });

  it("handles update to value", (): void => {
    ApolloClient.prototype.subscribe = jest.fn(
      (_): MockObservable => new MockObservable({ float: 42 })
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
          // Corresponds to Int32Array with values [0, 1, 2]
          {
            array: {
              numberType: "INT32",
              base64: "AAAAAAEAAAACAAAA"
            }
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
        new MockObservable({
          time: {
            datetime: new Date(2017, 1, 1)
          }
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

  it("queries with device query", (): void => {
    const catchFunc = jest.fn();
    const thenFunc = jest.fn(() => {
      return { catch: catchFunc };
    });
    const query: any = jest.fn(() => {
      return { then: thenFunc };
    });

    // 'as any' as client is a private property
    (cp as any).client.query = query;
    cp.getDevice("dev://stuff");
    expect((cp as any).client.query).toHaveBeenCalledWith({
      query: DEVICE_QUERY,
      variables: { device: "stuff" }
    });
  });
});
