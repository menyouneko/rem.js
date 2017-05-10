/*
 * @Author: ChiHoNg - A Rookie FE
 * @E-mail: sheep_zh@163.com
 * @Date:   2017-02-18 15:41:40
 * @Last Modified by:   ChiHo-Ng
 * @Last Modified time: 2017-07-05 18:02:53
 */
(function (window) {
  'use strict';
  let rem = (function () {
    /**
     * 传入meta节点,解析meta节点的内容,返回一个解析后的对象
     * @param  {Node} remEl 
     * @return {Object}
     * @example
     * parseRem(document.querySelector('meta[name = "rem-setting"'))
     * return {designWidth: "750", maxWidth: "500", ratio: "2", dpr: "1"}
     */
    function parseRem(remEl) {
      let remContent = remEl.getAttribute('content');
      let obj = {};
      remContent.split(',').map((item) => {
        let arr = item.split('=').map((item) => item.replace(/^\s+|\s+$/g, ''));
        arr[0] = arr[0].replace(/\-+(\w{1})/, (item, $1) => {
          return $1.toUpperCase();
        });
        obj[arr[0]] = arr[1];
      });
      // 格式为：{designWidth: "750", maxWidth: "500", ratio: "2"}
      return obj;
    }

    /**
     * 设置meta标签,设置viewport的内容
     * @param {Object} option
     */
    function setViewport(option) {
      let viewport = document.querySelector('meta[name = "viewport"]');
      let { dpr = 1 } = option; // 默认dpr = 1
      let content = 'width=device-width, initial-scale=' + 1 / dpr + ', minimum-scale=' + 1 / dpr + ', maximum-scale=' + 1 / dpr + ', user-scalable=no';
      if (viewport) {
        viewport.setAttribute('content', content);
      } else {
        viewport = document.createElement('meta');
        viewport.setAttribute('name', 'viewport');
        viewport.setAttribute('content', content);
        document.head.appendChild(viewport);
      }
    }

    /** 
     * 视口宽度 clientWidth
     * 设计稿 designWidth
     * 转换系数 ratio（ratio表示将设计稿的px单位除以ratio，得出的值直接用于rem即可）
     * 设备像素比 dpr
     * 根字体大小rem
     * 主要公式为，clientWidth * dpr = (designWidth / ratio) * rem
     * 得出rem = (clientWidth * dpr * ratio) / designWidth
     * 根据以上公式就可以计算出rem应为多少
     * 获取视口宽度
     * 此处获得的clientWidth是计算了dpr后的值，所以无需再与dpr相乘
     * @param {Object} option
     * @return void
     */
    function setFontSize(option) {
      let clientWidth = document.documentElement.clientWidth || window.clientWidth;
      let { designWidth = 750, ratio = 100, maxWidth = 500, dpr = 1 } = option; // 默认值
      clientWidth = clientWidth > maxWidth * dpr ? maxWidth * dpr : clientWidth; // 判断当前宽度是否比设置的max-width大，是则使用设置的maxWidth，否则使用当前的clientWidth
      document.documentElement.setAttribute('data-dpr', dpr);
      document.documentElement.style.fontSize = clientWidth * ratio / designWidth + 'px';
    }

    /**
     * px转换成rem
     * @param  {Number|String} px
     * @return {String}
     */
    function px2rem(px) {
      px = px.toString().replace('px', '');
      return px / remSetting.ratio + 'rem';
    }

    /**
     * rem转换成px
     * @param  {Number|String} px
     * @return {String}
     */
    function rem2px(rem) {
      rem = rem.toString().replace('rem', '');
      let rootFontSize = document.documentElement.style.fontSize.replace('px', '');
      return rem * rootFontSize + 'px';
    }

    let remEl = document.querySelector('meta[name="rem-setting"]'); // 获取自定义的rem meta标签
    let remSetting = (remEl && parseRem(remEl)) || {};
    remSetting.dpr = remSetting.dpr ? remSetting.dpr : window.devicePixelRatio; // 若自定义了dpr，就用自定义的值，否则用屏幕的dpr值

    setViewport(remSetting); // 设置viewport
    setFontSize(remSetting); // 设置root font-size

    window.addEventListener('resize', function () { // 事件绑定,缩放时重新设置font-size
      clearTimeout(window.rem.tId);
      window.rem.tId = setTimeout(function () { // 函数节流
        setFontSize(remSetting);
      }, 100);
    }, false);

    return { // 返回两个转换方法接口
      px2rem,
      rem2px
    }
  })();
  window.rem = rem; // 全局变量
})(window);
