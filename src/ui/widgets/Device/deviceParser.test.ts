import { deviceParser } from "./deviceParser";

const response =
  'DType: {"getDevice":{"id":"Xspress3","children":[{"name":"Temperature","label":"Temperature","child":{"__typename":"Channel","id":"ssim://sine(40, 50)"},"__typename":"NamedChild"},{"name":"Channel1","label":"Channel1","child":{"__typename":"Device","id":"Xspress3.Channel1"},"__typename":"NamedChild"},{"name":"Channel2","label":"Channel2","child":{"__typename":"Device","id":"Xspress3.Channel2"},"__typename":"NamedChild"},{"name":"Channel3","label":"Channel3","child":{"__typename":"Device","id":"Xspress3.Channel3"},"__typename":"NamedChild"},{"name":"Channel4","label":"Channel4","child":{"__typename":"Device","id":"Xspress3.Channel4"},"__typename":"NamedChild"}],"__typename":"Device"}}';

describe("response is parser", (): void => {
  test("Xspress3 is parser", (): void => {
    deviceParser(response);
  });
});
