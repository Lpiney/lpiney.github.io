(function() {
    var userLang = localStorage.getItem('user-lang');
    var body = document.body;
    var html = document.documentElement;

    if (!userLang) {
        var sysLang = navigator.language || navigator.userLanguage;
        userLang = sysLang.toLowerCase().indexOf('zh') > -1 ? 'zh' : 'en';
    }

    function applyLang(lang, persist) {
        body.classList.remove('lang-zh');
        body.classList.remove('lang-en');
        body.classList.add('lang-' + lang);
        if (html) html.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');
        if (persist) localStorage.setItem('user-lang', lang);
        document.dispatchEvent(new CustomEvent('lpiney:language-change', { detail: { lang: lang } }));
    }

    applyLang(userLang, false);

    document.addEventListener('DOMContentLoaded', function() {
        document.addEventListener('click', function(e) {
            var target = e.target;
            if (!target) return;
            if (target.closest) {
                var langToggle = target.closest('#lang-toggle');
                if (langToggle) {
                    e.preventDefault();
                    var currentLang = body.classList.contains('lang-en') ? 'en' : 'zh';
                    var nextLang = currentLang === 'en' ? 'zh' : 'en';
                    applyLang(nextLang, true);
                    return;
                }
            }
            if (target.classList && target.classList.contains('lang-select')) {
                e.preventDefault();
                var lang = target.getAttribute('data-lang');
                if (lang === 'zh' || lang === 'en') applyLang(lang, true);
            }
        });
    });
})();
