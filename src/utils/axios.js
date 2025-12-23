import axios from "axios";
const instance = axios.create({
      baseURL: import.meta.env.VITE_BASE_URL,
      headers: {
            accept: "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
      },
});
export default instance;
