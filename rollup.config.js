/*
 * @Author: ChiHo-Ng
 * @E-mail: sheep_zh@163.com 
 * @Date: 2017-10-21 15:24:55
 * @Last Modified by: ChiHo-Ng
 * @Last Modified time: 2017-11-02 14:40:07
 */
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'

export default {
  name: 'Rem', // global name
  input: 'src/index.js',
  output: {
    format: 'umd',
    file: 'dist/rem.min.js'
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    uglify()
  ]
}