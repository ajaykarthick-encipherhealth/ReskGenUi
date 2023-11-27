import { workStatusApi,DailyTaskApi } from "../../services/DashboardService";

export const WORKFLOWDATA = "WORKFLOWDATA";
export const DATE_RANGE='DATE_RANGE'
export const DAILY_TASK='DAILY_TASK'


export const getDateRange=(val)=>({
    type:DATE_RANGE,
    payload:val
})

export const getWorkFlow=(startDate,endDate) =>{
  return (dispatch) => {
    workStatusApi(startDate,endDate).then((response) => {
      dispatch({
        type: WORKFLOWDATA,
        payload: response.data,
      });
    });
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
  