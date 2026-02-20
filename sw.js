/* ===========================================================
 * sw.js - Service Worker（PWA 离线功能核心）
 * ===========================================================
 * Copyright 2016 @huxpro
 * Licensed under Apache 2.0
 * service worker scripting
 * ========================================================== */

// 缓存命名空间（防止同一域名下不同网站的缓存冲突）
const CACHE_NAMESPACE = 'main-';
// 当前使用的缓存名称
const CACHE = CACHE_NAMESPACE + 'precache-then-runtime';
// 预缓存列表：这些文件会在 Service Worker 安装时就下载好
const PRECACHE_LIST = [
  "./",
  "./offline.html",
  "./js/jquery.min.js",
  "./js/bootstrap.min.js",
  "./js/hux-blog.min.js",
  "./js/simple-jekyll-search.min.js",
  "./js/dark-mode.js",
  "./js/language.js",
  "./js/snackbar.js",
  "./js/lazy-load.js",
  "./img/icon_wechat.png",
  "./img/home-bg.jpg",
  "./img/404-bg.jpg",
  "./css/bootstrap.min.css",
  "./css/bruce-blog.min.css",
  "./css/dark-mode.css",
  "./css/language.css"
];
// 允许访问的域名白名单（防止缓存外部恶意资源）
const HOSTNAME_WHITELIST = [
  self.location.hostname,
  "cdnjs.cloudflare.com",
  "giscus.app"
];
// 旧版本的缓存名称（用于清理）
const DEPRECATED_CACHES = ['precache-v1', 'runtime', 'main-precache-v1', 'main-runtime'];

// 推送通知相关配置
const NOTIFICATION_ICON = './pwa/icons/192.png';
const NOTIFICATION_TIMEOUT = 10000; // 10秒后自动关闭通知

/**
 * 给 URL 添加随机参数，强制从网络获取最新内容（绕过浏览器缓存）
 * @param {Request} req - 请求对象
 * @returns {string} - 带有缓存破坏参数的新 URL
 */
const getCacheBustingUrl = (req) => {
  const now = Date.now();
  const url = new URL(req.url);
  // 统一使用和当前页面一样的协议（http 或 https）
  url.protocol = self.location.protocol;
  // 添加 cache-bust 参数，强制获取最新内容
  url.search += (url.search ? '&' : '?') + 'cache-bust=' + now;
  return url.href;
};

/**
 * 判断是不是页面导航请求（而不是图片/JS/CSS 等资源请求）
 * @param {Request} req - 请求对象
 * @returns {boolean} - 是否为导航请求
 */
const isNavigationReq = (req) => (
  req.mode === 'navigate' || 
  (req.method === 'GET' && 
   req.headers?.get('accept')?.includes('text/html'))
);

/**
 * 判断 URL 是否以文件扩展名结尾
 * @param {Request} req - 请求对象
 * @returns {boolean} - URL 是否有扩展名
 */
const endWithExtension = (req) => /\.\w+$/.test(new URL(req.url).pathname);

/**
 * 判断是否需要重定向（解决 GitHub Pages 在某些情况下返回 404 的问题）
 * @param {Request} req - 请求对象
 * @returns {boolean} - 是否需要重定向
 */
const shouldRedirect = (req) => (
  isNavigationReq(req) && 
  !req.url.endsWith('/') && 
  !endWithExtension(req)
);

/**
 * 获取重定向 URL（为路径添加斜杠后缀）
 * @param {Request} req - 请求对象
 * @returns {string} - 重定向后的 URL
 */
const getRedirectUrl = (req) => {
  const url = new URL(req.url);
  url.pathname += "/";
  return url.href;
};

/**
 * @Lifecycle Install
 * 安装阶段：预缓存静态资源
 */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(PRECACHE_LIST))
      .then(() => self.skipWaiting())  // 跳过等待，立即激活
      .catch(err => console.error('Pre-cache failed:', err))
  );
});

/**
 * @Lifecycle Activate
 * 激活阶段：清理旧缓存
 */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => DEPRECATED_CACHES.includes(key))
            .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())  // 接管所有客户端
  );
});

/**
 * 缓存辅助工具对象
 */
const fetchHelper = {
  /**
   * 先发起网络请求，成功后将其放入缓存
   * @param {Request} request - 请求对象
   * @returns {Response} - 网络响应
   */
  fetchThenCache: async function(request) {
    const init = { mode: "cors", credentials: "omit" };
    const response = await fetch(request, init);
    if (response.ok) {
      const copy = response.clone();
      const cache = await caches.open(CACHE);
      cache.put(request, copy);
    }
    return response;
  },

  /**
   * 优先从缓存获取，如果缓存中没有则发起网络请求
   * @param {string} url - 请求 URL
   * @returns {Response} - 响应对象
   */
  cacheFirst: async function(url) {
    let response = await caches.match(url);
    if (!response) {
      response = await this.fetchThenCache(url);
    }
    return response;
  }
}

