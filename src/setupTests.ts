// React testing library extensions to expect().
import "@testing-library/jest-dom/extend-expect";
// Set up Enzyme.
import { configure } from "enzyme";
import log from "loglevel";
import Adapter from "enzyme-adapter-react-16";
import { DType, DAlarm } from "./types/dtypes";
configure({ adapter: new Adapter() });

log.setLevel("info");

// Plotly expects this function to exist but it doesn't
// when testing.
if (typeof window.URL.createObjectURL === "undefined") {
  Object.defineProperty(window.URL, "createObjectURL", { value: () => {} });
}

// Mock window.open
window.open = jest.fn();

export function ddouble(
  doubleValue: number,
  alarm: DAlarm = DAlarm.NONE
): DType {
  return new DType({ doubleValue: doubleValue }, alarm);
}

export function ddoubleArray(
  arrayValue: number[],
  alarm: DAlarm = DAlarm.NONE
): DType {
  return new DType({ arrayValue: Float64Array.from(arrayValue) }, alarm);
}

export function dstring(
  stringValue: string,
  alarm: DAlarm = DAlarm.NONE
): DType {
  return new DType({ stringValue: stringValue }, alarm);
}
