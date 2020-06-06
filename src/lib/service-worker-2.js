// Remember that workers (service worker and other workers) have their own special restricted scope. To access
// this global scope we use `self`
// Install
self.addEventListener("install", (event) => {
  console.log("👷‍♀️ Installing Service Worker");
  const cacheName = "v1";

  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      console.log("👷‍♀️ Caching main assets");
      return cache.addAll(["/", "index.html", "main.js"]);
    })
  );
});

// Proxy fetch
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log("👷‍♀️ Returning cached response");
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
