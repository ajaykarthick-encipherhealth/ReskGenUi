import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, DatePicker, Form, Input, Modal, Select } from "antd";
import modalStyle from "../../../pages/tenantadmin/allocateduser/allocate/style.module.css";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import {
  faSearch,
  faXmark,
  faUser,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";
import { actions as allActions } from "../../../stores/admin/patientAllocation";
import { connect } from "react-redux";
import {
  createIdGen,
  formatDateForIndex,
  getResponePopup,
} from "../../../utils/reusable";
import styles from "../../../components/tables/table.module.css";
import { getStorage } from "../../../utils/storages";
import TableSkeleton from "../../../components/skeleton/table";
import RegularButton from "../../../components/button";
import { actions as allAction } from "../../../stores/tenantAdmin/patientAllocations";
import { priorityOptions } from "../../../components/headerFilters/functions";

const RandomSamplingModal = ({
  open,
  setOpen,
  selectedRowsId,
  setSelectedRowsId,
  getL1UsersList,
  setSelectedRows,
  usersLoader,
  getAllAllocation,
  setIsModalOpen,
  isModalOpen,
  randomSampling,
  isAllocate,
  roleId,
  setIsAllocate,
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
  const getInitials = (firstName, lastName) => {
    const firstNameInitial = firstName?.charAt(0) || "";
    const secondNameInitial = lastName?.charAt(0) || "";
    return firstNameInitial?.toUpperCase() + secondNameInitial?.toUpperCase();
  };
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [form] = Form.useForm();
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedUserIds([]);
    setActiveCard("");
    setActiveEmail([]);
    form.resetFields();
  };

  const getUserList = async ({ roleId }) => {
    const response = await getL1UsersList({
      roleId: roleId || "",
    });
    if (response?.status === "SUCCESS") {
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
  const onFinish = async (values) => {
    setIsAllocate(true);
    const response = await randomSampling({
      roleId: roleId,
      userIdList: activeEmail,
      dueDate: formatDateForIndex({ date: values.duedate, index: 1 }),
      allocatedBy: userId,
      hccFoundFilesPercentage: Number(values?.hccpercentage),
      noHccFoundFilesPercentage: Number(values?.nohccpercentage),
      tin: values?.tin,
    });
    if (response?.status == "SUCCESS") {
      setIsAllocate(false);
      getResponePopup(response);
      getAllAllocation();
      setOpen(false);
      setIsModalOpen(false);
      setAllocateDate(null);
      setActiveCard("");
      setActiveEmail([]);
      setSearch("");
      setSelectedRowsId([]);
      setSelectedRows([]);
      setSelectedUserIds([]);
    } else {
      setIsAllocate(false);
      getResponePopup(response);
    }
  };

  const handleUserSelect = (id, email) => {
    if (selectedUserIds.includes(id)) {
      setSelectedUserIds(selectedUserIds.filter((userId) => userId !== id));
      setActiveEmail(activeEmail.filter((e) => e !== email));
    } else {
      setSelectedUserIds([...selectedUserIds, id]);
      setActiveEmail([...activeEmail, email]);
    }
  };

  const handleSelectAll = () => {
    if (selectedUserIds.length === userDetails.length) {
      setSelectedUserIds([]);
    } else {
      const allIds = userDetails.map((user) => user.id);
      setSelectedUserIds(allIds);
      setActiveEmail(userDetails.map((user) => user.email));
    }
  };

  useEffect(() => {
    getUserList({ roleId: roleId });
  }, [roleId]);

  return (
    <div>
      <Modal
        open={open}
        onCancel={() => {
          setOpen(false);
          setActiveCard("");
          setActiveEmail([]);
          setSearch("");
          setAllocateDate(null);
          setSelectedUserIds([]);
        }}
        title="Select User"
        footer={false}
        width={700}
        height={100}
        className={"custom-modal"}
      >
        <div class="form-group d-flex align-items-center justify-content-between has-search">
          <FontAwesomeIcon
            className="fa fa-search form-control-feedback"
            icon={faSearch}
          />
          <InputText
            autoComplete="off"
            id="search-input"
            name="search-input"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className=" w-50 form-control new-form-control"
            placeholder="Search"
            maxLength={25}
            onKeyDown={(e) => {
              if (e.key === "\\") {
                e.preventDefault();
              }
            }}
          />
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
                className={`mx-4  ${styles.checkbox}${
                  selectedUserIds.length === userDetails.length
                    ? styles.customChecked2
                    : ""
                } `}
                type="checkbox"
                id="selectAll"
                checked={
                  userDetails.length > 0 &&
                  selectedUserIds.length === userDetails.length
                }
                onChange={handleSelectAll}
              />
            </div>
          ) : (
            ""
          )}
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
                    onClick={() => {
                      if (activeCard === item.id) {
                        setActiveCard("");
                      } else {
                        setActiveCard(item.id);
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
                    <input
                      style={{
                        width: "20px",
                        height: "20px",
                        flexShrink: "0",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                      type="checkbox"
                      checked={selectedUserIds.includes(item.id)}
                      onChange={() => handleUserSelect(item.id, item.email)}
                      className="me-2 ms-3 align-self-center"
                    />
                  </div>
                  {activeCard == item.id ? (
                    <>
                      <div className="row px-3">
                        <div className={`col-5 ${modalStyle.activeRow1}`}>
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
                setIsModalOpen(true);
                setOpen(false);
                form.resetFields();
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
        title="Random Sampling"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          name="validateOnly"
          layout="vertical"
          autoComplete="off"
          onFinish={onFinish}
        >
          <div className="mt-3 samplingSelect">
            <Form.Item
              label="Select Tin"
              name="tin"
              rules={[{ required: true, message: "Select the Tin!" }]}
            >
              <Input className="w-75" placeholder=" Tin" />
            </Form.Item>
          </div>

          <Form.Item
            rules={[
              { required: true, message: "Select the Tin!" },
              {
                pattern: /^[0-9]+$/,
                message: "Percentage must contain only numbers",
              },
            ]}
            label="Enter Percentage of File Related to HCC Condition"
            name="hccpercentage"
          >
            <Input className="w-75" placeholder=" Percentage" />
          </Form.Item>
          <Form.Item
            rules={[
              { required: true, message: "Select the Tin!" },
              {
                pattern: /^[0-9]+$/,
                message: "Percentage must contain only numbers",
              },
            ]}
            label="Enter Percentage of File Related to No HCC Condition"
            name="nohccpercentage"
          >
            <Input className="w-75" placeholder=" Percentage" />
          </Form.Item>
          <div className="samplingSelect">
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Select the Priority ",
                },
              ]}
              label="Priority"
              name="priority"
            >
              <Select
                className="w-75"
                options={priorityOptions}
                placeholder="Select Priority"
              />
            </Form.Item>
          </div>
          <div className="samplingPicker">
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Enter Due Date",
                },
              ]}
              label="Due Date"
              name="duedate"
            >
              <DatePicker className="w-75" placeholder="Due Date" />
            </Form.Item>
          </div>

          <Form.Item>
            <div className="d-flex align-items-center justify-content-center">
              <RegularButton
                loading={isAllocate}
                type="submit"
                name="Save"
                width={150}
              />
            </div>
          </Form.Item>
        </Form>
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
    randomSampling: allAction.randomSamplingAction,
  }
);
export default connector(RandomSamplingModal);
