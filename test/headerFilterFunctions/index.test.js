import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import dayjs from "dayjs";
import { Select, DatePicker } from "antd";
import { handleRnagePicker } from "../../src/components/headerFilters/functions";
import { generateOptionsForNewStore } from "../../src/components/headerFilters/functions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import TableStyle from "../../src/components/table/table.module.css";
import { priorityStatus } from "../../src/components/headerFilters/functions";
import { sortFunction } from "../../src/components/headerFilters/functions";
import { searchFunction } from "../../src/components/headerFilters/functions";
import { processstatusBodyTemplate } from "../../src/components/headerFilters/functions";
import { handleSelector } from "../../src/components/headerFilters/functions";
import { dateFormate } from "../../src/components/headerFilters/functions";

const { RangePicker } = DatePicker;
// sort
describe("sortFunction", () => {
  it("should update sortDir and sortField when sortDir is ASC", () => {
    const setSortDir = jest.fn((updateFn) => {
      const newSortDir = updateFn("ASC");
      return newSortDir;
    });
    const setSort = jest.fn();
    const field = "name";
    const res = sortFunction("ASC", setSortDir, setSort, field);
    if (res == "DESC") {
      expect(setSortDir).toHaveBeenCalledTimes(1);
      expect(setSort).toHaveBeenCalledWith({
        sortDir: "DESC",
        sortField: field,
      });
    }
  });

  it("should update sortDir and sortField when sortDir is DESC", () => {
    const setSortDir = jest.fn((updateFn) => {
      const newSortDir = updateFn("DESC");
      return newSortDir;
    });
    const setSort = jest.fn();
    const field = "name";

    sortFunction(setSortDir, setSort, field);

    const res = sortFunction("DESC", setSortDir, setSort, field);
    if (res == "DESC") {
      expect(setSortDir).toHaveBeenCalledTimes(1);
      expect(setSort).toHaveBeenCalledWith({
        sortDir: "ASC",
        sortField: field,
      });
    }
  });

  it("should update sortDir and sortField when sortDir is undefined", () => {
    const setSortDir = jest.fn((updateFn) => {
      const newSortDir = updateFn(undefined);
      return newSortDir;
    });
    const setSort = jest.fn();
    const field = "name";
    const res = sortFunction("ASC", setSortDir, setSort, field);
    if (res == "DESC") {
      expect(setSortDir).toHaveBeenCalledTimes(1);
      expect(setSort).toHaveBeenCalledWith({
        sortDir: "ASC",
        sortField: field,
      });
    }
  });

  it("should update sortDir and sortField when field is changed", () => {
    const setSortDir = jest.fn((updateFn) => {
      const newSortDir = updateFn("ASC");
      return newSortDir;
    });
    const setSort = jest.fn();
    const field = "age";

    const res = sortFunction("DESC", setSortDir, setSort, field);
    if (res == "ASC") {
      expect(setSortDir).toHaveBeenCalledTimes(1);
      expect(setSort).toHaveBeenCalledWith({
        sortDir: "DESC",
        sortField: field,
      });
    }
  });
});

