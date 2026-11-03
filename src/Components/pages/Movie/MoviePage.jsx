import { useCallback, useEffect, useState } from "react";
import { Card, CastLoader, PageSkeleton } from "../../ui/index";
import api from "../../../utils/axios";
import InfiniteScroll from "react-infinite-scroll-component";

const MAX_PAGES = 500;

const MoviePage = () => {
      document.title = "The Movies Flix | Trending Movies - Watch and Stream Unlimited Movies and TV Series";
      const [genres, setGenres] = useState([]);
      const [selectedGenre, setSelectedGenre] = useState("");
      const [movies, setMovies] = useState([]);
      const [page, setPage] = useState(1);
      const [hasMore, setHasMore] = useState(true);
      const [loading, setLoading] = useState(true);
      const [genreLoading, setGenreLoading] = useState(true);
      const [movieError, setMovieError] = useState("");
      const [genreError, setGenreError] = useState(false);
      const [genreRetry, setGenreRetry] = useState(0);
      const [movieRetry, setMovieRetry] = useState(0);

      useEffect(() => {
            const controller = new AbortController();
            setGenreError(false);
            setGenreLoading(true);

            api.get("genre/movie/list?language=en", { signal: controller.signal })
                  .then(({ data }) => setGenres(data.genres ?? []))
                  .catch(() => {
                        if (!controller.signal.aborted) setGenreError(true);
                  })
                  .finally(() => {
                        if (!controller.signal.aborted) setGenreLoading(false);
                  });

            return () => controller.abort();
      }, [genreRetry]);

      useEffect(() => {
            const controller = new AbortController();
            const endpoint = selectedGenre ? "discover/movie" : "trending/movie/day";
            const params = selectedGenre
                  ? { page, with_genres: selectedGenre, sort_by: "popularity.desc" }
                  : { page };

            setLoading(true);
            setMovieError("");
            api.get(endpoint, { params, signal: controller.signal })
                  .then(({ data }) => {
                        const results = data.results ?? [];
                        setMovies((current) => page === 1 ? results : [...current, ...results]);
                        setHasMore(page < Math.min(data.total_pages ?? page, MAX_PAGES));
                  })
                  .catch(() => {
                        if (!controller.signal.aborted) {
                              setMovieError("Movies could not be loaded. Check your connection and try again.");
                        }
                  })
                  .finally(() => {
                        if (!controller.signal.aborted) setLoading(false);
                  });

            return () => controller.abort();
      }, [selectedGenre, page, movieRetry]);

      const selectGenre = (genreId) => {
            if (genreId === selectedGenre) return;
            setMovies([]);
            setHasMore(true);
            setLoading(true);
            setMovieError("");
            setPage(1);
            setSelectedGenre(genreId);
      };

      const loadNextPage = useCallback(() => {
            if (!loading && !movieError && hasMore) setPage((current) => current + 1);
      }, [hasMore, loading, movieError]);

      const retryMovies = () => setMovieRetry((attempt) => attempt + 1);
      const activeGenre = genres.find((genre) => String(genre.id) === selectedGenre);

      return (
            <div className="overflow-x-hidden w-full min-h-dvh pb-28 [background-image:var(--bg-gradient)]">
                  <header className="px-5 py-5">
                        <h1 className="text-2xl text-white">{activeGenre ? `${activeGenre.name} Movies` : "Trending Movies"}</h1>
                        <div className="trending-genre-filters" role="group" aria-label="Filter movies by genre">
                              <button
                                    type="button"
                                    className="trending-genre-chip"
                                    aria-pressed={!selectedGenre}
                                    onClick={() => selectGenre("")}
                              >
                                    All
                              </button>
                              {genres.map((genre) => {
                                    const genreId = String(genre.id);
                                    return (
                                          <button
                                                key={genre.id}
                                                type="button"
                                                className="trending-genre-chip"
                                                aria-pressed={selectedGenre === genreId}
                                                onClick={() => selectGenre(genreId)}
                                          >
                                                {genre.name}
                                          </button>
                                    );
                              })}
                              {genreLoading && <span className="trending-genre-error" role="status">Loading genres…</span>}
                              {genreError && (
                                    <span className="trending-genre-error" role="status">
                                          Genres unavailable.
                                          <button type="button" onClick={() => setGenreRetry((attempt) => attempt + 1)}>Retry</button>
                                    </span>
                              )}
                        </div>
                  </header>

                  {movies.length > 0 ? (
                        <InfiniteScroll
                              hasMore={hasMore && !movieError}
                              next={loadNextPage}
                              loader={<CastLoader />}
                              dataLength={movies.length}
                              endMessage={<p className="trending-end-message">You’ve reached the end.</p>}
                        >
                              <div id="trending-movie-results" className="media-grid px-3 w-full gap-3 md:gap-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                                    {movies.map((movie) => <Card type="movie" key={movie.id} eachMovie={movie} />)}
                              </div>
                        </InfiniteScroll>
                  ) : loading ? (
                        <PageSkeleton />
                  ) : movieError ? (
                        <div className="trending-movie-state" role="alert">
                              <p>{movieError}</p>
                              <button type="button" className="trending-retry-button" onClick={retryMovies}>Retry</button>
                        </div>
                  ) : (
                        <p className="trending-movie-state" role="status">No movies found for this genre.</p>
                  )}

                  {movies.length > 0 && movieError && (
                        <div className="trending-movie-state" role="alert">
                              <p>{movieError}</p>
                              <button type="button" className="trending-retry-button" onClick={retryMovies}>Retry</button>
                        </div>
                  )}
            </div>
      );
};

export default MoviePage;
