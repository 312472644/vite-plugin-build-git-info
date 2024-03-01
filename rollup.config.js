import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import terser from '@rollup/plugin-terser';
import progress from 'rollup-plugin-progress';
import clear from 'rollup-plugin-clear';

/**
 * @type {import('rollup').RollupOptions}
 */
export default {
  input: {
    index: './index.js',
  },
  output: [
    {
      dir: 'dist/esm',
      format: 'esm',
    },
    {
      dir: 'dist/cjs',
      format: 'cjs',
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
