// React testing library extensions to expect().
import "@testing-library/jest-dom/extend-expect";
import log from "loglevel";

log.setLevel("info");

// Plotly expects this function to exist but it doesn't
// when testing.
if (typeof window.URL.createObjectURL === "undefined") {
  Object.defineProperty(window.URL, "createObjectURL", { value: () => {} });
}

// Mock window.open
window.open = jest.fn();
