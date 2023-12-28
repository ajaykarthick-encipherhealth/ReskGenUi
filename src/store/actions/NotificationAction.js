import {NotificationList} from "../../services/NotificationService";

export const NOTIFICATION_ALERT = "NOTIFICATION_ALERT";
export const NOTIFICATION_LIST = "NOTIFICATION_LIST";



export const getNotificationAlert = (data) => {
    return (dispatch) => {
      try {
      
          dispatch({
            type: NOTIFICATION_ALERT,
            payload: data,
          });
      } catch (err) {
        console.log(err);
      }
    };
  };
  
  export const getNotificationList = (userId) => {
    return (dispatch) => {
      try {
        NotificationList(userId).then((response) => {
          dispatch({
            type: NOTIFICATION_LIST,
            payload: response,
          });
        });
      } catch (err) {
        console.log(err);
      }
    };
  };