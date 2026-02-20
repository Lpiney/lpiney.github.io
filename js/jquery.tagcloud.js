/**
 * jQuery Tag Cloud Plugin
 * 
 * 该插件用于创建标签云效果，可以根据标签的权重值调整字体大小和颜色
 * 
 * 使用方法：
 * $('.tag-cloud a').tagcloud({
 *   size: { start: 14, end: 18, unit: 'pt' },  // 字体大小范围
 *   color: { start: '#bbbbee', end: '#0000aa' }  // 颜色渐变范围
 * });
 */

(function($) {
  /**
   * 标签云主函数
   * @param {Object} options - 插件配置选项
   * @param {Object} options.size - 字体大小配置
   * @param {number} options.size.start - 最小字体大小
   * @param {number} options.size.end - 最大字体大小
   * @param {string} options.size.unit - 字体单位（如 pt, px, em 等）
   * @param {Object} options.color - 颜色配置
   * @param {string} options.color.start - 起始颜色
   * @param {string} options.color.end - 结束颜色
   */
  $.fn.tagcloud = function(options) {
    // 合并用户传入的配置和默认配置
    const opts = $.extend({}, $.fn.tagcloud.defaults, options);
    
    // 获取所有标签的权重值
    const tagWeights = this.map(function() {
      return parseFloat($(this).attr("rel"));
    });
    
    // 将权重值转换为数组并排序
    const weights = Array.from(tagWeights).sort((a, b) => a - b);
    
    // 获取最小和最大权重值
    const min = weights[0];
    const max = weights[weights.length - 1];
    
    // 计算权重范围（防止除零错误）
    const range = max - min || 1;
    
    // 计算字体大小和颜色的增量值
    let fontSizeIncr, colorIncr;
    if (opts.size) {
      fontSizeIncr = (opts.size.end - opts.size.start) / range;
    }
    if (opts.color) {
      colorIncr = colorIncrement(opts.color, range);
    }
    
    // 遍历每个标签元素，应用计算出的样式
    return this.each(function() {
      // 计算相对于最小值的权重
      const weight = parseFloat($(this).attr("rel")) - min;
      
      // 应用字体大小
      if (opts.size) {
        $(this).css("font-size", opts.size.start + (weight * fontSizeIncr) + opts.size.unit);
      }
      
      // 应用背景颜色
      if (opts.color) {
        $(this).css("backgroundColor", tagColor(opts.color, colorIncr, weight));
      }
    });
  };

  // 插件默认配置
  $.fn.tagcloud.defaults = {
    size: { start: 14, end: 18, unit: "pt" }
  };

  /**
   * 将十六进制颜色值转换为 RGB 数组
   * @param {string} code - 十六进制颜色代码（如 #fff 或 #ffffff）
   * @returns {Array<number>} - 包含 R、G、B 值的数组
   */
  function toRGB(code) {
    // 处理简写形式的颜色代码（如 #abc 转换为 #aabbcc）
    const normalized = code.length === 4 ? 
      code.replace(/\w/g, match => match + match) : 
      code;
    
    // 提取颜色代码中的三个部分
    const parts = normalized.match(/\w{2}/g);
    // 将十六进制转换为十进制
    return parts ? parts.map(part => parseInt(part, 16)) : [0, 0, 0];
  }

  /**
   * 将 RGB 值转换为十六进制颜色代码
   * @param {Array<number>} rgb - 包含 R、G、B 值的数组
   * @returns {string} - 十六进制颜色代码
   */
  function toHex(rgb) {
    return "#" + rgb.map(val => {
      // 确保值在 0-255 范围内
      const clamped = Math.max(0, Math.min(255, val));
      // 转换为十六进制并确保两位数格式
      const hex = clamped.toString(16).padStart(2, '0');
      return hex;
    }).join("");
  }

  /**
   * 计算颜色渐变的增量值
   * @param {Object} color - 颜色配置对象
   * @param {number} range - 权重范围
   * @returns {Array<number>} - 每个颜色通道的增量值
   */
  function colorIncrement(color, range) {
    const startRGB = toRGB(color.start);
    const endRGB = toRGB(color.end);
    // 计算每个颜色通道的增量值
    return startRGB.map((val, i) => (endRGB[i] - val) / range);
  }

  /**
   * 根据权重计算具体的颜色值
   * @param {Object} color - 颜色配置对象
   * @param {Array<number>} increment - 颜色增量值
   * @param {number} weighting - 当前权重
   * @returns {string} - 十六进制颜色代码
   */
  function tagColor(color, increment, weighting) {
    const startRGB = toRGB(color.start);
    // 根据权重和增量计算出新的颜色值
    const rgb = startRGB.map((val, i) => {
      return Math.round(val + (increment[i] * weighting));
    });
    // 转换为十六进制颜色代码
    return toHex(rgb);
  }
})(jQuery);