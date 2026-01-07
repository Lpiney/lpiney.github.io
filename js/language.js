(function() {
    var userLang = localStorage.getItem('user-lang');
    var body = document.body;
    var toggle = document.getElementById('language-toggle');

    // Determine initial language
    if (!userLang) {
        var sysLang = navigator.language || navigator.userLanguage;
        userLang = sysLang.toLowerCase().indexOf('zh') > -1 ? 'zh' : 'en';
    }

    // Apply class
    body.classList.add('lang-' + userLang);

    // Toggle Button Logic
    // We use event delegation or wait for DOMContentLoaded if script is at end of body
    // Since this script is in footer, DOM should be ready.
    if (toggle) {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            if (body.classList.contains('lang-zh')) {
                body.classList.remove('lang-zh');
                body.classList.add('lang-en');
                localStorage.setItem('user-lang', 'en');
            } else {
                body.classList.remove('lang-en');
                body.classList.add('lang-zh');
                localStorage.setItem('user-lang', 'zh');
            }
        });
    }
})();
