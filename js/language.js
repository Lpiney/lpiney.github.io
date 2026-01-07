(function() {
    var userLang = localStorage.getItem('user-lang');
    var body = document.body;

    if (!userLang) {
        var sysLang = navigator.language || navigator.userLanguage;
        userLang = sysLang.toLowerCase().indexOf('zh') > -1 ? 'zh' : 'en';
    }

    function applyLang(lang, persist) {
        body.classList.remove('lang-zh');
        body.classList.remove('lang-en');
        body.classList.add('lang-' + lang);
        if (persist) localStorage.setItem('user-lang', lang);
        document.dispatchEvent(new CustomEvent('lpiney:language-change', { detail: { lang: lang } }));
    }

    applyLang(userLang, false);

    document.addEventListener('click', function(e) {
        var target = e.target;
        if (!target) return;
        if (target.classList && target.classList.contains('lang-select')) {
            e.preventDefault();
            var lang = target.getAttribute('data-lang');
            if (lang === 'zh' || lang === 'en') applyLang(lang, true);
        }
    });
})();
