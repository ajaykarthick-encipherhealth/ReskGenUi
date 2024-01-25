import { L2UsersReducer } from "../../reducers/l2Reducers/usersReducers";

export const USERS = "USERS";

export const getL2Users = ({ pageCount, orgId, search }) => {
  return (dispatch) => {
    dispatch({
      type: USERS,
      payload: {
        loading: true,
      },
    });
    try {
      L2UsersReducer({pageCount, orgId, search}).then((response) => {
       if(response){
         dispatch({
          type: USERS,
          payload: {
            data: response?.data,
            loading: false,
          },
        });
       }
      });
    } catch (err) {
      console.log(err);
    }
  };
};
