import { Avatar } from "antd";
import { SVGICON } from "../../jsx/constant/theme";
import TableStyle from "../table/table.module.css";
import moment from "moment";
import dayjs from 'dayjs'
// for search
export const searchFunction = (
  e,
  setSearch,
  setSentSearch,
  setReceivedSearch,
  setCoderSearch,
  activeTab
) => {
  if (activeTab === "SentReport") {
    setSentSearch(e.target.value);
  } else if (activeTab === "ReceivedReport") {
    setReceivedSearch(e.target.value);
  } else if (activeTab === "CoderReport") {
    setCoderSearch(e.target.value);
  } else {
    setSearch(e.target.value);
  }
};

// for select
export const handleSelector = (option, setSelectedOption) => {
  setSelectedOption(option?.value);
};

// for rangepicker
export const handleRnagePicker = (
  dates,
  dateString,
  setStartDate,
  setEndDate,
  setSelectedDates,
  activeTab,
  setReceivedStartDate,
  setReceivedEndDate,
  setCoderStartDate,
  setCoderEndDate
) => {
  if (dates === null || (Array.isArray(dates) && dates.length === 0)) {
    setSelectedDates(null); 
    setCoderStartDate();
    setCoderEndDate();
    setStartDate();
    setEndDate();
    setReceivedStartDate();
    setReceivedEndDate();
    return;
  }

  const formattedDates = dateString?.length>0 && dateString?.map((data, index) => {
    const formattedDate =
      index === 1
        ? data && `${data}T23:59:59.999Z`
        : data && `${data}T00:00:00.000Z`;
        
    return formattedDate;
  });
  setSelectedDates([
    dayjs(dateString[0]),
    dayjs(dateString[1]),
  ]);
  if (activeTab === "SentReport") {
    setStartDate(formattedDates[0]);
    setEndDate(formattedDates[1]);
  } else if (activeTab === "ReceivedReport") {
    setReceivedStartDate(formattedDates[0]);
    setReceivedEndDate(formattedDates[1]);
  } else if (activeTab === "CoderReport") {
    setCoderStartDate(formattedDates[0]);
    setCoderEndDate(formattedDates[1]);
  } else {
    setStartDate(formattedDates[0]);
    setEndDate(formattedDates[1]);
  }
};

// if has 2 rangepickers
export const handleRnagePicker2 = ({
  date,
  dateString,
  setStartDate2,
  setEndDate2,
  setStartDate3,
  setEndDate3,
  setStartDate4,
  setEndDate4,
  setStartDate5,
  setEndDate5,
}) => {
  const formattedDates = dateString?.map((date, index) => {
    const formattedDate =
      index === 1
        ? date && `${date}T23:59:59.999Z`
        : date && `${date}T00:00:00.000Z`;
    return formattedDate;
  });
  if (setStartDate2 && setEndDate2) {
    setStartDate2(formattedDates[0]);
    setEndDate2(formattedDates[1]);
  }
  if (setStartDate3 && setEndDate3) {
    setStartDate3(formattedDates[0]);
    setEndDate3(formattedDates[1]);
  }
  if (setStartDate4 && setEndDate4) {
    setStartDate4(formattedDates[0]);
    setEndDate4(formattedDates[1]);
  }
  if (setStartDate5 && setEndDate5) {
    setStartDate5(formattedDates[0]);
    setEndDate5(formattedDates[1]);
  }
};

export const dateFormate = (dayjs, date) => {
  return date ? dayjs(date).format("MM-DD-YYYY") : <div>MM-DD-YYYY</div>;
};

//sorting
export const sortFunction = (sortDir, setSortDir, setSort, field) => {
  setSortDir(sortDir === "ASC" ? "DESC" : "ASC");
  setSort({ sortDir: sortDir === "ASC" ? "DESC" : "ASC", sortField: field });
};
export const priorityOptions = [
  {
    value: "URGENT",
    label: (
      <>
        <i>{SVGICON.alert}</i>{" "}
        <span style={{ fontSize: "13px", color: "red" }}>Urgent</span>{" "}
      </>
    ),
  },
  {
    value: "HIGH",
    label: (
      <>
        <i className={TableStyle.highFlag}>{SVGICON.alert}</i>
        <span style={{ fontSize: "13px", color: "#cf940a" }}>High</span>{" "}
      </>
    ),
  },
  {
    value: "NORMAL",
    label: (
      <>
        <i className={TableStyle.normalFlag}>{SVGICON.alert}</i>
        <span style={{ fontSize: "13px", color: "#4466ff " }}>Normal</span>{" "}
      </>
    ),
  },
  {
    value: "LOW",
    label: (
      <>
        <i className={TableStyle.lowFlag}>{SVGICON.alert}</i>{" "}
        <span style={{ fontSize: "13px", color: "#87909e" }}>Low</span>{" "}
      </>
    ),
  },
];

