import React, { useState, useEffect } from "react";
import { Tooltip } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { InputText } from "primereact/inputtext";
import { Paginator } from "primereact/paginator";
import { useSelector, useDispatch, connect } from "react-redux";
import Image from "next/image";
import visitStyles from "../../../../../styles/visitdata.module.css";
import LoadingSpinner from "../../../../../components/loadingSpinner";
// import { getWorkListFilter } from "../../../../../store/actions/l2Action/AuditorAction";
import AuditedTrack from "../../../../../../src/images/trackingImages/AuditedTrack.png";
import NotAudited from "../../../../../../src/images/trackingImages/NotAuditedTrack.png";
import AuditHold from "../../../../../../src/images/trackingImages/AuditHoldTrack.png";
import ReAudit from "../../../../../../src/images/trackingImages/reAuditTrack.png";
import AuditPending from "../../../../../../src/images/trackingImages/AuditPending.png";
import AuditeDeclineTrack from "../../../../../../src/images/trackingImages/AuditDeclined.png";
import Legends from "../../../../../components/legends";
import MyWorkQueueFilter from "../MyWorkQueueFilter";
import { actions as workflowActions } from "../../../../../stores/supervisor/auditedQueue";

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

const SupervisorWorkList = ({
  result,
  setWorkListPatientId,
  getWorkListFilter,
  setIsModalComments,
}) => {
  const dispatch = useDispatch();
  // const result = useSelector((state) => state.AuditWork.workListFilter);
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
  const [selectCompletedPicker, setSelectCompletedPicker] = useState("");
  const [selectComputedPicker, setSelectComputedPicker] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const getWorkList = async () => {
    setPatientList(result?.data?.response?.content);
    setTotalElements(result?.data?.response?.totalElements);
    setFilterDataLoading(false);
  };

  const filterChangePatientId = async (e) => {
    setSearch(e.target.value);
  };
  const onPageChange = async (e) => {
    setPaginationFirst(e.first);
    setPageNo(e.page);
    setFilterModalOpen(false);
  };

  const getPatientListToDetails = (id) => {
    setWorkListPatientId(id);
    setIsModalComments(false);
    setFilterModalOpen(false);
  };

  const statusOptions = [
    { label: "ALL", value: "" },
    { label: "AUDITED", value: "AUDITED" },
    { label: "AUDIT_PENDING", value: "AUDIT_PENDING" },
    { label: "RE AUDIT", value: "REAUDIT" },
    { label: "AUDIT HOLD", value: "AUDITHOLD" },
    { label: "AUDIT DECLINED", value: "AUDIT_DECLINED" },
  ];

  const processstatusBodyTemplate = (rowData) => {
    const declinedDataFromAudit = extractLatestData(
      rowData?.auditDeclinedNotes
    );

    const declinedDataFromDeclined = extractLatestData(rowData?.declinedNotes);

    const declinedData = declinedDataFromAudit || declinedDataFromDeclined;

    switch (rowData.auditedStatus) {
      case "AUDIT_PENDING":
        return (
          <Tooltip placement="bottom" title="Status: AUDIT PENDING">
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image
                src={AuditPending}
                style={{ height: "25px", width: "25px" }}
              />
            </div>
          </Tooltip>
        );

      case "DECLINED":
        return (
          <div className="patient-status" style={{ textAlign: "center" }}>
            <span className={`badge failed-text`} style={{ color: "red" }}>
              Declined
            </span>
          </div>
        );

      case "AUDITHOLD":
        return (
          <Tooltip placement="bottom" title="Status: AUDIT HOLD">
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image
                src={AuditHold}
                style={{ height: "25px", width: "25px" }}
              />
            </div>
          </Tooltip>
        );
      case "REAUDIT":
        return (
          <Tooltip placement="bottom" title="Status: REAUDIT">
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image src={ReAudit} style={{ height: "25px", width: "25px" }} />
            </div>
          </Tooltip>
        );
      case "AUDITED":
        return (
          <Tooltip placement="bottom" title="Status: AUDITED">
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image
                src={AuditedTrack}
                style={{ height: "25px", width: "25px" }}
              />
            </div>
          </Tooltip>
        );
      case "AUDIT_DECLINED":
        return (
          <Tooltip
            placement="bottom"
            title="Status: AUDIT DECLINED"
            content={`Reason: ${declinedData ? declinedData : "---"}`}
          >
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image
                src={AuditeDeclineTrack}
                style={{ height: "25px", width: "25px" }}
              />
            </div>
          </Tooltip>
        );
      case "AUDITED":
        return (
          <div className="patient-status" style={{ textAlign: "center" }}>
            <Image
              src={AuditedTrack}
              style={{ height: "25px", width: "25px" }}
            />
          </div>
        );
      case "NOT_AUDIT":
        return (
          <Tooltip placement="bottom" title=" Status: NOT AUDIT">
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image
                src={NotAudited}
                style={{ height: "25px", width: "25px" }}
              />
            </div>
          </Tooltip>
        );
      case null:
        return (
          <div className="patient-status" style={{ textAlign: "center" }}>
            ---
          </div>
        );
    }
  };

  const bullets = [
    {
      color: "#377880",
      name: "AUDITED",
    },
    {
      color: "#c33772",
      name: "AUDIT PENDING",
    },
    {
      color: "#964B00",
      name: "RE AUDIT",
    },
    {
      color: "#CE9900",
      name: "AUDIT HOLD",
    },
    {
      color: "#C21807",
      name: "AUDIT DECLINED",
    },
  ];

  useEffect(() => {
    getWorkList();
  }, [result, pageNo]);

  useEffect(() => {
    setFilterDataLoading(true);
    const data = {
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
    };

    getWorkListFilter({ data: data });
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

        <div className="col-xl-3">
          <div className={visitStyles.content}>
            <MyWorkQueueFilter
              setComputedStartDate={setCompletedStartDate}
              setComputedEndDate={setCompletedEndDate}
              setCompletedStartDate={setComputedStartDate}
              setCompletedEndDate={setComputedEndDate}
              completedStartDate={computedStartDate}
              completedEndDate={computedEndDate}
              computedStartDate={completedStartDate}
              computedEndDate={completedEndDate}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              statusOptions={statusOptions}
              selectCompletedPicker={selectCompletedPicker}
              setSelectCompletedPicker={setSelectCompletedPicker}
              selectComputedPicker={selectComputedPicker}
              setSelectComputedPicker={setSelectComputedPicker}
              datePicker1Lable="Audit Due Date"
              datePicker2Lable="Audited Date"
              filterModalOpen={filterModalOpen}
              setFilterModalOpen={setFilterModalOpen}
            />
          </div>
        </div>
        {!filterDataLoading ? (
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
const enhancer = connect(
  (state) => ({
    result: state?.supervisor?.audited?.filteredList,
  }),
  {
    getWorkListFilter: workflowActions.getWorkListFilter,
  }
);
export default enhancer(SupervisorWorkList);
