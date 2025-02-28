import { Link } from "react-router-dom";

/* eslint-disable react/prop-types */
const Exclude = ({ eachActor }) => {
      return (
            <div className="w-32 shrink-0   h-fit">
                  <Link to={`/person/details/${eachActor.id}`}>
                        <div className="w-28 h-28  rounded-full overflow-hidden">
                              <img className="w-full h-full  object-cover" src={eachActor.profile_path ? `https://image.tmdb.org/t/p/original${eachActor.profile_path}` : `/noImage.jpg`} alt="" />
                        </div>
                        <div className="w-full flex mt-2 flex-col justify-center items-center tracking-tight h-fit text-white">
                              <h1 className="leading-none text-center">{eachActor.original_name.slice(0, 10) || eachActor.name.slice(0, 10)}</h1>
                              <h4 className="leading-none text-center text-zinc-300 text-sm">as {eachActor.character ? eachActor.character.slice(0, 15) : eachActor.job}</h4>
                        </div>
                  </Link>
            </div>
      );
};

export default Exclude;
