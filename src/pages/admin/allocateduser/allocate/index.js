import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, DatePicker, Modal, notification } from "antd";
import modalStyle from "./style.module.css";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import Router from "next/router";
import {
  faSearch,
  faXmark,
  faUser,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";
import { disablePastDate } from "../../../../components/headerFilters/functions";
import { actions as allActions } from "../../../../stores/admin/patientAllocation";
import { connect } from "react-redux";
import { getResponePopup } from "../../../../utils/reusable";

const AllocateModal = ({
  open,
  setOpen,
  selectedRowsId,
  setSelectedRowsId,
  setAllocateClicked,
  selectedChart,
  setSelectedChart,
  getAllList,
  getL1UsersList,
  getAllocateUsers,
}) => {
  const [activeCard, setActiveCard] = useState("");
  const [search, setSearch] = useState("");
  const [userDetails, setUserDetails] = useState([]);
  const [allocateDate, setAllocateDate] = useState("");
  const [activeEmail, setActiveEmail] = useState("");
  const [statusCount, setStatusCount] = useState([]);
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

  const getUserList = async (search = "") => {
    // const orgId = getStorage("orgId");
    // let resoureUrl = `dbservice/user/getL1UsersByOrgIdAndTenantId?orgid=${orgId}&searchString=${search}`;
    const response = await getL1UsersList({
      search: search  || "",
    });
    if (response.status == "SUCCESS") {
      let result = response?.response;

      const user = result?.map((item) => {
        return {
          firstName: item.firstName,
          lastName: item.lastName,
          id: item.id,
          role: item.role,
          email: item.userName,
        };
      });
      setStatusCount(response?.response);
      setUserDetails(user);
    }
  };

  const setAllocate = async () => {
    // let resoureUrl = `dbservice/patient/admin/assignPatients`;
    const response = await getAllocateUsers({
      data: {
        userId: activeEmail,
        dueDate: `${allocateDate + "T00:00:00.000Z"}`,
        patientIds: selectedRowsId.map((item) => item?.id),
      },
    });
    // axios.post(ENDPOINTS.apiEndoint + resoureUrl, {
    // userId: activeEmail,
    // dueDate: `${allocateDate + "T00:00:00.000Z"}`,
    // patientIds: selectedRowsId.map((item) => item.id),
    // });

    if (response?.status == "SUCCESS") {
      getResponePopup(response)
      getAllList({
        pageNo: 0,
        pageSize: 15,
        allocate: true,
        status: 2,
      });
      setOpen(false);
      setAllocateClicked(true);
      setAllocateDate("");
      setActiveCard("");
      setActiveEmail("");
      setSearch("");
    }
  };

  // const getAllCheckList = async (selectEmail) => {
  //   let resoureUrl = `/management/admin/getProcessedStatus?userName=${selectEmail}`;
  //   const response = await axios.get(ENDPOINTS.apiEndoint + resoureUrl);
  //   if (response.data) {
  //     let result = response?.data?.response;
  //     setChart(result);
  //   }
  // };

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
          maxLength={25}
          onKeyDown={(e) => {
            // Prevent input of backslash ("\")
            if (e.key === "\\") {
              e.preventDefault();
            }
          }}
        />

      </div>
      <div className="overflow-auto" style={{ height: "640px" }}>
        {userDetails.length > 0 ? (
          userDetails?.map((item) => (
            <div className="mt-4 pe-auto">
              <div
                className={`form-control new-item-control my-2 p-0 ${
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
                      setAllocateDate("");
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
                        <FontAwesomeIcon
                          className="fa fa-search"
                          icon={faUser}
                        />
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
                            disabledDate={(current) => disablePastDate(current)}
                          />
                        </div>
                        {statusCount
                          ?.filter((status) => status.id === item.id)
                          ?.map((status) => (
                            <div key={status.id}>
                              <div className="d-flex my-3">
                                <div>
                                  <FontAwesomeIcon
                                    icon={faCircle}
                                    color="#3276CD"
                                    style={{ fontSize: "8px" }}
                                  />

                                  <span className="p-2">Allocated</span>
                                </div>
                                <span>
                                  {status.totalFileAllocated
                                    ? status.totalFileAllocated
                                    : 0}
                                </span>
                              </div>

                              <div className="d-flex my-3">
                                <div>
                                  <FontAwesomeIcon
                                    icon={faCircle}
                                    color="#00BC13"
                                    style={{ fontSize: "8px" }}
                                  />
                                  <span className="p-2">Completed</span>
                                </div>
                                <span>
                                  {status.totalFileProcessed
                                    ? status.totalFileProcessed
                                    : 0}
                                </span>
                              </div>

                              <div className="d-flex my-3">
                                <div>
                                  <FontAwesomeIcon
                                    icon={faCircle}
                                    color="#EA8715"
                                    style={{ fontSize: "8px" }}
                                  />
                                  <span className="p-2">Pending</span>
                                </div>
                                <span>
                                  {status.totalFilePending
                                    ? status.totalFilePending
                                    : 0}
                                </span>
                              </div>

                              <div className="d-flex my-3">
                                <div>
                                  <FontAwesomeIcon
                                    icon={faCircle}
                                    color="#BCA7FB"
                                    style={{ fontSize: "8px" }}
                                  />
                                  <span className="p-2">Hold</span>
                                </div>
                                <span>
                                  {status.totalFileHold
                                    ? status.totalFileHold
                                    : 0}
                                </span>
                              </div>

                              <div className="d-flex my-3">
                                <div>
                                  <FontAwesomeIcon
                                    icon={faCircle}
                                    color="#EB5252"
                                    style={{ fontSize: "8px" }}
                                  />
                                  <span className="p-2">Declined</span>
                                </div>
                                <span>
                                  {status.totalFileDeclined
                                    ? status.totalFileDeclined
                                    : 0}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                      <div className={`col-7 ${modalStyle.activeRow1}`}>
                        <span className={`${modalStyle.title} text-danger`}>
                          {selectedChart.length + chart.hold + chart.pending >
                            100 && "Maximum upto 100 charts to pending"}
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
                          selectedChart.length + chart.hold + chart.pending >
                            100
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
      </div>
    </Modal>
  );
};

const connector = connect((state) => ({}), {
  getL1UsersList: allActions.getL1UsersList,
  getAllocateUsers: allActions.getAllocateUsers,
});
export default connector(AllocateModal);
