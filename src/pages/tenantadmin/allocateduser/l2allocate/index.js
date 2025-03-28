import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, DatePicker, Modal, notification, Select } from "antd";
import { faXmark, faUser } from "@fortawesome/free-solid-svg-icons";
import modalStyle from "./style.module.css";
import { useEffect, useState } from "react";
import {
  disablePastDate,
  priorityOptions,
} from "../../../../components/headerFilters/functions";
import moment from "moment";
import { connect } from "react-redux";
import { actions as allActions } from "../../../../stores/tenantAdmin/patientAllocation";
import { formatDateForIndex, getResponePopup } from "../../../../utils/reusable";

const L2AllocateModal = ({
  open,
  setOpen,
  selectedRowsId,
  setSelectedRowsId,
  setAllocateClicked,
  selectedChart,
  setSelectedChart,
  selectedUser,
  getAllocateUsers,
  getL2UsersList,
  setIsSupervisorAllocated,
}) => {
  const [activeCard, setActiveCard] = useState("");
  const [search, setSearch] = useState("");
  const [userDetails, setUserDetails] = useState([]);
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
        userId: selectedUser?.userName,
       
        dueDate: formatDateForIndex({ date: allocateDate, index: 1 }),
        patientIds: selectedRowsId.map((item) => item.id),
        priority: priority,
      },
    });
    if (response?.status == "SUCCESS") {
      getResponePopup(response);
      setIsSupervisorAllocated(true);
      setAllocateClicked(true);
      setAllocateDate("");
      setActiveCard("");
      setActiveEmail("");
      setSearch("");
      setPriority([]);
      setOpen(false);
    }
  };

  const getAllCheckList = async () => {
    if (selectedUser) {
      const response = await getL2UsersList({
        userName: selectedUser?.userName,
      });
      if (response?.status == "SUCCESS") {
        let result = response?.response;
        setChart(result);
      }
    }
  };

  useEffect(() => {
    getAllCheckList();
  }, [selectedUser?.userName]);

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
          className={`ant-badge form-control new-item-control2 my-2 p-0 ${modalStyle.listContentLargeL2}`}
        >
          <div className="ant-badge d-flex justify-content-between">
            <div className="d-flex ant-badge">
              <Avatar
                className="ant-badge"
                size={65}
                shape="square"
                style={{ backgroundColor: "#04306F" }}
              >
                {selectedUser?.firstName ? (
                  getInitials(selectedUser?.firstName, selectedUser?.lastName)
                ) : (
                  <FontAwesomeIcon className="fa fa-search" icon={faUser} />
                )}
              </Avatar>
              <div className="p-3 ant-badge">
                <p className={`${modalStyle.listName} mb-1`}>
                  {selectedUser?.firstName} {selectedUser?.lastName}
                </p>
              </div>
            </div>
          </div>
          <>
            <div className="row px-3 ant-badge" style={{ paddingTop: "50px" }}>
              <div className={`col-5 ant-badge ${modalStyle.activeRow1}`}>
                <span className="ant-badge">
                  Charts Selected:{" "}
                  {selectedChart?.length > 0 ? selectedChart?.length : 0}
                </span>
                <div className="ant-badge d-flex py-2 gap-3 align-items-center">
                  <span className={`ant-badge ${modalStyle.title} py-3`}>
                    Due Date
                  </span>
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
                    value={
                      allocateDate ? moment(allocateDate, "YYYY-MM-DD") : ""
                    }
                  />
                </div>
                <div className="ant-badge d-flex py-1 gap-1 align-items-center">
                  <span className="ant-badge">Set Priority</span>
                  <div className="ant-badge antdCustomSelect">
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
                <div className="ant-badge d-flex my-3">
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
                <div className="d-flex my-3 ant-badge">
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
                <div className="d-flex my-3 ant-badge">
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
                <div className="d-flex my-3 ant-badge">
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
                <div className="d-flex my-3 ant-badge">
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
              <div className={`ant-badge col-7 ${modalStyle.activeRow1}`}>
                <span className={`${modalStyle.title} text-danger`}>
                  {selectedChart?.length + chart.hold + chart.pending > 19 &&
                    "Maximum upto 20 charts to pending"}
                </span>
                <div className="ant-badge mb-3">Selected Charts</div>
                <ul className={`ant-badge ${modalStyle.selectChart}`}>
                  {selectedChart?.map((item) => (
                    <li
                      className={`ant-badge ${modalStyle.listing} ${modalStyle.listings} `}
                      key={item.id}
                      id={item.id}
                      name={item.id}
                      onClick={() => {
                        let remove = selectedChart?.filter(
                          (chart) => chart.id != item.id
                        );
                        setSelectedChart(remove);
                        setSelectedRowsId(remove);
                      }}
                    >
                      <span>{item.name}</span>
                      <button className="btn p-1">
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
          </>
        </div>
      </div>
    </Modal>
  );
};

const connector = connect((state) => ({ state }), {
  getL2UsersList: allActions.getL2UsersList,
  getAllocateUsers: allActions.getAllocateUsers,
});
export default connector(L2AllocateModal);
