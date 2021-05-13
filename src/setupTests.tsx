// React testing library extensions to expect().
import "@testing-library/jest-dom/extend-expect";
import { configure } from "enzyme";
import log from "loglevel";
import Adapter from "enzyme-adapter-react-16";

// Set up Enzyme.
configure({ adapter: new Adapter() });

log.setLevel("info");

// Plotly expects this function to exist but it doesn't
// when testing.
if (typeof window.URL.createObjectURL === "undefined") {
  Object.defineProperty(window.URL, "createObjectURL", { value: () => {} });
}

// Mock window.open
window.open = jest.fn();
