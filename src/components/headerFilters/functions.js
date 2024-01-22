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
  setSelectedDates2,
}) => {
  const formattedDates = dateString?.map((date, index) => {
    const formattedDate =
      index === 1
        ? date && `${date}T23:59:59.999Z`
        : date && `${date}T00:00:00.000Z`;
    return formattedDate;
  });
  setStartDate2(formattedDates[0]);
  setEndDate2(formattedDates[1]);
  // setSelectedDates2(date);
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
