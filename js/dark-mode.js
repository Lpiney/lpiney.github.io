(function() {
    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        var toggleBtn = document.getElementById('dark-mode-toggle');
        var icon = toggleBtn ? toggleBtn.querySelector('i') : null;
        var body = document.body;

        function setDarkMode(isDark) {
            if (isDark) {
                body.classList.add('dark-mode');
                if (icon) {
                    icon.classList.remove('fa-moon-o');
                    icon.classList.add('fa-sun-o');
                }
                localStorage.setItem('dark-mode', 'true');
            } else {
                body.classList.remove('dark-mode');
                if (icon) {
                    icon.classList.remove('fa-sun-o');
                    icon.classList.add('fa-moon-o');
                }
                localStorage.setItem('dark-mode', 'false');
            }
        }

        // Initialize based on local storage or system preference
        var savedMode = localStorage.getItem('dark-mode');
        if (savedMode === 'true') {
            setDarkMode(true);
        } else if (savedMode === null && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setDarkMode(true);
        }

        // Bind click event
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function(e) {
                e.preventDefault();
                var isDark = body.classList.contains('dark-mode');
                setDarkMode(!isDark);
            });
        }
    });
})();
