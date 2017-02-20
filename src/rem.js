/*
 * @Author: ChiHoNg - A Rookie FE
 * @E-mail: sheep_zh@163.com
 * @Date:   2017-02-18 15:41:40
 * @Last Modified by:   ChiHo-Ng
 * @Last Modified time: 2017-02-20 15:55:32
 */
(function (window) {
  'use strict';
  let rem = (function () {
    function parseRem(remObj) {
      // 获取content内容
      let remContent = remObj.getAttribute('content');
      // 解析content，返回一个Object
      let obj = {};
      remContent.split(',').map((item) => {
        let arr = item.split('=').map((item) => item.replace(/^\s+|\s+$/, ''));
        arr[0] = arr[0].replace(/\-+(\w{1})/, (item, $1) => {
          return $1.toUpperCase();
        });
        obj[arr[0]] = arr[1];
      });
      // 格式为：{designWidth: "750", maxWidth: "500", ratio: "2"}
      return obj;
    }

    function setViewport(option) {
      let viewport = document.querySelector('meta[name = "viewport"]');
      let { dpr = 1 } = option;
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

    function setFontSize(option) {
      // 视口宽度 clientWidth
      // 设计稿 designWidth
      // 转换系数 ratio（ratio表示将设计稿的px单位除以ratio，得出的值直接用于rem即可）
      // 设备像素比 dpr
      // 根字体大小rem
      // 主要公式为，clientWidth * dpr = (designWidth / ratio) * rem
      // 得出rem = (clientWidth * dpr * ratio) / designWidth
      // 根据以上公式就可以计算出rem应为多少
      // 获取视口宽度
      // 此处获得的clientWidth是计算了dpr后的值，所以无需再与dpr相乘
      let clientWidth = document.documentElement.clientWidth || window.clientWidth;
      let { designWidth = 750, ratio = 100, maxWidth = 500, dpr = 1 } = option
      // 判断当前宽度是否比设置的max-width大，是则使用设置的maxWidth，否则使用当前的clientWidth
      clientWidth = clientWidth > maxWidth * dpr ? maxWidth * dpr : clientWidth;
      console.log(clientWidth, dpr, ratio, clientWidth * ratio / designWidth);
      document.documentElement.setAttribute('data-dpr', dpr);
      document.documentElement.style.fontSize = clientWidth * ratio / designWidth + 'px';
    }

    function px2rem(px) {
      px = px.toString().replace('px', '');
      return px / remSetting.ratio + 'rem';
    }

    function rem2px(remUnit) {
      remUnit = remUnit.toString().replace('rem', '');
      let rootFontSize = document.documentElement.style.fontSize.replace('px', '');
      return remUnit * rootFontSize;
    }

    // 获取自定义的rem meta标签
    let remEl = document.querySelector('meta[name = "rem-setting"');
    let remSetting = remEl && parseRem(remEl);
    remSetting.dpr = window.devicePixelRatio || 1;
    // 设置viewport
    setViewport(remSetting);
    // 设置root font-size
    setFontSize(remSetting);
    // 事件绑定
    // 缩放时重新设置font-size
    window.addEventListener('resize', function () {
      setFontSize(remSetting);
    }, false);
    // 返回两个转换方法接口
    return {
      px2rem,
      rem2px
    }
  })();
  // 复制给全局变量
  window.rem = rem;
})(window);
