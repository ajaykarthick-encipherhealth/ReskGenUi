import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, DatePicker, Modal, notification, Select } from "antd";
import { faXmark, faUser } from "@fortawesome/free-solid-svg-icons";
import modalStyle from "./style.module.css";
import { useEffect, useState } from "react";
import { actions as allAction } from "../../../../../stores/tenantAdmin/patientAllocations";
import moment from "moment";
import { connect } from "react-redux";
import { actions as allActions } from "../../../../../stores/tenantAdmin/patientAllocation";

import {
  disablePastDate,
  priorityOptions,
} from "../../../../../components/headerFilters/functions";
import {
  createIdGen,
  formatDateForIndex,
  getResponePopup,
} from "../../../../../utils/reusable";
import { useRouter } from "next/router";
import { getStorage } from "../../../../../utils/storages";

const L2AllocateModal = ({
  open,
  setOpen,
  selectedRowsId,
  setSelectedRowsId,
  selectedChart,
  setSelectedChart,
  getAllocateUsers,
  getL2UsersList,
  getAllAllocationList,
  supervisorUserName,
  setSelectedUserName,
  setSelectedRows,
  id,
  viewDetailSuperisor,
}) => {
  const router = useRouter();
  const [activeCard, setActiveCard] = useState("");
  const [search, setSearch] = useState("");
  const [allocateDate, setAllocateDate] = useState("");
  const [activeEmail, setActiveEmail] = useState("");
  const [chart, setChart] = useState({
    date: null,
    completed: null,
    pending: null,
    declined: null,
    hold: null,
    allocated: null,
  });
  const [priority, setPriority] = useState([]);
  const getInitials = (firstName, lastName) => {
    const firstNameInitial = firstName?.charAt(0) || "";
    const secondNameInitial = lastName?.charAt(0) || "";
    return firstNameInitial?.toUpperCase() + secondNameInitial?.toUpperCase();
  };
  const handleChange = (value) => {
    setPriority(value);
  };
  const setAllocate = async () => {
    const response = await getAllocateUsers({
      data: {
        userId: viewDetailSuperisor?.userName,
        dueDate: formatDateForIndex({ date: allocateDate, index: 1 }),
        patientIds: selectedRowsId.map((item) => item.patientId),
        priority: priority,
      },
    });
    if (response?.status == "SUCCESS") {
      getResponePopup(response);
      getAllAllocationList()
      setAllocateDate("");
      setActiveCard("");
      setActiveEmail("");
      setSearch("");
      setPriority([]);
      setSelectedUserName([]);
      setSelectedRows([]);
      setOpen(false);
    }
  };
  const getAllCheckList = async () => {
    const response = await getL2UsersList({
      userName: viewDetailSuperisor?.userName,
    });
    if (response?.status == "SUCCESS") {
      let result = response?.response;
      setChart(result);
    }
  };


  useEffect(() => {
    getAllCheckList();
  }, [viewDetailSuperisor]);

  useEffect(() => {
    setSelectedChart(selectedRowsId);
  }, [selectedRowsId]);
  return (
    <Modal
      open={open}
      onCancel={() => {
        setOpen(false);
        setSelectedRowsId(selectedChart);
        setActiveCard("");
        setActiveEmail("");
        setSearch("");
        setAllocateDate("");
        setPriority([]);
        setSelectedUserName([]);
      }}
      title="Select User"
      footer={false}
      width={700}
      height={600}
      className="allocate_modal_container"
    >
      <div className="pe-auto" style={{ marginTop: "30px" }}>
        <div
          style={{ height: "475 !important" }}
          className={`form-control new-item-control2 my-2 p-0 ${modalStyle.listContentLargeL2}`}
        >
          <div className="d-flex justify-content-between">
            <div className="d-flex">
              <Avatar
                size={65}
                shape="square"
                style={{ backgroundColor: "#04306F" }}
              >
                {supervisorUserName?.firstName ? (
                  getInitials(
                    supervisorUserName?.firstName,
                    supervisorUserName?.lastName
                  )
                ) : (
                  <FontAwesomeIcon className="fa fa-search" icon={faUser} />
                )}
              </Avatar>
              <div className="p-3">
                <p className={`${modalStyle.listName} mb-1`}>
                  {supervisorUserName?.firstName} {supervisorUserName?.lastName}
                </p>
              </div>
            </div>
          </div>

          <div className="row px-3" style={{ paddingTop: "50px" }}>
            <div className={`col-5 ${modalStyle.activeRow1}`}>
              <span>
                Charts Selected:{" "}
                {selectedChart?.length > 0 ? selectedChart?.length : 0}
              </span>
              <div className="d-flex py-2 gap-3 align-items-center">
                <span className={`${modalStyle.title} py-3`}>Due Date</span>
                <DatePicker
                  style={{ width: "150px" }}
                  id="select-date"
                  name="select-date"
                  onChange={(date, dateS) => {
                    if (dateS) {
                      setAllocateDate(dateS);
                    } else {
                      setAllocateDate("");
                    }
                  }}
                  disabledDate={(current) => disablePastDate(current)}
                  value={allocateDate ? moment(allocateDate, "YYYY-MM-DD") : ""}
                />
              </div>
              <div className="d-flex py-1 gap-1 align-items-center">
                <span>Set Priority</span>
                <div className="antdCustomSelect">
                  <Select
                    className={modalStyle.prioritySelect}
                    options={priorityOptions}
                    placeholder="Set priority"
                    showSearch={false}
                    onChange={handleChange}
                    value={priority}
                  />
                </div>
              </div>
              <div className="d-flex my-3">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="8"
                    height="8"
                    viewBox="0 0 8 8"
                    fill="none"
                  >
                    <circle cx="4" cy="4" r="4" fill="#64B4BE" />
                  </svg>
                  <span className="p-2">Audited</span>
                </div>
                <span>{chart.audited ? chart.audited : 0}</span>
              </div>
              <div className="d-flex my-3">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="8"
                    height="8"
                    viewBox="0 0 8 8"
                    fill="none"
                  >
                    <circle cx="4" cy="4" r="4" fill="#FFB54D" />
                  </svg>
                  <span className="p-2">AuditPending</span>
                </div>
                <span>{chart.auditPending ? chart.auditPending : 0}</span>
              </div>
              <div className="d-flex my-3">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="8"
                    height="8"
                    viewBox="0 0 8 8"
                    fill="none"
                  >
                    <circle cx="4" cy="4" r="4" fill="#F4CE14" />
                  </svg>
                  <span className="p-2">AuditHold</span>
                </div>
                <span>{chart.auditHold ? chart.auditHold : 0}</span>
              </div>
              <div className="d-flex my-3">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="8"
                    height="8"
                    viewBox="0 0 8 8"
                    fill="none"
                  >
                    <circle cx="4" cy="4" r="4" fill="#C26100" />
                  </svg>
                  <span className="p-2">ReAudited</span>
                </div>
                <span>{chart.reAudited ? chart.reAudited : 0}</span>
              </div>
              <div className="d-flex my-3">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="8"
                    height="8"
                    viewBox="0 0 8 8"
                    fill="none"
                  >
                    <circle cx="4" cy="4" r="4" fill="#EB5252" />
                  </svg>
                  <span className="p-2">AuditDeclined</span>
                </div>
                <span>{chart.declined ? chart.declined : 0}</span>
              </div>
            </div>
            <div className={`col-7 ${modalStyle.activeRow1}`}>
              <span className={`${modalStyle.title} text-danger`}>
                {selectedChart?.length + chart.hold + chart.pending > 19 &&
                  "Maximum upto 20 charts to pending"}
              </span>
              <div className="mb-3">Selected Charts</div>
              <ul className={`${modalStyle.selectChart}`}>
                {selectedChart?.map((item, index) => (
                  <li
                    className={`${modalStyle.listing} ${modalStyle.listings} `}
                    key={item.id}
                    onClick={() => {
                      let remove = selectedChart?.filter(
                        (chart) => chart.patientId != item.patientId
                      );
                      setSelectedChart(remove);
                      setSelectedRowsId(remove);
                    }}
                  >
                    <span>{item.patientName}</span>
                    <button
                      id={
                        id
                          ? createIdGen("deleteicon " + tableId + index)
                          : createIdGen(
                              "deleteicon " +
                                router.pathname.replaceAll("/", " ") +
                                index
                            )
                      }
                      className="btn p-1"
                    >
                      <Avatar
                        size={21}
                        shape="square"
                        style={{
                          backgroundColor: "#F99F9F",
                          color: "#F01010",
                        }}
                        icon={
                          <FontAwesomeIcon
                            className="fa fa-search"
                            icon={faXmark}
                          />
                        }
                      ></Avatar>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className={`d-flex justify-content-center`}>
            <button
              id="allocate-btn"
              name="allocate-btn"
              className={`btn btn-primary px-5 p-1 ${modalStyle.modalBtn}`}
              disabled={
                !selectedChart?.length > 0 ||
                allocateDate == "" ||
                priority == ""
              }
              onClick={setAllocate}
            >
              Allocate
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const connector = connect(
  (state) => ({
    supervisorUserName: state.tenantAdmin?.patientSync?.supervisorUserName,
  }),
  {
    getL2UsersList: allActions.getL2UsersList,
    getAllocateUsers: allActions.getAllocateUsers,
    getAllSupervisorList: allAction.getAllSupervisorList,
    allocationList: allAction.getAllAllocationList,
  }
);
export default connector(L2AllocateModal);
