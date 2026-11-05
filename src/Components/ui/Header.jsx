import { useEffect, useState } from "react";
import api from "../../utils/axios";
import { completeHomeLoad } from "../../utils/initialLoad";
import CurtainSlider from "./CurtainSlider";

const HERO_LIMIT = 10;

function toHeroSlide(item) {
      const mediaType = item.media_type === "tv" ? "tv" : "movie";
      const title = item.original_title || item.title || item.original_name || item.name || "Untitled";
      const year = (item.release_date || item.first_air_date || "").slice(0, 4);
      const artwork = item.backdrop_path || item.poster_path;
      const imageUrl = artwork ? `https://image.tmdb.org/t/p/w1280${artwork}` : "";

      return {
            id: `${mediaType}-${item.id}`,
            title,
            year,
            mediaLabel: mediaType === "tv" ? "TV series" : "Movie",
            rating: item.vote_average,
            imageUrl,
            src: imageUrl || "/noImage.jpg",
            alt: `${title} backdrop`,
            label: "Trending today",
            watchTo: `/${mediaType}/details/${item.id}/${mediaType === "tv" ? "watch/1/1" : "watch"}`,
            trailerTo: `/${mediaType}/details/${item.id}/trailer`,
      };
}

const Header = () => {
      const [slides, setSlides] = useState([]);

      useEffect(() => {
            const controller = new AbortController();
            api.get("trending/all/day", { signal: controller.signal })
                  .then(({ data }) => {
                        if (controller.signal.aborted) return;
                        const featured = (data.results || [])
                              .filter((item) => item.media_type === "movie" || item.media_type === "tv")
                              .slice(0, HERO_LIMIT)
                              .map(toHeroSlide);
                        setSlides(featured);
                  })
                  .catch(() => {
                        if (!controller.signal.aborted) setSlides([]);
                  })
                  .finally(() => completeHomeLoad("header"));

            return () => controller.abort();
      }, []);

      return (
            <header className="w-full leading-none font-primary">
                  {slides.length > 0 && (
                        <CurtainSlider
                              images={slides}
                              duration={1.1}
                              columns={12}
                              auto={5}
                        />
                  )}
            </header>
      );
};

export default Header;
