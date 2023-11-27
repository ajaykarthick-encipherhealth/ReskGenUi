import axios from "axios";

export function workStatusApi(startDate,endDate) {
    const token=localStorage.getItem("token")
    return axios.get(
        `https://hcc.encipherhealth.com/secure/management/dashboard/tile/statistics?start=${startDate}&end=${endDate}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
}

export const DailyTaskApi=(date)=> {
    const token=localStorage.getItem("token")
    return axios.get(
        `https://hcc.encipherhealth.com/secure/management/dashboard/daily/statistics?date=${date}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
}

