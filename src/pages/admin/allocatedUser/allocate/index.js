import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, DatePicker, Modal } from "antd";
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

const AllocateModal = ({ open, setOpen, selectedRowsId, setSelectedRowsId }) => {
  const [activeCard, setActiveCard] = useState("");
  const [search, setSearch] = useState("");
  const [userDetails, setUserDetails] = useState([]);
  const [allocateDate, setAllocateDate] = useState('');
  const [selectedChart, setSelectedChart] = useState([]);
  const [chart, setChart] = useState({
    date: null,
    completed: null,
    pending: null,
    declined: null,
    hold: null,
    allocated: null
  })
  const data = [
    {
      id: 1,
      name: "Richard Jorge",
      role: "L1 Coder",
      status: "complete",
    },
    {
      id: 2,
      name: "Richard Jorge",
      role: "L1 Coder",
      status: "test",
    },
    {
      id: 3,
      name: "Richard",
      role: "L1 Coder",
      status: "danger",
    },
    {
      id: 4,
      name: "Richard Jorge",
      role: "L1 Coder",
      status: "complete",
    },
    {
      id: 5,
      name: "Richard Jorge",
      role: "L1 Coder",
      status: "complete",
    },
    {
      id: 6,
      name: "Richard Jorge",
      role: "L1 Coder",
      status: "complete",
    },
    {
      id: 7,
      name: "Richard Jorge",
      role: "L1 Coder",
      status: "complete",
    },
    {
      id: 8,
      name: "Richard Jorge",
      role: "L1 Coder",
      status: "test",
    },
    {
      id: 9,
      name: "Richard Jorge",
      role: "L1 Coder",
      status: "complete",
    },
    {
      id: 10,
      name: "Richard Jorge",
      role: "L1 Coder",
      status: "complete",
    },
    {
      id: 11,
      name: "Richard Jorge",
      role: "L1 Coder",
      status: "complete",
    },
  ];
  

  const handleStatus = (status) => {
    switch (status) {
      case "test":
        return (
          <Avatar
            size={26}
            shape="square"
            style={{ backgroundColor: "#F7CFA1", color: "#EA8715" }}
          >
            NA
          </Avatar>
        );
      case "complete":
        return (
          <Avatar
            size={26}
            shape="square"
            style={{ backgroundColor: "#CCFFD1", color: "#009910" }}
          >
            A
          </Avatar>
        );
      case "danger":
        return (
          <Avatar
            size={26}
            shape="square"
            style={{ backgroundColor: "#F99F9F", color: "#F01010" }}
            icon={<FontAwesomeIcon className="fa fa-search" icon={faLock} />}
          ></Avatar>
        );
      default:
        return (
          <Avatar
            size={26}
            shape="square"
            style={{ backgroundColor: "#EA8715" }}
          >
            {status}
          </Avatar>
        );
    }
  };

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
          email: item.email
        };
      });
      setUserDetails(user);
    }
  };

  const setAllocate = async () => {
    var resoureUrl = `dbservice/patient/admin/assignPatients`;
    var uId = localStorage.getItem("userId");
    const response = await axios.post(ENDPOINTS.apiEndoint + resoureUrl, {
      userName : uId,
      dueDate: "2023-11-16T05:07:59.016Z",
      patientIds: selectedRowsId.map((item) => item.id),
    });
    if (response.data) {
      var result = response?.data?.response?.content;
      const user = result?.map((item) => {
        return {
          firstName: item.firstName,
          lastName: item.lastName,
          id: item.id,
          role: item.role,
        };
      });
      setUserDetails(user);
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
        setActiveCard('')
      }}
      title="Select User"
      footer={false}
      width={700}
    // style={{height: "800px"}}
    >
      <div class="form-group has-search">
        <FontAwesomeIcon
          className="fa fa-search form-control-feedback"
          icon={faSearch}
        />
        <InputText
          type="text"
          onChange={(e) => setSearch(e.target.value)}
          className="form-control new-form-control"
          placeholder="Search"
        />
      </div>
      {userDetails?.map((item) => (
        <div
          className="mt-4 pe-auto"

        // onClick={() => setActiveCard(item.id)}
        >
          <div
            className={`form-control new-form-control my-2 p-0 ${item.id == activeCard
                ? modalStyle.listContentLarge
                : modalStyle.listContent
              }`}
          >
            <div
              className="d-flex justify-content-between"
              onClick={() => {
                if (activeCard == item.id) {
                  setActiveCard("");
                } else {
                  setActiveCard(item.id);
                  // setSelectEmail(item.email)
                  getAllCheckList(item.email)
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
                <div className="row px-2">
                  <div className={`col-5 ${modalStyle.activeRow1}`}>
                    <span>Charts Selected: {selectedChart.length > 0 ? selectedChart.length : 0}</span>
                    <div className="d-flex py-2">
                      <span className={`${modalStyle.title} py-3`}>
                        Due Date
                      </span>
                      <DatePicker
                        style={{ width: "150px", marginLeft: "5px" }}
                        onChange={(date, dateS) => {
                          if (dateS) {
                            setAllocateDate(dateS+'T00:00:00.000Z');
                          } else {
                            setAllocateDate('')
                          }
                        }}
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
                      <span>{chart ? chart.allocated: 0}</span>
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
                      <span>{chart ? chart.completed: 0}</span>
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
                      <span>{chart ? chart.pending: 0}</span>
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
                      <span>{chart ? chart.hold: 0}</span>
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
                      <span>{chart ? chart.declined: 0}</span>
                    </div>
                  </div>
                  <div className={`col-7 ${modalStyle.activeRow1}`}>
                    <span className={`${modalStyle.title} text-danger`}>
                      Maximum upto 25 charts to pending
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
                              size={20}
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
                    className={`btn btn-outline-primary px-5 p-1 ${modalStyle.modalBtn}`}
                    disabled={!selectedChart.length > 0 || allocateDate == ""}
                    onClick={setAllocate}
                  >
                    Allocate
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </Modal>
  );
};

export default AllocateModal;
