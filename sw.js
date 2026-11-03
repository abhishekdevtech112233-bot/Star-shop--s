const CACHE_NAME = 'star-merchant-v3'; // 👈 जब भी बड़ा अपडेट करो, इसे v3, v4 कर सकते हो
const assetsToCache = [
  './index.html',
  './manifest.json',
  './logo.svg',
  './logo512.png'
];

// 1. इंस्टॉल करते समय नई फाइलें कैच करना
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assetsToCache);
    })
  );
  self.skipWaiting(); // नया सर्विस वर्कर तुरंत कंट्रोल ले ले
});

// 2. एक्टिवेट होते ही पुराने सारे कैच डिलीट कर देना (ताकि नया अपडेट तुरंत दिखे)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Purging old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. फेच रिक्वेस्ट हैंडल करना
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
