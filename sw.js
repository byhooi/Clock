const CACHE_NAME = 'clock-v1';
const STATIC_CACHE = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json'
];

// 安装事件 - 缓存静态资源
self.addEventListener('install', (event) => {
    console.log('Service Worker 安装中...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('缓存静态资源');
                return cache.addAll(STATIC_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
    console.log('Service Worker 激活中...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('删除旧缓存:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 网络请求策略
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // API 请求 - 网络优先,失败时使用缓存
    if (url.hostname === 'api.open-meteo.com' ||
        url.hostname === 'v1.hitokoto.cn') {
        event.respondWith(
            fetch(request)
                .then(response => {
                    // 克隆响应并缓存
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(request, responseClone);
                    });
                    return response;
                })
                .catch(() => {
                    // 网络失败,返回缓存
                    return caches.match(request);
                })
        );
        return;
    }

    // 静态资源 - 缓存优先
    event.respondWith(
        caches.match(request)
            .then(cached => {
                if (cached) {
                    return cached;
                }
                return fetch(request).then(response => {
                    // 只缓存成功的响应
                    if (response.status === 200) {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(request, responseClone);
                        });
                    }
                    return response;
                });
            })
    );
});

// 后台同步(未来可扩展)
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-weather') {
        console.log('后台同步天气数据');
    }
});

// 推送通知(未来可扩展)
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : '时钟应用通知',
        icon: './icon-192.png',
        badge: './badge-72.png'
    };

    event.waitUntil(
        self.registration.showNotification('智能时钟', options)
    );
});