export const processstatusBodyTemplate = (rowData) => {
  switch (rowData.processedStatus) {
    case "COMPLETED":
      return (
        <div className="patient-status">
          <span className={`badge processed-text`}>Completed</span>
        </div>
      );

    case "PENDING":
      return (
        <div className="patient-status">
          <span className={`badge processing-text`}>Pending</span>
        </div>
      );

    case "DECLINED":
      return (
        <div className="patient-status">
          <span className={`badge failed-text`} style={{ color: "red" }}>
            Declined
          </span>
        </div>
      );

    case "NOTCOMPUTED":
      return (
        <div className="patient-status">
          <span className={`badge notComputed-text`}>Not Computed</span>
        </div>
      );
    case "COMPUTED":
      return (
        <div className="patient-status">
          <span className={`badge computed-text`}>Computed</span>
        </div>
      );
    case "HOLD":
      return (
        <div className="patient-status">
          <span className={`badge hold-text`}>Hold</span>
        </div>
      );
    case null:
      return <div className="patient-status">---</div>;
  }
};

export const generateOptionsList = (items) => {
  if (items?.loading || items === null) {
    return [{ label: "Loading...", value: "Loading..." }];
  } else if (items?.data?.data.response?.length > 0) {
    const options = [
      { label: "All", value: "" },
      ...items.data.data.response.map((item) => ({
        label: item,
        value: item,
      })),
    ].filter(Boolean);
    return options;
  } else {
    return [];
  }
};

export const getBackgroundColor = (randomNumber) => {
  switch (randomNumber) {
    case 1:
      return "#F28585";
    case 2:
      return "#04306F";
    case 3:
      return "#E6A4B4";
    case 4:
      return "#607274";
    case 5:
      return "#DED0B6";
    case 6:
      return "#C3E2C2";
    default:
      return "#9BB8CD";
  }
};

export const renderUserPrfoile = (
  firstName,
  lastName,
  imageUrl,
  field,
  width,
  height
) => {
  const firstNameInitial = firstName?.charAt(0) || "";
  const secondNameInitial = lastName?.charAt(0) || "";
  const hash = (firstNameInitial.charCodeAt(0) % 6) + 1;
  const backgroundColor = field ? getBackgroundColor(hash) : "#F3C217";

  if (!imageUrl) {
    var profileAvatar = (
      <Avatar
        style={{
          backgroundColor: backgroundColor,
          color: "white",
          cursor: "pointer",
          width: width ? width : "47px",
          height: height ? height : "47px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "18px",
          fontWeight: 700,
        }}
      >
        {firstNameInitial?.toUpperCase() + secondNameInitial?.toUpperCase()}
      </Avatar>
    );
    return profileAvatar;
  } else {
    var profileAvatar = (
      <img
        src={imageUrl}
        alt="avatar"
        // className="rounded-4 shadow-4"
        style={{
          width: width ? width : "50px",
          height: height ? height : "50px",
          borderRadius: "50%",
        }}
      />
    );
    return profileAvatar;
  }
};
export const renderUserPrfoileAvatar = (
  firstName,
  lastName,
  imageUrl,
  field
) => {
  const firstNameInitial = firstName?.charAt(0) || "";
  const secondNameInitial = lastName?.charAt(0) || "";
  const hash = (firstNameInitial.charCodeAt(0) % 6) + 1;
  const backgroundColor = field ? getBackgroundColor(hash) : "#F3C217";

  if (!imageUrl) {
    var profileAvatar = (
      <Avatar
        style={{
          backgroundColor: backgroundColor,
          color: "white",
          cursor: "pointer",
          width: "30px",
          height: "30px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "15px",
          fontWeight: 500,
        }}
      >
        {firstNameInitial?.toUpperCase() + secondNameInitial?.toUpperCase()}
      </Avatar>
    );
    return profileAvatar;
  } else {
    var profileAvatar = (
      <img
        src={imageUrl}
        alt="avatar"
        // className="rounded-4 shadow-4"
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "50%",
        }}
      />
    );
    return profileAvatar;
  }
};

export const getSelectedDaysCount = (DateRanges) => {
  const startDate = new Date(
    moment(DateRanges?.startDate).format("YYYY-MM-DD")
  );
  const endDate = new Date(moment(DateRanges?.endDate).format("YYYY-MM-DD"));

  const differenceMs = Math.abs(endDate - startDate);

  const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
  return differenceDays;
};
