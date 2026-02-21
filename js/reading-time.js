/**
 * 计算并显示文章阅读时间
 * 根据文章字数估算阅读时间
 */
(function() {
    'use strict';
    
    // 中文和英文的平均阅读速度（每分钟字数）
    const CHINESE_READING_SPEED = 300; // 中文每分钟约300字
    const ENGLISH_READING_SPEED = 200; // 英文每分钟约200词
    
    // 初始化阅读时间计算
    document.addEventListener('DOMContentLoaded', function() {
        // 获取文章内容
        const postContent = document.querySelector('.post-content') || 
                           document.querySelector('.post-body') || 
                           document.querySelector('article');
                           
        if (!postContent) {
            console.warn('未找到文章内容，阅读时间功能将不会加载');
            return;
        }
        
        // 计算阅读时间
        const readingTime = calculateReadingTime(postContent);
        
        // 显示阅读时间
        displayReadingTime(readingTime);
    });
    
    /**
     * 计算阅读时间
     * @param {Element} contentElement - 文章内容元素
     * @returns {number} 阅读时间（分钟）
     */
    function calculateReadingTime(contentElement) {
        // 获取纯文本内容，排除HTML标签
        const textContent = getTextContent(contentElement);
        
        // 计算中文和英文字符数量
        const chineseChars = textContent.match(/[\u4e00-\u9fa5]/g) || [];
        const englishWords = textContent.match(/[a-zA-Z]+\b/g) || [];
        const otherChars = textContent.replace(/[\u4e00-\u9fa5a-zA-Z\s]/g, '');
        
        // 估算阅读时间（分钟）
        const chineseTime = chineseChars.length / CHINESE_READING_SPEED;
        const englishTime = englishWords.length / ENGLISH_READING_SPEED;
        // 其他字符时间按中文计算
        const otherTime = otherChars.length / CHINESE_READING_SPEED;
        
        // 总阅读时间，向上取整
        const totalTime = Math.ceil(chineseTime + englishTime + otherTime);
        
        // 确保至少显示1分钟
        return Math.max(totalTime, 1);
    }
    
    /**
     * 提取纯文本内容
     * @param {Element} element - 要提取文本的元素
     * @returns {string} 纯文本内容
     */
    function getTextContent(element) {
        let text = '';
        
        // 遍历所有子节点
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    // 只接受非空白文本节点
                    if (node.parentNode.tagName === 'SCRIPT' || 
                        node.parentNode.tagName === 'STYLE' ||
                        node.parentNode.classList.contains('toc')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );
        
        let node;
        while (node = walker.nextNode()) {
            text += node.textContent + ' ';
        }
        
        return text.trim();
    }
    
    /**
     * 显示阅读时间
     * @param {number} minutes - 阅读时间（分钟）
     */
    function displayReadingTime(minutes) {
        // 查找文章头部信息区域
        let metaContainer = document.querySelector('.post-meta') || 
                           document.querySelector('.post-header') ||
                           document.querySelector('.page-header');
        
        if (!metaContainer) {
            // 如果没有找到元信息区域，则创建一个新的
            const articleHeader = document.querySelector('header') || 
                                 document.querySelector('.post-heading') ||
                                 document.querySelector('article');
                                 
            if (articleHeader) {
                metaContainer = document.createElement('div');
                metaContainer.className = 'post-meta';
                articleHeader.appendChild(metaContainer);
            }
        }
        
        if (metaContainer) {
            // 创建阅读时间元素
            const readingTimeEl = document.createElement('span');
            readingTimeEl.className = 'reading-time';
            readingTimeEl.innerHTML = `
                <i class="fa fa-clock-o" aria-hidden="true"></i>
                约 ${minutes} 分钟阅读
            `;
            
            // 添加样式类
            readingTimeEl.classList.add('meta-item');
            
            // 插入到元信息区域
            metaContainer.appendChild(readingTimeEl);
        }
        
        // 也可以在文章开头添加
        const postBody = document.querySelector('.post-content') || 
                        document.querySelector('.post-body') || 
                        document.querySelector('article');
                        
        if (postBody) {
            const readingTimeTop = document.createElement('div');
            readingTimeTop.className = 'reading-time-top';
            readingTimeTop.innerHTML = `
                <div class="alert alert-info reading-time-banner">
                    <i class="fa fa-book" aria-hidden="true"></i>
                    预计需要 ${minutes} 分钟阅读完本文
                </div>
            `;
            
            postBody.insertBefore(readingTimeTop, postBody.firstChild);
        }
    }
})();