import { SVGICON } from "../../jsx/constant/theme";
import TableStyle from "../table/table.module.css";
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
  date,
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
  const formattedDates = dateString?.map((data, index) => {
    const formattedDate =
      index === 1
        ? data && `${data}T23:59:59.999Z`
        : data && `${data}T00:00:00.000Z`;
    return formattedDate;
  });
  // setSelectedDates(date);
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
};

export const dateFormate = (dayjs, date) => {
  return date ? dayjs(date).format("MM-DD-YYYY") : <div>MM-DD-YYYY</div>;
};

//sorting
export const sortFunction = (sortOrder, setSortOrder) => {
  if (sortOrder === "ASC") {
    setSortOrder("DESC");
  } else {
    setSortOrder("ASC");
  }
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

export function generateOptionsList(items, key, defaultValue) {
  const optionsSet = new Set();
  const options = [
    { label: "All", value: defaultValue },
    ...items
      ?.map((item) => {
        if (item && item[key] && !optionsSet.has(item[key])) {
          optionsSet.add(item[key]);
          return { label: item[key], value: item[key] };
        }
        return null;
      })
      .filter(Boolean),
  ];
  return options;
}
