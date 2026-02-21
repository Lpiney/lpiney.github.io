/**
 * 自动生成文章目录导航
 * 通过解析页面中的标题元素来生成目录
 */
(function() {
    'use strict';
    
    // 等待页面内容加载完成
    document.addEventListener('DOMContentLoaded', function() {
        // 获取文章内容区域
        const postContent = document.querySelector('.post-container') || document.querySelector('.post-content') || document.querySelector('article');
        
        if (!postContent) {
            console.warn('未找到文章内容区域，目录功能将不会加载');
            return;
        }
        
        // 查找所有标题元素
        const headings = Array.from(postContent.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        
        if (headings.length === 0) {
            console.info('文章中没有发现标题，目录功能将不会生成');
            return;
        }
        
        // 生成目录HTML
        const tocHtml = generateTOC(headings);
        
        // 创建目录容器
        const tocContainer = document.createElement('div');
        tocContainer.id = 'table-of-contents';
        tocContainer.className = 'toc toc-fixed';
        tocContainer.innerHTML = `
            <div class="toc-title">文章目录</div>
            <div class="toc-content">${tocHtml}</div>
        `;
        
        // 将目录添加到页面主体
        document.body.appendChild(tocContainer);
        
        // 添加平滑滚动功能
        addSmoothScrolling();
    });
    
    /**
     * 生成目录HTML
     * @param {Array} headings - 标题元素数组
     */
    function generateTOC(headings) {
        let tocHTML = '<ul>';
        let currentLevel = 0;
        
        headings.forEach((heading, index) => {
            const level = parseInt(heading.tagName.charAt(1));
            const id = heading.id || `heading-${index}`;
            
            // 确保标题有ID以便锚点跳转
            if (!heading.id) {
                heading.id = id;
            }
            
            const text = heading.textContent.trim();
            
            // 处理层级关系
            if (level > currentLevel) {
                // 增加缩进层级
                for (let i = currentLevel; i < level; i++) {
                    tocHTML += '<ul>';
                }
            } else if (level < currentLevel) {
                // 减少缩进层级
                for (let i = currentLevel; i > level; i--) {
                    tocHTML += '</ul></li>';
                }
            } else if (currentLevel !== 0) {
                tocHTML += '</li>';
            }
            
            tocHTML += `<li class="toc-level-${level}"><a href="#${id}" data-target="${id}">${text}</a>`;
            currentLevel = level;
        });
        
        // 关闭所有开放的标签
        for (let i = 0; i < currentLevel; i++) {
            tocHTML += '</li></ul>';
        }
        
        return tocHTML;
    }
    
    /**
     * 添加平滑滚动功能
     */
    function addSmoothScrolling() {
        const tocLinks = document.querySelectorAll('#table-of-contents a');
        
        tocLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('data-target');
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // 滚动到目标元素
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // 更新URL哈希但不触发页面跳转
                    history.pushState(null, null, `#${targetId}`);
                    
                    // 高亮当前选中的目录项
                    updateActiveTOCItem(this);
                }
            });
        });
        
        // 监听滚动事件，更新当前活跃的目录项
        window.addEventListener('scroll', updateActiveTOCItemOnScroll);
    }
    
    /**
     * 更新当前活跃的目录项
     * @param {Element} clickedLink - 被点击的链接
     */
    function updateActiveTOCItem(clickedLink) {
        // 移除之前活跃的链接样式
        document.querySelectorAll('#table-of-contents a.active').forEach(activeLink => {
            activeLink.classList.remove('active');
        });
        
        // 添加当前链接的活跃样式
        if (clickedLink) {
            clickedLink.classList.add('active');
        }
    }
    
    /**
     * 滚动时更新活跃的目录项
     */
    function updateActiveTOCItemOnScroll() {
        const headings = document.querySelectorAll('#table-of-contents a[data-target]');
        const scrollPosition = window.scrollY + 100; // 添加偏移量
        
        let current = '';
        
        headings.forEach(heading => {
            const targetId = heading.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop;
                const offsetHeight = targetElement.offsetHeight;
                
                if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                    current = targetId;
                }
            }
        });
        
        // 更新活跃的目录项
        document.querySelectorAll('#table-of-contents a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-target') === current) {
                link.classList.add('active');
            }
        });
    }
})();