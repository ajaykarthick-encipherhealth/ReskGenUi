import { workStatusApi,DailyTaskApi,accuracyScore,CompletedScore,HoldStatus} from "../../services/DashboardService";

export const WORKFLOWDATA = "WORKFLOWDATA";
export const DATE_RANGE='DATE_RANGE'
export const DAILY_TASK='DAILY_TASK'
export const ACCURACY='ACCURACY'
export const COMPLETED='COMPLETED'
export const HOLD_STATUS='HOLD_STATUS'


export const getDateRange=(val)=>({
    type:DATE_RANGE,
    payload:val
})

export const getWorkFlow=(startDate,endDate) =>{
  return (dispatch) => {
    try{
      workStatusApi(startDate,endDate).then((response) => {
        dispatch({
          type: WORKFLOWDATA,
          payload: response.data,
        });
      });
    }catch(err){
      console.log(err)
    }
  };
}
export const getDailyTaskDatas=(date) =>{
    return (dispatch) => {
        DailyTaskApi(date).then((response) => {
        dispatch({
          type:DAILY_TASK,
          payload: response.data,
        });
      });
    };
  }

  export const getAccuracyScore=(btn,month,year) =>{
    return (dispatch) => {
      accuracyScore(btn,month,year).then((response) => {
        dispatch({
          type:ACCURACY,
          payload: response.data,
        });
      });
    };
  }
  
  export const getCOmpletedScore=(btn,date,month,year) =>{
    return (dispatch) => {
      CompletedScore(btn,date,month,year).then((response) => {
        dispatch({
          type:COMPLETED,
          payload: response.data,
        });
      });
    };
  }
  
  export const getHoldStatusData=() =>{
    return (dispatch) => {
      HoldStatus().then((response) => {
        dispatch({
          type:HOLD_STATUS,
          payload: response.data,
        });
      });
    };
  }