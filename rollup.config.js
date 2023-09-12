import scss from 'rollup-plugin-scss';
import typescript from 'rollup-plugin-typescript2';
import terser from '@rollup/plugin-terser';

export default {
  input: './src/trail.ts',
  output: [{
    file:'./dist/trail.esm.js',
    format: 'esm',
    sourcemap: true
  }, {
    file: './dist/trail.js',
    format: 'umd',
    name: 'window',
    sourcemap: true,
    extend: true
  }],
  plugins: [
    scss({ output: false, outputStyle: 'compressed' }),
    typescript(),
    terser()
  ]
}
