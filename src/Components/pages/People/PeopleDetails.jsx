import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncPeopleLoader, removePeople } from "../../../store/actions/peopleAction";
import { useNavigate, useParams } from "react-router-dom";
import { MdOutlineHorizontalRule } from "react-icons/md";
import { IoChevronBackOutline } from "react-icons/io5";
import { ViewCard, PeopleDetailSkeleton } from "../../ui/index";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
const PeopleDetails = () => {
      const dispatch = useDispatch();
      const containerRef = useRef(null);
      const navigate = useNavigate();
      const [isEnd, setIsEnd] = useState(false);
      const [isStart, setIsStart] = useState(true);
      const info = useSelector((state) => state.people.info);
      document.title = info?.personDetail?.name;
      const { id } = useParams();
      useEffect(() => {
            dispatch(asyncPeopleLoader(id));
            return () => dispatch(removePeople());
      }, [id, dispatch]);
      const scrollLeft = () => {
            if (containerRef.current) {
                  const { scrollLeft, clientWidth, scrollWidth } = containerRef.current;
                  if (scrollLeft + clientWidth - 100 > scrollWidth) setIsEnd(true);
                  else setIsEnd(false);
                  if (scrollLeft > 0) setIsStart(false);
                  else setIsStart(true);
                  containerRef.current.scrollBy({
                        left: -400,
                        behavior: "smooth",
                  });
            }
      };
      const scrollRight = () => {
            const { scrollLeft, clientWidth, scrollWidth } = containerRef.current;
            if (scrollLeft + clientWidth >= scrollWidth) setIsEnd(true);
            else setIsEnd(false);
            if (scrollLeft + clientWidth > 0) setIsStart(false);
            else setIsStart(true);
            if (containerRef.current) {
                  containerRef.current.scrollBy({
                        left: 400,
                        behavior: "smooth",
                  });
            }
      };
      return (
            <>
                  {info ? (
                        <section className="min-w-screen px-3 relative md:flex md:gap-2 min-h-[100dvh] py-10 pb-16 text-white theme-bg">
                              <span onClick={() => navigate(-1)} className="absolute z-10 bg-white/30 backdrop-blur rounded-full p-2 top-5 left-5">
                                    <IoChevronBackOutline size="1.5rem" color="black" />
                              </span>
                              {/*Top Div  Profile Pic and Personal Info  */}
                              <div className="w-full md:flex md:flex-col md:gap-10  md:py-5 md:w-2/5 md:shrink-0">
                                    <div className="w-full flex flex-col justify-center items-center">
                                          <div className="w-32 md:w-52 md:h-56 h-36 overflow-hidden rounded-2xl">
                                                <img className="w-full h-full object-cover" src={info.personDetail.profile_path ? `https://image.tmdb.org/t/p/original${info.personDetail.profile_path}` : `/noImage.jpg`} alt="Profile Pic" />
                                          </div>
                                          <h1 className="font-Stoshi mt-2 md:text-2xl text-format">{info?.personDetail?.name}</h1>
                                          <h1 className="tracking-tight md:text-2xl mt-1 leading-none">⭐{info.personDetail.popularity && info.personDetail.popularity.toFixed(0)}</h1>
                                          <div className="flex gap-2 mt-4 flex-wrap justify-center items-center">
                                                {info.castedMovies.cast.map((eachMovie, index) => {
                                                      if (eachMovie.vote_average >= 7) {
                                                            return (
                                                                  <div key={index} className="py-1 shrink-0 px-3 tracking-tighter md:text-sm text-xs leading-none bg-white/20  rounded-full">
                                                                        {(eachMovie.title && eachMovie.title.slice(0, 20)) || (eachMovie.original_title && eachMovie.original_title.slice(0, 20)) || (eachMovie.name && eachMovie.name.slice(0, 20))}
                                                                  </div>
                                                            );
                                                      }
                                                })}
                                          </div>
                                    </div>
                                    {/* Top Div   Personal Info */}
                                    <div className="w-full  mt-7">
                                          <h1 className="font-Stoshi  md:text-center md:text-3xl text-2xl text-format">Personal Info:</h1>
                                          <div className="mt-2 md:flex md:flex-col md:text-xl md:justify-center md:items-center">
                                                {info.personDetail.birthday && (
                                                      <h1 className="text-white/60">
                                                            Born: <span className="text-white">{info.personDetail.birthday.split("-")[0]}</span>
                                                      </h1>
                                                )}
                                                {info.personDetail.place_of_birth && (
                                                      <h1 className="text-white/60">
                                                            From: <span className="text-white">{info.personDetail.place_of_birth}</span>
                                                      </h1>
                                                )}
                                                {info?.personDetail?.known_for_department && (
                                                      <h1 className="text-white/60">
                                                            Known For: <span className="text-white">{info?.personDetail?.known_for_department}</span>
                                                      </h1>
                                                )}
                                          </div>
                                    </div>
                              </div>
                              {/*Bottom Div  Biography and Card  */}

                              <div className="w-full md:w-[60%] md:shrink-0 font-Stoshi mt-5">
                                    {info.personDetail.biography && (
                                          <>
                                                <h1 className="text-2xl flex gap-2 items-center  text-format">
                                                      <span className="inline-block">
                                                            <MdOutlineHorizontalRule />
                                                      </span>
                                                      Biography:
                                                </h1>
                                                <p className="mt-4  md:text-lg md:px-2 leading-none ">{info.personDetail.biography}</p>
                                          </>
                                    )}
                                    <div className="w-full relative px-2  mt-5">
                                          <h1 className="text-2xl text-format">Recent Projects:</h1>
                                          {/* Now Here come the Card Container */}
                                          <section ref={containerRef} className="w-full [&::-webkit-scrollbar]:hidden  h-96 flex gap-4 items-center overflow-x-scroll overflow-y-hidden">
                                                {/* Card */}
                                                {/* These are movie List controller  */}
                                                {info?.castedMovies?.cast.length > 0 ? (
                                                      <>
                                                            <div onClick={scrollLeft} className={`absolute z-20 hidden md:block ${isStart ? "cursor-not-allowed opacity-0" : "cursor-auto opacity-100"}  shadow-black backdrop-blur-sm py-48 px-1  rounded-md left-0 top-[9%]`}>
                                                                  <FaChevronLeft size="2rem" color="#e5e9de" />
                                                            </div>
                                                            <div onClick={scrollRight} className={`absolute z-20 hidden md:block ${isEnd ? "cursor-not-allowed opacity-0" : "cursor-auto opacity-100"}  shadow-black backdrop-blur-sm py-48 px-1  rounded-md right-0 top-[9%]`}>
                                                                  <FaChevronRight size="2rem" color="#e5e9de" />
                                                            </div>
                                                            {info?.castedMovies.cast
                                                                  .map((eachMovie, index) => <ViewCard eachMovie={eachMovie} key={index} />)
                                                                  .reverse()
                                                                  .slice(0, 20)}
                                                      </>
                                                ) : (
                                                      <h1 className="text-white text-2xl md:text-4xl">There is no recent Projects that have been done !</h1>
                                                )}
                                          </section>
                                    </div>
                              </div>
                        </section>
                  ) : (
                        <PeopleDetailSkeleton />
                  )}
            </>
      );
};

export default PeopleDetails;
