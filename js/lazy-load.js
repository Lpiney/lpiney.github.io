/**
 * 图片懒加载功能
 * 使用 Intersection Observer API 实现高性能的图片懒加载
 */

(function() {
    'use strict';

    // 检查浏览器是否支持 Intersection Observer API
    if ('IntersectionObserver' in window) {
        // 创建懒加载观察器
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // 检查是否存在 data-src 属性（懒加载占位符）
                    if (img.dataset.src) {
                        // 设置真实图片源
                        img.src = img.dataset.src;
                        
                        // 如果存在 data-srcset，则也设置 srcset
                        if (img.dataset.srcset) {
                            img.srcset = img.dataset.srcset;
                        }
                        
                        // 移除 data-src 属性
                        img.removeAttribute('data-src');
                        
                        // 移除 data-srcset 属性
                        if (img.dataset.srcset) {
                            img.removeAttribute('data-srcset');
                        }

                        // 移除占位符类
                        img.classList.remove('lazy-load-placeholder');
                        
                        // 添加已加载类
                        img.classList.add('lazy-loaded');
                        
                        // 停止观察此元素
                        observer.unobserve(img);
                    }
                }
            });
        });

        // 查找所有带有 data-src 属性的图片并开始观察
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // 对于不支持 Intersection Observer 的旧浏览器，回退到简单方法
        const lazyImages = document.querySelectorAll('img[data-src]');
        const loadImages = () => {
            lazyImages.forEach(img => {
                if (img.getBoundingClientRect().top <= window.innerHeight && !img.classList.contains('lazy-loaded')) {
                    img.src = img.dataset.src;
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                    }
                    img.removeAttribute('data-src');
                    if (img.dataset.srcset) {
                        img.removeAttribute('data-srcset');
                    }
                    img.classList.remove('lazy-load-placeholder');
                    img.classList.add('lazy-loaded');
                }
            });
        };

        // 监听滚动事件
        window.addEventListener('scroll', loadImages);
        // 页面加载时也执行一次
        window.addEventListener('load', loadImages);
    }

    /**
     * 渐变显示已加载的图片
     */
    const style = document.createElement('style');
    style.textContent = `
        img.lazy-load-placeholder {
            opacity: 0.5;
            transition: opacity 0.3s ease;
        }
        
        img.lazy-loaded {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
})();