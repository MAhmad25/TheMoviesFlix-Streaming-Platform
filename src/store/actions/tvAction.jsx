import { getTv } from "../reducers/tvSlice";
export { removeTv } from "../reducers/tvSlice";
import api from "../../utils/axios";
import { pickYouTubeTrailer } from "../../utils/tmdbVideos";
export const asyncTvLoader = (id, signal) => async (dispatch) => {
      const config = signal ? { signal } : undefined;
      const [details, castBy, recommendedTv, videoLink, reviews] = await Promise.all([
            api.get(`/tv/${id}`, config),
            api.get(`/tv/${id}/credits`, config),
            api.get(`/tv/${id}/recommendations`, config),
            api.get(`/tv/${id}/videos`, config),
            api.get(`/tv/${id}/reviews`, config),
      ]);
      if (signal?.aborted) return;
      const credits = castBy.data || {};
      const idDetail = {
            detail: details.data,
            castBy: { ...credits, cast: credits.cast || [], crew: credits.crew || [] },
            reviews: reviews.data.results || [],
            recommendedTv: recommendedTv.data.results || [],
            videoLink: pickYouTubeTrailer(videoLink.data.results),
      };
      dispatch(getTv(idDetail));
};
