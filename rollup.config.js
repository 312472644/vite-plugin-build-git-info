const commonjs = require('@rollup/plugin-commonjs');
const resolve = require('@rollup/plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const terser = require('@rollup/plugin-terser');
const progress = require('rollup-plugin-progress');
const clear = require('rollup-plugin-clear');

/**
 * @type {import('rollup').RollupOptions}
 */
module.exports = {
  input: './index.js',
  output: [
    {
      file: 'dist/cjs/index.cjs',
      format: 'cjs',
    },
    {
      file: 'dist/esm/index.mjs',
      format: 'esm',
    },
  ],
  plugins: [
    commonjs(),
    resolve(),
    babel({
      exclude: 'node_modules/**',
      presets: ['@babel/preset-env'],
    }),
    terser(),
    clear({ targets: ['dist'] }),
    progress({
      clearLine: false,
    }),
  ],
};
