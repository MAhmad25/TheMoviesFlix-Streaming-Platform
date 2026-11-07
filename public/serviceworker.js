const cacheName = "version-2";
const appShell = ["/index.html", "/offline.html"];

self.addEventListener("install", (event) => {
      event.waitUntil(
            caches
                  .open(cacheName)
                  .then((cache) => cache.addAll(appShell))
                  .then(() => self.skipWaiting())
                  .catch((err) => {
                        console.log("Unable to insert cache", err.message);
                  })
      );
});

self.addEventListener("activate", (event) => {
      event.waitUntil(
            Promise.all([
                  caches.keys().then((cacheNames) => Promise.all(cacheNames.filter((name) => name !== cacheName).map((name) => caches.delete(name)))),
                  self.clients.claim(),
            ])
      );
});

self.addEventListener("fetch", (event) => {
      const request = event.request;

      if (request.method !== "GET") return;

      const url = new URL(request.url);
      if (url.origin !== self.location.origin) return;
      if (url.pathname.startsWith("/@vite") || url.pathname.startsWith("/src/") || url.pathname.startsWith("/node_modules/") || url.pathname.startsWith("/__")) return;

      if (request.mode === "navigate") {
            event.respondWith(
                  fetch(request)
                        .then((response) => {
                              const copy = response.clone();
                              caches
                                    .open(cacheName)
                                    .then((cache) => cache.put(request, copy))
                                    .catch(() => {});
                              return response;
                        })
                        .catch(async () => (await caches.match(request)) || (await caches.match("/offline.html")) || Response.error())
            );
            return;
      }

      event.respondWith(caches.match(request).then((cachedResponse) => cachedResponse || fetch(request)));
});
