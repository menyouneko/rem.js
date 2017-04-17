'use strict';

/*
 * @Author: ChiHoNg - A Rookie FE
 * @E-mail: sheep_zh@163.com
 * @Date:   2017-02-18 15:41:40
 * @Last Modified by:   ChiHo-Ng
 * @Last Modified time: 2017-04-14 11:46:10
 */
(function (window) {
  'use strict';

  var rem = function () {
    /**
     * 传入meta节点,解析meta节点的内容,返回一个解析后的对象
     * @param  {Node} remEl 
     * @return {Object}
     *
     * @example
     * parseRem(document.querySelector('meta[name = "rem-setting"'))
     * return {designWidth: "750", maxWidth: "500", ratio: "2", dpr: "1"}
     */
    function parseRem(remEl) {
      var remContent = remEl.getAttribute('content');
      var obj = {};
      remContent.split(',').map(function (item) {
        var arr = item.split('=').map(function (item) {
          return item.replace(/^\s+|\s+$/g, '');
        });
        arr[0] = arr[0].replace(/\-+(\w{1})/, function (item, $1) {
          return $1.toUpperCase();
        });
        obj[arr[0]] = arr[1];
      });
      return obj;
    }

    /**
     * 设置meta标签,设置viewport的内容
     * @param {Object} option
     */
    function setViewport(option) {
      var viewport = document.querySelector('meta[name = "viewport"]');
      var _option$dpr = option.dpr,
          dpr = _option$dpr === undefined ? 1 : _option$dpr; // 默认dpr = 1

      var content = 'width=device-width, initial-scale=' + 1 / dpr + ', minimum-scale=' + 1 / dpr + ', maximum-scale=' + 1 / dpr + ', user-scalable=no';
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
      var clientWidth = document.documentElement.clientWidth || window.clientWidth;
      var _option$designWidth = option.designWidth,
          designWidth = _option$designWidth === undefined ? 750 : _option$designWidth,
          _option$ratio = option.ratio,
          ratio = _option$ratio === undefined ? 100 : _option$ratio,
          _option$maxWidth = option.maxWidth,
          maxWidth = _option$maxWidth === undefined ? 500 : _option$maxWidth,
          _option$dpr2 = option.dpr,
          dpr = _option$dpr2 === undefined ? 1 : _option$dpr2; // 默认值

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
      var rootFontSize = document.documentElement.style.fontSize.replace('px', '');
      return rem * rootFontSize + 'px';
    }

    var remEl = document.querySelector('meta[name = "rem-setting"'); // 获取自定义的rem meta标签
    var remSetting = remEl && parseRem(remEl);
    remSetting.dpr = remSetting.dpr || window.devicePixelRatio || 1; // 若自定义了dpr，就用自定义的值，否则用屏幕的dpr值

    setViewport(remSetting); // 设置viewport
    setFontSize(remSetting); // 设置root font-size

    window.addEventListener('resize', function () {
      // 事件绑定,缩放时重新设置font-size
      clearTimeout(window.rem.tId);
      window.rem.tId = setTimeout(function () {
        // 函数节流
        setFontSize(remSetting);
      }, 100);
    }, false);

    return { // 返回两个转换方法接口
      px2rem: px2rem,
      rem2px: rem2px
    };
  }();
  window.rem = rem; // 全局变量
})(window);
//# sourceMappingURL=rem.js.map