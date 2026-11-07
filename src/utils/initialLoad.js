const MIN_VISIBLE_MS = 600;
const MAX_WAIT_MS = 5000;
const IDLE_AFTER_MS = 200;
const SETTLE_MS = 100;

let pendingRequests = 0;
let lastActivityAt = Date.now();
let appMounted = false;

const expectedHomeLoads = new Set();
const completedHomeLoads = new Set();
const listeners = new Set();

const now = () => (typeof performance !== "undefined" ? performance.now() : Date.now());

const notify = () => {
      listeners.forEach((listener) => listener());
};

export function trackRequestStart() {
      pendingRequests += 1;
      lastActivityAt = now();
      notify();
}

export function trackRequestEnd() {
      pendingRequests = Math.max(0, pendingRequests - 1);
      lastActivityAt = now();
      notify();
}

export function markAppMounted() {
      if (appMounted) return;
      appMounted = true;
      lastActivityAt = now();
      notify();
}

export function expectHomeLoads(keys) {
      keys.forEach((key) => expectedHomeLoads.add(key));
      lastActivityAt = now();
      notify();
}

export function completeHomeLoad(key) {
      completedHomeLoads.add(key);
      lastActivityAt = now();
      notify();
}

function homeLoadsComplete() {
      return (
            expectedHomeLoads.size > 0 &&
            [...expectedHomeLoads].every((key) => completedHomeLoads.has(key))
      );
}

function delay(ms) {
      return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function requestFrame(callback) {
      if (typeof requestAnimationFrame === "function") {
            return requestAnimationFrame(callback);
      }
      return window.setTimeout(callback, 16);
}

function nextFrame() {
      return new Promise((resolve) => requestFrame(() => resolve()));
}

function waitForWindowLoad() {
      if (typeof document === "undefined" || document.readyState === "complete") {
            return Promise.resolve();
      }
      return new Promise((resolve) => window.addEventListener("load", resolve, { once: true }));
}

function waitForFonts() {
      if (typeof document === "undefined" || !document.fonts?.ready) {
            return Promise.resolve();
      }
      return document.fonts.ready.catch(() => {});
}

function waitFor(predicate, timeoutMs = MAX_WAIT_MS) {
      if (predicate()) return Promise.resolve();

      return new Promise((resolve) => {
            const finish = () => {
                  listeners.delete(listener);
                  window.clearTimeout(timer);
                  resolve();
            };
            const listener = () => {
                  if (predicate()) finish();
            };
            const timer = window.setTimeout(finish, timeoutMs);

            listeners.add(listener);
      });
}

function waitForIdle() {
      const deadline = now() + MAX_WAIT_MS;

      return new Promise((resolve) => {
            const check = () => {
                  const idle = pendingRequests === 0 && now() - lastActivityAt >= IDLE_AFTER_MS;

                  if (idle || now() >= deadline) {
                        resolve();
                        return;
                  }

                  requestFrame(check);
            };

            requestFrame(check);
      });
}

export function waitForInitialLoad({ home = false } = {}) {
      const startedAt = now();
      const maxWait = delay(MAX_WAIT_MS);

      const ready = (async () => {
            await Promise.all([waitForWindowLoad(), waitForFonts()]);
            await waitFor(() => appMounted);

            if (home) await waitFor(homeLoadsComplete);

            await delay(SETTLE_MS);
            await waitForIdle();

            const remaining = MIN_VISIBLE_MS - (now() - startedAt);
            if (remaining > 0) await delay(remaining);

            await nextFrame();
            await nextFrame();
      })();

      return Promise.race([ready, maxWait]);
}

export function dismissSplashWhenReady() {
      if (typeof window === "undefined" || typeof document === "undefined") return;

      const { pathname } = window.location;
      const home = pathname === "/" || pathname === "";

      waitForInitialLoad({ home }).then(() => {
            if (typeof window.__hideAppSplash === "function") {
                  window.__hideAppSplash();
                  return;
            }

            document.getElementById("app-splash")?.remove();
      });
}
