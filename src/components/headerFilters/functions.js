// for search
// const performanceSearch = (value, setSearch) => {
//   setSearch(value);
// };
// const debouncedSearch = debounce(performanceSearch, 500);

export const searchFunction = (e, setSearch) => {
  setSearch(e.target.value);
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
  setSelectedDates
) => {
  const formattedDates = dateString?.map((date, index) => {
    const formattedDate =
      index === 1
        ? date && `${date}T23:59:59.999Z`
        : date && `${date}T00:00:00.000Z`;
    return formattedDate;
  });
  setStartDate(formattedDates[0]);
  setEndDate(formattedDates[1]);
  setSelectedDates(date);
};

// if has 2 rangepickers
export const handleRnagePicker2 = (
  date,
  dateString,
  setStartDate2,
  setEndDate2,
  setSelectedDates2
) => {
  const formattedDates = dateString?.map((date, index) => {
    const formattedDate =
      index === 1
        ? date && `${date}T23:59:59.999Z`
        : date && `${date}T00:00:00.000Z`;
    return formattedDate;
  });
  setStartDate2(formattedDates[0]);
  setEndDate2(formattedDates[1]);
  setSelectedDates2(date);
};
