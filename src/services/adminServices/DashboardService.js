import axios from "axios";
import ENDPOINTS from "../../utility/enpoints";

export const TEAM_CHART = "TEAM_CHART";
export const MANAGERS = "MANAGERS";
export const SPEEDOMETER = "SPEEDOMETER";
export const ACCURACY_MONTHLY = "ACCURACY_MONTHLY";
export const ACCURACY_WEEKLY = "ACCURACY_WEEKLY";
export const ACCURACY_DAILY = "ACCURACY_DAILY";
// chnaged
export async function workStatusApiAdmin(startDate = "", endDate = "", router) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      `${ENDPOINTS?.apiEndoint}dbservice/admindashboard/overallchart?allocatedOnStartDate=${startDate}&allocatedOnEndDate=${endDate}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    if (err?.response?.status === 401) {
      router.push("/login");
    }
  }
}

// chnaged
export const DailyTaskApi = async (date, router) => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  try {
    const response = await axios.get(
      `${ENDPOINTS?.apiEndoint}dbservice/audit/statistics/processed?username=${userId}&date=${date}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    if (err?.response?.status === 401) {
      router?.push("/login");
    }
  }
};

export const accuracyScore = async (btn, month, year, router) => {
  const token = localStorage.getItem("token");
  const url =
    btn === "Daily"
      ? `daily?month=${month}&year=${year}`
      : btn === "Weekly"
      ? `weekly?month=${month}&year=${year}`
      : `monthyly?year=${year}`;
  try {
    const response = await axios.post(
      `${ENDPOINTS?.apiEndoint}dbservice/accuracyscore/${url}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    if (err?.response?.status === 401) {
      router.push("/login");
    }
  }
};

export const CompletedScore = async (btn, date, month, year, router) => {
  const token = localStorage.getItem("token");
  const url =
    btn === "DAILY"
      ? `daily?month=${month}&year=${year}`
      : btn === "WEEKLY"
      ? `weekly?month=${month}&year=${year}`
      : `monthly?year=${year}`;
  try {
    const response = await axios.get(
      `${ENDPOINTS?.apiEndoint}dbservice/l2dashboard/productivity/status/${url}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    if (err?.response?.status === 401) {
      router.push("/login");
    }
  }
};

// chnaged
export const HoldStatus = async (router) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      `${ENDPOINTS?.apiEndoint}dbservice/audit/hold/charts`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    if (err.response.status === 401) {
      router.push("/login");
    }
  }
};

export const ChatBot = async (msg) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      `${ENDPOINTS?.apiEndoint}aiservice/ai/chat?input=${msg}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const CompletedScoreNew = async (btn, date, month, year, router) => {
  const token = localStorage.getItem("token");
  const url =
    btn === "DAILY"
      ? `daily?month=${month}&year=${year}`
      : btn === "WEEKLY"
      ? `weekly?month=${month}&year=${year}`
      : `monthly?year=${year}`;
  try {
    const response = await axios.get(
      `${ENDPOINTS?.apiEndoint}dbservice/l2dashboard/productivity/status/${url}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    if (err?.response?.status === 401) {
      router.push("/login");
    }
  }
};

