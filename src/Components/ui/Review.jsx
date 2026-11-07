import { memo } from "react";
import { play } from "cuelume";

const Review = ({ review }) => {
      return (
            <section
                  onClick={() => {
                        if (!window.getSelection()?.toString()) play("press");
                  }}
                  className="flex h-full w-full min-w-0 shrink-0 flex-col rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm active:opacity-90"
            >
                  <p className="flex-shrink-0 text-end text-xs text-[#FCD53F] sm:text-sm md:text-lg min-[932px]:text-xl">{review.updated_at.split("T")[0]}</p>

                  <div className="mb-2 min-h-0 flex-1 overflow-y-auto break-words pr-2 text-sm text-white/90 font-primary sm:opacity-80 md:text-base [&::-webkit-scrollbar]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-2xl [&::-webkit-scrollbar-thumb]:bg-white/20">
                        <div className="min-h-full">
                              {review.content
                                    .replace(/<[^>]*>/g, "")
                                    .replace(/\\n|\\t/g, "")
                                    .trim()}
                        </div>
                  </div>

                  <div className="flex flex-shrink-0 flex-wrap items-center justify-between gap-x-3 gap-y-1 py-2 text-sm sm:text-base">
                        <p className="min-w-0 break-words text-white/80">
                              By <span className="text-white font-primary">{review.author || review.author_details.name}</span>
                        </p>
                        <p className="whitespace-nowrap text-white/90">{review.author_details.rating !== null ? ` ⭐ ${review.author_details.rating} / 10 ` : "no rating"}</p>
                  </div>
            </section>
      );
};

export default memo(Review);