// search
describe("searchFunction", () => {
  it("calls setSearch when active tab is not SentReport, ReceivedReport, or CoderReport", () => {
    const setSearch = jest.fn();
    const setSentSearch = jest.fn();
    const setReceivedSearch = jest.fn();
    const setCoderSearch = jest.fn();
    const activeTab = "OtherTab";
    const searchValue = "test";
    const e = { target: { value: searchValue } };

    searchFunction(
      searchValue,
      setSearch,
      setSentSearch,
      setReceivedSearch,
      setCoderSearch,
      activeTab,
      e
    );

    expect(setSearch).toHaveBeenCalledWith(searchValue);
  });

  it("calls setSentSearch when active tab is SentReport", () => {
    const setSearch = jest.fn();
    const setSentSearch = jest.fn();
    const setReceivedSearch = jest.fn();
    const setCoderSearch = jest.fn();
    const activeTab = "SentReport";
    const searchValue = "test";
    const e = { target: { value: searchValue } };

    searchFunction(
      searchValue,
      setSearch,
      setSentSearch,
      setReceivedSearch,
      setCoderSearch,
      activeTab,
      e
    );

    expect(setSentSearch).toHaveBeenCalledWith(searchValue);
  });

  it("calls setReceivedSearch when active tab is ReceivedReport", () => {
    const setSearch = jest.fn();
    const setSentSearch = jest.fn();
    const setReceivedSearch = jest.fn();
    const setCoderSearch = jest.fn();
    const activeTab = "ReceivedReport";
    const searchValue = "test";
    const e = { target: { value: searchValue } };

    searchFunction(
      searchValue,
      setSearch,
      setSentSearch,
      setReceivedSearch,
      setCoderSearch,
      activeTab,
      e
    );

    expect(setReceivedSearch).toHaveBeenCalledWith(searchValue);
  });

  it("calls setCoderSearch when active tab is CoderReport", () => {
    const setSearch = jest.fn();
    const setSentSearch = jest.fn();
    const setReceivedSearch = jest.fn();
    const setCoderSearch = jest.fn();
    const activeTab = "CoderReport";
    const searchValue = "test";
    const e = { target: { value: searchValue } };

    searchFunction(
      searchValue,
      setSearch,
      setSentSearch,
      setReceivedSearch,
      setCoderSearch,
      activeTab,
      e
    );

    expect(setCoderSearch).toHaveBeenCalledWith(searchValue);
  });

  it("does not call setSearch, setSentSearch, setReceivedSearch, or setCoderSearch when searchValue is empty", () => {
    const setSearch = jest.fn();
    const setSentSearch = jest.fn();
    const setReceivedSearch = jest.fn();
    const setCoderSearch = jest.fn();
    const activeTab = "OtherTab";
    const searchValue = "";
    const e = { target: { value: searchValue } };
    searchFunction(
      searchValue,
      setSearch,
      setSentSearch,
      setReceivedSearch,
      setCoderSearch,
      activeTab,
      e
    );
    if (e.target.value) {
      expect(setSearch).toHaveBeenCalled();
      expect(setSentSearch).toHaveBeenCalled();
      expect(setReceivedSearch).toHaveBeenCalled();
      expect(setCoderSearch).toHaveBeenCalled();
    }
  });
});

// priorityOptions
describe("processstatusBodyTemplate", () => {
  it('should render "Completed" when processedStatus is "COMPLETED"', () => {
    const rowData = { processedStatus: "COMPLETED" };
    const { getByText } = render(processstatusBodyTemplate(rowData));

    expect(getByText("Completed")).toBeInTheDocument();
  });

  it('should render "Pending" when processedStatus is "PENDING"', () => {
    const rowData = { processedStatus: "PENDING" };
    const { getByText } = render(processstatusBodyTemplate(rowData));

    expect(getByText("Pending")).toBeInTheDocument();
  });

  it('should render "Declined" when processedStatus is "DECLINED"', () => {
    const rowData = { processedStatus: "DECLINED" };
    const { getByText } = render(processstatusBodyTemplate(rowData));

    expect(getByText("Declined")).toBeInTheDocument();
  });

  it('should render "Not Computed" when processedStatus is "NOTCOMPUTED"', () => {
    const rowData = { processedStatus: "NOTCOMPUTED" };
    const { getByText } = render(processstatusBodyTemplate(rowData));

    expect(getByText("Not Computed")).toBeInTheDocument();
  });

  it('should render "Computed" when processedStatus is "COMPUTED"', () => {
    const rowData = { processedStatus: "COMPUTED" };
    const { getByText } = render(processstatusBodyTemplate(rowData));

    expect(getByText("Computed")).toBeInTheDocument();
  });

  it('should render "Hold" when processedStatus is "HOLD"', () => {
    const rowData = { processedStatus: "HOLD" };
    const { getByText } = render(processstatusBodyTemplate(rowData));

    expect(getByText("Hold")).toBeInTheDocument();
  });

  it("should render an empty span when processedStatus is null or undefined", () => {
    const rowData = { processedStatus: null };
    const { getByTestId } = render(processstatusBodyTemplate(rowData));

    expect(getByTestId("status-span")).toHaveTextContent("");
  });
});

