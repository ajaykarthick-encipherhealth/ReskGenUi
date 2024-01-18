import { notification } from "antd";
import {
  UsersList,
  AddUser,
  EnableUser,
} from "../../../services/adminServices/usersService";

export const LIST = "LIST";
export const CREATE = "CREATE";
export const ENABLE = "ENABLE";

export const getUsers = ({
  pageCount,
  search,
  startDate,
  endDate,
  status,
  role,
}) => {
  return (dispatch) => {
    dispatch({
      type: LIST,
      payload: { loading: true },
    });
    try {
      UsersList({ pageCount, search, startDate, endDate, status, role }).then(
        (response) => {
          if (response) {
            dispatch({
              type: LIST,
              payload: {
                data: response.data,
                loading: false,
              },
            });
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  };
};

export const getAddUser = (data) => {
  return (dispatch) => {
    try {
      if (data) {
        AddUser(data).then((response) => {
          if (response) {
            dispatch({
              type: CREATE,
              payload: response.data,
            });

            if (response?.status === "SUCCESS") {
              notification?.success({ description: response?.message });
              dispatch(getUsers(0));
            }
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
};