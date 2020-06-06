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
  console.log("👷‍♀️ Intercepting request");
  event.respondWith(
    // Note that access to the request lets you change caching strategies based on things like
    // resource type or path or anything
    caches.match(event.request).then((cachedResponse) => {
      if (event.request.url.includes("/hacker-news/")) {
        // specific caching strategy for the API: network first then cache
        if (navigator.onLine) {
          return fetch(event.request).then((response) => {
            console.log("👷‍♀️ Caching API request");
            return cache.put(event.request, response).then(() => response);
          });
        } else if (cachedResponse) {
          return cachedResponse;
        }
      } else {
        // for everything else cache first then network
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request);
      }
    })
  );
});
