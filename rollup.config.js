/*
 * @Author: ChiHo-Ng
 * @E-mail: sheep_zh@163.com 
 * @Date: 2017-10-21 15:24:55
 * @Last Modified by: ChiHo-Ng
 * @Last Modified time: 2018-01-31 11:35:58
 */
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'

export default {
  input: 'src/index.js',
  output: {
    name: 'Rem', // global name
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