/**
 * 推送通知事件处理
 */
self.addEventListener('push', event => {
  let payload = {};
  
  try {
    payload = event.data.json();
  } catch (e) {
    payload = {
      title: 'Bruce Blog',
      body: event.data.text(),
      icon: NOTIFICATION_ICON,
      badge: NOTIFICATION_ICON
    };
  }

  const options = {
    body: payload.body || '您有一条新消息',
    icon: payload.icon || NOTIFICATION_ICON,
    badge: payload.badge || NOTIFICATION_ICON,
    tag: payload.tag || 'blog-notification',
    data: payload.data || {},
    actions: payload.actions || []
  };

  event.waitUntil(
    self.registration.showNotification(payload.title || 'Bruce Blog', options)
  );
});

/**
 * 通知点击事件处理
 */
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action) {
    // 处理通知动作
    console.log('Notification action:', event.action);
  } else {
    // 默认点击行为：打开博客主页
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

/**
 * 后台同步事件处理
 */
self.addEventListener('sync', event => {
  if (event.tag === 'sync-posts') {
    event.waitUntil(syncPosts());
  }
});

/**
 * 同步帖子数据的函数
 */
async function syncPosts() {
  try {
    // 这里可以实现离线期间收集的数据同步
    console.log('Syncing posts...');
    // 实际的同步逻辑会根据应用需求定制
  } catch (error) {
    console.error('Sync failed:', error);
    // 可以尝试延迟重试
    throw error;
  }
}

/**
 * 订阅到期事件处理
 */
self.addEventListener('pushsubscriptionchange', event => {
  event.waitUntil(
    self.registration.pushManager.subscribe(event.oldSubscription.options)
      .then(newSubscription => {
        // 发送新订阅到服务器
        return fetch('/api/subscription/update', {
          method: 'POST',
          body: JSON.stringify({ 
            oldEndpoint: event.oldSubscription.endpoint,
            newEndpoint: newSubscription.endpoint 
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        });
      })
  );
});;

/**
 * @Lifecycle Fetch
 * 拦截页面发出的网络请求
 */
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // 检查是否为允许的域名
  if (!HOSTNAME_WHITELIST.includes(url.hostname)) return;

  // 处理需要重定向的请求
  if (shouldRedirect(e.request)) {
    e.respondWith(Response.redirect(getRedirectUrl(e.request)));
    return;
  }

  // 处理静态资源请求
  if (e.request.url.includes('ys.static')) {
    e.respondWith(fetchHelper.cacheFirst(e.request.url));
    return;
  }

  // 分别获取缓存和网络响应
  const cached = caches.match(e.request);
  const fetched = fetch(getCacheBustingUrl(e.request), { cache: "no-store" });

  // 返回响应：优先返回网络请求，但如果网络失败则返回缓存或离线页面
  e.respondWith(
    cached.then(cachedResp => {
      const fetchPromise = fetched.catch(() => null);
      return Promise.race([fetchPromise, Promise.resolve(cachedResp)])
        .then(resp => resp || cachedResp || fetched)
        .catch(() => caches.match('offline.html'));
    }).catch(() => fetched.catch(() => caches.match('offline.html')))
  );

  // 后台更新缓存
  e.waitUntil(
    Promise.all([fetched, caches.open(CACHE)])
      .then(async ([response, cache]) => {
        if (response?.ok) {
          const copy = response.clone();
          cache.put(e.request, copy);
        }
      })
  );

  // 如果是导航请求，则验证内容是否有更新
  if (isNavigationReq(e.request)) {
    e.waitUntil(revalidateContent(cached, fetched.then(r => r.clone())));
  }
});

/**
 * 向所有客户端发送消息
 * @param {Object} msg - 要发送的消息
 */
function sendMessageToAllClients(msg) {
  self.clients.matchAll().then(clients => {
    clients.forEach(client => client.postMessage(msg));
  });
}

/**
 * 延迟向客户端发送消息
 * @param {Object} msg - 要发送的消息
 */
function sendMessageToClientsAsync(msg) {
  setTimeout(() => sendMessageToAllClients(msg), 1000);
}

/**
 * 验证内容是否有更新
 * @param {Promise<Response>} cachedResp - 缓存响应的 Promise
 * @param {Promise<Response>} fetchedResp - 网络响应的 Promise
 */
async function revalidateContent(cachedResp, fetchedResp) {
  try {
    const [cached, fetched] = await Promise.all([cachedResp, fetchedResp]);
    if (!cached || !fetched) return;
    
    // 比较缓存和网络响应的最后修改时间
    const cachedVer = cached.headers?.get('last-modified');
    const fetchedVer = fetched.headers?.get('last-modified');
    if (cachedVer && fetchedVer && cachedVer !== fetchedVer) {
      // 如果内容有更新，通知客户端
      sendMessageToClientsAsync({
        'command': 'UPDATE_FOUND',
        'url': fetched.url
      });
    }
  } catch (err) {
    console.error('Revalidation error:', err);
  }
}