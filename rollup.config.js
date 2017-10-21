/*
 * @Author: ChiHo-Ng
 * @E-mail: sheep_zh@163.com 
 * @Date: 2017-10-21 15:24:55
 * @Last Modified by: ChiHo-Ng A FE
 * @Last Modified time: 2017-10-21 15:31:28
 */
import babel from 'rollup-plugin-babel'

export default {
  name: 'Rem.js',
  moduleName: 'Rem',
  input: 'src/index.js',
  output: {
    format: 'umd',
    file: 'dist/rem.min.js' // 输出文件
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ]
}