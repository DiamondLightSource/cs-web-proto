import { ApolloClient } from "apollo-client";
import { ConiqlPlugin, ConiqlTime, ConiqlStatus } from "./coniql";

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
  it("handles update to value", (): void => {
    ApolloClient.prototype.subscribe = jest.fn(
      (_): MockObservable => new MockObservable(42)
    ) as jest.Mock;
    const cp = new ConiqlPlugin("a.b.c:100");
    const mockConnUpdate = jest.fn();
    const mockValUpdate = jest.fn();
    cp.connect(mockConnUpdate, mockValUpdate);
    cp.subscribe("hello");
    expect(ApolloClient.prototype.subscribe).toHaveBeenCalled();
    expect(mockValUpdate).toHaveBeenCalledWith("hello", { value: 42 });
  });
});
