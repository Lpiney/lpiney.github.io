(function() {
    const body = document.body;
    const html = document.documentElement;
    const STORAGE_KEY = 'user-lang';
    
    // 获取用户语言偏好
    let userLang = localStorage.getItem(STORAGE_KEY);
    if (!userLang) {
        const sysLang = navigator.language || navigator.userLanguage;
        userLang = sysLang.toLowerCase().includes('zh') ? 'zh' : 'en';
    }

    function applyLang(lang, persist = false) {
        body.className = body.className.replace(/lang-\w+/g, '') + ` lang-${lang}`;
        html?.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');
        if (persist) localStorage.setItem(STORAGE_KEY, lang);
        document.dispatchEvent(new CustomEvent('lpiney:language-change', { detail: { lang } }));
    }

    // 立即应用语言设置
    applyLang(userLang);

    document.addEventListener('DOMContentLoaded', () => {
        document.addEventListener('click', e => {
            const target = e.target;
            if (!target) return;

            // 处理语言切换按钮
            if (target.closest('#lang-toggle')) {
                e.preventDefault();
                const currentLang = body.classList.contains('lang-en') ? 'en' : 'zh';
                applyLang(currentLang === 'en' ? 'zh' : 'en', true);
            }
            // 处理语言选择器
            else if (target.classList?.contains('lang-select')) {
                e.preventDefault();
                const lang = target.getAttribute('data-lang');
                if (['zh', 'en'].includes(lang)) applyLang(lang, true);
            }
        });
    });
})();