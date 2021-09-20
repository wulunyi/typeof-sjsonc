import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import visualizer from 'rollup-plugin-visualizer';
import cleanup from 'rollup-plugin-cleanup';
import ts from 'rollup-plugin-ts';
import { babel } from '@rollup/plugin-babel';

export default [
    {
        input: './src/index.ts',
        output: {
            file: 'lib/index.js',
            format: 'cjs',
            sourcemap: true,
        },
        plugins: [
            nodeResolve({
                extensions: ['.ts', '.js']
            }),
            commonjs(),
            babel({
                babelHelpers: 'bundled',
                extensions: ['.ts', '.js'],
                presets: ['@babel/preset-typescript', '@babel/preset-env']
            }),
            visualizer(),
            terser({
                format: {
                    comments: false,
                }
            }),
        ],
    },
    {
        input: './src/index.ts',
        output: {
            file: 'es/index.js',
            format: 'es',
            sourcemap: true,
        },
        external: ['ramda', 'sjsonc-parser'],
        plugins: [
            nodeResolve({
                babelHelpers: 'bundled',
                extensions: ['.ts', '.js']
            }),
            commonjs(),
            babel({
                extensions: ['.ts', '.js'],
                presets: ['@babel/preset-typescript', '@babel/preset-env']
            }),
            cleanup({ comments: 'none', extensions: ['ts'] }),
        ],
    },
    {
        input: 'src/index.ts',
        output: {
            file: 'lib/index.d.ts',
            format: 'es',
        },
        external: ['ramda', 'sjsonc-parser'],
        plugins: [
            ts({})
        ],
    },
];
