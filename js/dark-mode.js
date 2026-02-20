(function() {
    // 获取页面的 body 元素（整个网页的主体）
    var body = document.body;

    /**
     * 设置暗黑模式
     * @param {boolean} isDark - 是否开启暗黑模式
     */
    function setDarkMode(isDark) {
        if (isDark) {
            // 开启暗黑模式：给 body 添加 dark-mode 类
            body.classList.add('dark-mode');
            // 保存用户的选择到浏览器本地存储
            localStorage.setItem('dark-mode', 'true');
        } else {
            // 关闭暗黑模式：移除 dark-mode 类
            body.classList.remove('dark-mode');
            // 保存用户的选择到浏览器本地存储
            localStorage.setItem('dark-mode', 'false');
        }
        // 更新切换按钮上的图标
        updateIcon();
    }

    /**
     * 更新暗黑模式切换按钮的图标
     */
    function updateIcon() {
        // 获取暗黑模式切换按钮
        var toggleBtn = document.getElementById('dark-mode-toggle');
        // 获取按钮里的图标元素
        var icon = toggleBtn ? toggleBtn.querySelector('i') : null;
        
        if (icon) {
            // 检查当前是否是暗黑模式
            var isDark = body.classList.contains('dark-mode');
            if (isDark) {
                // 暗黑模式：显示太阳图标（点击可以切换到白天）
                icon.classList.remove('fa-moon-o');
                icon.classList.add('fa-sun-o');
            } else {
                // 白天模式：显示月亮图标（点击可以切换到暗黑）
                icon.classList.remove('fa-sun-o');
                icon.classList.add('fa-moon-o');
            }
        }
    }

    // 第一步：从本地存储读取用户之前的选择
    var savedMode = localStorage.getItem('dark-mode');
    
    if (savedMode === 'true') {
        // 用户之前选了暗黑模式，直接应用
        setDarkMode(true);
    } else if (savedMode === null && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // 用户没选过，但系统设置是暗黑模式，跟随系统
        setDarkMode(true);
    }

    // 等待页面加载完成后再绑定点击事件
    document.addEventListener('DOMContentLoaded', function() {
        // 获取暗黑模式切换按钮
        var toggleBtn = document.getElementById('dark-mode-toggle');

        // 页面加载完成后，先更新一下图标状态
        updateIcon();

        // 给按钮绑定点击事件
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function(e) {
                // 阻止链接的默认跳转行为
                e.preventDefault();
                // 检查当前模式，然后切换到相反的模式
                var isDark = body.classList.contains('dark-mode');
                setDarkMode(!isDark);
            });
        }

        // 监听系统主题变化（比如 macOS/Windows 的深色/浅色模式切换）
        if (window.matchMedia) {
            var darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            darkModeMediaQuery.addEventListener('change', function(e) {
                // 只有当用户没有手动设置过时，才跟随系统变化
                if (localStorage.getItem('dark-mode') === null) {
                    setDarkMode(e.matches);
                }
            });
        }
    });
})();
