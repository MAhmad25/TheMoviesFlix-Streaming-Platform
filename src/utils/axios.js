import axios from "axios";
import { trackRequestEnd, trackRequestStart } from "./initialLoad";

const instance = axios.create({
      baseURL: import.meta.env.VITE_BASE_URL,
      headers: {
            accept: "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
      },
});

instance.interceptors.request.use((config) => {
      trackRequestStart();
      return config;
});

instance.interceptors.response.use(
      (response) => {
            trackRequestEnd();
            return response;
      },
      (error) => {
            trackRequestEnd();
            return Promise.reject(error);
      }
);

export default instance;
