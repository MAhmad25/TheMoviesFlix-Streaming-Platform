import { getPeople } from "../reducers/peopleSlicer";
export { removePeople } from "../reducers/peopleSlicer";
import api from "../../utils/axios";
export const asyncPeopleLoader = (id) => async (dispatch) => {
      const details = await api.get(`/person/${id}`);
      const castedMovies = await api.get(`/person/${id}/credits`);
      const idDetail = {
            personDetail: details.data,
            castedMovies: castedMovies.data,
      };
      dispatch(getPeople(idDetail));
};
