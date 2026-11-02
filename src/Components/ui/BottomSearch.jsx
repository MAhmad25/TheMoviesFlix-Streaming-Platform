import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { MdClose } from "react-icons/md";
import { CgSearch } from "react-icons/cg";
import api from "../../utils/axios";
import { captureEvent } from "../../analytics/posthog.js";
import { play } from "cuelume";
import { clearRecentSearches, readRecentSearches, rememberSearch } from "../../utils/recentSearches";

const getTitle = (result) => result.name || result.title || result.original_name || result.original_title || "Untitled";
const getYear = (result) => (result.release_date || result.first_air_date || "").slice(0, 4);
const getArtwork = (result) => {
      const path = result.poster_path || result.profile_path || result.backdrop_path;
      return path ? `https://image.tmdb.org/t/p/w185${path}` : "/noImage.jpg";
};

export default function BottomSearch({ onClose }) {
      const [query, setQuery] = useState("");
      const [results, setResults] = useState([]);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(false);
      const [retryToken, setRetryToken] = useState(0);
      const [recentSearches, setRecentSearches] = useState(readRecentSearches);
      const dialogRef = useRef(null);
      const inputRef = useRef(null);
      const closeRef = useRef(onClose);
      const navigate = useNavigate();
      closeRef.current = onClose;

      useEffect(() => {
            const previousFocus = document.activeElement;
            const previousBodyOverflow = document.body.style.overflow;
            const previousRootOverflow = document.documentElement.style.overflow;
            document.body.style.overflow = "hidden";
            document.documentElement.style.overflow = "hidden";
            inputRef.current?.focus({ preventScroll: true });

            const handleKeyDown = (event) => {
                  if (event.key === "Escape") {
                        event.preventDefault();
                        closeRef.current();
                        return;
                  }
                  if (event.key !== "Tab") return;

                  const dialog = dialogRef.current;
                  const focusable = dialog?.querySelectorAll("input:not(:disabled), button:not(:disabled), [href]");
                  if (!focusable?.length) return;
                  const first = focusable[0];
                  const last = focusable[focusable.length - 1];
                  if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
                        event.preventDefault();
                        last.focus();
                  } else if (!event.shiftKey && document.activeElement === last) {
                        event.preventDefault();
                        first.focus();
                  }
            };

            document.addEventListener("keydown", handleKeyDown);
            return () => {
                  document.removeEventListener("keydown", handleKeyDown);
                  document.body.style.overflow = previousBodyOverflow;
                  document.documentElement.style.overflow = previousRootOverflow;
                  if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
            };
      }, []);

      useEffect(() => {
            const term = query.trim();
            if (!term) {
                  setResults([]);
                  setLoading(false);
                  setError(false);
                  return undefined;
            }

            setLoading(true);
            const controller = new AbortController();
            const timer = window.setTimeout(async () => {
                  setError(false);
                  try {
                        const { data } = await api.get(`/search/multi?query=${encodeURIComponent(term)}`, { signal: controller.signal });
                        if (controller.signal.aborted) return;
                        const matching = (data.results || []).filter((item) => ["movie", "tv", "person"].includes(item.media_type));
                        setResults(matching.slice(0, 16));
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
            onClose();
      };

      const handleRecentSearch = (term) => {
            setQuery(term);
            setResults([]);
            setError(false);
            inputRef.current?.focus();
      };

      const handleClearHistory = () => {
            clearRecentSearches();
            setRecentSearches([]);
      };

      return createPortal(
            <div className="bottom-search" data-lenis-prevent onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
                  <section
                        ref={dialogRef}
                        className="bottom-search__panel"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="bottom-search-title"
                        tabIndex={-1}
                        data-lenis-prevent
                  >
                        <div className="bottom-search__heading">
                              <div>
                                    <h2 id="bottom-search-title">Search MoviesFlix</h2>
                                    <p>Movies, TV series, and people</p>
                              </div>
                              <button className="bottom-search__close" type="button" onClick={onClose} aria-label="Close search">
                                    <MdClose size="1.4rem" aria-hidden="true" />
                              </button>
                        </div>

                        <label className="bottom-search__input-wrap">
                              <CgSearch size={20} aria-hidden="true" />
                              <input
                                    ref={inputRef}
                                    type="search"
                                    value={query}
                                    onChange={(event) => {
                                          setQuery(event.target.value);
                                          setResults([]);
                                          setError(false);
                                    }}
                                    placeholder="Search titles or people"
                                    aria-label="Search movies, TV series, and people"
                                    autoComplete="off"
                              />
                              {query && <button type="button" className="bottom-search__clear" onClick={() => setQuery("")}>Clear</button>}
                        </label>

                        <div className="bottom-search__results" data-lenis-prevent>
                              {!query.trim() && recentSearches.length > 0 && (
                                    <div className="bottom-search__history">
                                          <div className="bottom-search__history-heading">
                                                <h3>Recent searches</h3>
                                                <button type="button" onClick={handleClearHistory}>Clear history</button>
                                          </div>
                                          <ul className="bottom-search__history-list" aria-label="Recent searches">
                                                {recentSearches.map((term) => (
                                                      <li key={term.toLowerCase()}>
                                                            <button type="button" className="bottom-search__history-tag" onClick={() => handleRecentSearch(term)}>{term}</button>
                                                      </li>
                                                ))}
                                          </ul>
                                    </div>
                              )}
                              {!query.trim() && recentSearches.length === 0 && <p className="bottom-search__hint">Type a movie, series, or person’s name to see matches.</p>}
                              {loading && <p className="bottom-search__message" role="status">Searching…</p>}
                              {!loading && error && (
                                    <div className="bottom-search__message" role="alert">
                                          <p>Search couldn’t load results.</p>
                                          <button type="button" onClick={() => setRetryToken((token) => token + 1)}>Try again</button>
                                    </div>
                              )}
                              {!loading && !error && query.trim() && results.length === 0 && (
                                    <p className="bottom-search__message" role="status">No matches found. Try another title.</p>
                              )}
                              {results.length > 0 && (
                                    <ul className="bottom-search__list" aria-label="Search results">
                                          {results.map((result) => {
                                                const title = getTitle(result);
                                                const type = result.media_type === "tv" ? "TV series" : result.media_type === "person" ? "Person" : "Movie";
                                                const year = getYear(result);
                                                return (
                                                      <li key={`${result.media_type}-${result.id}`}>
                                                            <button type="button" className="bottom-search__result" onClick={() => handleResult(result)} aria-label={`Open ${title}, ${type}`}>
                                                                  <img src={getArtwork(result)} alt="" width="54" height="78" loading="lazy" decoding="async" />
                                                                  <span className="bottom-search__result-copy">
                                                                        <strong>{title}</strong>
                                                                        <span>{type}{year ? ` · ${year}` : ""}{result.vote_average ? ` · ★ ${Number(result.vote_average).toFixed(1)}` : ""}</span>
                                                                  </span>
                                                            </button>
                                                      </li>
                                                );
                                          })}
                                    </ul>
                              )}
                        </div>
                  </section>
            </div>,
            document.body,
      );
}
