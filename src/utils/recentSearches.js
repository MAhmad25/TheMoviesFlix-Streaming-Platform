export const RECENT_SEARCHES_KEY = "moviesflix.recent-searches.v1";
export const MAX_RECENT_SEARCHES = 6;

function getStorage() {
      try {
            return globalThis.localStorage || null;
      } catch {
            return null;
      }
}

export function readRecentSearches(storage = getStorage()) {
      if (!storage) return [];

      try {
            const stored = JSON.parse(storage.getItem(RECENT_SEARCHES_KEY) || "[]");
            if (!Array.isArray(stored)) return [];

            const seen = new Set();
            return stored
                  .filter((value) => typeof value === "string")
                  .map((value) => value.trim())
                  .filter((value) => {
                        const normalized = value.toLowerCase();
                        if (!normalized || seen.has(normalized)) return false;
                        seen.add(normalized);
                        return true;
                  })
                  .slice(0, MAX_RECENT_SEARCHES);
      } catch {
            return [];
      }
}

export function rememberSearch(query, storage = getStorage()) {
      const term = String(query ?? "").trim();
      const previous = readRecentSearches(storage);
      if (!term || !storage) return previous;

      const next = [term, ...previous.filter((saved) => saved.toLowerCase() !== term.toLowerCase())]
            .slice(0, MAX_RECENT_SEARCHES);
      try {
            storage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
      } catch {
            return previous;
      }
      return next;
}

export function clearRecentSearches(storage = getStorage()) {
      try {
            storage?.removeItem(RECENT_SEARCHES_KEY);
      } catch {
            // Keep the in-memory drawer usable when browser storage is unavailable.
      }
}
