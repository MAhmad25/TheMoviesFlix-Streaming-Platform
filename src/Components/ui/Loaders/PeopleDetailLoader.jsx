import { useLayoutEffect } from "react";

export default function PeopleDetailSkeleton() {
      useLayoutEffect(() => {
            window.scrollTo(0, 0);
      }, []);
      return (
            <section className="min-w-screen px-3 relative md:flex md:gap-2 min-h-[100dvh] py-10 pb-16 text-white [background-image:var(--bg-gradient)]">
                  {/* Back Button Skeleton */}
                  <div className="absolute z-10 bg-white/30 backdrop-blur rounded-full p-2 top-5 left-5">
                        <div className="w-6 h-6 bg-white/40 rounded-full animate-pulse" />
                  </div>

                  {/* Profile Section */}
                  <div className="w-full md:flex md:flex-col md:gap-10 md:py-5 md:w-2/5 md:shrink-0">
                        {/* Profile Picture and Basic Info */}
                        <div className="w-full flex flex-col justify-center items-center">
                              {/* Profile Image Skeleton */}
                              <div className="w-32 md:w-52 md:h-56 h-36 [background-image:var(--bg-gradient)] rounded-2xl animate-pulse shimmer" />

                              {/* Name Skeleton */}
                              <div className="h-6 md:h-8 bg-white/20 rounded-full animate-pulse w-32 md:w-40 mt-2" />

                              {/* Popularity Skeleton */}
                              <div className="h-5 md:h-7 bg-white/20 rounded-full animate-pulse w-16 mt-1" />

                              {/* High-rated Movies Tags */}
                              <div className="flex gap-2 mt-4 flex-wrap justify-center items-center">
                                    {Array.from({ length: 4 }).map((_, index) => (
                                          <div key={index} className="h-6 md:h-7 bg-white/20 rounded-full animate-pulse w-20 md:w-24" />
                                    ))}
                              </div>
                        </div>

                        {/* Personal Info Section */}
                        <div className="w-full mt-7">
                              {/* Personal Info Title */}
                              <div className="h-8 md:h-10 bg-white/20 rounded-lg animate-pulse w-40 md:w-48 md:mx-auto mb-2" />

                              {/* Personal Info Items */}
                              <div className="mt-2 md:flex md:flex-col md:text-xl md:justify-center md:items-center space-y-2">
                                    <div className="h-5 md:h-6 bg-white/15 rounded-full animate-pulse w-32 md:w-36" />
                                    <div className="h-5 md:h-6 bg-white/15 rounded-full animate-pulse w-40 md:w-44" />
                                    <div className="h-5 md:h-6 bg-white/15 rounded-full animate-pulse w-36 md:w-40" />
                              </div>
                        </div>
                  </div>

                  {/* Content Section */}
                  <div className="w-full md:w-[60%] md:shrink-0 mt-5">
                        {/* Biography Section */}
                        <div className="mb-5">
                              {/* Biography Title */}
                              <div className="flex gap-2 items-center mb-4">
                                    <div className="w-6 h-6 bg-white/20 rounded animate-pulse" />
                                    <div className="h-7 bg-white/20 rounded-lg animate-pulse w-28" />
                              </div>

                              {/* Biography Text Lines */}
                              <div className="space-y-2 md:px-2">
                                    {Array.from({ length: 6 }).map((_, index) => (
                                          <div key={index} className={`h-4 md:h-5 bg-white/15 rounded animate-pulse ${index === 5 ? "w-3/4" : "w-full"}`} />
                                    ))}
                              </div>
                        </div>

                        {/* Recent Projects Section */}
                        <div className="w-full relative px-2 mt-5">
                              {/* Recent Projects Title */}
                              <div className="h-7 bg-white/20 rounded-lg animate-pulse w-40 mb-4" />

                              {/* Projects Container */}
                              <section className="w-full scrollbar-hide h-96 flex gap-4 items-center overflow-x-scroll overflow-y-hidden">
                                    {/* Navigation Buttons Skeleton */}
                                    <div className="absolute hidden md:block bg-white/30 p-2 backdrop-blur-xl rounded-full left-0 top-[30%]">
                                          <div className="w-12 h-12 bg-white/20 rounded-full animate-pulse" />
                                    </div>
                                    <div className="absolute hidden md:block bg-white/30 p-2 backdrop-blur-xl rounded-full right-0 top-[30%]">
                                          <div className="w-12 h-12 bg-white/20 rounded-full animate-pulse" />
                                    </div>

                                    {/* ViewCard Skeletons */}
                                    {Array.from({ length: 8 }).map((_, index) => (
                                          <ViewCardSkeleton key={index} />
                                    ))}
                              </section>
                        </div>
                  </div>
            </section>
      );
}

// ViewCard Skeleton Component
function ViewCardSkeleton() {
      return (
            <div className="w-1/2 shrink-0 h-[80%]">
                  <div className="w-full h-full">
                        {/* Image Skeleton */}
                        <div className="w-full [background-image:var(--bg-gradient)] rounded-lg h-3/4 animate-pulse shimmer" />

                        {/* Content Skeleton */}
                        <div className="mt-2 space-y-1">
                              <div className="h-4 bg-white/20 rounded animate-pulse w-3/4" />
                              <div className="h-3 bg-white/15 rounded animate-pulse w-12" />
                              <div className="h-3 bg-white/15 rounded animate-pulse w-16" />
                        </div>
                  </div>
            </div>
      );
}
