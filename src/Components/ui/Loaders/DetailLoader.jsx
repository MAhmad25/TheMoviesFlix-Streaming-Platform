import { useLayoutEffect } from "react";

const DetailLoader = () => {
      useLayoutEffect(() => {
            window.scrollTo(0, 0);
      }, []);
      return (
            <section className="w-full relative overflow-x-hidden [&::-webkit-scrollbar]:hidden [background-image:var(--bg-gradient)]">
                  {/* Back Button */}
                  <span className="absolute z-10 bg-white/30 backdrop-blur rounded-full p-2 top-5 left-5">
                        <div className="w-6 h-6 bg-black/20 rounded animate-pulse" />
                  </span>

                  <section className="backdrop-blur-2xl overflow-x-hidden [&::-webkit-scrollbar]:hidden relative overflow-hidden w-full sm:min-h-[300dvh] md:min-h-[322dvh] bg-black/30">
                        {/* Hero Image Section */}
                        <div className="w-full relative max-h-screen overflow-hidden rounded-b-2xl">
                              <div className="w-full h-96 md:h-[500px] [background-image:var(--bg-gradient)] animate-pulse" />

                              {/* Desktop Overlay */}
                              <div className="md:absolute hidden md:block md:bg-gradient-to-t md:from-zinc-700/40 md:to-transparent md:w-full md:left-0 md:backdrop-blur-[2px] md:px-5 md:py-5 md:bottom-0">
                                    <div className="h-12 lg:h-16 bg-white/20 rounded-lg animate-pulse mb-3" />
                                    <div className="h-6 bg-white/15 rounded-lg animate-pulse w-3/4 mb-4" />

                                    {/* Tags */}
                                    <div className="flex mt-3 flex-wrap gap-1 w-full">
                                          <div className="px-3 py-1 h-8 w-20 bg-white/10 rounded-full animate-pulse" />
                                          <div className="px-3 py-1 h-8 w-16 bg-white/10 rounded-full animate-pulse" />
                                          <div className="px-3 py-1 h-8 w-24 bg-white/10 rounded-full animate-pulse" />
                                    </div>

                                    {/* Rating and Trailer */}
                                    <div className="w-full mt-3 flex justify-between md:justify-start md:gap-5 items-center">
                                          <div className="h-6 bg-white/15 rounded-lg animate-pulse w-32" />
                                          <div className="h-10 bg-white/15 rounded-lg animate-pulse w-40" />
                                    </div>
                              </div>
                        </div>

                        <section className="px-5 overflow-x-hidden [&::-webkit-scrollbar]:hidden text-white mt-3 w-full">
                              {/* Mobile Title Section */}
                              <div className="md:hidden">
                                    <div className="h-10 bg-white/20 rounded-lg animate-pulse mb-3" />
                                    <div className="h-5 bg-white/15 rounded-lg animate-pulse w-3/4 mb-4" />

                                    {/* Mobile Tags */}
                                    <div className="flex mt-3 flex-wrap gap-1 w-full">
                                          <div className="px-3 py-1 h-8 w-20 bg-white/10 rounded-full animate-pulse" />
                                          <div className="px-3 py-1 h-8 w-16 bg-white/10 rounded-full animate-pulse" />
                                          <div className="px-3 py-1 h-8 w-24 bg-white/10 rounded-full animate-pulse" />
                                    </div>

                                    {/* Mobile Rating and Trailer */}
                                    <div className="w-full mt-3 flex justify-between items-center">
                                          <div className="h-6 bg-white/15 rounded-lg animate-pulse w-28" />
                                          <div className="h-10 bg-white/15 rounded-lg animate-pulse w-36" />
                                    </div>
                              </div>

                              {/* Storyline Section */}
                              <div className="w-full text-white min-[961px]:flex min-[961px]:flex-col min-[961px]:justify-center min-[961px]:items-center mt-3 border-t-[.5px] md:border-none border-zinc-300/70 py-3">
                                    <div className="flex w-full gap-2 md:justify-center items-center mb-3">
                                          <div className="h-8 md:h-12 bg-white/20 rounded-lg animate-pulse w-32" />
                                          <div className="h-6 w-16 bg-yellow-500/40 rounded-full animate-pulse" />
                                    </div>
                                    <div className="space-y-2 min-[961px]:w-1/2">
                                          <div className="h-4 bg-white/15 rounded animate-pulse" />
                                          <div className="h-4 bg-white/15 rounded animate-pulse w-5/6" />
                                          <div className="h-4 bg-white/15 rounded animate-pulse w-4/5" />
                                          <div className="h-4 bg-white/15 rounded animate-pulse w-3/4" />
                                    </div>
                              </div>
                        </section>
                  </section>
            </section>
      );
};

export default DetailLoader;
