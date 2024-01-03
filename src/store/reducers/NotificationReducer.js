import {NOTIFICATION_ALERT, NOTIFICATION_LIST,NOTIFICATION_ALERT_CLEAR} from "../actions/NotificationAction";
  
  const initialState = {
   notificationAlert: [], 
   notificationList : [], 
  };

  export const NotificationReducer = (state = initialState, action) => {

    if (action.type === NOTIFICATION_ALERT) {
        var newArray =action.payload;
        if(state.notificationAlert != null){
         newArray = [...state.notificationAlert,...action.payload]
        }
      return {
        ...state,
        notificationAlert:newArray,
      };
    }

    if (action.type === NOTIFICATION_ALERT_CLEAR) {
    return {
      ...state,
      notificationAlert:action.payload,
    };
  }

    if (action.type === NOTIFICATION_LIST) {
        return {
          ...state,
          notificationList: action.payload,
        };
      }


    return state;
  };