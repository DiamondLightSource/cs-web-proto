import { ApolloClient } from "apollo-client";
import { ConiqlPlugin, ConiqlTime, ConiqlStatus } from "./coniql";

const EPOCH_2017 = { seconds: 1511111111, nanoseconds: 0, userTag: 0 };

class MockObservable {
  private value?: any;
  private time?: ConiqlTime;
  private meta?: any;
  private status?: ConiqlStatus;

  public constructor(
    value: any,
    time?: ConiqlTime,
    meta?: any,
    status?: ConiqlStatus
  ) {
    this.value = value;
    this.time = time;
    this.meta = meta;
    this.status = status;
  }

  public subscribe(x: any): void {
    x.next({
      data: { subscribeChannel: { value: this.value, time: this.time } }
    });
  }
}

describe("ConiqlPlugin", (): void => {
  let cp: ConiqlPlugin;
  let mockConnUpdate: jest.Mock;
  let mockValUpdate: jest.Mock;
  beforeEach((): void => {
    cp = new ConiqlPlugin("a.b.c:100");
    mockConnUpdate = jest.fn();
    mockValUpdate = jest.fn();
    cp.connect(mockConnUpdate, mockValUpdate);
  });

  it("handles update to value", (): void => {
    ApolloClient.prototype.subscribe = jest.fn(
      (_): MockObservable => new MockObservable(42)
    ) as jest.Mock;
    cp.subscribe("hello");
    expect(ApolloClient.prototype.subscribe).toHaveBeenCalled();
    expect(mockValUpdate).toHaveBeenCalledWith("hello", { value: 42 });
  });

  it("handles update to time", (): void => {
    ApolloClient.prototype.subscribe = jest.fn(
      (_): MockObservable => new MockObservable(undefined, EPOCH_2017)
    ) as jest.Mock;
    cp.subscribe("hello");
    expect(ApolloClient.prototype.subscribe).toHaveBeenCalled();
    const calls = mockValUpdate.mock.calls;
    expect(calls.length).toBe(1);
    const [pv, value] = mockValUpdate.mock.calls[0];
    expect(pv).toBe("hello");
    expect(value.time.asDate().getFullYear()).toBe(2017);
  });
});
