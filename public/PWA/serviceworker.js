const cache_name = "version-1";
const url_to_cache = ["offline.html", "index.html"];

// Install the service worker
self.addEventListener("install", (event) => {
      event.waitUntil(
            caches
                  .open(cache_name)
                  .then((cache) => {
                        return cache.addAll(url_to_cache);
                  })
                  .catch((err) => {
                        console.log("Unable to insert cache", err.message);
                  })
      );
});

// Fetch the cache from the client
self.addEventListener("fetch", (event) => {
      event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                  return (
                        cachedResponse ||
                        fetch(event.request).catch(() => {
                              return caches.match("offline.html");
                        })
                  );
            })
      );
});

self.addEventListener("activate", (event) => {
      const cache_white_list = [cache_name];
      event.waitUntil(
            Promise.all(
                  [
                        caches.keys().then((cache_names) => {
                              return Promise.all(
                                    cache_names.map((eachCache) => {
                                          if (!cache_white_list.includes(eachCache)) {
                                                return caches.delete(eachCache);
                                          }
                                    })
                              );
                        }),
                  ],
                  self.clients.claim()
            )
      );
});
