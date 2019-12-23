import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
  input: 'example/main.js',
  output: {
    file: 'dist/ex2.js',
    format: 'iife',
    name: 'MyModule'
  },
  plugins: [
    resolve(),
    babel()
  ]
};