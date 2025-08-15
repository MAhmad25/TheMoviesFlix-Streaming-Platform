const Review = ({ review }) => {
      return (
            <section className="w-3/4 py-2 relative sm:w-[60%] min-[1270px]:w-[36%] min-[1270px]:h-full lg:w-[45%] lg:h-[93%] min-[1200px]:w-[40%] min-[1200px]:h-[96%] min-[932px]:w-1/2 md:w-[55%] px-4 shrink-0 sm:h-[80%] min-[932px]:h-[90%] md:h-[85%] h-3/4 rounded-xl backdrop-blur-sm flex flex-col">
                  <p className="text-xs sm:text-sm md:text-lg min-[932px]:text-xl text-[#FCD53F] text-end flex-shrink-0">{review.updated_at.split("T")[0]}</p>

                  <div className="text-xs flex-1 overflow-hidden [&::-webkit-scrollbar]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-2xl [&::-webkit-scrollbar-thumb]:bg-white/20 overflow-y-auto sm:text-sm md:text-[1rem] min-[932px]:text-[1.095rem] font-Stoshi sm:opacity-80 text-white/90 pr-2 mb-2">
                        <div className="min-h-full">
                              {review.content
                                    .replace(/<[^>]*>/g, "")
                                    .replace(/\\n|\\t/g, "")
                                    .trim()}
                        </div>
                  </div>

                  <div className="flex justify-between  py-2 px-4 rounded-b-xl items-center min-[932px]:text-xl sm:text-lg text-sm flex-shrink-0 -mx-4 -mb-2">
                        <p className="text-white/80">
                              By <span className="text-white font-Stoshi">{review.author || review.author_details.name}</span>
                        </p>
                        <p className="text-white/90">{review.author_details.rating !== null ? ` ⭐ ${review.author_details.rating} / 10 ` : "no rating"}</p>
                  </div>
            </section>
      );
};

export default Review;
