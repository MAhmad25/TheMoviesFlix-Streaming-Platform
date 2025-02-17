const Loader = () => {
      return (
            <div className="w-full min-h-[100dvh] bg-[rgb(31,71,69)]   bg-[linear-gradient(27deg,_rgba(31,71,69,1)_10%,_rgba(16,36,27,1)_67%,_rgba(68,73,53,1)_100%)] flex justify-center items-center">
                  <div className="flex flex-col bg-neutral-300 w-56 h-64 animate-pulse rounded-xl p-4 gap-4">
                        <div className="bg-[rgb(31,71,69)] w-full h-32 animate-pulse rounded-md" />
                        <div className="flex flex-col gap-2">
                              <div className="bg-[rgb(31,71,69)] w-full h-4 animate-pulse rounded-md" />
                              <div className="bg-[rgb(31,71,69)] w-4/5 h-4 animate-pulse rounded-md" />
                              <div className="bg-[rgb(31,71,69)] w-full h-4 animate-pulse rounded-md" />
                              <div className="bg-[rgb(31,71,69)] w-2/4 h-4 animate-pulse rounded-md" />
                        </div>
                  </div>
            </div>
      );
};

export default Loader;
