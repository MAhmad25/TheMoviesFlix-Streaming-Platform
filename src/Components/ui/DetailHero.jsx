import { useState } from "react";
import StarIcon from "./Icons/StarIcon";

const imageBase = "https://image.tmdb.org/t/p/w500";

export default function DetailHero({ detail, mediaType = "movie", children }) {
      const isTV = mediaType === "tv";
      const title = isTV ? detail.name || detail.original_name : detail.title || detail.original_title;
      const imagePath = detail.poster_path || detail.backdrop_path;
      const runtime = Number(detail.runtime);
      const rating = Number(detail.vote_average) || 0;
      const releaseDate = isTV ? detail.first_air_date || detail.last_air_date : detail.release_date;
      const overview = detail.overview || "No overview is available for this title yet.";
      const [showFullOverview, setShowFullOverview] = useState(false);
      const hasLongOverview = overview.length > 90;

      const metadata = [releaseDate?.slice(0, 4), isTV ? `${detail.number_of_seasons || 0} ${detail.number_of_seasons === 1 ? "season" : "seasons"}${detail.number_of_episodes ? ` · ${detail.number_of_episodes} episodes` : ""}` : runtime > 0 ? `${Math.floor(runtime / 60)}h ${runtime % 60}m` : null].filter(Boolean);

      return (
            <header className="detail-hero">
                  <div className="detail-hero__artwork">
                        <img className="detail-hero__image" src={imagePath ? `${imageBase}${imagePath}` : "/noImage.jpg"} alt={imagePath ? `Poster for ${title}` : "No poster available"} width="500" height="750" decoding="async" />
                  </div>

                  <div className="detail-hero__content">
                        <h1 className="detail-hero__title">{title}</h1>
                        {detail.tagline && <p className="detail-hero__tagline">{detail.tagline}</p>}

                        <div className="detail-hero__tags" aria-label="Title information">
                              {metadata.map((item) => (
                                    <span className="detail-hero__meta" key={item}>
                                          {item}
                                    </span>
                              ))}
                              {detail.genres?.map((genre) => (
                                    <div className="detail-hero__meta" key={genre.id}>
                                          {genre.name}
                                    </div>
                              ))}
                        </div>

                        <div className="detail-hero__rating" aria-label={`${rating.toFixed(1)} out of 10, ${(detail.vote_count || 0).toLocaleString()} votes`}>
                              <span className="detail-hero__score">
                                    <StarIcon className="shrink-0" />
                                    {rating.toFixed(1)}
                                    <span className="detail-hero__scale">/10</span>
                              </span>
                              <span className="detail-hero__votes">{(detail.vote_count || 0).toLocaleString()} votes</span>
                              {isTV && detail.status && <span className="detail-hero__status">{detail.status}</span>}
                        </div>

                        <div className="detail-hero__synopsis">
                              <p className={showFullOverview ? "" : "detail-hero__overview--clamped"}>{overview}</p>
                              {hasLongOverview && (
                                    <button type="button" className="detail-hero__expand" aria-expanded={showFullOverview} onClick={() => setShowFullOverview((current) => !current)}>
                                          {showFullOverview ? "Show less" : "Read more"}
                                    </button>
                              )}
                        </div>
                  </div>

                  {children}
            </header>
      );
}
