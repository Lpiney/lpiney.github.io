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
  var previous = null;
  
  /**
   * 创建并显示一个 snackbar
   * @param {Object} config - 配置选项
   * @param {string} config.message - 要显示的消息内容
   * @param {string} [config.actionText] - 操作按钮的文字（可选）
   * @param {Function} [config.action] - 点击操作按钮时执行的函数（可选）
   * @param {number} [config.duration=5000] - 自动消失的时间（毫秒，默认 5 秒）
   */
  return function(config) {
    // 获取配置项，给 message 一个默认值防止报错
    var message = config.message || '';
    var actionText = config.actionText;
    var action = config.action;
    var duration = config.duration;

    // 如果之前有 snackbar 正在显示，先关掉它
    if (previous) {
      previous.dismiss(true);
    }
    
    // 创建 snackbar 的 DOM 元素
    var snackbar = document.createElement('div');
    snackbar.className = 'paper-snackbar';
    
    // 用来保存定时器的 ID，方便后续取消
    var timeoutId = null;
    
    /**
     * 关闭 snackbar
     * @param {boolean} [immediate=false] - 是否立即关闭（不播放动画）
     */
    snackbar.dismiss = function(immediate) {
      var self = this;
      // 先清除定时器，避免重复触发
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      if (immediate) {
        // 立即关闭：直接从页面移除
        removeSnackbar(self);
      } else {
        // 慢慢关闭：先设透明度为 0，播放淡出动画
        self.style.opacity = 0;
      }
    };
    
    // 创建消息文本节点并添加到 snackbar
    var text = document.createTextNode(message);
    snackbar.appendChild(text);
    
    var actionButton;
    // 如果配置了操作按钮，就创建一个按钮
    if (actionText) {
      // 如果没给 action 函数，默认点击就是关闭 snackbar
      if (!action) {
        action = snackbar.dismiss.bind(snackbar, false);
      }
      // 创建按钮元素
      actionButton = document.createElement('button');
      actionButton.className = 'action';
      actionButton.textContent = actionText;
      // 给按钮绑定点击事件
      actionButton.addEventListener('click', action);
      snackbar.appendChild(actionButton);
    }
    
    /**
     * 从页面中移除 snackbar 元素
     * @param {HTMLElement} element - 要移除的 snackbar 元素
     */
    function removeSnackbar(element) {
      if (element && element.parentElement) {
        // 从 DOM 树中移除
        element.parentElement.removeChild(element);
        // 如果是当前正在显示的那个，清空 previous 引用
        if (previous === element) {
          previous = null;
        }
      }
    }
    
    // 监听 CSS 动画结束事件
    var transitionHandler = function(event) {
      // 只有当透明度动画完成时，才真正移除元素
      if (event.propertyName === 'opacity' && this.style.opacity == 0) {
        removeSnackbar(this);
      }
    }.bind(snackbar);
    
    snackbar.addEventListener('transitionend', transitionHandler);
    
    // 设置定时器，一段时间后自动关闭
    timeoutId = setTimeout(function() {
      if (previous === this) {
        this.dismiss(false);
      }
    }.bind(snackbar), duration || 5000);

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
