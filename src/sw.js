/* eslint-env serviceworker */

const version = "1.0.0";
const CACHE = "cache-only-" + version;

self.addEventListener("install", (evt) => {
    evt.waitUntil(precache().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (evt) => {
    evt.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if (cacheName !== CACHE) {
                    return caches.delete(cacheName);
                }
            })
        )).then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", (evt) => {
    evt.respondWith(networkOrCache(evt.request));
});


function networkOrCache(request) {
    return fetch(request).then((response) => response.ok ? response : fromCache(request))
        .catch(() => fromCache(request));
}

function fromCache(request) {
    return caches.open(CACHE).
        then((cache) => cache.match(request, {ignoreSearch: true}).
            then((matching) => matching || Promise.reject("request-not-in-cache")));
}

function precache() {
    const filesToCache = self.__WB_MANIFEST.map((e) => e.url);
    return caches.open(CACHE).then((cache) => cache.addAll([
        "./",
        ...filesToCache
    ]));
}
