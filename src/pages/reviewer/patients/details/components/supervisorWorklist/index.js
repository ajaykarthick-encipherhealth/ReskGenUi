import React, { useState, useEffect } from "react";
import { Empty, Popover, Tooltip, DatePicker } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faSearch } from "@fortawesome/free-solid-svg-icons";
import { InputText } from "primereact/inputtext";
import { Paginator } from "primereact/paginator";
import { useSelector, useDispatch } from "react-redux";
import moment, { months } from "moment";
import Image from "next/image";
import { patientListFilter } from "../../../../../../services/PatientsListSevice";
import visitStyles from "../../../../../../styles/visitdata.module.css";
import LoadingSpinner from "../../../../../../components/loadingSpinner";
import { IMAGES, SVGICON } from "../../../../../../jsx/constant/theme";
import { getWorkListFilter } from "../../../../../../store/actions/l2Action/AuditorAction";
import AuditedTrack from "../../../../../../../src/images/trackingImages/AuditedTrack.png";
import NotAudited from "../../../../../../../src/images/trackingImages/NotAuditedTrack.png";
import AuditHold from "../../../../../../../src/images/trackingImages/AuditHoldTrack.png";
import ReAudit from "../../../../../../../src/images/trackingImages/reAuditTrack.png";
import AuditPending from "../../../../../../../src/images/trackingImages/AuditPending.png";
import AuditeDeclineTrack from "../../../../../../../src/images/trackingImages/AuditDeclined.png";
import Legends from "../../../../../../components/legends";

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

const SupervisorWorkList = ({ localUserId, setWorkListPatientId }) => {
  const dispatch = useDispatch();
  const result = useSelector((state) => state.AuditWork.workListFilter);
  const { RangePicker } = DatePicker;
  const [showIcons, setShowIcons] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [openPicker, setOpenPicker] = useState(false);
  const [openPicker2, setOpenPicker2] = useState(false);
  const [patientList, setPatientList] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [totalElements, setTotalElements] = useState(10);
  const [filterDataLoading, setFilterDataLoading] = useState(true);
  const [patientSortOrder, setPatientSortOrder] = useState("ASC");
  const [sort, setSort] = useState({ sortDir: "", sortField: "" });
  const [selCreatedBy, setSelCreatedBy] = useState("");
  const [selAllocatedBy, setSelAllocatedBy] = useState("");
  const [completedStartDate, setCompletedStartDate] = useState("");
  const [completedEndDate, setCompletedEndDate] = useState("");
  const [computedStartDate, setComputedStartDate] = useState("");
  const [computedEndDate, setComputedEndDate] = useState("");
  const [selectedOption, SetSelectedOption] = useState("");
  const [search, setSearch] = useState("");
  const [closeSlider, setCloseSlider] = useState(true);

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
  };

  const handleFilterClick = () => {
    setShowIcons(!showIcons);
  };
  const closeFilterIcons = async () => {
    setShowIcons(false);
    setOpenPicker(false);
    setOpenPicker2(false);
    setCloseSlider(false);
  };
  const handleShowCard = () => {
    setShowCard(!showCard);
    setShowCard(true);
  };

  const getPatientListToDetails = (id) => {
    setWorkListPatientId(id);
  };

  const handleDatePickerChange = async (dateString) => {
    let convertStartDate =
      moment(dateString[0]).format("YYYY-MM-DD") + "T00:00:00.000Z";
    let convertEndDate =
      moment.utc(dateString[1]).format("YYYY-MM-DD") + "T23:59:59.000Z";
    setComputedStartDate(convertStartDate);
    setComputedEndDate(convertEndDate);
    setOpenPicker(false);
  };

  const handleChangeprocessedDate = async (dateString) => {
    let convertStartDate =
      moment(dateString[0]).format("YYYY-MM-DD") + "T00:00:00.000Z";
    let convertEndDate =
      moment.utc(dateString[1]).format("YYYY-MM-DD") + "T23:59:59.000Z";
    setCompletedStartDate(convertStartDate);
    setCompletedEndDate(convertEndDate);
    setOpenPicker2(false);
  };
  const getFiltePatientListStatus = async (value) => {
    SetSelectedOption(value);
    setOpenPicker(false);
    setOpenPicker2(false);
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
      color: "#E28213",
      name: "AUDIT PENDING",
    },
    {
      color: "#964B00",
      name: "RE AUDIT",
    },
    {
      color: "red",
      name: "DECLINED",
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
    const datas = {
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

    dispatch(getWorkListFilter(datas));
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
            />
            <RangePicker
              open={openPicker}
              onChange={(dates, dateStrings) => {
                handleDatePickerChange(dateStrings);
              }}
              suffixIcon={false}
              className={visitStyles.datepicker}
            />
            <RangePicker
              open={openPicker2}
              onChange={(dates, dateStrings) => {
                handleChangeprocessedDate(dateStrings);
              }}
              suffixIcon={false}
              className={visitStyles.datepicker}
            />
          </div>
        </div>

        <div className="col-xl-3">
          <div className={visitStyles.content}>
            <span
              className={visitStyles.circleCard}
              onClick={handleFilterClick}
            >
              <span></span>
              {showIcons ? (
                <FontAwesomeIcon
                  icon={faClose}
                  height={30}
                  width={30}
                  color="#A20404"
                  onClick={() => {
                    closeFilterIcons(false);
                    setOpenPicker(false);
                    setOpenPicker2(false);
                  }}
                />
              ) : (
                SVGICON.filter
              )}
            </span>
            {showIcons && (
              <div className={visitStyles.iconContainer}>
                <Tooltip title="Status" placement="left">
                  <span
                    className={visitStyles.circleCard}
                    onClick={handleShowCard}
                  >
                    {SVGICON.dashboard}
                  </span>
                </Tooltip>
                <Tooltip title="Audit Due Date" placement="left">
                  <span
                    className={visitStyles.circleCard}
                    onClick={() => {
                      setOpenPicker(!openPicker);
                      setOpenPicker2(false);
                    }}
                  >
                    {SVGICON.dateIcon}
                  </span>
                </Tooltip>
                <Tooltip title="Audited Date" placement="left">
                  <span
                    className={visitStyles.circleCard}
                    onClick={() => {
                      setOpenPicker2(!openPicker2);
                      setOpenPicker(false);
                    }}
                  >
                    {SVGICON.dateIcon}
                  </span>
                </Tooltip>
              </div>
            )}
            {showCard && (
              <div
                className={visitStyles.menuCard}
                onMouseEnter={() => setShowCard(true)}
                onMouseLeave={() => setShowCard(false)}
              >
                <ul>
                  {statusOptions.map((status, index) => (
                    <li
                      onClick={() => getFiltePatientListStatus(status.value)}
                      className={visitStyles.nameList}
                      key={index}
                    >
                      {status.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        {result?.response?.content ? (
          <>
            <div className={visitStyles.patientListHead}>
              <ul className={`${visitStyles.patientDetailsHead2}`}>
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
      <div className="patient-filte-page">
        <Paginator
          first={paginationFirst}
          rows={15}
          totalRecords={totalElements}
          onPageChange={onPageChange}
        />
      </div>
    </>
  );
};

export default SupervisorWorkList;
