import { FihrServices } from "../../../services/tanantAdminService/FihrServices";

  export const GET_FIHR_LIST = "GET_FIHR_LIST"
  
  export const getFihrList = (router) => {
    return (dispatch) => {
      dispatch({
        type: GET_FIHR_LIST,
        payload: {
          loading: true,
        },
      });
      try {
        FihrServices(router).then((response) => {
          dispatch({
            type: GET_FIHR_LIST,
            payload: {
              fihr_list: response,
              loading: false,
            },
          });
        });
      } catch (err) {
        console.log("dasff", err);
      }
    };
  };