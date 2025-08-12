import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, DatePicker, Form, Input, Modal, Select } from "antd";
import modalStyle from "../../../pages/tenantadmin/allocateduser/allocate/style.module.css";
import { useEffect, useState } from "react";
import { faSearch, faUser, faCircle } from "@fortawesome/free-solid-svg-icons";
import { actions as allActions } from "../../../stores/admin/patientAllocation";
import { connect } from "react-redux";
import { formatDateForIndex, getResponePopup } from "../../../utils/reusable";
import styles from "../../../components/tables/table.module.css";
import { getStorage } from "../../../utils/storages";
import TableSkeleton from "../../../components/skeleton/table";
import RegularButton from "../../../components/button";
import { actions as allAction } from "../../../stores/tenantAdmin/patientAllocations";
import {
  disablePastDate,
  priorityOptions,
} from "../../../components/headerFilters/functions";
import { patientAllocationPageId } from '../../../utils/pageIds'

const RandomSamplingModal = ({
  open,
  setOpen,
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
  getAllTabRoles,
  roleAliasName,
  setFormValues,
  formValues,
  form,
}) => {
  // const [form] = Form.useForm();
  const tinNumber = getStorage("tinNumber");
  const userId = getStorage("userId");
  const [activeCard, setActiveCard] = useState("");
  const [search, setSearch] = useState("");
  const [userDetails, setUserDetails] = useState([]);
  const [activeEmail, setActiveEmail] = useState([]);
  // const [formValues, setFormValues] = useState({});
  const [statusCount, setStatusCount] = useState([]);
  const getInitials = (firstName, lastName) => {
    const firstNameInitial = firstName?.charAt(0) || "";
    const secondNameInitial = lastName?.charAt(0) || "";
    return firstNameInitial?.toUpperCase() + secondNameInitial?.toUpperCase();
  };
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [roles, setRoles] = useState([]);
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedUserIds([]);
    setActiveCard("");
    setActiveEmail([]);
    setFormValues({});
    form.resetFields();
  };
  const aliasOptions = userDetails
    .filter(
      (item, index, self) =>
        index === self.findIndex((i) => i.aliasName === item.aliasName)
    )
    .map((item) => ({
      label: item.aliasName?.split("_")?.join(" "),
      value: item.role,
    }));

  const getUserList = async ({ roleId, search }) => {
    const response = await getL1UsersList({
      roleId: roleAliasName === "MASTER_AUDIT" ? roles || "" : roleId || "",
      search: search,
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
          aliasName: item.aliasName,
          proxyId: item.proxyId,
        };
      });
      setStatusCount(response?.response);
      setUserDetails(user);
    }
  };
  const onFinish = async (values) => {
    setFormValues(values);
    setOpen(true);
    setIsModalOpen(false);
  };
  const handleSaveUsers = async () => {
    if (!formValues) return;
    setIsAllocate(true);
    let payload;
    if (roleAliasName === "MASTER_AUDIT") {
      payload = {
        roleId: roleId,
        usersWithRole: activeEmail,
        dueDate: formatDateForIndex({ date: formValues.duedate, index: 1 }),
        allocatedBy: userId,
        randomSamplingPercentage: Number(formValues?.totalPercentage),
        hccFoundFilesPercentage: Number(formValues?.hccpercentage),
        noHccFoundFilesPercentage: Number(formValues?.nohccpercentage),
        tin: tinNumber,
        priority: formValues?.priority,
        masterAudit: true,
      };
    } else {
      payload = {
        roleId: roleId,
        userIdList: activeEmail.map((user) => user.username),
        dueDate: formatDateForIndex({ date: formValues.duedate, index: 1 }),
        allocatedBy: userId,
        randomSamplingPercentage: Number(formValues?.totalPercentage),
        hccFoundFilesPercentage: Number(formValues?.hccpercentage),
        noHccFoundFilesPercentage: Number(formValues?.nohccpercentage),
        tin: tinNumber,
        priority: formValues?.priority,
      };
    }
    const response = await randomSampling(payload);
    setIsAllocate(false);
    if (response?.status === "SUCCESS") {
      getResponePopup(response);
      getAllTabRoles({
        pageId: patientAllocationPageId,
      });
      getAllAllocation();
      setFormValues({});
      setOpen(false);
      setIsModalOpen(false);
      setActiveCard("");
      setActiveEmail([]);
      setSearch("");
      setSelectedRowsId([]);
      setSelectedRows([]);
      setSelectedUserIds([]);
      setRoles([]);
      form.resetFields();
    } else {
      getResponePopup(response);
    }
  };
  const handleUserSelect = (proxyId, email, role) => {
    if (selectedUserIds.includes(proxyId)) {
      setSelectedUserIds((prev) => prev.filter((id) => id !== proxyId));
      setActiveEmail((prev) => prev.filter((e) => e.username !== email));
    } else {
      setSelectedUserIds((prev) => [...prev, proxyId]);
      setActiveEmail((prev) => [...prev, { username: email, roleId: role }]);
    }
  };

  const handleSelectAll = () => {
    if (selectedUserIds.length === userDetails.length) {
      setSelectedUserIds([]);
      setActiveEmail([]);
    } else {
      const allIds = userDetails.map((user) => user.proxyId);
      const user = userDetails.map((user) => ({
        username: user.email,
        roleId: user.role,
      }));
      setSelectedUserIds(allIds);
      setActiveEmail(user);
    }
  };
  const handleRoleChange = (value) => {
    setRoles(value);
     setSelectedUserIds([]);
    setActiveEmail([]);
  };
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

  useEffect(() => {
    if (roleId) {
      getUserList({
        roleId: roleAliasName === "MASTER_AUDIT" ? roles || "" : roleId || "",
        search: search,
        masterAudit: roleAliasName === "MASTER_AUDIT" ? true : false,
      });
    }
  }, [roleId, search, roleAliasName, roles]);

  return (
    <div>
      <Modal
        open={open}
        onCancel={() => {
          setOpen(false);
          setActiveCard("");
          setActiveEmail([]);
          setSearch("");
          setSelectedUserIds([]);
          setFormValues({});
          form.resetFields();
          setRoles([]);
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
            options={
              roleAliasName === "MASTER_AUDIT"
                ? [
                    { value: "7", label: "QA Lead" },
                    { value: "2", label: "Owner" },
                  ]
                : aliasOptions || []
            }
            allowClear
            value={roles}
            onChange={handleRoleChange}
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
                  <div className="d-flex justify-content-between">
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
                    {/* <input
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
                        handleUserSelect(item.proxyId, item.email, item.role)
                      }
                      className="me-2 ms-3 align-self-center"
                    /> */}
                    <input
                      type="checkbox"
                      style={{
                        width: "20px",
                        height: "20px",
                        flexShrink: "0",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                      checked={selectedUserIds.includes(item.proxyId)}
                      onChange={() =>
                        handleUserSelect(item.proxyId, item.email, item.role)
                      }
                      disabled={
                        !selectedUserIds.includes(item.proxyId) &&
                        activeEmail.some((e) => e.username === item.email)
                      }
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
              name={"Save"}
              type="submit"
              onClick={handleSaveUsers}
              disabled={activeEmail.length === 0 || isAllocate}
              loading={isAllocate}
            ></RegularButton>
          </div>
        ) : null}
      </Modal>
      <Modal
        title={
          roleAliasName === "MASTER_AUDIT"
            ? " Master Audit Sampling"
            : "Random Sampling"
        }
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
          onValuesChange={(changedValues, allValues) => {
            const hcc = allValues.hccpercentage;
            const nohcc = allValues.nohccpercentage;

            if ("hccpercentage" in changedValues) {
              const hccValue = parseInt(changedValues.hccpercentage);
              if (!isNaN(hccValue) && hccValue >= 0 && hccValue <= 100) {
                form.setFieldsValue({
                  nohccpercentage: 100 - hccValue,
                });
              }
            } else if ("nohccpercentage" in changedValues) {
              const nohccValue = parseInt(changedValues.nohccpercentage);
              if (!isNaN(nohccValue) && nohccValue >= 0 && nohccValue <= 100) {
                form.setFieldsValue({
                  hccpercentage: 100 - nohccValue,
                });
              }
            }
          }}
        >
          <div className="mt-3 samplingSelect"></div>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Enter Total Percentage !",
              },
              {
                pattern: /^(100|[1-9][0-9]?|0)$/,
                message:
                  "Percentage must be a number between 0 and 100 with no decimals or letters",
              },
            ]}
            label="Enter Total Percentage "
            name="totalPercentage"
          >
            <Input className="w-75" placeholder="Percentage" />
          </Form.Item>
          <Form.Item
            label="Enter Percentage of File Related to HCC Condition"
            name="hccpercentage"
            rules={[
              {
                required: true,
                message: "Enter Percentage!",
              },
              {
                pattern: /^(100|[1-9][0-9]?|0)$/,
                message: "Percentage must be a whole number between 0 and 100",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const other = getFieldValue("nohccpercentage");
                  if (
                    value !== undefined &&
                    other !== undefined &&
                    parseInt(value) + parseInt(other) !== 100
                  ) {
                    return Promise.reject(
                      new Error("The total must be exactly 100")
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input className="w-75" placeholder="Percentage" />
          </Form.Item>

          <Form.Item
            label="Enter Percentage of File Related to No HCC Condition"
            name="nohccpercentage"
            rules={[
              {
                required: true,
                message: "Enter Percentage!",
              },
              {
                pattern: /^(100|[1-9][0-9]?|0)$/,
                message: "Percentage must be a whole number between 0 and 100",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const other = getFieldValue("hccpercentage");
                  if (
                    value !== undefined &&
                    other !== undefined &&
                    parseInt(value) + parseInt(other) !== 100
                  ) {
                    return Promise.reject(
                      new Error("The total must be exactly 100")
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input
              className="w-75"
              placeholder="Percentage"
              disabled={!!form.getFieldValue("nohccpercentage")}
            />

            {/* <Input className="w-75" placeholder="Percentage" /> */}
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
              <DatePicker
                format="MM-DD-YYYY"
                className="w-75"
                placeholder="Due Date"
                disabledDate={(current) => disablePastDate(current)}
              />
            </Form.Item>
          </div>

          <Form.Item>
            <div className="d-flex align-items-center justify-content-center">
              <RegularButton type="submit" name="Next" width={150} />
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
    getAllTabRoles: allAction.getAllRoles,
  }
);
export default connector(RandomSamplingModal);