export const accuracyScoreNew = async (
  btn,
  date,
  month,
  year,
  router,
  type,
  user
) => {
  const token = localStorage.getItem("token");
  switch (btn) {
    case "WEEKLY":
      btn = "WEEK";
      break;
    case "MONTHLY":
      btn = "MONTH";
      break;
    default:
      null;
  }
  var data = {
    year: year,
    month: month,
    date: date,
    l1AccuracyMemberType: type,
    l1AccuracyDateType: btn,
    weekStart: 11,
    weekEnd: 13,
    orgId: "daa95f13-8b1d-4dc3-8d1c-c15d192c6cd5",
    userIds: user,
  };
  try {
    const response = await axios.post(
      `${ENDPOINTS?.apiEndoint}management/l2dashboard/l1accuracybydatetype`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const UserByIndividual = async (router) => {
  const token = localStorage.getItem("token");
  const orgId = localStorage.getItem("orgId");
  try {
    const response = await axios.get(
      `${ENDPOINTS?.apiEndoint}dbservice/user/getuserbymanagerid?orgid=${orgId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    if (err.response.status === 401) {
      router.push("/login");
    }
  }
};

export const TeamChart = () => async (dispatch) => {
  const token = localStorage.getItem("token");
  const orgId = localStorage.getItem("orgId");
  try {
    dispatch({
      type: TEAM_CHART,
      payload: {
        loading: true,
        data: null,
      },
    });
    const response = await axios.get(
      `${ENDPOINTS.apiEndoint}dbservice/admindashboard/teamchart?orgId=${orgId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response) {
      dispatch({
        type: TEAM_CHART,
        payload: {
          loading: false,
          data: response.data,
        },
      });
    }
  } catch (err) {
    if (err?.response?.status === 401) {
      router?.push("/login");
    }
  }
};

export const getManagers = () => async (dispatch) => {
  const token = localStorage.getItem("token");
  const orgId = localStorage.getItem("orgId");
  const role = "REVIEWER";
  try {
    dispatch({
      type: MANAGERS,
      payload: {
        loading: true,
        data: null,
      },
    });
    const response = await axios.get(
      `${
        ENDPOINTS.apiEndoint
      }dbservice/user/getByRole?role=${role?.toUpperCase()}&orgId=${orgId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response) {
      dispatch({
        type: MANAGERS,
        payload: {
          loading: false,
          data: response.data,
        },
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const getSppedoMeterDatas = (managerId) => async (dispatch) => {
  const token = localStorage.getItem("token");
  const orgId = localStorage.getItem("orgId");

  try {
    dispatch({
      type: SPEEDOMETER,
      payload: {
        loading: true,
        data: null,
      },
    });
    const response = await axios.get(
      `${ENDPOINTS.apiEndoint}dbservice/admindashboard/accuracybyuser?userName=${managerId}&organizationId=${orgId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response) {
      dispatch({
        type: SPEEDOMETER,
        payload: {
          loading: false,
          data: response.data,
        },
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const getAccuracyMOnthly = (year) => async (dispatch) => {
  const token = localStorage.getItem("token");
  try {
    dispatch({
      type: ACCURACY_MONTHLY,
      payload: {
        loading: true,
        data: null,
      },
    });
    const response = await axios.get(
      `${ENDPOINTS.apiEndoint}dbservice/accuracyscore/machine/monthly?year=${year}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response) {
      dispatch({
        type: ACCURACY_MONTHLY,
        payload: {
          loading: false,
          data: response.data,
        },
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const getAccuracyWeekly = (year, month) => async (dispatch) => {
  const token = localStorage.getItem("token");
  try {
    dispatch({
      type: ACCURACY_WEEKLY,
      payload: {
        loading: true,
        data: null,
      },
    });
    const response = await axios.get(
      `${ENDPOINTS.apiEndoint}dbservice/accuracyscore/machine/weekly?year=${year}&month=${month}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response) {
      dispatch({
        type: ACCURACY_WEEKLY,
        payload: {
          loading: false,
          data: response.data,
        },
      });
    }
  } catch (err) {
    console.log(err);
  }
};
export const getAccuracyDaily = (year, month) => async (dispatch) => {
  const token = localStorage.getItem("token");
  try {
    dispatch({
      type: ACCURACY_DAILY,
      payload: {
        loading: true,
        data: null,
      },
    });
    const response = await axios.get(
      `${ENDPOINTS.apiEndoint}dbservice/accuracyscore/machine/daily?year=${year}&month=${month}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response) {
      dispatch({
        type: ACCURACY_DAILY,
        payload: {
          loading: false,
          data: response.data,
        },
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const CompletedStatus = async (
  btn,
  date,
  month,
  year,
  router,
  userName
) => {
  const token = localStorage.getItem("token");
  const url =
    btn === "DAILY"
      ? `daily?month=${month}&year=${year}&userName=${userName}`
      : btn === "WEEKLY"
      ? `weekly?month=${month}&year=${year}&userName=${userName}`
      : `monthyly?year=${year}&userName=${userName}`;
  try {
    const response = await axios.get(
      `${ENDPOINTS?.apiEndoint}dbservice/admindashboard/chartdeliverystatus/${url}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    if (err?.response?.status === 401) {
      router.push("/login");
    }
  }
};

export const GetUserCount = async (role) => {
  const token = localStorage.getItem("token");
  const orgId = localStorage.getItem("orgId");
  try {
    const response = await axios.get(
      `${ENDPOINTS?.apiEndoint}dbservice/user/getusercountbyrole`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    if (err?.response?.status === 401) {
      router.push("/login");
    }
  }
};

export const SelectUserList = async (role) => {
  const token = localStorage.getItem("token");
  const orgId = localStorage.getItem("orgId");
  try {
    const response = await axios.get(
      `${ENDPOINTS?.apiEndoint}dbservice/user/getByRole?role=${role}&orgId=${orgId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    if (err?.response?.status === 401) {
      router.push("/login");
    }
  }
};
