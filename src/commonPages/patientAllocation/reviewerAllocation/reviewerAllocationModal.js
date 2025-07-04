import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, DatePicker, Empty, Input, Modal, Select } from "antd";
import modalStyle from "../../../pages/tenantadmin/allocateduser/allocate/style.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dayjs from "dayjs";

import {
  faSearch,
  faXmark,
  faUser,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";

import { actions as allActions } from "../../../stores/admin/patientAllocation";
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

const AllocateModal = ({
  open,
  setOpen,
  selectedRowsId,
  setSelectedRowsId,
  selectedChart,
  setSelectedChart,
  getL1UsersList,
  getAllocateUsers,
  setSelectedRows,
  selectedUserName,
  setSelectedUserName,
  usersLoader,
  id,
  getAllAllocation,
  setIsAllocate,
  roleId,
  isAllocate,
  roleAliasName,
}) => {
  const router = useRouter();
  const userId = getStorage("userId");
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
  const getInitials = (firstName, lastName) => {
    const firstNameInitial = firstName?.charAt(0) || "";
    const secondNameInitial = lastName?.charAt(0) || "";
    return firstNameInitial?.toUpperCase() + secondNameInitial?.toUpperCase();
  };
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);

  const handleChange = (value) => {
    setPriority(value);
  };

  const getUserList = async ({ roleId, search }) => {
    const response = await getL1UsersList({
      roleId: roleId || "",
      search: search || "",
       masterAudit: roleAliasName === "MASTER_AUDIT" ? true : false,
    });
    if (response?.status === "SUCCESS") {
      let result = response?.response;
      const user = result?.map((item) => {
        return {
          firstName: item.firstName,
          lastName: item.lastName,
          id: item.id,
          role: item.roleId,
          email: item.userName,
          aliasName:item.aliasName,
          proxyId: item.proxyId,
        };
      });
      setStatusCount(response?.response);
      setUserDetails(user);
    }
  };
  const setAllocate = async () => {
    setIsAllocate(true);
    let data;
    if (roleAliasName === "MASTER_AUDIT") {
      data = {
        roleId: roleId,
        usersWithRole: activeEmail,
        dueDate: formatDateForIndex({ date: allocateDate, index: 1 }),
        allocatedBy: userId,
        patientIdList: selectedRowsId,
        priority: priority,
        masterAudit:true
      };
    } else {
      data = {
        roleId: roleId,
        userIdList: activeEmail.map((user) => user.username),
        dueDate: formatDateForIndex({ date: allocateDate, index: 1 }),
        allocatedBy: userId,
        patientIdList: selectedRowsId,
        priority: priority,
      };
    }

    const response = await getAllocateUsers({ data });

    if (response?.status === "SUCCESS") {
      setIsAllocate(false);
      getResponePopup(response);
      getAllAllocation();
      setOpen(false);
      setAllocateDate("");
      setActiveEmail([]);
      setSearch("");
      setPriority([]);
      setSelectedRowsId([]);
      setSelectedRows([]);
      setSelectedUserName([]);
      setSelectedUserIds([]);
      setIsSecondModalOpen(false);
    } else {
      getResponePopup(response);
      setIsAllocate(false);
    }
  };

  const handleUserSelect = (proxyId, email) => {
    const user = userDetails.find((u) => u.proxyId === proxyId);
    const isSelected = selectedUserIds.includes(proxyId);
    if (isSelected) {
      setSelectedUserIds((prev) => prev.filter((userId) => userId !== proxyId));  
      setActiveEmail((prev) =>
        prev.filter((u) => !(u.username === email && u.roleId === user?.role))
      );
    } else {
      if (user) {
        setSelectedUserIds((prev) => [...prev, proxyId]);
        setActiveEmail((prev) => [
          ...prev,
          { username: email, roleId: user.role },
        ]);
      }
    }
    setActiveCard("");
  };

  const handleSelectAll = () => {
    const isAllSelected = selectedUserIds.length === userDetails.length;
    if (isAllSelected) {
      setSelectedUserIds([]);
      setActiveEmail([]);
    } else {
      const allIds = userDetails.map((user) => user.proxyId);
      const allUsers = userDetails.map((user) => ({
        username: user.email,
        roleId: roleId,
      }));
      setSelectedUserIds(allIds);
      setActiveEmail(allUsers);
    }
  };
  useEffect(() => {
    if (roleId) {
      getUserList({
        roleId: roleId,
        search: search,
        masterAudit: roleAliasName === "MASTER_AUDIT" ? true : false,
      });
    }
  }, [roleId, search, roleAliasName]);

  useEffect(() => {
    setSelectedChart(selectedRowsId);
  }, [selectedRowsId]);
  const userTitle = () => {
    return (
      <div className="d-flex justify-content-between">
        <div>Select User</div>
        <div>
          {userDetails.length > 0 ? (
            <div className="d-flex align-items-center ">
              <div className="fontWeight3 font3">Select All</div>
              <input
                style={{
                  width: "20px",
                  height: "20px",
                  flexShrink: "0",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                className={`mx-4  ${styles.checkbox} ${
                  selectedUserIds.length === userDetails.length
                    ? styles.customChecked2
                    : ""
                }`}
                type="checkbox"
                id="selectAll"
                checked={selectedUserIds.length === userDetails.length}
                onChange={handleSelectAll}
              />
            </div>
          ) : null}
        </div>
      </div>
    );
  };
  console.log(userDetails,"userDetails")
  return (
    <div>
      <Modal
        open={open}
        onCancel={() => {
          setOpen(false);
          setSelectedRowsId(selectedChart);
          setActiveEmail([]);
          setSearch("");
          setAllocateDate(null);
          setPriority([]);
          setSelectedUserIds([]);
        }}
        title={roleAliasName === "MASTER_AUDIT" ? "Select User" : userTitle()}
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
          />
        </div>
        {usersLoader ? (
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
                        <p className={`mt-2 ${modalStyle.listRole}`}>
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
                      onChange={() =>
                        handleUserSelect(item.proxyId, item.email)
                      }
                      className="me-2 ms-3 align-self-center"
                      disabled={
                        activeEmail.some(
                          (user) => user.username === item.email
                        ) && !selectedUserIds.includes(item.proxyId)
                      }
                    />
                  </div>
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
                {selectedUserName?.length + chart?.hold + chart?.pending >
                  100 && "Maximum upto 100 charts to pending"}
              </span>

              <div className="mb-3">Selected Charts</div>

              <ul className={`${modalStyle.selectChart}`}>
                {selectedUserName?.map((item, index) => (
                  <li
                    className={`${modalStyle.listing} ${modalStyle.listings}`}
                    key={item.id}
                  >
                    <span>{item.patientId}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="d-flex justify-content-center mt-5">
            <RegularButton
              disabled={
                !selectedChart?.length ||
                !allocateDate ||
                !priority?.length ||
                selectedChart?.length + chart?.hold + chart?.pending > 100 ||
                isAllocate
              }
              name="Allocate"
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
    usersLoader: state?.admin?.patientAllocate?.getUsersLoading,
  }),
  {
    getL1UsersList: allActions.getL1UsersList,
    getAllocateUsers: allActions.getAllocateUsers,
  }
);
export default connector(AllocateModal);
