const CACHE_NAME = 'amanat-tracker-v1';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './icon.svg',
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            // using catch to prevent failure if an external CDN asset fails to load
            return Promise.all(
                ASSETS.map(url => {
                    return fetch(url).then(response => {
                        if (!response.ok) throw new Error('Network response was not ok');
                        return cache.put(url, response);
                    }).catch(error => {
                        console.error('Failed to cache:', url, error);
                    });
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).then(fetchRes => {
                return caches.open(CACHE_NAME).then(cache => {
                    // Only cache successful GET requests
                    if(event.request.method === 'GET' && fetchRes.status === 200) {
                        cache.put(event.request, fetchRes.clone());
                    }
                    return fetchRes;
                });
            });
        }).catch(() => {
            // Return nothing if fully offline and no cache match
        })
    );
});
