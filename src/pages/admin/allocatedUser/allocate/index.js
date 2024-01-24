import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, DatePicker, Modal, notification } from "antd";
import {
  faSearch,
  faLock,
  faXmark,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { InputText } from "primereact/inputtext";
import modalStyle from "./style.module.css";
import { useEffect, useState } from "react";
import axios from "../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../utility/enpoints";
import Router from "next/router";

const AllocateModal = ({
  open,
  setOpen,
  selectedRowsId,
  setSelectedRowsId,
  setAllocateClicked,
  selectedChart,
  setSelectedChart,
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

  const getUserList = async (search) => {
    var resoureUrl = `dbservice/user/getUsersByOrgIdAndTenantId?orgid=daa95f13-8b1d-4dc3-8d1c-c15d192c6cd5&searchString=${search}`;
    const response = await axios.get(ENDPOINTS.apiEndoint + resoureUrl);
    if (response.data) {
      var result = response?.data?.response;
      const user = result?.map((item) => {
        return {
          firstName: item.firstName,
          lastName: item.lastName,
          id: item.id,
          role: item.role,
          email: item.userName,
        };
      });
      setUserDetails(user);
    }
  };

  const setAllocate = async () => {
    var resoureUrl = `dbservice/patient/admin/assignPatients`;
    const response = await axios.post(ENDPOINTS.apiEndoint + resoureUrl, {
      userId: activeEmail,
      dueDate: `${allocateDate + "T00:00:00.000Z"}`,
      patientIds: selectedRowsId.map((item) => item.id),
    });
    if (response) {
      if (response?.data?.status == "SUCCESS") {
        notification.success({
          message: response?.data?.message,
        });
        setOpen(false);
        setAllocateClicked(true);
        setAllocateDate("");
        setActiveCard("");
        setActiveEmail("");
        setSearch("");
      }
    }
  };

  const getAllCheckList = async (selectEmail) => {
    var resoureUrl = `/management/admin/getProcessedStatus?userName=${selectEmail}`;
    const response = await axios.get(ENDPOINTS.apiEndoint + resoureUrl);
    if (response.data) {
      var result = response?.data?.response;
      setChart(result);
    }
  };

  useEffect(() => {
    getUserList(search);
  }, [search]);

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
      // style={{height: "800px"}}
      className="allocate_modal_container"
    >
      <div class="form-group has-search">
        <FontAwesomeIcon
          className="fa fa-search form-control-feedback"
          icon={faSearch}
        />
        <InputText
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-control new-form-control"
          placeholder="Search"
        />
      </div>
      {userDetails.length > 0 ? (
        userDetails?.map((item) => (
          <div className="mt-4 pe-auto">
            <div
              className={`form-control new-form-control my-2 p-0 ${
                item.id == activeCard
                  ? modalStyle.listContentLarge
                  : modalStyle.listContent
              }`}
            >
              <div
                className="d-flex justify-content-between"
                onClick={() => {
                  if (activeCard == item.id) {
                    setActiveCard("");
                    setActiveEmail(item.email);
                  } else {
                    setActiveCard(item.id);
                    setActiveEmail(item.email);
                    getAllCheckList(item.email);
                  }
                }}
              >
                <div className="d-flex">
                  <Avatar
                    size={65}
                    shape="square"
                    style={{ backgroundColor: "#04306F" }}
                  >
                    {item.firstName || item.lastName ? (
                      getInitials(item.firstName, item.lastName)
                    ) : (
                      <FontAwesomeIcon className="fa fa-search" icon={faUser} />
                    )}
                  </Avatar>
                  <div className="p-3">
                    <p className={`${modalStyle.listName} mb-1`}>
                      {item.firstName + " " + item.lastName}
                    </p>
                    <p className={`${modalStyle.listRole}`}>
                      {item.role
                        ? item.role.map((item) => (
                            <span className="px-1">{item}</span>
                          ))
                        : null}
                    </p>
                  </div>
                </div>

                {/* <div className="m-2">{handleStatus(item.status)}</div> */}
              </div>
              {activeCard == item.id && (
                <>
                  <div className="row px-3">
                    <div className={`col-5 ${modalStyle.activeRow1}`}>
                      <span>
                        Charts Selected:{" "}
                        {selectedChart.length > 0 ? selectedChart.length : 0}
                      </span>
                      <div className="d-flex py-2">
                        <span className={`${modalStyle.title} py-3`}>
                          Due Date
                        </span>
                        <DatePicker
                          style={{ width: "150px", marginLeft: "5px" }}
                          onChange={(date, dateS) => {
                            if (dateS) {
                              setAllocateDate(dateS);
                            } else {
                              setAllocateDate("");
                            }
                          }}
                          // value={moment(allocateDate, 'YYYY-MM-DD')}
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
                            <circle cx="4" cy="4" r="4" fill="#3276CD" />
                          </svg>
                          <span className="p-2">Allocated</span>
                        </div>
                        <span>{chart.allocated ? chart.allocated : 0}</span>
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
                            <circle cx="4" cy="4" r="4" fill="#00BC13" />
                          </svg>
                          <span className="p-2">Completed</span>
                        </div>
                        <span>{chart.completed ? chart.completed : 0}</span>
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
                            <circle cx="4" cy="4" r="4" fill="#EA8715" />
                          </svg>
                          <span className="p-2">Pending</span>
                        </div>
                        <span>{chart.pending ? chart.pending : 0}</span>
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
                            <circle cx="4" cy="4" r="4" fill="#BCA7FB" />
                          </svg>
                          <span className="p-2">Hold</span>
                        </div>
                        <span>{chart.hold ? chart.hold : 0}</span>
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
                          <span className="p-2">Decline</span>
                        </div>
                        <span>{chart.declined ? chart.declined : 0}</span>
                      </div>
                    </div>
                    <div className={`col-7 ${modalStyle.activeRow1}`}>
                      <span className={`${modalStyle.title} text-danger`}>
                        {selectedChart.length + chart.hold + chart.pending >
                          19 && "Maximum upto 20 charts to pending"}
                      </span>
                      <p>Selected Charts</p>

                      <ul className={`${modalStyle.selectChart}`}>
                        {selectedChart.map((item) => (
                          <li
                            className={`${modalStyle.listing} ${modalStyle.listings}`}
                            key={item.id}
                            onClick={() => {
                              let remove = selectedChart.filter(
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
                      disabled={
                        !selectedChart.length > 0 ||
                        allocateDate == "" ||
                        selectedChart.length + chart.hold + chart.pending > 19
                      }
                      onClick={setAllocate}
                    >
                      Allocate
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="m-4">
          <button
            onClick={() => {
              Router.push("/admin/user");
            }}
            className={`btn btn-outline-primary btn-sm ms-2 ${modalStyle.modalBtn}`}
          >
            Add User
          </button>
        </div>
      )}
    </Modal>
  );
};

export default AllocateModal;
