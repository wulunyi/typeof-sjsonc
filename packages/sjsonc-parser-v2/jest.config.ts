import type { JestConfigWithTsJest } from "ts-jest";

const jestConfig: JestConfigWithTsJest = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: ".",
  verbose: true,
  coverageDirectory: "./coverage",
  moduleNameMapper: {
    "^lodash-es$": "lodash",
    chevrotain: "<rootDir>/node_modules/chevrotain/lib/chevrotain.mjs",
  },
  transformIgnorePatterns: [
    `node_modules/(?!(?:.pnpm/)?(chevrotain))`,
  ],
  transform: {
    "^.+\\.(js|mjs)$": 'babel-jest',
  },
};

export default jestConfig;
