import { TrendingContainer, Header, ComingSoonContainer } from "../ui/index";
const Home = () => {
      document.title = "MoviesFlix | Home - Watch and Stream Movies and TV Series";
      return (
            <>
                  <div className="w-full relative lg:space-y-10  overflow-hidden font-Stoshi min-h-full sm:pb-10 md:pb-0  sm:mb-0 bg-[#031402]">
                        <Header />
                        <TrendingContainer />
                        <hr className="hidden lg:block" />
                        <ComingSoonContainer />
                  </div>
            </>
      );
};

export default Home;
