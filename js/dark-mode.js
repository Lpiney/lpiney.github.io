(function() {
    var body = document.body;

    function setDarkMode(isDark) {
        if (isDark) {
            body.classList.add('dark-mode');
            localStorage.setItem('dark-mode', 'true');
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('dark-mode', 'false');
        }
        updateIcon();
    }

    function updateIcon() {
        var toggleBtn = document.getElementById('dark-mode-toggle');
        var icon = toggleBtn ? toggleBtn.querySelector('i') : null;
        if (icon) {
            var isDark = body.classList.contains('dark-mode');
            if (isDark) {
                icon.classList.remove('fa-moon-o');
                icon.classList.add('fa-sun-o');
            } else {
                icon.classList.remove('fa-sun-o');
                icon.classList.add('fa-moon-o');
            }
        }
    }

    var savedMode = localStorage.getItem('dark-mode');
    if (savedMode === 'true') {
        setDarkMode(true);
    } else if (savedMode === null && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setDarkMode(true);
    }

    document.addEventListener('DOMContentLoaded', function() {
        var toggleBtn = document.getElementById('dark-mode-toggle');

        updateIcon();

        if (toggleBtn) {
            toggleBtn.addEventListener('click', function(e) {
                e.preventDefault();
                var isDark = body.classList.contains('dark-mode');
                setDarkMode(!isDark);
            });
        }

        if (window.matchMedia) {
            var darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            darkModeMediaQuery.addEventListener('change', function(e) {
                if (localStorage.getItem('dark-mode') === null) {
                    setDarkMode(e.matches);
                }
            });
        }
    });
})();
