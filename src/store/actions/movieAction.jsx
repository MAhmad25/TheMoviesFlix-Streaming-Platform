import { getMovie } from "../reducers/moviesSlice";
export { removeMovie } from "../reducers/moviesSlice";
import api from "../../utils/axios";
import { pickYouTubeTrailer } from "../../utils/tmdbVideos";
export const asyncMovieLoader = (id, signal) => async (dispatch) => {
      const config = signal ? { signal } : undefined;
      const [details, castBy, recommendedMovies, videoLink, reviews] = await Promise.all([
            api.get(`/movie/${id}`, config),
            api.get(`/movie/${id}/credits`, config),
            api.get(`/movie/${id}/recommendations`, config),
            api.get(`/movie/${id}/videos`, config),
            api.get(`/movie/${id}/reviews`, config),
      ]);
      if (signal?.aborted) return;
      const credits = castBy.data || {};
      const idDetail = {
            detail: details.data,
            castBy: { ...credits, cast: credits.cast || [], crew: credits.crew || [] },
            recommendedMovies: recommendedMovies.data.results || [],
            videoLink: pickYouTubeTrailer(videoLink.data.results),
            reviews: reviews.data.results || [],
      };
      dispatch(getMovie(idDetail));
};
