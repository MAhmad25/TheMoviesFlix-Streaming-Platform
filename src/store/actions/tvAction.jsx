import { getTv } from "../reducers/tvSlice";
export { removeTv } from "../reducers/tvSlice";
import api from "../../utils/axios";
export const asyncTvLoader = (id) => async (dispatch) => {
      const details = await api.get(`/tv/${id}`);
      const castBy = await api.get(`/tv/${id}/credits`);
      const recommendedTv = await api.get(`/tv/${id}/recommendations`);
      const similarTv = await api.get(`/tv/${id}/similar`);
      const videoLink = await api.get(`/tv/${id}/videos`);
      const idDetail = {
            detail: details.data,
            castBy: castBy.data,
            recommendedTv: recommendedTv.data.results,
            similarTvs: similarTv.data.results,
            videoLink: videoLink.data.results.find((link) => link.type === "Trailer"),
      };
      dispatch(getTv(idDetail));
};
