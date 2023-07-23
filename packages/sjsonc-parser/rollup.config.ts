import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import { RollupOptions } from "rollup";
import ts from "typescript";

const config: RollupOptions[] = [
  {
    input: "src/index.ts",
    output: {
      file: "lib/index.js",
      format: "cjs",
      sourcemap: true,
    },
    plugins: [
      typescript({
        compilerOptions: {
          module: "ESNext",
          target: "es5",
        },
        include: ["src/**/*.ts"],
        exclude: ["src/**/*.test.ts"],
        typescript: ts,
        declaration: true,
        declarationDir: "types",
      }),
      nodeResolve(),
      commonjs(),
      terser(),
    ],
  },
  {
    input: "src/index.ts",
    output: {
      file: "es/index.js",
      format: "es",
      sourcemap: true,
    },
    external: ["lodash-es"],
    plugins: [
      typescript({
        compilerOptions: {
          module: "ESNext",
          target: "ESNext",
        },
        include: ["src/**/*.ts"],
        exclude: ["src/**/*.test.ts"],
        typescript: ts,
        declaration: false,
      }),
      nodeResolve(),
      commonjs(),
      terser(),
    ],
  },
];

export default config;
