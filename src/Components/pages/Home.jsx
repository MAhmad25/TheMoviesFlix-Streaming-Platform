import { TrendingContainer, Header, ComingSoonContainer } from "../ui/index";
const Home = () => {
      document.title = "MoviesFlix | Movie & TV Streaming ";
      return (
            <div className="w-full [background-image:var(--bg-gradient)] relative overflow-hidden font-Stoshi min-h-full sm:pb-10 md:pb-0 sm:mb-0">
                  <Header />
                  <TrendingContainer />
                  <ComingSoonContainer />
            </div>
      );
};

export default Home;
