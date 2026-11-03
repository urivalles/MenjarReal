// El build calcula una versió a partir del contingut per detectar cada canvi.
const BUILD_VERSION = '68c1d6d0b66ff206';
const SCOPE = self.registration.scope;
const CACHE_PREFIX = `realfood-shell-${encodeURIComponent(new URL(SCOPE).pathname)}-`;
const CACHE_NAME = CACHE_PREFIX + BUILD_VERSION;
const APP_FILES = [
    './', 'index.html', 'styles.css', 'icons.css', 'recipes.js',
    'seasonal-recipes.js', 'recipe-catalog.js', 'weekly-planner.js',
    'shopping-list.js', 'app-data.js', 'app.js', 'pwa.js', 'manifest.webmanifest',
    'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png',
    'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png'
];
const APP_URLS = new Set(APP_FILES.map(file => new URL(file, SCOPE).href));
const INDEX_URL = new URL('index.html', SCOPE).href;

self.addEventListener('install', event => {
    // Si falla un fitxer, no s'activa una versió incompleta.
    event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(
        APP_FILES.map(file => new Request(new URL(file, SCOPE), { cache: 'reload' }))
    )));
});
self.addEventListener('activate', event => {
    event.waitUntil((async () => {
        for (const name of await caches.keys()) {
            if (name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME) await caches.delete(name);
        }
        await self.clients.claim();
    })());
});
self.addEventListener('message', event => {
    if (event.data?.type === 'ACTIVATE_UPDATE') event.waitUntil(self.skipWaiting());
});
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;
    const url = new URL(event.request.url);
    url.search = ''; url.hash = '';
    if (!APP_URLS.has(url.href)) return;
    // Només la carcassa coneguda; fotos externes i dades de l'usuari no es cachen.
    const target = event.request.mode === 'navigate' ? INDEX_URL : url.href;
    event.respondWith((async () => {
        const cache = await caches.open(CACHE_NAME);
        return await cache.match(target) || fetch(event.request);
    })());
});