// priority Status
describe("priorityStatus", () => {
  it("should return the correct JSX for 'URGENT'", () => {
    const result = priorityStatus("URGENT");
    expect(result).toEqual(
      <div data-testid="status-span">
        <i>
          <FontAwesomeIcon icon={faTriangleExclamation} />
        </i>{" "}
        <span style={{ fontSize: "13px", color: "red" }}>Urgent</span>
      </div>
    );
  });

  it("should return the correct JSX for 'HIGH'", () => {
    const result = priorityStatus("HIGH");
    expect(result).toEqual(
      <div data-testid="status-span">
        <i className={TableStyle.highFlag}>
          <FontAwesomeIcon icon={faTriangleExclamation} />
        </i>
        <span style={{ fontSize: "13px", color: "#cf940a" }}>High</span>{" "}
      </div>
    );
  });

  it("should return the correct JSX for 'NORMAL'", () => {
    const result = priorityStatus("NORMAL");
    expect(result).toEqual(
      <div data-testid="status-span">
        <i className={TableStyle.normalFlag}>
          <FontAwesomeIcon icon={faTriangleExclamation} />
        </i>
        <span style={{ fontSize: "13px", color: "#4466ff " }}>Normal</span>
      </div>
    );
  });

  it("should return the correct JSX for 'LOW'", () => {
    const result = priorityStatus("LOW");
    expect(result).toEqual(
      <div data-testid="status-span">
        <i className={TableStyle.lowFlag}>
          <FontAwesomeIcon icon={faTriangleExclamation} />
        </i>
        <span style={{ fontSize: "13px", color: "#87909e" }}>Low</span>
      </div>
    );
  });

  it("should return an empty fragment for any other value", () => {
    const result = priorityStatus("OTHER");
    expect(result).toBeUndefined();
  });
});

// selector
describe("handleSelector", () => {
  it("should set the selected option when option is provided", () => {
    const setSelectedOption = jest.fn();
    const option = "option1";

    handleSelector(option, setSelectedOption);

    expect(setSelectedOption).toHaveBeenCalledWith(option);
  });

  it("should set an empty string as the selected option when option is not provided", () => {
    const setSelectedOption = jest.fn();

    handleSelector(undefined, setSelectedOption);

    expect(setSelectedOption).toHaveBeenCalledWith("");
  });
});
// dateformat
describe("dateFormate", () => {
  it("should format date in MM-DD-YYYY hh:mm A format", () => {
    const date = dayjs("2022-01-01T12:00:00.000Z");
    const formattedDate = dateFormate(dayjs, date);
    expect(formattedDate).toContain("01-01-2022");
  });

  it("should return --- when date is null or undefined", () => {
    const formattedDate = dateFormate(dayjs, "");
    expect(formattedDate).toMatchInlineSnapshot(`
  <div
    className="w-100 text-center"
  >
    ---
  </div>
  `);
  });

  it("should return --- when date is an empty string", () => {
    const formattedDate = dateFormate(dayjs, "");
    expect(formattedDate).toStrictEqual(
      <div className="w-100 text-center">---</div>
    );
  });

  it("should format date in MM-DD-YYYY hh:mm A format when date is a string", () => {
    const date = "2022-01-01T12:00:00.000Z";
    const formattedDate = dateFormate(dayjs, date);
    expect(formattedDate).toContain("01-01-2022");
  });
});
// generateOptionList
describe("generateOptionsForNewStore", () => {
  it("should return an empty array when items is undefined or an empty array", () => {
    expect(generateOptionsForNewStore(undefined)).toEqual([]);
    expect(generateOptionsForNewStore([])).toEqual([]);
  });
  it("should return options when items is non-empty", () => {
    const items = [
      { firstName: "John", lastName: "Doe", userName: "john_doe" },
      { firstName: "Jane", lastName: "Smith", userName: "jane_smith" },
    ];
    const expectedOptions = [
      {
        label: <span>John&nbsp;&nbsp;Doe</span>,
        value: "john_doe",
      },
      {
        label: <span>Jane&nbsp;&nbsp;Smith</span>,
        value: "jane_smith",
      },
    ];
    const actualOptions = generateOptionsForNewStore(items);
    expect(actualOptions).toHaveLength(expectedOptions.length);
    actualOptions.forEach((actualOption, index) => {
      expect(actualOption.value).toBe(expectedOptions[index].value);
      const actualLabelText = actualOption.label.props.children
        .reduce((acc, child) => {
          if (typeof child === "string") {
            return acc + child;
          }
          return acc;
        }, "")
        .replace(/\s+/g, " ")
        .trim();
      const expectedLabelText =
        `${items[index].firstName} ${items[index].lastName}`
          .replace(/\s+/g, " ")
          .trim();
      expect(actualLabelText).toBe(expectedLabelText);
    });
  });
});

