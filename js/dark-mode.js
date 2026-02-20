(function() {
    // 获取页面的 html 元素（用于设置 data-theme 属性）
    const html = document.documentElement;
    // 存储用户暗黑模式偏好的键名
    const STORAGE_KEY = 'dark-mode';

    /**
     * 设置暗黑模式
     * @param {boolean} isDark - 是否开启暗黑模式
     */
    function setDarkMode(isDark) {
        // 使用 data-theme 属性切换主题，配合 CSS 变量使用
        if (isDark) {
            html.setAttribute('data-theme', 'dark');
        } else {
            html.removeAttribute('data-theme');
        }
        
        // 将用户的偏好保存到浏览器本地存储
        localStorage.setItem(STORAGE_KEY, isDark);
        // 更新切换按钮上的图标
        updateIcon();
    }

    /**
     * 更新暗黑模式切换按钮的图标
     */
    function updateIcon() {
        // 获取暗黑模式切换按钮
        const toggleBtn = document.getElementById('dark-mode-toggle');
        // 获取按钮里的图标元素
        const icon = toggleBtn?.querySelector('i');
        
        if (icon) {
            // 检查当前是否是暗黑模式
            const isDark = html.getAttribute('data-theme') === 'dark';
            if (isDark) {
                // 暗黑模式：显示太阳图标（点击可以切换到白天）
                icon.className = 'fa fa-sun-o';
            } else {
                // 白天模式：显示月亮图标（点击可以切换到暗黑）
                icon.className = 'fa fa-moon-o';
            }
        }
    }

    // 第一步：从本地存储读取用户之前的选择
    const savedMode = localStorage.getItem(STORAGE_KEY);
    // 获取系统主题偏好（如 macOS/Windows 的深色/浅色模式设置）
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    // 确定初始模式：如果有保存的设置则使用，否则跟随系统偏好
    const initialMode = savedMode ? savedMode === 'true' : prefersDark;
    // 设置初始模式
    setDarkMode(initialMode);

    // 等待页面加载完成后再绑定点击事件
    document.addEventListener('DOMContentLoaded', () => {
        // 获取暗黑模式切换按钮
        const toggleBtn = document.getElementById('dark-mode-toggle');

        // 给按钮绑定点击事件
        if (toggleBtn) {
            toggleBtn.addEventListener('click', e => {
                // 阻止链接的默认跳转行为
                e.preventDefault();
                // 检查当前模式，然后切换到相反的模式
                const isCurrentlyDark = html.getAttribute('data-theme') === 'dark';
                setDarkMode(!isCurrentlyDark);
            });
        }

        // 监听系统主题变化（比如 macOS/Windows 的深色/浅色模式切换）
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)')
                  .addEventListener('change', e => {
                      // 只有当用户没有手动设置过时，才跟随系统变化
                      if (localStorage.getItem(STORAGE_KEY) === null) {
                          setDarkMode(e.matches);
                      }
                  });
        }
    });
})();