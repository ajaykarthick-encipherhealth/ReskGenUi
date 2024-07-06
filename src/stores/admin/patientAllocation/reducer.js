import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import { getAllList ,getSupervisorsList,getSelectedSupervisorList} from "./actions";

const initialState = {
  loading: true,
  data: null,
  error: null,
};
const createReducer = (actionType) =>
  handleActions(
    {
      [actionType.STARTED]: (state, action) => ({
        ...state,
        loading: true,
        error: null,
      }),
      [actionType.SUCCEEDED]: (state, action) => ({
        ...state,
        loading: false,
        data: action.payload,
        error: null,
      }),
      [actionType.FAILED]: (state, action) => ({
        ...state,
        loading: false,
        error: action.payload,
      }),
    },
    initialState
  );
  const getReportLoading=(type) => handleActions(
    {
      [type.START]: () => true,
      [type.SUCCEEDED]: () => false,
      [type.FAILED]: () => false,
    },
    false
  );
const allocatedReducer = combineReducers({
  allocatedList: createReducer(getAllList),
  loader:getReportLoading(getAllList),
  l2AllocatedList: createReducer(getSupervisorsList),
  l2Loader:getReportLoading(getSupervisorsList),
  selectedSupervisors:createReducer(getSelectedSupervisorList),
  supervisorLoader:getReportLoading(getSelectedSupervisorList)
});

export default allocatedReducer;
