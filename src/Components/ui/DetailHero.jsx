import StarIcon from "./Icons/StarIcon";

export default function DetailHero({ detail, mediaType = "movie", children }) {
      const isTV = mediaType === "tv";
      const title = isTV ? detail.name || detail.original_name : detail.title || detail.original_title;
      const imagePath = detail.backdrop_path || detail.poster_path;
      const runtime = Number(detail.runtime);
      const rating = Number(detail.vote_average) || 0;

      return (
            <header className="detail-hero">
                  <img className="detail-hero__image" src={imagePath ? `https://image.tmdb.org/t/p/original${imagePath}` : "/noImage.jpg"} alt="" decoding="async" />
                  <div className="detail-hero__content">
                        <h1 className="detail-hero__title">{title}</h1>
                        <p className="detail-hero__tagline">{detail.tagline || detail.status}</p>
                        <div className="detail-hero__tags">
                              {isTV ? (
                                    <span>Total Seasons: {detail.number_of_seasons}</span>
                              ) : runtime > 0 ? (
                                    <span>{Math.floor(runtime / 60)}h {runtime % 60}min</span>
                              ) : null}
                              {detail.genres?.map((genre) => <span key={genre.id}>{genre.name}</span>)}
                        </div>
                        <div className="detail-hero__rating">
                              <span className="detail-hero__score"><StarIcon className="shrink-0" />{rating.toFixed(0)}/10</span>
                              <span className="detail-hero__votes">{(detail.vote_count || 0).toLocaleString()} votes</span>
                        </div>
                        {children}
                  </div>
            </header>
      );
}
