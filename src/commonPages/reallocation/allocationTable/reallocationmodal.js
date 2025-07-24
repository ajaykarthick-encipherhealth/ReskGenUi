import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Avatar,
  Checkbox,
  DatePicker,
  Empty,
  Input,
  Modal,
  Select,
} from "antd";
import modalStyle from "../../../pages/tenantadmin/allocateduser/allocate/style.module.css";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { faSearch, faUser, faCircle } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import { formatDateForIndex, getResponePopup } from "../../../utils/reusable";
import styles from "../../../components/tables/table.module.css";
import { getStorage } from "../../../utils/storages";
import TableSkeleton from "../../../components/skeleton/table";
import RegularButton from "../../../components/button";
import {
  disablePastDate,
  priorityOptions,
} from "../../../components/headerFilters/functions";
import { actions as allAction } from "../../../stores/tenantAdmin/patientAllocations";

const ReAllocationModal = ({
  open,
  setOpen,
  selectedRowsId,
  setSelectedRowsId,
  selectedChart,
  setSelectedChart,
  reAllocateUser,
  setSelectedRows,
  selectedUserName,
  setSelectedUserName,
  getAllReAllocation,
  setIsAllocate,
  roleId,
  isAllocate,
  getReAllocateUserList,
  allocateModal,
  roleAliasName,
}) => {
  const [activeCard, setActiveCard] = useState("");
  const [search, setSearch] = useState("");
  const [userDetails, setUserDetails] = useState([]);
  const [allocateDate, setAllocateDate] = useState("");
  const [activeEmail, setActiveEmail] = useState([]);
  const [chart, setChart] = useState({
    date: null,
    completed: null,
    pending: null,
    declined: null,
    hold: null,
    allocated: null,
  });
  const [statusCount, setStatusCount] = useState([]);
  const [priority, setPriority] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [roles, setRoles] = useState([]);

  const getInitials = (firstName, lastName) => {
    const firstNameInitial = firstName?.charAt(0) || "";
    const secondNameInitial = lastName?.charAt(0) || "";
    return firstNameInitial?.toUpperCase() + secondNameInitial?.toUpperCase();
  };
  const handleChange = (value) => {
    setPriority(value);
  };
  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const getUserList = async () => {
    setIsLoading(true);
    const response = await getReAllocateUserList({
      data: {
        roleId: roleId || "",
        search: search || "",
        aliasName: roles || "",
        userRoleDTOList: selectedUserName.map(({ username, roleId }) => ({
          username,
          roleId,
        })),
        isMasterAudit: roleAliasName === "MASTER_AUDIT" ? true : false,
      },
    });
    if (response?.status === "SUCCESS") {
      setIsLoading(false);
      let result = response?.response;
      const user = result?.map((item) => {
        return {
          firstName: item.firstName,
          lastName: item.lastName,
          id: item.id,
          roleId: item.roleId,
          email: item.userName,
          aliasName: item.aliasName,
          proxyId: item.proxyId,
        };
      });
      setStatusCount(response?.response);
      setUserDetails(user);
    } else {
      setIsLoading(false);
    }
  };
  const aliasOptions = userDetails
    ?.filter(
      (item, index, self) =>
        index === self.findIndex((i) => i.aliasName === item.aliasName)
    )
    ?.map((item) => ({
      label: item.aliasName?.split("_")?.join(" "),
      value: item.role,
    }));

  const handleRoleChange = (value) => {
    setRoles(value);
  };
  const setAllocate = async () => {
    setIsAllocate(true);

    let payload;

    if (roleAliasName === "MASTER_AUDIT") {
      payload = {
        roleId: Number(activeEmail.map((role) => role.roleId)),
        reallocateUserName: activeEmail.map((item) => item.email).toString(),
        dueDate: formatDateForIndex({ date: allocateDate, index: 1 }),
        patientId: selectedRowsId,
        priority: priority,
        changesNeeded: isChecked,
        isMasterAudit: true,
      };
    } else {
      payload = {
        roleId: Number(activeEmail.map((role) => role.roleId)),
        dueDate: formatDateForIndex({ date: allocateDate, index: 1 }),
        reallocateUserName: activeEmail.map((item) => item.email).toString(),
        patientId: selectedRowsId,
        priority: priority,
        changesNeeded: isChecked,
      };
    }
    const response = await reAllocateUser({ data: payload });

    if (response?.status === "SUCCESS") {
      setIsAllocate(false);
      getResponePopup(response);
      getAllReAllocation();
      setOpen(false);
      setAllocateDate("");
      setActiveCard("");
      setActiveEmail([]);
      setSearch("");
      setPriority([]);
      setSelectedRowsId([]);
      setSelectedRows([]);
      setSelectedUserName([]);
      setSelectedUserIds([]);
      setIsSecondModalOpen(false);
      setIsChecked(false);
      setRoles([]);
    } else {
      getResponePopup(response);
      setIsAllocate(false);
    }
  };

  const handleRowCheckboxChange = ({ e, row }) => {
    if (e.target?.checked) {
      setSelectedUserIds([row.proxyId]);
      setActiveEmail([{ email: row.email, roleId: row.roleId }]);
    } else {
      setSelectedUserIds([]);
      setActiveEmail([]);
    }

    setActiveCard("");
  };
  useEffect(() => {
    if (allocateModal) {
      getUserList();
    }
  }, [roleId, selectedUserName, allocateModal, search, roles]);
  useEffect(() => {
    setSelectedChart(selectedRowsId);
  }, [selectedRowsId]);
  return (
    <div>
      <Modal
        open={open}
        onCancel={() => {
          setOpen(false);
          setSelectedRowsId(selectedChart);
          setActiveCard("");
          setActiveEmail([]);
          setSearch("");
          setAllocateDate(null);
          setPriority([]);
          setSelectedUserIds([]);
          setRoles([]);
        }}
        title="Select User"
        footer={false}
        width={700}
        height={100}
        className={"custom-modal"}
      >
        <div className="d-flex align-items-center justify-content-evenly mt-2">
          <Input
            onKeyDown={(e) => {
              if (e.key === "\\") {
                e.preventDefault();
              }
            }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={modalStyle.allocationInput}
            placeholder="Search"
            suffix={
              <FontAwesomeIcon
                className="fa fa-search form-control-feedback"
                icon={faSearch}
              />
            }
          />
          <Select
            className={modalStyle.allocationInput}
            placeholder="Select Role"
            // options={aliasOptions}
            allowClear
            value={roles}
            // onChange={handleRoleChange}
          />
        </div>
        {isLoading ? (
          <TableSkeleton />
        ) : userDetails.length > 0 ? (
          <div className={modalStyle.scroll}>
            {userDetails?.map((item) => (
              <div className="mt-4 ">
                <div
                  className={`form-control new-item-control my-2 p-0 ${
                    item.id == activeCard
                      ? modalStyle.listContentLarge
                      : modalStyle.listContent
                  }`}
                >
                  <div
                    className="d-flex justify-content-between"
                    // onClick={() => {
                    //   if (activeCard === item.id) {
                    //     setActiveCard("");
                    //   } else {
                    //     setActiveCard(item.id);
                    //     setAllocateDate("");
                    //     setPriority([]);
                    //   }
                    // }}
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
                        <p className={` mt-2 ${modalStyle.listRole}`}>
                          {item?.aliasName?.split("_")?.join(" ")}
                        </p>
                      </div>
                    </div>
                    <input
                      style={{
                        width: "20px",
                        height: "20px",
                        flexShrink: "0",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                      type="checkbox"
                      checked={selectedUserIds.includes(item.proxyId)}
                      onChange={(e) =>
                        handleRowCheckboxChange({ e, row: item })
                      }
                      className="me-2 ms-3 align-self-center"
                    />
                  </div>
                  {activeCard == item.id ? (
                    <>
                      <div className="row px-3">
                        <div className={`col-5 mt-3 ${modalStyle.activeRow1}`}>
                          <span>
                            Charts Selected:{" "}
                            {selectedChart?.length > 0
                              ? selectedChart?.length
                              : 0}
                          </span>
                          {statusCount
                            ?.filter((status) => status.id === item.id)
                            ?.map((status) => (
                              <div className="mt-3" key={status.id}>
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
                            {selectedRowsId?.length +
                              chart?.hold +
                              chart?.pending >
                              100 && "Maximum upto 100 charts to pending"}
                          </span>
                          <div className="mt-3">Selected Charts</div>
                          <ul className={`${modalStyle.selectChart}`}>
                            {selectedRowsId?.map((item, index) => (
                              <li
                                className={` mt-2 ${modalStyle.listing} ${modalStyle.listings}`}
                                key={item.id}
                              >
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="m-4">
            <div className="d-flex align-items-center justify-content-center mt-5">
              No users available. Please create and assign users.
            </div>
          </div>
        )}
        {userDetails.length > 0 ? (
          <div className="d-flex justify-content-center mt-3">
            <RegularButton
              name={"Next"}
              type="submit"
              onClick={() => {
                setIsSecondModalOpen(true);
                setOpen(false);
                setAllocateDate(null);
                setPriority([]);
              }}
              disabled={activeEmail.length === 0}
            >
              Next
            </RegularButton>
          </div>
        ) : (
          ""
        )}
      </Modal>
      <Modal
        open={isSecondModalOpen}
        onCancel={() => {
          setSelectedUserIds([]);
          setIsSecondModalOpen(false);
          setAllocateDate(null);
          setActiveCard("");
          setActiveEmail([]);
          setPriority([]);
        }}
        footer={null}
        width="35%"
      >
        <>
          <div className="row mt-5 px-3">
            <div className={`col-6 ${modalStyle.activeRow1}`}>
              <span>
                Charts Selected:
                {selectedChart?.length > 0 ? selectedChart.length : 0}
              </span>
              <div className="d-flex gap-3 py-2 align-items-center ">
                <span className={`${modalStyle.title} py-3`}>Due Date</span>
                <DatePicker
                  id="select-dueDate"
                  name="select-dueDate"
                  style={{ width: "150px" }}
                  value={allocateDate ? dayjs(allocateDate) : null}
                  onChange={(date, dateS) => {
                    setAllocateDate(dateS || "");
                  }}
                  format="MM-DD-YYYY"
                  disabledDate={(current) => disablePastDate(current)}
                />
              </div>
              <div className="d-flex py-1 gap-1 align-items-center">
                <span>Set Priority</span>
                <div className="antdCustomSelect">
                  <Select
                    id="select-priority"
                    name="select-priority"
                    className={modalStyle.prioritySelect}
                    options={priorityOptions}
                    placeholder="Set priority"
                    onChange={handleChange}
                    value={priority}
                    allowClear
                  />
                </div>
              </div>
            </div>
            <div className={`col-6 ${modalStyle.activeRow1}`}>
              <span className={`${modalStyle.title} text-danger`}>
                {selectedRowsId?.length + chart?.hold + chart?.pending > 100 &&
                  "Maximum upto 100 charts to pending"}
              </span>

              <div className="mb-3">Selected Charts</div>
              <ul className={`${modalStyle.selectChart}`}>
                {selectedRowsId?.map((item, index) => (
                  <li
                    className={`${modalStyle.listing} ${modalStyle.listings}`}
                    key={item.id}
                  >
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4">
              <span className="fontWeight2">Note:</span> If you choose 'Delete
              Codes and Reallocate', the codes will be permanently deleted.
              Otherwise, the codes will be retained and reallocated.
              <div className="mt-1">
                <Checkbox
                  className="ant-badge"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                >
                  Delete Codes and Reallocate
                </Checkbox>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center mt-4">
            <RegularButton
              disabled={isAllocate || !(allocateDate && priority?.length)}
              name="ReAllocate"
              onClick={setAllocate}
              loading={isAllocate}
            />
          </div>
        </>
      </Modal>
    </div>
  );
};

const connector = connect(
  (state) => ({
    reAllocateUserLoader:
      state?.tenantAdmin?.patientAllocation?.reAllocateLoader,
  }),
  {
    getReAllocateUserList: allAction.getReAllocateUserList,
    reAllocateUser: allAction.reAllocateUser,
  }
);
export default connector(ReAllocationModal);
