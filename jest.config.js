module.exports = {
  roots: ["<rootDir>/src"],
  transform: { "^.+\\.tsx?$": "ts-jest" },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  snapshotSerializers: ["enzyme-to-json/serializer"],
  setupTestFrameworkScriptFile: "<rootDir>/src/setupTests.ts",
  collectCoverage: true,
  collectCoverageFrom: ["**/*.ts", "!<rootDir>/node_modules/**"]
  coverageReporters: ["lcov", "text-summary", "html"]
};
