/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  moduleNameMapper: {
    "^lodash-es$": "lodash",
  },
  testEnvironment: "node",
  rootDir: "./src",
  coverageDirectory: "../coverage",
};
