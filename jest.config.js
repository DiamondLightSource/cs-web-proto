module.exports = {
  roots: ["<rootDir>/src"],
  transform: { "^.+\\.tsx?$": "ts-jest" },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  setupTestFrameworkScriptFile: "<rootDir>/src/setupTests.tsx",
  collectCoverage: true,
  collectCoverageFrom: ["**/*.ts", "!<rootDir>/node_modules/**"],
  coverageReporters: ["lcov", "text-summary", "html"]
};
