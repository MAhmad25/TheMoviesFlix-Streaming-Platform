/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

const Card = ({ eachMovie, type = "all" }) => {
      return (
            <Link to={`/${eachMovie.media_type || type}/details/${eachMovie.id}`}>
                  <section className="w-44 sm:w-full sm:min-w-56 shrink-0 overflow-hidden rounded-xl sm:h-56  md:h-72 h-40">
                        <img className="w-full h-full object-cover" loading="lazy" src={eachMovie.backdrop_path || eachMovie.poster_path || eachMovie.profile_path ? `https://image.tmdb.org/t/p/original${eachMovie.backdrop_path || eachMovie.poster_path || eachMovie.profile_path}` : `/noImage.jpg`} alt="" />
                  </section>
                  <div className="mt-2  px-2 py-2 rounded-lg flex flex-col gap-1 h-fit  w-full md:w-full md:bg-transparent  text-white">
                        {eachMovie.vote_average != 0 && (
                              <h3 className="text-white rounded-full whitespace-nowrap  text-xs leading-none  tracking-tighter ">
                                    {eachMovie.vote_average && "⭐"}
                                    {eachMovie.vote_average && eachMovie.vote_average.toFixed(1)}
                              </h3>
                        )}
                        <h3 className="text-white w-full text-wrap leading-none text-sm sm:text-lg tracking-tight ">{eachMovie.name || eachMovie.title || eachMovie.original_title}</h3>
                        <p className="w-full  leading-3 text-xs sm:text-sm text-zinc-300">{eachMovie.overview && eachMovie.overview.slice(0, 60)}</p>
                  </div>
            </Link>
      );
};
export default Card;
