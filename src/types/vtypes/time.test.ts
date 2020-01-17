import { time } from "./time";

describe("Time", (): void => {
  test("asDate function", (): void => {
    const epoch = time({ secondsPastEpoch: 0, nanoseconds: 0 }, 0, true);
    const date = epoch.asDate();
    expect(date.getFullYear()).toEqual(1970);
    expect(date.getMonth()).toEqual(0);
    expect(date.getDate()).toEqual(1);
    expect(date.getUTCHours()).toEqual(0);
  });
});
