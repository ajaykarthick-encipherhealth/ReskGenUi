import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { InputText } from "primereact/inputtext";
import { Paginator } from "primereact/paginator";
import visitStyles from "../../../../../styles/visitdata.module.css";
import LoadingSpinner from "../../../../../components/loadingSpinner";
import MyWorkQueueFilter from "../MyWorkQueueFilter";
import { actions as patientsActions } from "../../../../../stores/patient/details";
import { connect } from "react-redux";
import { truncateString } from "../function/ReusableFunctions";
import TableSkeleton from "../../../../skeleton/table";

const ReviwerWorkList = ({
  localUserId,
  setWorkListPatientId,
  setIsModalComments,
  patientListFilter,
  getPatientListToDetails,
}) => {
  const [patientList, setPatientList] = useState([]);
  const [processedStatus, setProcessedStatus] = useState("ALL");
  const [searchtext, setSearchtext] = useState("");
  const [dueDateStart, setDueDateStart] = useState("");
  const [dueDateEnd, setDueDateEnd] = useState("");
  const [processedStart, setProcessedStart] = useState("");
  const [processedEnd, setProcessedEnd] = useState("");
  const [pageNo, setPageNo] = useState(0);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [totalElements, setTotalElements] = useState(10);
  const [filterDataLoading, setFilterDataLoading] = useState(true);
  const [selectCompletedPicker, setSelectCompletedPicker] = useState("");
  const [selectComputedPicker, setSelectComputedPicker] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const getWorkList = async () => {
    var result = await patientListFilter(
      localUserId,
      processedStatus != "ALL" ? processedStatus : "",
      searchtext,
      dueDateStart,
      dueDateEnd,
      processedStart,
      processedEnd,
      pageNo
    );
    setPatientList(result?.response?.patientDTOList?.content);
    setTotalElements(result?.response?.patientDTOList?.totalElements);
    setFilterDataLoading(false);
  };

  const filterChangePatientId = async (e) => {
    setSearchtext(e.target.value);
  };
  const onPageChange = async (e) => {
    setPaginationFirst(e.first);
    setPageNo(e.page);
    setFilterModalOpen(false);
  };
  // const getPatientListToDetails = (id) => {
  //   setWorkListPatientId(id);
  //   setFilterModalOpen(false);
  //   setIsModalComments(false);
  // };
  const statuses = [
    { label: "ALL", value: "ALL" },
    { label: "PENDING", value: "PENDING" },
    { label: "COMPLETED", value: "COMPLETED" },
    { label: "HOLD", value: "HOLD" },
    { label: "DECLINED", value: "DECLINED" },
  ];

  useEffect(() => {
    setFilterDataLoading(true);
    getWorkList();
  }, [
    processedStatus,
    searchtext,
    dueDateStart,
    dueDateEnd,
    processedStart,
    processedEnd,
    pageNo,
  ]);

  return (
    <>
      <div className={`row ${visitStyles.patientListHead}`}>
        <div
          className={visitStyles.flags}
          style={{ marginTop: "15px", marginBottom: "20px" }}
        >
          <div className={visitStyles.flags}>
            <span
              className={visitStyles.completed}
              style={{ background: "#3a9b94 !important" }}
            ></span>
            <span className={visitStyles.flagCodes}>Completed</span>
          </div>
          <div className={visitStyles.flags}>
            <span className={visitStyles.pending}></span>
            <span className={visitStyles.flagCodes}>Pending</span>
          </div>
          <div className={visitStyles.flags}>
            <span className={visitStyles.hold}></span>
            <span className={visitStyles.flagCodes}>Hold</span>
          </div>
          <div className={visitStyles.flags}>
            <span className={visitStyles.declined}></span>
            <span className={visitStyles.flagCodes}>Declined</span>
          </div>
        </div>
        <div className="col-9">
          <div class="form-group has-search">
            <FontAwesomeIcon
              className="fa fa-search form-control-feedback"
              icon={faSearch}
            />
            <InputText
              type="text"
              onChange={(e) => filterChangePatientId(e)}
              className="form-control input-form-control"
              placeholder="Search"
              maxLength={25}
              onKeyDown={(e) => {
                // Prevent input of backslash ("\")
                if (e.key === "\\") {
                  e.preventDefault();
                }
              }}
            />
          </div>
        </div>

        <div className="col-3">
          <div className={visitStyles.content}>
            <MyWorkQueueFilter
              setComputedStartDate={setProcessedStart}
              setComputedEndDate={setProcessedEnd}
              setCompletedStartDate={setDueDateStart}
              setCompletedEndDate={setDueDateEnd}
              completedStartDate={dueDateStart}
              completedEndDate={dueDateEnd}
              computedStartDate={processedStart}
              computedEndDate={processedEnd}
              selectedOption={processedStatus}
              setSelectedOption={setProcessedStatus}
              statusOptions={statuses}
              selectCompletedPicker={selectCompletedPicker}
              setSelectCompletedPicker={setSelectCompletedPicker}
              selectComputedPicker={selectComputedPicker}
              setSelectComputedPicker={setSelectComputedPicker}
              datePicker1Lable="Due Date"
              datePicker2Lable="Completed Date"
              filterModalOpen={filterModalOpen}
              setFilterModalOpen={setFilterModalOpen}
            />
          </div>
        </div>
        {!filterDataLoading ? (
          <>
            <div id="dosSelect" className={visitStyles.patientListHead}>
              <ul
                id="dosSelect"
                className={`${visitStyles.patientDetailsHead}`}
              >
                {patientList?.map((data, index) => (
                  <li
                    id="dosSelect"
                    className={`${visitStyles.nameList} ${visitStyles.patientList}`}
                    key={index}
                    onClick={() =>
                      getPatientListToDetails(data.patientId, true)
                    }
                  >
                    <span>
                      <span id="dosSelect">
                        {truncateString(data.patientId, 35)}
                      </span>{" "}
                      <span>-</span>
                      <span id="dosSelect">{data.patientName}</span>
                    </span>
                    {data.processedStatus == "COMPLETED" ? (
                      <span
                        id="dosSelect"
                        className={visitStyles.completed}
                        style={{
                          background: "#3a9b94 !important",
                        }}
                      ></span>
                    ) : data.processedStatus == "PENDING" ||
                      data.processedStatus == "COMPUTED" ? (
                      <span
                        id="dosSelect"
                        className={visitStyles.pending}
                      ></span>
                    ) : data.processedStatus == "HOLD" ? (
                      <span id="dosSelect" className={visitStyles.hold}></span>
                    ) : data.processedStatus == "DECLINED" ? (
                      <span
                        id="dosSelect"
                        className={visitStyles.declined}
                      ></span>
                    ) : null}
                  </li>
                ))}
                {patientList?.length == 0 ? (
                  <h5 className="text-center">NO DATA</h5>
                ) : null}
              </ul>
            </div>
          </>
        ) : (
          <div className="mt-2">
             <TableSkeleton/>
          </div>
        )}
      </div>
      <div className={visitStyles.paginationContiner}>
        <div className="patient-filte-page">
          <Paginator
             className="paginator-workqueue"
            first={paginationFirst}
            rows={15}
            totalRecords={totalElements}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </>
  );
};

const connector = connect((state) => ({}), {
  patientListFilter: patientsActions.getPatientListFilter,
});
export default connector(ReviwerWorkList);
