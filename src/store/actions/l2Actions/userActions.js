import { l2Users } from "../../../services/l2Services/userService";

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
      l2Users({pageCount, orgId, search}).then((response) => {
        dispatch({
          type: USERS,
          payload: {
            data: response?.data,
            loading: false,
          },
        });
      });
    } catch (err) {
      console.log(err);
    }
  };
};
