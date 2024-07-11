import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { InputText } from "primereact/inputtext";
import { Paginator } from "primereact/paginator";
import { useSelector, useDispatch } from "react-redux";
import { getPatients } from "../../../../../store/actions/adminAction/patientsActions";
import visitStyles from "../../../../../styles/visitdata.module.css";
import LoadingSpinner from "../../../../../components/loadingSpinner";
import Legends from "../../../../../components/legends";
import MyWorkQueueFilter from "../MyWorkQueueFilter";

export function extractLatestData(notes) {
  let declinedData;
  if (notes && typeof notes === "object") {
    const entries = Object.entries(notes);
    const latestKey = Math.max(...entries.map(([key, value]) => parseInt(key)));
    entries.forEach(([key, value]) => {
      if (parseInt(key) === latestKey) {
        declinedData = value;
      }
    });
  }

  return declinedData;
}

const AdminWorkList = ({
  localUserId,
  setWorkListPatientId,
  setIsModalComments,
}) => {
  const dispatch = useDispatch();
  const result = useSelector((state) => state.adminList.patients);
  console.log(result);
  const [patientList, setPatientList] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [totalElements, setTotalElements] = useState(10);
  const [filterDataLoading, setFilterDataLoading] = useState(false);
  const [patientSortOrder, setPatientSortOrder] = useState("ASC");
  const [sort, setSort] = useState({ sortDir: "", sortField: "" });
  const [selCreatedBy, setSelCreatedBy] = useState("");
  const [selAllocatedBy, setSelAllocatedBy] = useState("");
  const [completedStartDate, setCompletedStartDate] = useState("");
  const [completedEndDate, setCompletedEndDate] = useState("");
  const [computedStartDate, setComputedStartDate] = useState("");
  const [computedEndDate, setComputedEndDate] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [search, setSearch] = useState("");
  const [closeSlider, setCloseSlider] = useState(true);
  const [selAllocatedTo, setSelAllocatedTo] = useState("");
  const [selectCompletedPicker, setSelectCompletedPicker] = useState("");
  const [selectComputedPicker, setSelectComputedPicker] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const getWorkList = async () => {
    setPatientList(result?.response?.content);
    setTotalElements(result?.response?.totalElements);
    setFilterDataLoading(false);
  };

  const filterChangePatientId = async (e) => {
    setSearch(e.target.value);
  };
  const onPageChange = async (e) => {
    setPaginationFirst(e.first);
    setPageNo(e.page);
    setFilterModalOpen(false)
  };

  const getPatientListToDetails = (id) => {
    setWorkListPatientId(id);
    setIsModalComments(false);
    setFilterModalOpen(false)
  };

  const statusOptions = [
    { label: "ALL", value: "" },
    { label: "PROCESSING", value: "1", status: 1 },
    { label: "COMPUTED", value: "2", status: 2 },
    { label: "FAILED", value: "3", status: 3 },
    { label: "NOT COMPUTED", value: "0", status: 0 },
  ];

  const bullets = [
    {
      color: "#34ace8",
      name: "Computed",
    },
    {
      color: "#452b90",
      name: "Processing",
    },
    {
      color: "#be3144",
      name: "Not Computed",
    },
    {
      color: "#e88d8d",
      name: "Failed",
    },
  ];

  const processstatusBodyTemplate = (rowData) => {
    const isFinished =
      patientList?.length > 0 &&
      patientList?.find(
        (data) =>
          data?.patientId === rowData?.patientId &&
          data?.processStageChart === "FINISHED"
      ) !== undefined;

    const rowStatus =
      rowData?.computing === 0 && patientList?.length === 0
        ? "Not Computed"
        : rowData?.computing == 1
        ? "Processing"
        : isFinished || rowData?.computing == 2
        ? "Computed"
        : rowData?.computing == 3
        ? "Failed"
        : "Not Computed";
    return (
      <div className="patient-status">
        <div
          className={visitStyles.roleStyleWQ}
          style={{
            backgroundColor:
              rowStatus === "Computed"
                ? " #34ace8"
                : rowStatus === "Processing"
                ? "#452b90"
                : rowStatus === "Failed"
                ? "#e88d8d"
                : "#be3144",
          }}
        ></div>
      </div>
    );
  };

  useEffect(() => {
    setFilterDataLoading(true);
    getWorkList();
  }, [result, pageNo]);

  useEffect(() => {
    setFilterDataLoading(true);
    dispatch(
      getPatients(
        pageNo,
        computedStartDate,
        computedEndDate,
        selectedOption,
        search,
        completedStartDate,
        completedEndDate,
        selAllocatedTo,
        selAllocatedBy,
        selCreatedBy,
        sort
      )
    );
  }, [
    pageNo,
    computedStartDate,
    computedEndDate,
    selectedOption,
    search,
    completedStartDate,
    completedEndDate,
    patientSortOrder,
    selAllocatedBy,
    sort,
    selCreatedBy,
    closeSlider,
  ]);

  return (
    <>
      <div className={`row ${visitStyles.patientListHead}`}>
        <div
          className={visitStyles.flags}
          style={{ marginTop: "15px", marginBottom: "20px" }}
        >
          <Legends bullets={bullets} display="ruby" padding="0 0px 10px 0" />
        </div>
        <div className="col-xl-9">
          <div class="form-group has-search">
            <FontAwesomeIcon
              className="fa fa-search form-control-feedback"
              icon={faSearch}
            />
            <InputText
              type="text"
              onChange={(e) => filterChangePatientId(e)}
              className="form-control new-form-control"
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

        <div className="col-xl-3">
          <div className={visitStyles.content}>
            <MyWorkQueueFilter
              setComputedStartDate={setComputedStartDate}
              setComputedEndDate={setComputedEndDate}
              setCompletedStartDate={setCompletedStartDate}
              setCompletedEndDate={setCompletedEndDate}
              completedStartDate={completedStartDate}
              completedEndDate={completedEndDate}
              computedStartDate={computedStartDate}
              computedEndDate={computedEndDate}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              statusOptions={statusOptions}
              selectCompletedPicker={selectCompletedPicker}
              setSelectCompletedPicker={setSelectCompletedPicker}
              selectComputedPicker={selectComputedPicker}
              setSelectComputedPicker={setSelectComputedPicker}
              datePicker1Lable="Created Date"
              datePicker2Lable="Completed Date"
              filterModalOpen={filterModalOpen}
              setFilterModalOpen={setFilterModalOpen}
            />
          </div>
        </div>
        {result?.response?.content && !filterDataLoading ? (
          <>
            <div className={visitStyles.patientListHead}>
              <ul className={`${visitStyles.patientDetailsHead}`}>
                {patientList?.map((data, index) => (
                  <li
                    className={`${visitStyles.nameList} ${visitStyles.patientList}`}
                    key={index}
                    onClick={() => getPatientListToDetails(data.patientId)}
                  >
                    {data.patientId} - {data.patientName}
                    {processstatusBodyTemplate(data)}
                  </li>
                ))}
                {patientList?.length == 0 ? (
                  <h5 className="text-center">NO DATA</h5>
                ) : null}
              </ul>
            </div>
          </>
        ) : (
          <div
            className={`${visitStyles.userDetailsCard} ${visitStyles.loadingContainer}`}
          >
            <LoadingSpinner />
          </div>
        )}
      </div>
      <div className={visitStyles.paginationContiner}>
        <div className="patient-filte-page">
          <Paginator
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

export default AdminWorkList;
