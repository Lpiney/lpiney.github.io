/* ===========================================================
 * sw.js - Service Worker（PWA 离线功能核心）
 * ===========================================================
 * Copyright 2016 @huxpro
 * Licensed under Apache 2.0
 * service worker scripting
 * ========================================================== */

const CACHE_NAMESPACE = 'main-';
const CACHE = CACHE_NAMESPACE + 'precache-then-runtime';
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
  "./img/icon_wechat.png",
  "./img/home-bg.jpg",
  "./img/404-bg.jpg",
  "./css/bootstrap.min.css",
  "./css/bruce-blog.min.css",
  "./css/dark-mode.css",
  "./css/language.css"
];
const HOSTNAME_WHITELIST = [
  self.location.hostname,
  "cdnjs.cloudflare.com",
  "giscus.app"
];
const DEPRECATED_CACHES = ['precache-v1', 'runtime', 'main-precache-v1', 'main-runtime'];

const getCacheBustingUrl = (req) => {
  const now = Date.now();
  const url = new URL(req.url);
  url.protocol = self.location.protocol;
  url.search += (url.search ? '&' : '?') + 'cache-bust=' + now;
  return url.href;
};

const isNavigationReq = (req) => (
  req.mode === 'navigate' || 
  (req.method === 'GET' && 
   req.headers?.get('accept')?.includes('text/html'))
);

const endWithExtension = (req) => /\.\w+$/.test(new URL(req.url).pathname);

const shouldRedirect = (req) => (
  isNavigationReq(req) && 
  !req.url.endsWith('/') && 
  !endWithExtension(req)
);

const getRedirectUrl = (req) => {
  const url = new URL(req.url);
  url.pathname += "/";
  return url.href;
};

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(PRECACHE_LIST))
      .then(() => self.skipWaiting())
      .catch(err => console.error('Pre-cache failed:', err))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => DEPRECATED_CACHES.includes(key))
            .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

const fetchHelper = {
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

  cacheFirst: async function(url) {
    let response = await caches.match(url);
    if (!response) {
      response = await this.fetchThenCache(url);
    }
    return response;
  }
};

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (!HOSTNAME_WHITELIST.includes(url.hostname)) return;

  if (shouldRedirect(e.request)) {
    e.respondWith(Response.redirect(getRedirectUrl(e.request)));
    return;
  }

  if (e.request.url.includes('ys.static')) {
    e.respondWith(fetchHelper.cacheFirst(e.request.url));
    return;
  }

  const cached = caches.match(e.request);
  const fetched = fetch(getCacheBustingUrl(e.request), { cache: "no-store" });

  e.respondWith(
    cached.then(cachedResp => {
      const fetchPromise = fetched.catch(() => null);
      return Promise.race([fetchPromise, Promise.resolve(cachedResp)])
        .then(resp => resp || cachedResp || fetched)
        .catch(() => caches.match('offline.html'));
    }).catch(() => fetched.catch(() => caches.match('offline.html')))
  );

  e.waitUntil(
    Promise.all([fetched, caches.open(CACHE)])
      .then(async ([response, cache]) => {
        if (response?.ok) {
          const copy = response.clone();
          cache.put(e.request, copy);
        }
      })
  );

  if (isNavigationReq(e.request)) {
    e.waitUntil(revalidateContent(cached, fetched.then(r => r.clone())));
  }
});

function sendMessageToAllClients(msg) {
  self.clients.matchAll().then(clients => {
    clients.forEach(client => client.postMessage(msg));
  });
}

function sendMessageToClientsAsync(msg) {
  setTimeout(() => sendMessageToAllClients(msg), 1000);
}

async function revalidateContent(cachedResp, fetchedResp) {
  try {
    const [cached, fetched] = await Promise.all([cachedResp, fetchedResp]);
    if (!cached || !fetched) return;
    
    const cachedVer = cached.headers?.get('last-modified');
    const fetchedVer = fetched.headers?.get('last-modified');
    if (cachedVer && fetchedVer && cachedVer !== fetchedVer) {
      sendMessageToClientsAsync({
        'command': 'UPDATE_FOUND',
        'url': fetched.url
      });
    }
  } catch (err) {
    console.error('Revalidation error:', err);
  }
}