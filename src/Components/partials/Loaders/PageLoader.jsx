import { useLayoutEffect } from "react";

export default function PageSkeleton() {
      useLayoutEffect(() => {
            window.scrollTo(0, 0);
      }, []);
      return (
            <div className="bg-[rgb(31,71,69)] overflow-x-hidden w-full h-full bg-[linear-gradient(27deg,_rgba(31,71,69,1)_10%,_rgba(16,36,27,1)_67%,_rgba(68,73,53,1)_100%)]">
                  {/* Header Section */}
                  <span className="flex px-5 py-5 gap-4 items-center">
                        <div className="h-8 bg-white/20 rounded-lg animate-pulse w-40" />
                        <div className="h-6 w-6 bg-white/20 rounded-full animate-pulse" />
                  </span>

                  {/* Grid of Skeleton Cards */}
                  <div className="px-2 w-full overflow-x-hidden gap-x-6 gap-y-4 grid sm:grid-cols-3 grid-cols-2">
                        {Array.from({ length: 12 }).map((_, index) => (
                              <div key={index} className="animate-pulse">
                                    {/* Movie Poster Section - matching w-44 sm:w-full sm:min-w-56 and heights */}
                                    <section className="w-44 relative sm:w-full sm:min-w-56 shrink-0 overflow-hidden rounded-xl sm:h-56 md:h-72 h-40">
                                          <div className="w-full h-full bg-[rgb(31,71,69)]/60 relative overflow-hidden">
                                                {/* Shimmer effect */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
                                          </div>
                                    </section>

                                    {/* Content Section - matching mt-2 px-2 py-2 structure */}
                                    <div className="mt-2 px-2 py-2 rounded-lg flex flex-col gap-1 h-fit w-full md:w-full text-white">
                                          {/* Rating Skeleton - matching vote_average structure */}
                                          <div className="h-3 bg-white/20 rounded-full w-12 animate-pulse" />

                                          {/* Title Skeleton - matching text-sm sm:text-lg */}
                                          <div className="h-4 sm:h-5 bg-white/20 rounded-full w-3/4 animate-pulse" />

                                          {/* Overview Skeleton - matching text-xs sm:text-sm and 60 char limit */}
                                          <div className="h-3 sm:h-4 bg-white/15 rounded-full w-full animate-pulse" />
                                          <div className="h-3 sm:h-4 bg-white/15 rounded-full w-2/3 animate-pulse" />
                                    </div>
                              </div>
                        ))}
                  </div>

                  {/* Loading More Indicator */}
                  <div className="flex justify-center py-8">
                        <div className="flex space-x-2">
                              <div className="w-3 h-3 bg-white/30 rounded-full animate-bounce" />
                              <div className="w-3 h-3 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                              <div className="w-3 h-3 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                        </div>
                  </div>
            </div>
      );
}
