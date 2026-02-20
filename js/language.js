(function() {
    // 获取页面的 body 和 html 元素
    const body = document.body;
    const html = document.documentElement;
    // 存储用户语言偏好的键名
    const STORAGE_KEY = 'user-lang';
    
    // 从浏览器本地存储读取用户之前选择的语言
    let userLang = localStorage.getItem(STORAGE_KEY);
    if (!userLang) {
        // 如果用户之前没有选择过语言，获取浏览器或系统的默认语言
        const sysLang = navigator.language || navigator.userLanguage;
        // 如果是中文环境，默认显示中文；否则显示英文
        userLang = sysLang.toLowerCase().includes('zh') ? 'zh' : 'en';
    }

    /**
     * 应用语言设置
     * @param {string} lang - 语言代码 ('zh' 或 'en')
     * @param {boolean} persist - 是否保存用户的选择
     */
    function applyLang(lang, persist = false) {
        // 先移除之前的语言类名，再添加新的语言类名（用于 CSS 控制显示/隐藏）
        body.className = body.className.replace(/lang-\w+/g, '') + ` lang-${lang}`;
        
        // 设置 html 标签的 lang 属性（便于搜索引擎和辅助技术识别）
        if (html) html.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');
        
        // 如果需要保存，就把用户的选择存到本地存储
        if (persist) localStorage.setItem(STORAGE_KEY, lang);
        
        // 触发一个自定义事件，告诉页面其他部分语言变了
        document.dispatchEvent(new CustomEvent('lpiney:language-change', { detail: { lang } }));
    }

    // 页面加载时立即应用语言（避免页面闪烁）
    applyLang(userLang);

    // 等待页面元素加载完成后，再绑定点击事件
    document.addEventListener('DOMContentLoaded', () => {
        // 监听页面上所有的点击事件
        document.addEventListener('click', e => {
            // 获取被点击的元素
            const target = e.target;
            if (!target) return;

            // 检查点击的是不是语言切换按钮
            if (target.closest('#lang-toggle')) {
                // 阻止链接的默认跳转行为
                e.preventDefault();
                // 判断当前是什么语言，然后切换到另一种语言
                const currentLang = body.classList.contains('lang-en') ? 'en' : 'zh';
                const nextLang = currentLang === 'en' ? 'zh' : 'en';
                // 应用新语言并保存用户的选择
                applyLang(nextLang, true);
            }
            // 检查点击的是不是语言选择器（比如下拉菜单）
            else if (target.classList?.contains('lang-select')) {
                e.preventDefault();
                // 获取按钮上设置的语言代码
                const lang = target.getAttribute('data-lang');
                // 只有中文和英文两种选择
                if (['zh', 'en'].includes(lang)) applyLang(lang, true);
            }
        });
    });
})();