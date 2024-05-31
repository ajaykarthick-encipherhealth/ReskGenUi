import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, DatePicker, Modal, notification } from "antd";
import { faXmark, faUser } from "@fortawesome/free-solid-svg-icons";
import modalStyle from "./style.module.css";
import { useEffect, useState } from "react";
import axios from "../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../utility/enpoints";
import { disablePastDate } from "../../../../components/headerFilters/functions";
import moment from "moment";

const L2AllocateModal = ({
  open,
  setOpen,
  selectedRowsId,
  setSelectedRowsId,
  setAllocateClicked,
  selectedChart,
  setSelectedChart,
  selectedUser,
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

  const getInitials = (firstName, lastName) => {
    const firstNameInitial = firstName?.charAt(0) || "";
    const secondNameInitial = lastName?.charAt(0) || "";
    return firstNameInitial?.toUpperCase() + secondNameInitial?.toUpperCase();
  };

  const setAllocate = async () => {
    let resoureUrl = `dbservice/patient/admin/assignPatients/l2audit`;
    const response = await axios.post(ENDPOINTS.apiEndoint + resoureUrl, {
      userId: selectedUser?.userName,
      dueDate: `${allocateDate + "T23:00:00.999Z"}`,
      patientIds: selectedRowsId.map((item) => item.id),
    });
    if (response) {
      if (response?.data?.status == "SUCCESS") {
        notification.success({
          message: response?.data?.message,
        });
        setAllocateClicked(true);
        setAllocateDate("");
        setActiveCard("");
        setActiveEmail("");
        setSearch("");
        setOpen(false);
      }
    }
  };

  const getAllCheckList = async () => {
    if (selectedUser) {
      let resoureUrl = `dbservice/l2audit/statistics?username=${selectedUser?.userName}`;
      const response = await axios.get(ENDPOINTS.apiEndoint + resoureUrl);
      if (response.data) {
        let result = response?.data?.response;
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
          className={`form-control new-form-control my-2 p-0 ${modalStyle.listContentLargeL2}`}
        >
          <div className="d-flex justify-content-between">
            <div className="d-flex">
              <Avatar
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
              <div className="p-3">
                <p className={`${modalStyle.listName} mb-1`}>
                  {selectedUser?.firstName} {selectedUser?.lastName}
                </p>
              </div>
            </div>
          </div>
          <>
            <div className="row px-3" style={{ paddingTop: "50px" }}>
              <div className={`col-5 ${modalStyle.activeRow1}`}>
                <span>
                  Charts Selected:{" "}
                  {selectedChart?.length > 0 ? selectedChart?.length : 0}
                </span>
                <div className="d-flex py-2">
                  <span className={`${modalStyle.title} py-3`}>Due Date</span>
                  <DatePicker
                    style={{ width: "150px", marginLeft: "5px" }}
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
                <p>Selected Charts</p>

                <ul className={`${modalStyle.selectChart}`}>
                  {selectedChart?.map((item) => (
                    <li
                      className={`${modalStyle.listing} ${modalStyle.listings}`}
                      key={item.id}
                      onClick={() => {
                        let remove = selectedChart?.filter(
                          (chart) => chart.id != item.id
                        );
                        setSelectedChart(remove);
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
                className={`btn btn-primary px-5 p-1 ${modalStyle.modalBtn}`}
                disabled={!selectedChart?.length > 0 || allocateDate == ""}
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

export default L2AllocateModal;
