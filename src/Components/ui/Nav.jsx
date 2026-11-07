"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { useLocation, useNavigate } from "react-router-dom";
import {
      Search01Icon,
      Home01Icon,
      Film01Icon,
      Tv01Icon,
      UserGroupIcon,
      MultiplicationSignIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { play } from "cuelume";
import api from "../../utils/axios";
import { clearRecentSearches, readRecentSearches, rememberSearch } from "../../utils/recentSearches";
import { captureEvent } from "../../analytics/posthog.js";

// Theme-colored navigation tabs (brand color #ff7949, clean & non-glowing)
const TABS = [
      {
            id: "home",
            label: "Home",
            to: "/",
            icon: Home01Icon,
            color: "text-[#ff7949]",
            fill: "fill-[#ff7949]",
            bg: "bg-[#ff7949]/20",
      },
      {
            id: "movies",
            label: "Movies",
            to: "/trending",
            icon: Film01Icon,
            color: "text-[#ff7949]",
            fill: "fill-[#ff7949]",
            bg: "bg-[#ff7949]/20",
      },
      {
            id: "tv",
            label: "TV Shows",
            to: "/tv",
            icon: Tv01Icon,
            color: "text-[#ff7949]",
            fill: "fill-[#ff7949]",
            bg: "bg-[#ff7949]/20",
      },
      {
            id: "people",
            label: "Celebrity",
            to: "/people",
            icon: UserGroupIcon,
            color: "text-[#ff7949]",
            fill: "fill-[#ff7949]",
            bg: "bg-[#ff7949]/20",
      },
];

const getTitle = (result) =>
      result.name || result.title || result.original_name || result.original_title || "Untitled";
const getYear = (result) =>
      (result.release_date || result.first_air_date || "").slice(0, 4);
const getArtwork = (result) => {
      const path = result.poster_path || result.profile_path || result.backdrop_path;
      return path ? `https://image.tmdb.org/t/p/w185${path}` : "/noImage.jpg";
};

export default function DiscoverNav({ className = "" }) {
      const { pathname } = useLocation();
      const navigate = useNavigate();

      // Check if viewing full-screen video, stream, or trailer
      const isVideoOrTrailer =
            pathname.includes("/watch") ||
            pathname.endsWith("/trailer") ||
            pathname.includes("/trailer/");

      // Check if any modal overlay is open in the DOM (TVSeasonModal, DownloadModal, etc.)
      const [hasActiveOverlay, setHasActiveOverlay] = useState(false);

      useEffect(() => {
            const checkOverlays = () => {
                  if (typeof document === "undefined") return;
                  const modal = document.querySelector(
                        '.tv-season-backdrop.is-open, [role="dialog"], .download-overlay, .trailer-overlay'
                  );
                  setHasActiveOverlay(Boolean(modal));
            };

            checkOverlays();
            const observer = new MutationObserver(checkOverlays);
            observer.observe(document.body, { childList: true, subtree: true, attributes: true });
            return () => observer.disconnect();
      }, [pathname]);

      const [isSearchExpanded, setIsSearchExpanded] = useState(false);
      const [query, setQuery] = useState("");
      const [results, setResults] = useState([]);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(false);
      const [recentSearches, setRecentSearches] = useState(readRecentSearches);

      const navRef = useRef(null);
      const inputRef = useRef(null);
      const popupRef = useRef(null);

      // Determine active route tab
      const activeTabId = pathname.startsWith("/tv")
            ? "tv"
            : pathname.startsWith("/people") || pathname.startsWith("/person")
            ? "people"
            : pathname.startsWith("/trending") || pathname.startsWith("/movie")
            ? "movies"
            : "home";

      const closeSearch = () => {
            setIsSearchExpanded(false);
            setQuery("");
            setResults([]);
            setError(false);
      };

      // Handle outside click & escape to close search
      useEffect(() => {
            if (!isSearchExpanded) return undefined;

            inputRef.current?.focus({ preventScroll: true });

            const handlePointerDown = (event) => {
                  const target = event.target;
                  if (
                        !navRef.current?.contains(target) &&
                        !popupRef.current?.contains(target)
                  ) {
                        closeSearch();
                  }
            };

            const handleKeyDown = (event) => {
                  if (event.key === "Escape") {
                        event.preventDefault();
                        closeSearch();
                  }
            };

            document.addEventListener("pointerdown", handlePointerDown);
            document.addEventListener("keydown", handleKeyDown);
            return () => {
                  document.removeEventListener("pointerdown", handlePointerDown);
                  document.removeEventListener("keydown", handleKeyDown);
            };
      }, [isSearchExpanded]);

      // Debounced search query
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
                        const { data } = await api.get(
                              `/search/multi?query=${encodeURIComponent(term)}`,
                              { signal: controller.signal }
                        );
                        if (controller.signal.aborted) return;
                        const matching = (data.results || []).filter((item) =>
                              ["movie", "tv", "person"].includes(item.media_type)
                        );
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
      }, [query]);

      const handleResultClick = (result) => {
            const title = getTitle(result);
            play("press");
            captureEvent("search_result_selected", {
                  content_id: String(result.id),
                  content_type: result.media_type,
                  content_title: title,
            });
            navigate(
                  result.media_type === "person"
                        ? `/person/details/${result.id}`
                        : `/${result.media_type}/details/${result.id}`
            );
            closeSearch();
      };

      const handleTabClick = (tab) => {
            play("press");
            if (isSearchExpanded) {
                  closeSearch();
            }
            navigate(tab.to);
      };

      const handleClearHistory = () => {
            clearRecentSearches();
            setRecentSearches([]);
      };

      const springTransition = {
            type: "spring",
            damping: 22,
            stiffness: 260,
            mass: 0.8,
      };

      // Completely hide navigation when in full player or when any modal dialog is active
      if (isVideoOrTrailer || hasActiveOverlay) {
            return null;
      }

      return (
            <>
                  {/* Subtle navigation gradient backdrop only when navbar is visible */}
                  <div className="navigation-backdrop fixed inset-0 pointer-events-none z-40" />

                  {/* Floating Live Search Results Dialog rendered via Portal directly on document.body */}
                  {typeof document !== "undefined" &&
                        createPortal(
                              <AnimatePresence>
                                    {isSearchExpanded && (
                                          <motion.div
                                                ref={popupRef}
                                                key="discover-search-portal"
                                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                                transition={{ duration: 0.16, ease: "easeOut" }}
                                                className="fixed bottom-[74px] sm:bottom-[82px] left-3 right-3 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:w-[460px] z-[9999] max-h-[min(380px,calc(100dvh-170px))] overflow-y-auto rounded-3xl bg-[#180503] text-white border border-white/10 shadow-2xl p-3 sm:p-4 select-none"
                                                data-lenis-prevent
                                          >
                                                {!query.trim() && recentSearches.length > 0 && (
                                                      <div>
                                                            <div className="mb-2 flex items-center justify-between px-2">
                                                                  <h2 className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                                                                        Recent searches
                                                                  </h2>
                                                                  <button
                                                                        type="button"
                                                                        onClick={handleClearHistory}
                                                                        className="text-xs text-[#ff7949] hover:text-white transition-colors cursor-pointer"
                                                                  >
                                                                        Clear
                                                                  </button>
                                                            </div>
                                                            <ul className="space-y-1">
                                                                  {recentSearches.map((term) => (
                                                                        <li key={term.toLowerCase()}>
                                                                              <button
                                                                                    type="button"
                                                                                    onClick={() => setQuery(term)}
                                                                                    className="w-full rounded-xl px-3 py-2 text-left text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
                                                                              >
                                                                                    {term}
                                                                              </button>
                                                                        </li>
                                                                  ))}
                                                            </ul>
                                                      </div>
                                                )}

                                                {!query.trim() && recentSearches.length === 0 && (
                                                      <p className="px-3 py-4 text-center text-sm text-white/50">
                                                            Search for movies, TV series, or actors…
                                                      </p>
                                                )}

                                                {loading && (
                                                      <p className="px-3 py-4 text-center text-sm text-[#ff7949] animate-pulse">
                                                            Searching MoviesFlix…
                                                      </p>
                                                )}

                                                {!loading && error && (
                                                      <div className="px-3 py-4 text-center text-sm text-white/70">
                                                            <p>Couldn’t load results.</p>
                                                            <button
                                                                  type="button"
                                                                  onClick={() => setQuery((q) => q + " ")}
                                                                  className="mt-2 text-[#ff7949] hover:underline cursor-pointer"
                                                            >
                                                                  Retry
                                                            </button>
                                                      </div>
                                                )}

                                                {!loading && !error && query.trim() && results.length === 0 && (
                                                      <p className="px-3 py-4 text-center text-sm text-white/50">
                                                            No results found for “{query}”.
                                                      </p>
                                                )}

                                                {!loading && results.length > 0 && (
                                                      <ul className="space-y-1">
                                                            {results.map((result) => {
                                                                  const title = getTitle(result);
                                                                  const type =
                                                                        result.media_type === "tv"
                                                                              ? "TV Series"
                                                                              : result.media_type === "person"
                                                                              ? "Celebrity"
                                                                              : "Movie";
                                                                  const year = getYear(result);

                                                                  return (
                                                                        <li key={`${result.media_type}-${result.id}`}>
                                                                              <button
                                                                                    type="button"
                                                                                    onClick={() => handleResultClick(result)}
                                                                                    className="flex w-full items-center gap-3 rounded-2xl p-2 text-left transition-colors hover:bg-white/10 cursor-pointer group"
                                                                              >
                                                                                    <img
                                                                                          src={getArtwork(result)}
                                                                                          alt=""
                                                                                          width="40"
                                                                                          height="56"
                                                                                          loading="lazy"
                                                                                          decoding="async"
                                                                                          className="h-[52px] w-[38px] shrink-0 rounded-lg object-cover shadow-sm"
                                                                                    />
                                                                                    <span className="min-w-0 flex-1">
                                                                                          <strong className="block truncate text-sm font-semibold text-white group-hover:text-[#ff7949] transition-colors">
                                                                                                {title}
                                                                                          </strong>
                                                                                          <span className="mt-0.5 block truncate text-xs text-white/60">
                                                                                                {type}
                                                                                                {year ? ` · ${year}` : ""}
                                                                                                {result.vote_average
                                                                                                      ? ` · ★ ${Number(result.vote_average).toFixed(1)}`
                                                                                                      : ""}
                                                                                          </span>
                                                                                    </span>
                                                                              </button>
                                                                        </li>
                                                                  );
                                                            })}
                                                      </ul>
                                                )}
                                          </motion.div>
                                    )}
                              </AnimatePresence>,
                              document.body
                        )}

                  {/* Fixed Bottom Discover Navigation Bar - Solid & Stable across routes */}
                  <nav
                        ref={navRef}
                        aria-label="Discover navigation"
                        className={`fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 sm:gap-3 p-1 max-w-[calc(100vw-16px)] pointer-events-auto select-none ${className}`}
                  >
                        {/* Search Button / Morphing Input Pill - Width animated only */}
                        <motion.div
                              animate={{
                                    width: isSearchExpanded ? "min(380px, calc(100vw - 88px))" : "54px",
                              }}
                              transition={springTransition}
                              onClick={() => !isSearchExpanded && setIsSearchExpanded(true)}
                              className="flex items-center bg-[#1c0705] rounded-[3rem] shadow-xl border border-white/10 cursor-pointer h-[54px] sm:h-[58px] overflow-hidden relative px-3.5 sm:px-4 py-2"
                        >
                              <div className="shrink-0 flex items-center justify-center">
                                    <HugeiconsIcon
                                          icon={Search01Icon}
                                          className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${
                                                isSearchExpanded ? "text-[#ff7949]" : "text-white/75 hover:text-[#ff7949]"
                                          }`}
                                    />
                              </div>

                              <motion.div
                                    initial={false}
                                    animate={{
                                          width: isSearchExpanded ? "auto" : "0px",
                                          opacity: isSearchExpanded ? 1 : 0,
                                          filter: isSearchExpanded ? "blur(0px)" : "blur(4px)",
                                          marginLeft: isSearchExpanded ? "12px" : "0px",
                                    }}
                                    transition={springTransition}
                                    className="overflow-hidden flex items-center flex-1"
                              >
                                    <input
                                          ref={inputRef}
                                          type="text"
                                          value={query}
                                          onChange={(e) => {
                                                setQuery(e.target.value);
                                                setError(false);
                                          }}
                                          placeholder="Search Movies, TV, People…"
                                          className="border-0 outline-none bg-transparent text-sm sm:text-base text-white placeholder:text-white/40 w-full focus:ring-0 focus:outline-none"
                                          onClick={(e) => e.stopPropagation()}
                                    />
                                    {query && (
                                          <button
                                                type="button"
                                                onClick={(e) => {
                                                      e.stopPropagation();
                                                      setQuery("");
                                                }}
                                                className="shrink-0 text-white/50 hover:text-[#ff7949] p-1 cursor-pointer transition-colors"
                                          >
                                                <HugeiconsIcon icon={MultiplicationSignIcon} className="w-4 h-4" />
                                          </button>
                                    )}
                              </motion.div>
                        </motion.div>

                        {/* Navigation Tabs Container / Collapsing Close Button - Width animated only */}
                        <motion.div
                              animate={{
                                    width: isSearchExpanded ? "54px" : "auto",
                              }}
                              transition={springTransition}
                              className="flex items-center bg-[#1c0705] rounded-[3rem] shadow-xl border border-white/10 h-[54px] sm:h-[58px] overflow-hidden relative"
                        >
                              <div className="overflow-hidden relative h-full flex items-center">
                                    {/* Tabs Group */}
                                    <motion.div
                                          initial={false}
                                          animate={{
                                                opacity: isSearchExpanded ? 0 : 1,
                                                filter: isSearchExpanded ? "blur(4px)" : "blur(0px)",
                                          }}
                                          transition={{ duration: 0.18 }}
                                          className="flex items-center whitespace-nowrap"
                                    >
                                          <div className="flex items-center gap-1 sm:gap-2 px-1.5 sm:px-2">
                                                {TABS.map((tab) => {
                                                      const isActive = !isSearchExpanded && activeTabId === tab.id;

                                                      return (
                                                            <button
                                                                  key={tab.id}
                                                                  type="button"
                                                                  onClick={() => handleTabClick(tab)}
                                                                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-[3rem] transition-colors relative cursor-pointer ${
                                                                        isActive ? `${tab.color} font-medium` : "text-white/60 hover:text-white"
                                                                  }`}
                                                            >
                                                                  {isActive && (
                                                                        <motion.span
                                                                              layoutId="discover-active-bubble"
                                                                              className={`absolute inset-0 z-0 ${tab.bg} rounded-[3rem]`}
                                                                              transition={{
                                                                                    type: "spring",
                                                                                    bounce: 0.19,
                                                                                    duration: 0.35,
                                                                              }}
                                                                        />
                                                                  )}
                                                                  <HugeiconsIcon
                                                                        icon={tab.icon}
                                                                        className={`w-5 h-5 relative z-10 transition-colors ${
                                                                              isActive ? tab.color : "text-white/60"
                                                                        }`}
                                                                  />
                                                                  <span className="uppercase text-xs tracking-wider relative z-10 hidden sm:inline font-medium">
                                                                        {tab.label}
                                                                  </span>
                                                            </button>
                                                      );
                                                })}
                                          </div>
                                    </motion.div>

                                    {/* Close Button - positioned absolutely on top when search is expanded */}
                                    <motion.div
                                          initial={false}
                                          animate={{
                                                opacity: isSearchExpanded ? 1 : 0,
                                                filter: isSearchExpanded ? "blur(0px)" : "blur(4px)",
                                          }}
                                          transition={{ duration: 0.18 }}
                                          className="absolute inset-0 flex items-center justify-center"
                                          style={{ pointerEvents: isSearchExpanded ? "auto" : "none" }}
                                    >
                                          <button
                                                type="button"
                                                onClick={closeSearch}
                                                aria-label="Close search"
                                                className="shrink-0 cursor-pointer p-2 text-white/70 hover:text-[#ff7949] transition-colors"
                                          >
                                                <HugeiconsIcon
                                                      icon={MultiplicationSignIcon}
                                                      className="w-5 h-5"
                                                />
                                          </button>
                                    </motion.div>
                              </div>
                        </motion.div>
                  </nav>
            </>
      );
}
