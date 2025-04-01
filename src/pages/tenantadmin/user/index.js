import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Offcanvas } from "react-bootstrap";
import { Form, Input, Button, Select, Row, Col, notification } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import styles from "../../../styles/auth.module.css";
import Header from "../../../jsx/layouts/nav/Header";
import { encyptingPass } from "../../../components/headerFilters/functions";
import { actions as tenantAdminAction } from "../../../stores/tenantAdmin/users";
import { actions as adminAction } from "../../../stores/admin/dashboard";
import { getStorage } from "../../../utils/storages";
import { getResponePopup } from "../../../utils/reusable";
import ReusableFilters from "../../../components/reusableFilters";
import { PlusCircleFilled } from "@ant-design/icons";
import AppTable from "../../../components/tables";
const options3 = [
  { value: "true", label: "Enabled" },
  { value: "false", label: "Disabled" },
];
const RoleList = [
  { value: "REVIEWER", label: "REVIEWER" },
  { value: "SUPERVISOR", label: "SUPERVISOR" },
  { value: "TENANT_ADMIN", label: "TENANT ADMIN" },
];

const intialValues = {
  firstName: "",
  lastName: "",
  emailId: "",
  password: "",
  role: "",
  userName: "",
  mobileNumber: "",
  confirmPassword: "",
};
const UserList = ({
  getAllOrganizationList,
  organizationList,
  getAllUsersList,
  usersListData,
  loading,
  getAddUser,
  addPatients,
  getEnableUser,
  getTenantAdminSelectUserList,
  selectUserList,
}) => {
  const commonFilterItems = [
    {
      id: 1,
      title: "Search",
      type: "search",
      value: null,
      placeholder: "Search",
      active: true,
      header: "Search by UserName",
    },

    {
      id: 2,
      title: "role",
      type: "select",
      value: null,
      placeholder: " Role",
      options: RoleList,
      active: false,
    },
    {
      id: 3,
      title: "status",
      type: "select",
      value: null,
      placeholder: "Status",
      options: options3,
      active: false,
    },
    {
      id: 4,
      title: "organization",
      type: "select",
      value: null,
      placeholder: "Organization",
      options: organizationList?.response?.map((item) => ({
        value: item?.id,
        label: `${item?.name}`,
      })),
      active: false,
    },
    {
      id: 5,
      title: "createdDateRange",
      type: "rangePicker",
      value: null,
      placeholder: "Created Date Range",
      pickerType: "year",
      active: false,
    },
  ];

  const columns = [
    {
      name: "Name",
      value: {
        first: "firstName",
        last: "lastName",
        img: "profileImageUrl",
      },
      isImage: true,
    },
    {
      name: "user name",
      value: "userName",
    },

    {
      name: "ORGANIZATION",
      value: { firstValue: "organizationDTO", secondValue: "name" },
      objValue: true,
    },
    { name: "ROLE", value: "role", isComma: true },

    {
      name: "DATE CREATED ",
      value: "createdDate",
      isDateAndTime: "true",
      sortable: true,
    },
    {
      name: "MFA Status",
      value: "mfaEnabled",
      isBoolean: true,
      truthValue: "Enabled",
      falseValue: "Disabled",
    },
    {
      name: "Action",
      value: "action",
      isAction: true,
    },
    { name: "status", value: "status", isSwitchStatus: true },
  ];

  const [sort, setSort] = useState({
    createdDate: {
      sortDir: "DESC",
      sortField: "createdDate",
    },
  });
  const [localUserId, setLocalUserId] = useState("");
  const [localOrgId, setLocalOrgId] = useState("");
  const [localTenantId, setLocalTenantId] = useState("");
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [validated, setValidated] = useState(false);
  const [addUser, setAddUser] = useState(false);
  const [isStatus, setStatus] = useState(false);
  const [roleValue, setRoleValue] = useState([]);
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [useAdd, setUseAdd] = useState(false);
  const [formData, setFormData] = useState(intialValues);
  const [switchStates, setSwitchStates] = useState({});
  const [pageNo, setPageNo] = useState(0);
  const [addPatientId, setAddPatientId] = useState(false);
  const [role, setRole] = useState(null);
  const [inputValuePatientId, setInputValuePatientId] = useState({
    patientId: "",
    patientName: "",
  });
  const [activeFilters, setActiveFilters] = useState(commonFilterItems);
  const [searchText, setSearchText] = useState(null);
  const [selectedOption, setSelectedOption] = useState({});
  const [selectedDateRanges, setSelectedDateRanges] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);
  const [mobileNumber, setMobileNumber] = useState("");
  const [orgAllList, setOrgAllList] = useState("");
  const [rowData, setRowData] = useState();
  const [popoverVisible, setPopoverVisible] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedManager, setSelectedManager] = useState();
  const [isMultiple, setIsMultiple] = useState(false);
  const [roleChangeLoader, setRoleChangeLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const [openManager, setOpenManager] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    let value = e.target.value;
    const val = getDisplayValue(value);
    setMobileNumber(val);
  };
  const getDisplayValue = (number) => {
    if (number.length === 10) {
      return number.slice(0, 5) + "*****";
    }
    return number;
  };
  const addUserForm = () => {
    setValidated(false);
    setAddUser(true);
  };
  useEffect(() => {
    var orgListArray = [];
    organizationList?.response?.map((res) => {
      orgListArray.push({
        value: res.id,
        label: res.name,
      });
    });
    setOrgAllList(orgListArray);
  }, [organizationList]);
  const [clear, setClear] = useState(false);

  const [form] = Form.useForm();

  const handleSubmit = async (userFormData) => {
    const encryptedData = encyptingPass(userFormData?.password);
    userFormData.tenantId = localTenantId;
    userFormData.organizationId = userFormData.orgId;
    userFormData.role = [userFormData?.role];
    userFormData.password = encryptedData?.pass;
    userFormData.passwordIv = encryptedData.iv;
    const response = await getAddUser(userFormData, setFormData);
    if (response?.status == "SUCCESS") {
      getAllUsersList({
        pageNo: 0,
        searchText,
        selectedDateRanges,
        selectedOption,
        sort: sort,
      });
      setFormData({
        firstName: "",
        lastName: "",
        emailId: "",
        password: "",
        role: "",
        userName: "",
        mobileNumber: "",
        confirmPassword: "",
      });
      setPaginationFirst(0);
      setMobileNumber("");
      form.resetFields();
      setUseAdd(true);
      setIsLoadingBtn(false);
      getResponePopup(response);
      setRoleValue([]);
      setValidated(true);
      setAddUser(false);
    } else if (response?.status == "FAILED") {
      setAddUser(true);
      notification.warning({
        message: response.message,
        duration: 2,
      });
    } else setAddUser(false);
  };

  const switchHandler = (event, id) => {
    const isChecked = event;
    setStatus(({ isStatus }) => ({
      isStatus: {
        ...isStatus,
        [id]: isChecked,
      },
    }));
  };
 
  const handleSwitchToggle = async (item, checked) => {
    if (isLoading) return;
    setIsLoading(true);
    setSwitchStates((prevStates) => ({
      ...prevStates,
      [item.email]: checked,
    }));

    try {
      const res = await getEnableUser({
        checked: checked ? "yes" : "no",
        user: item,
      });
      if (res?.status === "SUCCESS") {
        getAllUsersList({ pageCount: 0 });
      }
    } catch (error) {
      console.error("Error toggling switch:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (usersListData?.data?.response?.content) {
      const initialSwitchStates = {};
      usersListData.data.response.content.forEach((user) => {
        initialSwitchStates[user.email] = user.accountStatus;
      });
      setSwitchStates(initialSwitchStates);
    }
  }, [usersListData]);

  const handleSubmitPatientId = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    inputValuePatientId.patientAllocated = localUserId;
    inputValuePatientId.computing = 0;
    inputValuePatientId.allocatedUserId = localUserId;
    if (form.checkValidity() === true) {
      setIsLoadingBtn(true);
      const response = await addPatients({ data: inputValuePatientId });
      if (response?.status == 200) {
        if (response.data.message == "patient Already Present") {
          setIsLoadingBtn(false);
          notification.warning({
            message: "Patient ID Already Present",
            duration: 1,
          });
        } else {
          notification.success({
            message: "Patient ID Created Successfully!",
            duration: 1,
          });
          setAddPatientId(false);
          setIsLoadingBtn(false);
        }
      } else {
        setIsLoadingBtn(false);
      }
      getAllList(localUserId, pageNo, pageSize);
    }

    setValidated(true);
  };

  const handleChangePatientId = async (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setInputValuePatientId({ ...inputValuePatientId, [key]: value });
  };
  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPageNo(e.page);
  };
  const handleRows = (value) => {
    const updatedValue = Array.isArray(value) ? value : [value];
    setSelectedRoles(updatedValue);
    setOpen(false);
  };
  const items = [
    { value: "REVIEWER", label: "Reviewer", role: "REVIEWER" },
    { value: "SUPERVISOR", label: "Supervisor", role: "SUPERVISOR" },
    { value: "TENANT_ADMIN", label: "Tenant Admin", role: "TENANT_ADMIN" },
  ];
  const getContent = (data) => {
    return (
      <div>
        <div className="d-flex justify-content-end cr-pointer">
          <CloseCircleOutlined onClick={() => setPopoverVisible(null)} />
        </div>
        <div style={{ height: "200px", width: "100%" }}>
          <div className="my-2">Change Role</div>
          <Select
            id="change-role"
            name="change-role"
            style={{ width: "300px" }}
            mode={"multiple"}
            onChange={(e) => handleRows(e, data?.role)}
            options={items || []} // Ensure it doesn't break if items is undefined
            placeholder={"Select Role"}
            defaultValue={isMultiple ? data.role : data?.role}
            onDropdownVisibleChange={(visible) => setOpen(visible)}
          />
          {selectedRoles?.length === 1 && selectedRoles[0] === "REVIEWER" && (
            <>
              <div className="mt-4 my-2">Change Manager</div>
              <Select
                id="change-manager"
                name="change-manager"
                style={{ width: "300px" }}
                onChange={handleManager}
                options={optionsUser?.length > 0 ? optionsUser : []}
                placeholder={"Change Manager"}
                open={openManager}
                value={selectedManager}
                allowClear
                onDropdownVisibleChange={(visible) => setOpenManager(visible)}
              />
            </>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "end",
          }}
        >
          <button
            id="save-btn"
            name="save-btn"
            className={styles.sendBtn}
            onClick={() => {
              handleSave();
            }}
            disabled={selectedRoles?.length === 0}
          >
            {roleChangeLoader ? "Loading...." : "Save"}
          </button>
        </div>
      </div>
    );
  };

  const handleSave = async () => {
    if (selectedRoles?.length > 0) {
      setRoleChangeLoader(true);
      const res = await getEnableUser({
        checked: null,
        user: rowData,
        role: selectedRoles,
        setPopoverVisible: setPopoverVisible,
        selectedManager: selectedManager,
        field: "addRole",
      });
      if (res?.status === "SUCCESS") {
        getAllUsersList({ pageCount: 0 });
        setPopoverVisible(null);
        setPageNo(0);
        setRoleChangeLoader(false);
      }
    }
  };
  const handleManager = (value) => {
    setSelectedManager(value);
    setOpenManager(false);
  };
  const optionsUser = selectUserList?.data?.response?.map((res) => ({
    value: res.userName,
    label: res.firstName + " " + res.lastName,
  }));
  useEffect(() => {
    if (usersListData?.data?.response) {
      setTotalElements(usersListData?.data?.response?.totalElements);
    }
  }, [usersListData]);
  useEffect(() => {
    getTenantAdminSelectUserList({ role: "SUPERVISOR" });
  }, []);
  useEffect(() => {
    var tenId = getStorage("tenantId");
    var uId = getStorage("userId");
    var orgId = getStorage("orgId");
    setFormData(intialValues);
    setLocalTenantId(tenId);
    setLocalUserId(uId);
    setLocalOrgId(orgId);
    setUseAdd(false);
    getAllUsersList({
      pageNo,
      searchText,
      selectedDateRanges,
      selectedOption,
      sort: sort,
    });
  }, [pageNo, searchText, sort, selectedDateRanges, selectedOption]);

  useEffect(() => {
    setTimeout(() => {
      setFormData(intialValues);
    }, 750);
  }, [addUser]);

  useEffect(() => {
    getAllOrganizationList();
  }, []);

  const onFinish = (values) => {
    handleSubmit(values);
  };
  const opt = {
    organization: organizationList?.response?.map((item) => ({
      value: item?.id,
      label: `${item?.name}`,
    })),
    role: RoleList,
    status: options3,
  };
  return (
    <div className={`show `}>
      <Header />
      <div className="content-body">
        <div className="container-fluid">
          <div className="table-responsive active-projects task-table">
            <div className="d-flex tbl-caption  align-items-center">
              <div style={{ width: "90%" }}>
                <ReusableFilters
                  opt={opt}
                  showFilter={true}
                  setActiveFilters={setActiveFilters}
                  setSearchText={setSearchText}
                  searchText={searchText}
                  setSelectedOption={setSelectedOption}
                  selectedOption={selectedOption}
                  setSelectedDateRanges={setSelectedDateRanges}
                  selectedDateRanges={selectedDateRanges}
                  setPageNo={setPageNo}
                  FilterItems={activeFilters}
                  selectedDates={selectedDates}
                  setSelectedDates={setSelectedDates}
                  activeFilters={activeFilters}
                  setClear={setClear}
                  clear={clear}
                  addUserForm={addUserForm}
                  addUser={false}
                  btnTitle={"Add User"}
                  form={form}
                />
              </div>
              <div
                id="user-btn"
                name="user-btn"
                className="d-flex justify-content-center align-items-center mt-3"
                style={{ width: "10%" }}
              >
                <Button
                  data-testid="add-user"
                  name="add-user"
                  onClick={() => {
                    if (form) {
                      form.resetFields();
                    }
                    addUserForm();
                  }}
                  style={{
                    background: "#04306f",
                    color: "#fff",
                    width: "100%",
                    fontSize: "12px",
                  }}
                  className="btn btn-sm w-full text-ellipsis"
                >
                  <PlusCircleFilled /> Add User
                </Button>
              </div>
            </div>
            <div id="task-tbl_wrapper" className="dataTables_wrapper no-footer">
              <>
                <AppTable
                  data={usersListData?.data?.response?.content}
                  column={columns}
                  loader={loading}
                  switchStates={switchStates}
                  onSwitchToggle={handleSwitchToggle}
                  totalLength={usersListData?.data?.response?.totalElements}
                  pageNumber={pageNo}
                  pagination={false}
                  disableUser={true}
                  rowBackground={true}
                  totalPages={usersListData?.data?.response?.totalPages}
                  setRowData={setRowData}
                  setPopoverVisible={setPopoverVisible}
                  setSelectedRoles={setSelectedRoles}
                  optionsUser={optionsUser}
                  setSelectedManager={setSelectedManager}
                  getContent={getContent}
                  popoverVisible={popoverVisible}
                  isMultiple={isMultiple}
                  sort={sort}
                  setSort={setSort}
                  name="user-paginator"
                  first={pageNo === 0 ? 0 : paginationFirst}
                  rows={15}
                  totalRecords={totalElements}
                  onPageChange={onPageChange}
                />
              </>
            </div>
          </div>
        </div>
      </div>

      <Offcanvas
        onHide={setAddPatientId}
        show={addPatientId}
        className="offcanvas-end"
        placement="end"
        id="patient-details"
        name="patient-details"
      >
        <div className="offcanvas-header">
          <h5 className="modal-title" id="#gridSystemModal">
            Add Patient Details
          </h5>
          <button
            id="add-btn"
            name="add-btn"
            type="button"
            className="btn-close"
            onClick={() => {
              setAddPatientId(false);
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="offcanvas-body">
          <div
            id="addUser-form"
            name="addUser-form"
            className={`container-fluid ${styles.formAnimation}`}
          >
            <Form
              data-testid="add-user-details"
              noValidate
              validated={validated}
              onSubmit={handleSubmitPatientId}
              autoComplete="off"
            >
              <div className="row">
                <div className="col-xl-12 mb-3">
                  <Form.Label>
                    Patient ID <span className="text-danger">*</span>{" "}
                  </Form.Label>
                  <Form.Control
                    name="patientId"
                    data-testid="patientId"
                    required
                    type="text"
                    onChange={handleChangePatientId}
                  />
                </div>
                <div className="col-xl-12 mb-3">
                  <Form.Label>
                    Patient Name <span className="text-danger">*</span>{" "}
                  </Form.Label>
                  <Form.Control
                    name="patientName"
                    data-testid="patientName"
                    required
                    type="text"
                    onChange={handleChangePatientId}
                  />
                </div>
              </div>

              <div id="">
                <Button
                  id="submit-btn"
                  name="submit-btn"
                  type="submit"
                  className="btn btn-primary btn-sm me-1"
                >
                  {isLoadingBtn ? "Loading..." : "Submit"}
                </Button>
                <Button
                  id="cancel-btn"
                  name="cancel-btn"
                  onClick={() => setAddPatientId(false)}
                  className="btn btn-danger btn-sm light ms-1"
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </Offcanvas>
      <Offcanvas
        id="add-user"
        name="add-user"
        show={addUser}
        onHide={() => {
          setAddUser(false);
          setRoleValue([]);
          setRole("");
          form.resetFields();
        }}
        className="offcanvas-end offcanvas-md-size"
        placement="end"
      >
        <div className="offcanvas-header">
          <h5 className="modal-title" id="#gridSystemModal">
            Add User
          </h5>
          <button
            id="user-btn"
            name="user-btn"
            type="button"
            className="btn-close"
            onClick={() => {
              setAddUser(false);
              form.resetFields();
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="offcanvas-body">
          <div
            id="user-form"
            name="user-form"
            className={`container-fluid ${styles.formAnimation}`}
          >
            <Form
              data-testid="control-hooks"
              form={form}
              name="control-hooks"
              onFinish={onFinish}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              autoComplete="off"
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="First Name"
                    name="firstName"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your first name!",
                      },
                    ]}
                  >
                    <Input
                      data-testid="firstName"
                      name="firstName"
                      placeholder="Enter first name"
                      autoComplete="off"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Last Name"
                    name="lastName"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your last name!",
                      },
                    ]}
                  >
                    <Input
                      data-testid="lastName"
                      name="lastName"
                      placeholder="Enter last name"
                      autoComplete="off"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Email"
                    name="emailId"
                    rules={[
                      { required: true, message: "Please enter your email!" },
                      {
                        pattern:
                          "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}(?:.[a-zA-Z]{2,})?$",
                        required: true,
                        message: "Enter the Valid Email ",
                      },
                    ]}
                  >
                    <Input
                      data-testid="emailId"
                      name="emailId"
                      placeholder="Enter email"
                      autoComplete="off"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="User Name"
                    name="userName"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your username!",
                      },
                      {
                        validator: (_, value) => {
                          if (value && value.includes("@")) {
                            return Promise.reject(
                              "Username should not contain @ symbol"
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input
                      data-testid="userName"
                      name="userName"
                      placeholder="Enter user name"
                      autoComplete="off"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="role"
                    label="Role"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Select
                      data-testid="role"
                      name="role"
                      placeholder="Select role"
                      allowClear
                      style={{ height: "42px" }}
                    >
                      <Select.Option value="REVIEWER">REVIEWER</Select.Option>
                      <Select.Option value="SUPERVISOR">
                        SUPERVISOR
                      </Select.Option>
                      <Select.Option value="TENANT_ADMIN">
                        TENANT ADMIN
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Select Organization"
                    name="orgId"
                    rules={[
                      {
                        required: true,
                        message: "Please select Organization!",
                      },
                    ]}
                  >
                    <Select
                      data-testid="orgId"
                      name="orgId"
                      placeholder="Select"
                      options={orgAllList}
                      style={{ height: "42px" }}
                      allowClear
                    />
                  </Form.Item>
                </Col>
              </Row>

              <input type="password" style={{ display: "none" }} />

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Password"
                    name="password"
                    dependencies={["password"]}
                    rules={[
                      {
                        required: true,
                        message: "Please enter your password!",
                      },
                      {
                        validator: (_, value) =>
                          value &&
                          value.length >= 8 &&
                          /[a-z]/.test(value) &&
                          /[A-Z]/.test(value) &&
                          /\d/.test(value) &&
                          /[!@#$%^&*(),.?":{}|<>]/.test(value)
                            ? Promise.resolve()
                            : Promise.reject(
                                "Password must be at least 8 characters, with at least one lowercase, one uppercase, one number, and one special character!"
                              ),
                      },
                    ]}
                  >
                    <div
                      id="input-password"
                      name="input-password"
                      className="confirmPass"
                    >
                      <input type="password" style={{ display: "none" }} />
                      <Input.Password
                        name="password"
                        data-testid="password"
                        placeholder="Enter password"
                        autoComplete="new-password"
                      />
                    </div>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Confirm Password"
                    name="confirmPassword"
                    dependencies={["password"]}
                    rules={[
                      {
                        required: true,
                        message: "Please confirm your password!",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            "Passwords do not match. Please verify and re-enter."
                          );
                        },
                      }),
                    ]}
                  >
                    <div
                      id="input-confirmpassword"
                      name="input-confirmpassword"
                      className="confirmPass"
                    >
                      <input type="password" style={{ display: "none" }} />
                      <Input.Password
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Re-enter the password"
                        autoComplete="new-password"
                      />
                    </div>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Mobile Number"
                    name="mobileNumber"
                    rules={[
                      {
                        required: true,
                        max: 10,
                        message: "Please enter your mobile number!",
                      },
                      {
                        pattern: /^[0-9]{10}$/,
                        message: "Please enter a valid 10-digit mobile number!",
                      },
                    ]}
                  >
                    <Input
                      id="mobileNumber"
                      name="mobileNumber"
                      type="text"
                      placeholder="Enter mobile number"
                      autoComplete="off"
                      value={getDisplayValue(mobileNumber)}
                      onChange={handleChange}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <div
                id="fake-user"
                name="fake-user"
                style={{ display: "flex", gap: "8px" }}
              >
                <input
                  type="text"
                  name="fakeusernameremembered"
                  id="fakeusernameremembered"
                  value=""
                  style={{ display: "none" }}
                />
                <input
                  type="password"
                  name="fakepasswordremembered"
                  id="fakepasswordremembered"
                  value=""
                  style={{ display: "none" }}
                />
                <Form.Item>
                  <Button
                    type="primary"
                    className="btn btn-sm ms-2 flr width-max-content custom-btn-style"
                    htmlType="submit"
                    data-id="submit-btn"
                    name="submit-btn"
                  >
                    Submit
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button
                    data-testid="cancle-btn"
                    name="cancel-btn"
                    style={{
                      backgroundColor: "#ffdede",
                      color: "#ff5e5e",
                      borderColor: "#ffdede",
                    }}
                    onClick={() => {
                      setAddUser(false);
                      setRoleValue([]);
                      setRole("");
                      form.resetFields();
                      setMobileNumber("");
                    }}
                  >
                    Cancel
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </div>
        </div>
      </Offcanvas>
    </div>
  );
};

const enhancer = connect(
  (state) => ({
    organizationList: state?.tenantAdmin?.users?.allOrganization?.data,
    usersListData: state?.tenantAdmin?.users?.allUsers,
    loading: state?.tenantAdmin?.users?.allUsersLoading,
    selectUserList: state?.admin.dashboard?.managersList,
  }),
  {
    getAllOrganizationList: tenantAdminAction.getAllOrganizationAction,
    getAllUsersList: tenantAdminAction.getAllUsersAction,
    getAddUser: tenantAdminAction.getAddUser,
    addPatients: tenantAdminAction.addPatient,
    getEnableUser: tenantAdminAction.getEnableUser,
    getTenantAdminSelectUserList: adminAction.getSelectUserList,
  }
);
export default enhancer(UserList);