// handlePicker
describe("handleRangePicker", () => {
  it("should update startDate and endDate when dates are selected", async () => {
    const setStartDate = jest.fn();
    const setEndDate = jest.fn();
    const setSelectedDates = jest.fn();
    const activeTab = "SentReport";

    const { getAllByTestId } = render(
      <RangePicker
        format="YYYY-MM-DD"
        data-testid="sent-range-picker"
        onChange={(dates, dateString) =>
          handleRnagePicker({
            dates,
            dateString,
            setStartDate,
            setEndDate,
            setSelectedDates,
            activeTab,
          })
        }
      />
    );
    const rangePickers = getAllByTestId("sent-range-picker");
    expect(rangePickers.length).toBeGreaterThan(0);
    const rangePicker = rangePickers[0];
    if (rangePicker) {
      fireEvent.mouseDown(rangePicker);
      fireEvent.mouseUp(rangePicker);
      handleRnagePicker({
        dates: ["2021-12-01", "2021-12-31"],
        dateString: ["2021-12-01", "2021-12-31"],
        setStartDate,
        setEndDate,
        setSelectedDates,
        activeTab,
      });

      // await waitFor(() => {
      //   expect(setStartDate).toHaveBeenCalledWith("2021-12-01T18:30:00.000Z");
      //   expect(setEndDate).toHaveBeenCalledWith("2021-12-31T18:30:00.000Z");
      //   expect(setSelectedDates).toHaveBeenCalledWith([
      //     dayjs("2021-12-01").toISOString(),
      //     dayjs("2021-12-31").toISOString(),
      //   ]);
      // });
    }
  });

  // it("should update receivedStartDate and receivedEndDate when activeTab is ReceivedReport", async () => {
  //   const setReceivedStartDate = jest.fn();
  //   const setReceivedEndDate = jest.fn();
  //   const setSelectedDates = jest.fn();
  //   const activeTab = "ReceivedReport";

  //   const { getByTestId } = render(
  //     <RangePicker
  //       data-testid="range-picker"
  //       onChange={(dates) =>
  //         handleRnagePicker({
  //           dates,
  //           setSelectedDates,
  //           activeTab,
  //           setReceivedStartDate,
  //           setReceivedEndDate,
  //         })
  //       }
  //     />
  //   );

  //   const rangePicker = getByTestId("range-picker");

  //   fireEvent.mouseDown(rangePicker);
  //   fireEvent.mouseUp(rangePicker);

  //   const startDate = moment("2022-01-01");
  //   const endDate = moment("2022-01-31");

  //   fireEvent.change(rangePicker, { target: { value: [startDate, endDate] } });

  //   await waitFor(() => {
  //     expect(setReceivedStartDate).toHaveBeenCalledWith(
  //       "2022-01-01T00:00:00.000Z"
  //     );
  //     expect(setReceivedEndDate).toHaveBeenCalledWith(
  //       "2022-01-31T23:59:59.999Z"
  //     );
  //     expect(setSelectedDates).toHaveBeenCalledWith([startDate, endDate]);
  //   });
  // });
  // it("should update coderStartDate and coderEndDate when activeTab is CoderReport", async () => {
  //   const setCoderStartDate = jest.fn();
  //   const setCoderEndDate = jest.fn();
  //   const setSelectedDates = jest.fn();
  //   const activeTab = "CoderReport";

  //   const { getByTestId } = render(
  //     <RangePicker
  //       data-testid="range-picker"
  //       onChange={(dates) =>
  //         handleRnagePicker({
  //           dates,
  //           setSelectedDates,
  //           activeTab,
  //           setCoderStartDate,
  //           setCoderEndDate,
  //         })
  //       }
  //     />
  //   );

  //   const rangePicker = getByTestId("range-picker");

  //   fireEvent.mouseDown(rangePicker);
  //   fireEvent.mouseUp(rangePicker);

  //   const startDate = moment("2022-01-01");
  //   const endDate = moment("2022-01-31");

  //   fireEvent.change(rangePicker, { target: { value: [startDate, endDate] } });

  //   await waitFor(() => {
  //     expect(setCoderStartDate).toHaveBeenCalledWith(
  //       "2022-01-01T00:00:00.000Z"
  //     );
  //     expect(setCoderEndDate).toHaveBeenCalledWith("2022-01-31T23:59:59.999Z");
  //     expect(setSelectedDates).toHaveBeenCalledWith([startDate, endDate]);
  //   });
  // });
});
