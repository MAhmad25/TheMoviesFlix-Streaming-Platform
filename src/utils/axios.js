import axios from "axios";
const instance = axios.create({
      baseURL: "https://api.themoviedb.org/3/",
      headers: {
            accept: "application/json",
            Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlNmEwODE2YmZjZGE1ZmYxNjhhZTZlNDYwNTYzMDk4MCIsIm5iZiI6MTczOTAwNzU0My45NjYsInN1YiI6IjY3YTcyNjM3ZTRiZDAyZTY0Y2UwNWY0OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3ZS5YWe6AGyN02S9QfckvTO2onYOXAeleexmECC0WDY",
      },
});
export default instance;
