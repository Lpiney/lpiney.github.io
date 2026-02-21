/**
 * 关键词高亮和悬停解释功能
 * 支持鼠标悬停显示关键词定义
 */
(function() {
    'use strict';
    
    // 关键词定义数据库（可根据需要扩展）
    const keywordDefinitions = {
        // 技术类关键词
        'API': 'Application Programming Interface，应用程序编程接口',
        'HTTP': 'HyperText Transfer Protocol，超文本传输协议',
        'CSS': 'Cascading Style Sheets，层叠样式表',
        'JavaScript': '一种轻量级的编程语言，常用于网页交互',
        'JSON': 'JavaScript Object Notation，一种数据交换格式',
        'HTML': 'HyperText Markup Language，超文本标记语言',
        'PWA': 'Progressive Web App，渐进式网页应用',
        'SEO': 'Search Engine Optimization，搜索引擎优化',
        'CDN': 'Content Delivery Network，内容分发网络',
        
        // 金融/投资类关键词
        'ROI': 'Return On Investment，投资回报率',
        'APY': 'Annual Percentage Yield，年化收益率',
        'APR': 'Annual Percentage Rate，年化利率',
        'DCA': 'Dollar Cost Averaging，定期定额投资法',
        'ETF': 'Exchange-Traded Fund，交易所交易基金',
        'P/E': 'Price-to-Earnings Ratio，市盈率',
        '蓝筹股': '经营规模大、业绩稳定的上市公司股票',
        '白马股': '业绩优良、信息公开透明的成长性股票',
        '熊市': '市场行情低迷，价格持续下跌的市场状态',
        '牛市': '市场行情高涨，价格持续上涨的市场状态',
        
        // 通用词汇
        '区块链': '分布式账本技术，具有去中心化特点',
        '人工智能': 'Artificial Intelligence，模拟人类智能的技术',
        '机器学习': 'Machine Learning，让计算机具备学习能力的技术',
        '大数据': '规模巨大、类型多样、处理速度快的数据集合',
        '云计算': '通过网络提供计算资源和服务的技术',
        '物联网': 'Internet of Things，万物互联的网络技术'
    };
    
    // 初始化关键词处理
    document.addEventListener('DOMContentLoaded', function() {
        // 遍历页面上的主要内容区域
        const contentAreas = document.querySelectorAll('article, .post-content, .post-body, .content');
        
        contentAreas.forEach(area => {
            processContentArea(area);
        });
    });
    
    /**
     * 处理内容区域中的关键词
     * @param {Element} area - 内容区域元素
     */
    function processContentArea(area) {
        // 获取区域内的所有文本节点
        const walker = document.createTreeWalker(
            area,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    // 排除脚本和样式标签
                    const parentTag = node.parentElement.tagName;
                    if (parentTag === 'SCRIPT' || parentTag === 'STYLE' || parentTag === 'CODE') {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );
        
        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }
        
        // 处理每个文本节点
        textNodes.forEach(textNode => {
            processTextNode(textNode);
        });
    }
    
    /**
     * 处理文本节点，高亮关键词
     * @param {Node} textNode - 文本节点
     */
    function processTextNode(textNode) {
        const text = textNode.textContent;
        
        // 按照关键词长度排序，优先匹配长关键词
        const sortedKeywords = Object.keys(keywordDefinitions)
            .sort((a, b) => b.length - a.length);
        
        let modifiedText = text;
        const replacements = [];
        
        // 查找所有关键词匹配
        sortedKeywords.forEach(keyword => {
            const regex = new RegExp(`(${escapeRegExp(keyword)})`, 'gi');
            let match;
            
            while ((match = regex.exec(modifiedText)) !== null) {
                const fullMatch = match[0];
                const startIndex = match.index;
                const endIndex = startIndex + fullMatch.length;
                
                // 检查是否已被其他关键词包围
                const isOverlapping = replacements.some(rep => {
                    return !(endIndex <= rep.startIndex || startIndex >= rep.endIndex);
                });
                
                if (!isOverlapping) {
                    replacements.push({
                        startIndex,
                        endIndex,
                        keyword: fullMatch,
                        definition: keywordDefinitions[keyword]
                    });
                }
            }
        });
        
        // 按照起始位置排序，从后往前替换（避免索引偏移）
        replacements.sort((a, b) => b.startIndex - a.startIndex);
        
        let result = modifiedText;
        replacements.forEach(rep => {
            const before = result.substring(0, rep.startIndex);
            const highlighted = `<span class="keyword-highlight" data-definition="${rep.definition}">${rep.keyword}</span>`;
            const after = result.substring(rep.endIndex);
            result = before + highlighted + after;
        });
        
        // 如果有替换，则创建新的HTML结构
        if (result !== text) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = result;
            
            // 替换原始文本节点
            const fragment = document.createDocumentFragment();
            while (tempDiv.firstChild) {
                fragment.appendChild(tempDiv.firstChild);
            }
            
            textNode.parentNode.replaceChild(fragment, textNode);
        }
    }
    
    /**
     * 转义正则表达式特殊字符
     * @param {string} str - 字符串
     * @returns {string} 转义后的字符串
     */
    function escapeRegExp(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    /**
     * 初始化悬停提示功能
     */
    document.addEventListener('mouseover', function(e) {
        if (e.target.classList.contains('keyword-highlight')) {
            showTooltip(e.target, e.target.dataset.definition);
        }
    });
    
    document.addEventListener('mouseout', function(e) {
        if (e.target.classList.contains('keyword-highlight')) {
            hideTooltip();
        }
    });
    
    /**
     * 显示悬停提示
     * @param {Element} element - 目标元素
     * @param {string} definition - 定义文本
     */
    function showTooltip(element, definition) {
        // 检查是否已有提示框
        const existingTooltip = document.querySelector('.keyword-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }
        
        // 创建提示框
        const tooltip = document.createElement('div');
        tooltip.className = 'keyword-tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-content">
                <strong>${element.textContent}</strong>
                <p>${definition}</p>
            </div>
        `;
        
        // 设置样式
        tooltip.style.position = 'absolute';
        tooltip.style.zIndex = '1000';
        tooltip.style.backgroundColor = '#333';
        tooltip.style.color = '#fff';
        tooltip.style.padding = '10px 15px';
        tooltip.style.borderRadius = '4px';
        tooltip.style.fontSize = '14px';
        tooltip.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        tooltip.style.maxWidth = '300px';
        tooltip.style.wordWrap = 'break-word';
        tooltip.style.lineHeight = '1.4';
        
        // 添加箭头
        const arrow = document.createElement('div');
        arrow.className = 'tooltip-arrow';
        arrow.style.position = 'absolute';
        arrow.style.width = '0';
        arrow.style.height = '0';
        arrow.style.borderWidth = '6px';
        arrow.style.borderStyle = 'solid';
        arrow.style.borderColor = 'transparent transparent #333 transparent';
        arrow.style.top = '-12px';
        arrow.style.left = '10px';
        tooltip.appendChild(arrow);
        
        // 计算位置
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        tooltip.style.left = rect.left + 'px';
        tooltip.style.top = (rect.top + rect.height + 5 + scrollTop) + 'px';
        
        // 添加到页面
        document.body.appendChild(tooltip);
        
        // 检查是否超出屏幕边界并调整位置
        const tooltipRect = tooltip.getBoundingClientRect();
        if (tooltipRect.right > window.innerWidth) {
            tooltip.style.left = (rect.right - tooltipRect.width) + 'px';
            arrow.style.left = (tooltipRect.width - 20) + 'px';
        }
    }
    
    /**
     * 隐藏悬停提示
     */
    function hideTooltip() {
        const tooltip = document.querySelector('.keyword-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }
    
    // 为关键词添加样式
    const style = document.createElement('style');
    style.textContent = `
        .keyword-highlight {
            background-color: #fff3cd;
            color: #856404;
            padding: 1px 3px;
            border-radius: 3px;
            border-bottom: 1px dotted #ffc107;
            cursor: pointer;
            position: relative;
            transition: background-color 0.2s ease;
        }
        
        .keyword-highlight:hover {
            background-color: #ffeaa7;
        }
        
        .keyword-tooltip {
            position: absolute;
            z-index: 1000;
            background-color: #333;
            color: #fff;
            padding: 10px 15px;
            border-radius: 4px;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            max-width: 300px;
            word-wrap: break-word;
            line-height: 1.4;
        }
        
        .tooltip-content strong {
            display: block;
            margin-bottom: 5px;
            color: #ffc107;
        }
        
        .tooltip-content p {
            margin: 0;
            font-size: 0.9em;
        }
        
        .reading-time-banner {
            margin: 15px 0;
            padding: 10px 15px;
            border-left: 4px solid #0085a1;
            background-color: #f8f9fa;
        }
        
        [data-theme="dark"] .keyword-highlight,
        body.dark-mode .keyword-highlight {
            background-color: #4a6fa5;
            color: #fff;
            border-bottom: 1px dotted #6c757d;
        }
        
        [data-theme="dark"] .keyword-highlight:hover,
        body.dark-mode .keyword-highlight:hover {
            background-color: #5a7fb5;
        }
        
        [data-theme="dark"] .reading-time-banner,
        body.dark-mode .reading-time-banner {
            background-color: #343a40;
            border-left-color: #4da3d0;
        }
    `;
    document.head.appendChild(style);
})();