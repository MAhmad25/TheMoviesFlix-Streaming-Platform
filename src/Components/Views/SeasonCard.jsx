/* eslint-disable react/prop-types */
const SeasonCard = ({ eachSeason }) => {
      return (
            <div className="w-32 flex h-3/4 flex-col gap-1 shrink-0">
                  <div className="w-full rounded-md overflow-hidden h-[80%]">
                        <img className="w-full h-full object-cover" src={eachSeason.poster_path ? `https://image.tmdb.org/t/p/original${eachSeason.poster_path}` : `/noImage.jpg`} alt="" />
                  </div>
                  <div className="w-full  flex flex-col gap-2">
                        <h1 className="text-sm tracking-tight leading-none">{eachSeason.name}</h1>
                        {eachSeason.overview && <p className="text-[0.6rem] tracking-tight leading-none">{eachSeason.overview.slice(0, 25)}...</p>}{" "}
                  </div>
            </div>
      );
};

export default SeasonCard;
