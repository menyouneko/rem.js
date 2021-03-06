/*
 * @Author: ChiHo-Ng
 * @Github: https://github.com/menyouneko
 * @E-mail: sheep_zh@163.com 
 * @Date: 2017-10-30 19:24:17
 * @Last Modified by: ChiHo-Ng
 * @Last Modified time: 2018-01-31 11:44:53
 */

class Rem {
  constructor(arg) {
    // 默认设置
    if (!Rem.instance) {
      this.config = {}
      this.tId = {}
      let self = this
      let defaultConfig = {
        designWidth: 750,
        maxWidth: 500,
        ratio: 100,
        dpr: window.devicePixelRatio
      }
      if (arg && typeof arg === 'object') { // 判断参数是否存在
        this.config = Object.assign(defaultConfig, arg) // 参数存在, 合并参数
      } else if (!arg) {
        this.config = Object.assign(defaultConfig, this.metaParse()) // 参数不存在, 则解析 meta 元素携带的数据
      } else {
        throw ('new Rem() 参数错误, 请检查.')
      }
      this.setViewport(this.config) // 设置 viewport
      this.setFontSize(this.config) // 设置 root font-size
      window.addEventListener('resize', function () { // 事件绑定, 缩放时重新设置 font-size
        clearTimeout(self.tId)
        self.tId = setTimeout(function () { // 简易函数节流
          self.setFontSize(self.config)
        }, 100)
      }, false)
      Rem.instance = this
    } else {
      return Rem.instance
    }
  }

  /**
   * 获取页面 meta 的元素, 返回解析后的对象
   * @return {Object} obj
   */
  metaParse () {
    let obj = {},
      configArr = [],
      el
    try {
      el = document.querySelector('meta[name="rem"]')
      configArr = el.getAttribute('content').split(',')
    } catch (error) {
      console.warn('meta 标签设置错误')
      return obj
    }
    configArr.map((item) => {
      let arr = item.split('=').map((item) => item.replace(/^\s+|\s+$/g, ''))
      arr[0] = arr[0].replace(/\-+(\w{1})/, (item, $1) => {
        return $1.toUpperCase()
      })
      obj[arr[0]] = arr[1]
    })
    // 返回一个对象, 例如：{designWidth: "750", maxWidth: "500", ratio: "2"}
    return obj
  }

  /**
   * 设置 meta 标签, 设置viewport的内容
   * @param {Object} config
   * @return void
   */
  setViewport (config) {
    let viewport = document.querySelector('meta[name="viewport"]')
    let { dpr = 1 } = config // 默认dpr = 1
    let content = 'width=device-width, initial-scale=' + 1 / dpr + ', minimum-scale=' + 1 / dpr + ', maximum-scale=' + 1 / dpr + ', user-scalable=no'
    if (viewport) {
      viewport.setAttribute('content', content)
    } else {
      viewport = document.createElement('meta')
      viewport.setAttribute('name', 'viewport')
      viewport.setAttribute('content', content)
      document.head.appendChild(viewport)
    }
  }

  /** 
 * 视口宽度 clientWidth
 * 设计稿 designWidth
 * 转换系数 ratio（ratio表示将设计稿的px单位除以ratio, 得出的值直接用于rem即可）
 * 设备像素比 dpr
 * 根字体大小rem
 * 主要公式为, clientWidth * dpr = (designWidth / ratio) * rem
 * 得出rem = (clientWidth * dpr * ratio) / designWidth
 * 根据以上公式就可以计算出rem应为多少
 * 获取视口宽度
 * 此处获得的clientWidth是计算了dpr后的值, 所以无需再与dpr相乘
 * @param {Object} config
 * @return void
 */
  setFontSize (config) {
    let clientWidth = document.documentElement.clientWidth || window.clientWidth
    let { designWidth, ratio, maxWidth, dpr } = config // 默认值
    clientWidth = clientWidth > maxWidth * dpr ? maxWidth * dpr : clientWidth // 判断当前宽度是否比设置的max-width大, 是则使用设置的maxWidth, 否则使用当前的clientWidth
    // document.documentElement.setAttribute('data-dpr', dpr)
    document.documentElement.style.fontSize = clientWidth * ratio / designWidth + 'px'
  }

  /**
 * px转换成rem
 * @param  {Number|String} px
 * @return {String}
 */
  px2rem (px) {
    px = px.toString().replace('px', '')
    return px / this.config.ratio + 'rem'
  }

  /**
   * rem转换成px
   * @param  {Number|String} rem
   * @return {String}
   */
  rem2px (rem) {
    rem = rem.toString().replace('rem', '')
    let rootFontSize = document.documentElement.style.fontSize.replace('px', '')
    return rem * rootFontSize + 'px'
  }
}

export default Rem