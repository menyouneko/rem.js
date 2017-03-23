/*
 * @Author: ChiHoNg - A Rookie FE
 * @E-mail: sheep_zh@163.com
 * @Date:   2017-02-18 15:41:40
 * @Last Modified by:   ChiHo-Ng
 * @Last Modified time: 2017-07-05 17:55:47
 */
(function (window) {
  var rem = (function () {
    function parseRem(remObj) {
      // 获取content内容
      var remContent = remObj.getAttribute('content');
      // 解析content，返回一个Object
      var obj = {};
      remContent.split(',').map(function (item) {
        var arr = item.split('=').map(function (item) {
          return item.replace(/^\s+|\s+$/g, '')
        });
        arr[0] = arr[0].replace(/\-+(\w{1})/, function (item, $1) {
          return $1.toUpperCase();
        });
        obj[arr[0]] = arr[1];
      });
      // 格式为：{designWidth: "750", maxWidth: "500", ratio: "2"}
      return obj;
    }

    function setViewport(option) {
      var viewport = document.querySelector('meta[name="viewport"]');
      var dpr = option.dpr || 1; // 默认dpr = 1
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
      var clientWidth = document.documentElement.clientWidth || window.clientWidth;
      var designWidth = option.designWidth || 750;
      var ratio = option.ratio || 100;
      var maxWidth = option.maxWidth || 500;
      var dpr = option.dpr || 1; // 默认值
      // 判断当前宽度是否比设置的max-width大，是则使用设置的maxWidth，否则使用当前的clientWidth
      clientWidth = clientWidth > maxWidth * dpr ? maxWidth * dpr : clientWidth;
      document.documentElement.setAttribute('data-dpr', dpr);
      document.documentElement.style.fontSize = clientWidth * ratio / designWidth + 'px';
      console.log(clientWidth * ratio / designWidth + 'px');
    }

    function px2rem(px) {
      px = px.toString().replace('px', '');
      return px / remSetting.ratio + 'rem';
    }

    function rem2px(remUnit) {
      remUnit = remUnit.toString().replace('rem', '');
      var rootFontSize = document.documentElement.style.fontSize.replace('px', '');
      return remUnit * rootFontSize;
    }

    // 获取自定义的rem meta标签
    var remEl = document.querySelector('meta[name="rem-setting"]');
    var remSetting = remEl && parseRem(remEl);
    remSetting.dpr = remSetting.dpr || window.devicePixelRatio || 1; // 若自定义了dpr，就用自定义的值，否则用屏幕的dpr值
    setViewport(remSetting);
    setFontSize(remSetting);
    // 事件绑定
    // 缩放时重新设置font-size
    window.addEventListener('resize', function () {
      clearTimeout(window.rem.tId);
      // 函数节流
      window.rem.tId = setTimeout(function () {
        setFontSize(remSetting);
      }, 100);
    }, false);
    // 返回两个转换方法接口
    return {
      px2rem: px2rem,
      rem2px: px2rem
    }
  })();
  // 暴露给全局变量
  window.rem = rem;
})(window);
