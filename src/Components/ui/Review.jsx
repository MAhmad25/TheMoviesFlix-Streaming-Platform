import { memo } from "react";

const Review = ({ review }) => {
      return (
            <section className="w-[85%] min-w-0 h-full py-3 relative sm:w-[60%] md:w-[55%] lg:w-[40%] px-4 shrink-0 rounded-xl flex flex-col">
                  <p className="text-xs sm:text-sm md:text-lg min-[932px]:text-xl text-[#FCD53F] text-end flex-shrink-0">{review.updated_at.split("T")[0]}</p>

                  <div className="text-sm min-h-0 flex-1 break-words [&::-webkit-scrollbar]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-2xl [&::-webkit-scrollbar-thumb]:bg-white/20 overflow-y-auto md:text-base font-primary sm:opacity-80 text-white/90 pr-2 mb-2">
                        <div className="min-h-full">
                              {review.content
                                    .replace(/<[^>]*>/g, "")
                                    .replace(/\\n|\\t/g, "")
                                    .trim()}
                        </div>
                  </div>

                  <div className="flex flex-wrap justify-between gap-x-3 gap-y-1 py-2 items-center sm:text-base text-sm flex-shrink-0">
                        <p className="min-w-0 break-words text-white/80">
                              By <span className="text-white font-primary">{review.author || review.author_details.name}</span>
                        </p>
                        <p className="whitespace-nowrap text-white/90">{review.author_details.rating !== null ? ` ⭐ ${review.author_details.rating} / 10 ` : "no rating"}</p>
                  </div>
            </section>
      );
};

export default memo(Review);
