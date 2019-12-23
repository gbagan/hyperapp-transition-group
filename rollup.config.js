import resolve from 'rollup-plugin-node-resolve';
 
export default {
  input: 'example/main.js',
  output: {
    file: 'dist/ex2.js',
    format: 'iife',
    name: 'MyModule'
  },
  plugins: [
    resolve()
  ]
};