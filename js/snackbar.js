/**
 * SnackBar.js - 消息提示条组件
 * 
 * 这个组件可以在页面底部显示一个临时的消息提示
 * 类似 Android 的 Snackbar 或 iOS 的 Toast
 * 
 * 参考：https://codepen.io/wibblymat/pen/avAjq
 */

var createSnackbar = (function() {
  // 保存当前正在显示的 snackbar，方便后续关闭
  let previous = null;
  
  /**
   * 创建并显示一个 snackbar
   * @param {Object} config - 配置选项
   * @param {string} config.message - 要显示的消息内容
   * @param {string} [config.actionText] - 操作按钮的文字（可选）
   * @param {Function} [config.action] - 点击操作按钮时执行的函数（可选）
   * @param {number} [config.duration=5000] - 自动消失的时间（毫秒，默认 5 秒）
   */
  return function(config) {
    // 解构配置对象，设置默认值
    const { message = '', actionText, action, duration = 5000 } = config;

    // 如果之前有 snackbar 正在显示，先关掉它
    if (previous) previous.dismiss(true);
    
    // 创建 snackbar 的 DOM 元素
    const snackbar = document.createElement('div');
    snackbar.className = 'paper-snackbar';
    
    // 用来保存定时器的 ID，方便后续取消
    let timeoutId = null;
    
    /**
     * 关闭 snackbar
     * @param {boolean} [immediate=false] - 是否立即关闭（不播放动画）
     */
    snackbar.dismiss = function(immediate) {
      // 先清除定时器，避免重复触发
      if (timeoutId) clearTimeout(timeoutId);
      if (immediate) {
        // 立即关闭：直接从页面移除
        removeSnackbar(this);
      } else {
        // 慢慢关闭：先设透明度为 0，播放淡出动画
        this.style.opacity = 0;
      }
    };
    
    // 创建消息文本节点并添加到 snackbar
    snackbar.appendChild(document.createTextNode(message));
    
    // 如果配置了操作按钮，就创建一个按钮
    if (actionText) {
      // 创建按钮元素
      const btn = document.createElement('button');
      btn.className = 'action';
      btn.textContent = actionText;
      // 如果没给 action 函数，默认点击就是关闭 snackbar
      btn.onclick = action || (() => snackbar.dismiss());
      snackbar.appendChild(btn);
    }
    
    /**
     * 从页面中移除 snackbar 元素
     * @param {HTMLElement} element - 要移除的 snackbar 元素
     */
    function removeSnackbar(element) {
      if (element?.parentElement) {
        // 从 DOM 树中移除
        element.parentElement.removeChild(element);
        // 如果是当前正在显示的那个，清空 previous 引用
        if (previous === element) previous = null;
      }
    }
    
    // 监听 CSS 动画结束事件
    snackbar.addEventListener('transitionend', e => {
      // 只有当透明度动画完成时，才真正移除元素
      if (e.propertyName === 'opacity' && this.style.opacity == 0) {
        removeSnackbar(this);
      }
    });
    
    // 设置定时器，一段时间后自动关闭
    timeoutId = setTimeout(() => previous === this && this.dismiss(), duration);

    // 保存当前 snackbar 的引用
    previous = snackbar;
    // 把 snackbar 添加到页面中
    document.body.appendChild(snackbar);
    
    // 这是一个小技巧：先读取一下样式，强制浏览器渲染初始状态
    getComputedStyle(snackbar).bottom;
    // 然后再修改样式，触发 CSS 动画（从底部滑入）
    snackbar.style.bottom = '0px';
    snackbar.style.opacity = 1;
  };
})();