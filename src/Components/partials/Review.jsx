/* eslint-disable react/prop-types */
const Review = ({ review }) => {
      console.log(typeof review.author_details.rating);
      return (
            <section className="w-3/4 py-2 relative sm:w-[60%] min-[1270px]:w-[36%] min-[1270px]:h-full lg:w-[45%] lg:h-[93%] min-[1200px]:w-[40%] min-[1200px]:h-[96%]  min-[932px]:w-1/2 md:w-[55%] px-4 shrink-0 sm:h-[80%] min-[932px]:h-[90%] md:h-[85%] h-3/4 rounded-xl  backdrop-blur-sm">
                  <p className="text-xs sm:text-sm md:text-lg min-[932px]:text-xl text-[#FCD53F] text-end">{review.updated_at.split("T")[0]}</p>
                  <p className="text-xs sm:text-sm md:text-[1rem] min-[932px]:text-[1.095rem] font-Stoshi sm:opacity-80 text-white/90">
                        {review.content
                              .replace(/<[^>]*>/g, "")
                              .replace(/\\n|\\t/g, "")
                              .trim()
                              .slice(0, 250)}
                  </p>
                  <div className="flex justify-between left-0 py-2 px-4  absolute bottom-0 items-center mt-2 min-[932px]:text-xl sm:text-lg text-sm w-full">
                        <p className="text-white/80">
                              By <span className=" text-white font-Stoshi">{review.author || review.author_details.name}</span>
                        </p>
                        <p>{review.author_details.rating !== null ? ` ⭐ ${review.author_details.rating} / 10 ` : "no rating"}</p>
                  </div>
            </section>
      );
};

export default Review;
