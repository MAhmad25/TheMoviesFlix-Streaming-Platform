import { getTv } from "../reducers/tvSlice";
export { removeTv } from "../reducers/tvSlice";
import api from "../../utils/axios";
export const asyncTvLoader = (id) => async (dispatch) => {
      const details = await api.get(`/tv/${id}`);
      const castBy = await api.get(`/tv/${id}/credits`);
      const recommendedTv = await api.get(`/tv/${id}/recommendations`);
      const videoLink = await api.get(`/tv/${id}/videos`);
      const reviews = await api.get(`/tv/${id}/reviews`);
      const idDetail = {
            detail: details.data,
            castBy: castBy.data,
            reviews: reviews.data.results,
            recommendedTv: recommendedTv.data.results,
            videoLink: videoLink.data.results.find((link) => link.type === "Trailer"),
      };
      dispatch(getTv(idDetail));
};
