import { Color } from "./color";

describe("Color", (): void => {
  it.each<[string]>([["green"], ["red"]])(
    "accepts string as color",
    (name): void => {
      expect(new Color(name).toString()).toEqual(name);
    }
  );
});
