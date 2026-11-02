import assert from "node:assert/strict";
import test from "node:test";
import {
      clearRecentSearches,
      MAX_RECENT_SEARCHES,
      readRecentSearches,
      RECENT_SEARCHES_KEY,
      rememberSearch,
} from "../src/utils/recentSearches.js";

function createStorage(initialValue = "[]") {
      const values = new Map([[RECENT_SEARCHES_KEY, initialValue]]);
      return {
            getItem(key) {
                  return values.get(key) ?? null;
            },
            setItem(key, value) {
                  values.set(key, value);
            },
            removeItem(key) {
                  values.delete(key);
            },
      };
}

test("reads recent searches as trimmed, unique terms", () => {
      const storage = createStorage(JSON.stringify([" Dune ", "dune", "  ", "Severance"]));

      assert.deepEqual(readRecentSearches(storage), ["Dune", "Severance"]);
});

test("moves a repeated search to the front and keeps a bounded history", () => {
      const storage = createStorage(JSON.stringify(Array.from({ length: MAX_RECENT_SEARCHES }, (_, index) => `Title ${index + 1}`)));

      const next = rememberSearch("title 3", storage);

      assert.equal(next[0], "title 3");
      assert.equal(next.length, MAX_RECENT_SEARCHES);
      assert.equal(next.filter((term) => term.toLowerCase() === "title 3").length, 1);
      assert.deepEqual(JSON.parse(storage.getItem(RECENT_SEARCHES_KEY)), next);
});

test("ignores empty searches and clears history", () => {
      const storage = createStorage(JSON.stringify(["Dune"]));

      assert.deepEqual(rememberSearch("   ", storage), ["Dune"]);
      clearRecentSearches(storage);
      assert.deepEqual(readRecentSearches(storage), []);
});

test("recovers from malformed browser storage", () => {
      const storage = createStorage("not-json");

      assert.deepEqual(readRecentSearches(storage), []);
      assert.deepEqual(rememberSearch("Dune", storage), ["Dune"]);
});
