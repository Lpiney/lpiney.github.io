(function() {
    const body = document.body;
    const STORAGE_KEY = 'dark-mode';

    function setDarkMode(isDark) {
        body.classList.toggle('dark-mode', isDark);
        localStorage.setItem(STORAGE_KEY, isDark);
        updateIcon();
    }

    function updateIcon() {
        const toggleBtn = document.getElementById('dark-mode-toggle');
        const icon = toggleBtn?.querySelector('i');
        if (icon) {
            const isDark = body.classList.contains('dark-mode');
            icon.className = isDark ? 'fa fa-sun-o' : 'fa fa-moon-o';
        }
    }

    // 初始化：从存储或系统偏好获取模式
    const savedMode = localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const initialMode = savedMode ? savedMode === 'true' : prefersDark;
    setDarkMode(initialMode);

    document.addEventListener('DOMContentLoaded', () => {
        const toggleBtn = document.getElementById('dark-mode-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', e => {
                e.preventDefault();
                setDarkMode(!body.classList.contains('dark-mode'));
            });
        }

        // 监听系统主题变化
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)')
                  .addEventListener('change', e => {
                      if (localStorage.getItem(STORAGE_KEY) === null) {
                          setDarkMode(e.matches);
                      }
                  });
        }
    });
})();