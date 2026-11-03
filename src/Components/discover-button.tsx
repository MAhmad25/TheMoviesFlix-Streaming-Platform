"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { createPortal } from "react-dom";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { play } from "cuelume";
import { captureEvent } from "../analytics/posthog.js";
import api from "../utils/axios";
import { clearRecentSearches, readRecentSearches, rememberSearch } from "../utils/recentSearches";
import { SmoothInput } from "./ui/SmoothInput";

const getTitle = (result) => result.name || result.title || result.original_name || result.original_title || "Untitled";
const getYear = (result) => (result.release_date || result.first_air_date || "").slice(0, 4);
const getArtwork = (result) => {
      const path = result.poster_path || result.profile_path || result.backdrop_path;
      return path ? `https://image.tmdb.org/t/p/w185${path}` : "/noImage.jpg";
};

export default function DiscoverButton({ expanded, onExpandedChange, showTrigger = true, className = "" }) {
      const [internalExpanded, setInternalExpanded] = useState(false);
      const isSearchExpanded = expanded ?? internalExpanded;
      const [query, setQuery] = useState("");
      const [results, setResults] = useState([]);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(false);
      const [retryToken, setRetryToken] = useState(0);
      const [recentSearches, setRecentSearches] = useState(readRecentSearches);
      const rootRef = useRef(null);
      const popupRef = useRef(null);
      const inputRef = useRef(null);
      const closeRef = useRef(null);
      const [visualViewport, setVisualViewport] = useState(() => ({
            height: typeof window === "undefined" ? 0 : Math.round(window.visualViewport?.height || window.innerHeight),
            top: typeof window === "undefined" ? 0 : Math.round(window.visualViewport?.offsetTop || 0),
      }));
      const navigate = useNavigate();

      const changeExpanded = (next) => {
            if (expanded === undefined) setInternalExpanded(next);
            onExpandedChange?.(next);
      };

      const closeSearch = () => {
            changeExpanded(false);
            setQuery("");
            setResults([]);
            setError(false);
      };
      closeRef.current = closeSearch;

      useEffect(() => {
            if (!isSearchExpanded) return undefined;
            inputRef.current?.focus({ preventScroll: true });
            const handlePointerDown = (event) => {
                        if (!rootRef.current?.contains(event.target) && !popupRef.current?.contains(event.target)) closeRef.current?.();
            };
            const handleKeyDown = (event) => {
                  if (event.key === "Escape") {
                        event.preventDefault();
                        closeRef.current?.();
                  }
            };
            document.addEventListener("pointerdown", handlePointerDown);
            document.addEventListener("keydown", handleKeyDown);
            return () => {
                  document.removeEventListener("pointerdown", handlePointerDown);
                  document.removeEventListener("keydown", handleKeyDown);
            };
      }, [isSearchExpanded]);

      useEffect(() => {
            if (!isSearchExpanded) return undefined;

            const updateVisualViewport = () => {
                  setVisualViewport({
                        height: Math.round(window.visualViewport?.height || window.innerHeight),
                        top: Math.round(window.visualViewport?.offsetTop || 0),
                  });
            };
            const viewport = window.visualViewport;
            viewport?.addEventListener("resize", updateVisualViewport);
            viewport?.addEventListener("scroll", updateVisualViewport);
            window.addEventListener("resize", updateVisualViewport);
            updateVisualViewport();

            return () => {
                  viewport?.removeEventListener("resize", updateVisualViewport);
                  viewport?.removeEventListener("scroll", updateVisualViewport);
                  window.removeEventListener("resize", updateVisualViewport);
            };
      }, [isSearchExpanded]);

      useEffect(() => {
            const term = query.trim();
            if (!term) {
                  setResults([]);
                  setLoading(false);
                  setError(false);
                  return undefined;
            }

            const controller = new AbortController();
            setLoading(true);
            const timer = window.setTimeout(async () => {
                  try {
                        const { data } = await api.get(`/search/multi?query=${encodeURIComponent(term)}`, { signal: controller.signal });
                        if (controller.signal.aborted) return;
                        const matching = (data.results || []).filter((item) => ["movie", "tv", "person"].includes(item.media_type));
                        setResults(matching.slice(0, 8));
                        setRecentSearches(rememberSearch(term));
                        captureEvent("search_performed", {
                              query_length: term.length,
                              result_count: data.total_results ?? matching.length,
                              has_results: matching.length > 0,
                        });
                  } catch {
                        if (!controller.signal.aborted) {
                              setResults([]);
                              setError(true);
                              captureEvent("search_failed", { query_length: term.length });
                        }
                  } finally {
                        if (!controller.signal.aborted) setLoading(false);
                  }
            }, 220);

            return () => {
                  window.clearTimeout(timer);
                  controller.abort();
            };
      }, [query, retryToken]);

      const handleResult = (result) => {
            const title = getTitle(result);
            play("press");
            captureEvent("search_result_selected", {
                  content_id: String(result.id),
                  content_type: result.media_type,
                  content_title: title,
            });
            navigate(result.media_type === "person" ? `/person/details/${result.id}` : `/${result.media_type}/details/${result.id}`);
            closeSearch();
      };

      const handleRecentSearch = (term) => {
            setQuery(term);
            setResults([]);
            setError(false);
      };

      const clearHistory = () => {
            clearRecentSearches();
            setRecentSearches([]);
      };

      return (
            <>
            <div ref={rootRef} className={`relative z-30 ${showTrigger ? "flex h-11 w-11 shrink-0 items-center justify-center" : "h-0 w-0"} ${className}`}>
                  {showTrigger && (
                        <button
                              type="button"
                              aria-label={isSearchExpanded ? "Search movies, TV series, and people" : "Open search"}
                              aria-expanded={isSearchExpanded}
                              aria-haspopup="dialog"
                              onClick={() => {
                                    if (isSearchExpanded) inputRef.current?.focus();
                                    else {
                                          play("press");
                                          changeExpanded(true);
                                    }
                              }}
                              className={`flex size-11 items-center justify-center rounded-full text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff7949] ${isSearchExpanded ? "bg-white/10" : "hover:bg-white/10"}`}
                        >
                              <Search size={21} aria-hidden="true" />
                        </button>
                  )}

            </div>

            {typeof document !== "undefined" && createPortal(
                  <AnimatePresence>
                  {isSearchExpanded && (
                              <motion.div
                                    ref={popupRef}
                                    key="discover-search-popup"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.16, ease: "easeOut" }}
                                    className="discover-search-layer pointer-events-none fixed inset-x-0 z-[1000]"
                                    style={{ top: `${visualViewport.top}px`, height: `${visualViewport.height}px` }}
                              >
                                    <motion.form
                                          initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                          animate={{ opacity: 1, y: 0, scale: 1 }}
                                          exit={{ opacity: 0, y: 6, scale: 0.98 }}
                                          transition={{ duration: 0.16, ease: "easeOut" }}
                                          onSubmit={(event) => {
                                                event.preventDefault();
                                                if (results[0]) handleResult(results[0]);
                                          }}
                                          className="discover-search__input pointer-events-auto absolute bottom-[80px] left-1/2 z-50 flex h-12 w-[min(320px,calc(100vw-24px))] -translate-x-1/2 items-center gap-3 rounded-full border border-white/15 bg-[#300b07] px-4 shadow-[0_14px_44px_rgba(0,0,0,0.38)]"
                                    >
                                          <Search size={18} className="shrink-0 text-white/65" aria-hidden="true" />
                                          <SmoothInput
                                                ref={inputRef}
                                                type="search"
                                                value={query}
                                                onChange={(event) => {
                                                      setQuery(event.target.value);
                                                      setError(false);
                                                }}
                                                placeholder="Search MoviesFlix"
                                                aria-label="Search movies, TV series, and people"
                                                aria-controls="discover-search-results"
                                                autoComplete="off"
                                                wrapperClassName="min-w-0 flex-1"
                                                className="discover-search__field min-w-0 flex-1 border-0 bg-transparent p-0 font-primary text-sm text-white outline-none placeholder:text-white/45 focus:ring-0"
                                          />
                                          {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="rounded-full p-1 text-white/60 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ff7949]"><X size={16} /></button>}
                                          <button type="button" onClick={closeSearch} aria-label="Close search" className="rounded-full p-1 text-white/60 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ff7949]"><X size={18} /></button>
                                    </motion.form>

                                    <motion.div
                                          id="discover-search-results"
                                          role="dialog"
                                          aria-label="Search suggestions"
                                          initial={{ opacity: 0, y: 8 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0, y: 6 }}
                                          transition={{ duration: 0.16, ease: "easeOut" }}
                                          className="discover-search__results pointer-events-auto absolute bottom-[140px] left-1/2 z-50 max-h-[min(360px,calc(100dvh-170px))] w-[min(360px,calc(100vw-24px))] -translate-x-1/2 overflow-y-auto rounded-2xl border border-white/10 bg-[#220806] p-3 shadow-[0_16px_48px_rgba(0,0,0,0.42)]"
                                          data-lenis-prevent
                                    >
                                          {!query.trim() && recentSearches.length > 0 && (
                                                <div>
                                                      <div className="mb-2 flex items-center justify-between px-1">
                                                            <h2 className="text-xs font-semibold text-white/65">Recent searches</h2>
                                                            <button type="button" onClick={clearHistory} className="text-xs text-white/50 transition hover:text-white">Clear</button>
                                                      </div>
                                                      <ul className="space-y-1" aria-label="Recent searches">
                                                            {recentSearches.map((term) => <li key={term.toLowerCase()}><button type="button" onClick={() => handleRecentSearch(term)} className="w-full rounded-lg px-2 py-2 text-left text-sm text-white/80 transition hover:bg-white/10 hover:text-white">{term}</button></li>)}
                                                      </ul>
                                                </div>
                                          )}
                                          {!query.trim() && recentSearches.length === 0 && <p className="px-2 py-3 text-sm text-white/60">Type a title or person’s name to see matches.</p>}
                                          {loading && <p className="px-2 py-3 text-sm text-white/70" role="status">Searching…</p>}
                                          {!loading && error && <div className="px-2 py-3 text-sm text-white/80" role="alert"><p>Search couldn’t load results.</p><button type="button" onClick={() => setRetryToken((token) => token + 1)} className="mt-2 text-[#ff9d78] hover:text-white">Try again</button></div>}
                                          {!loading && !error && query.trim() && results.length === 0 && <p className="px-2 py-3 text-sm text-white/65" role="status">No matches found.</p>}
                                          {!loading && results.length > 0 && (
                                                <ul className="space-y-1" aria-label="Search results">
                                                      {results.map((result) => {
                                                            const title = getTitle(result);
                                                            const type = result.media_type === "tv" ? "TV series" : result.media_type === "person" ? "Person" : "Movie";
                                                            const year = getYear(result);
                                                            return (
                                                                  <li key={`${result.media_type}-${result.id}`}>
                                                                        <button type="button" onClick={() => handleResult(result)} className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ff7949]">
                                                                              <img src={getArtwork(result)} alt="" width="38" height="54" loading="lazy" decoding="async" className="h-[54px] w-[38px] shrink-0 rounded-md object-cover" />
                                                                              <span className="min-w-0 flex-1">
                                                                                    <strong className="block truncate text-sm font-medium text-white">{title}</strong>
                                                                                    <span className="mt-1 block truncate text-xs text-white/55">{type}{year ? ` · ${year}` : ""}{result.vote_average ? ` · ★ ${Number(result.vote_average).toFixed(1)}` : ""}</span>
                                                                              </span>
                                                                        </button>
                                                                  </li>
                                                            );
                                                      })}
                                                </ul>
                                          )}
                                    </motion.div>
                              </motion.div>
                  )}
                  </AnimatePresence>,
                              document.body
                  )}
            </>
      );
}
