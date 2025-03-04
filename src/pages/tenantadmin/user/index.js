import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Offcanvas } from "react-bootstrap";
import { Form, Input, Button, Select, Row, Col, notification } from "antd";
import styles from "../../../styles/auth.module.css";
import Header from "../../../jsx/layouts/nav/Header";
import { Paginator } from "primereact/paginator";
import { encyptingPass } from "../../../components/headerFilters/functions";
import { actions as tenantAdminAction } from "../../../stores/tenantAdmin/users";
import UsersList from "../../../components/table/tenantTable/usersList/usersList";
import { getStorage } from "../../../utils/storages";
import { getResponePopup } from "../../../utils/reusable";
import TableSkeleton from "../../../components/skeleton/table";
import ReusableFilters from "../../../components/reusableFilters";
import { PlusCircleFilled } from "@ant-design/icons";
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
}) => {
  const commonFilterItems = [
    {
      id: 1,
      title: "Search",
      type: "search",
      value: null,
      placeholder: "Search",
      header: "Search by UserName",
    },

    {
      id: 2,
      title: "role",
      type: "select",
      value: null,
      placeholder: " Role",
      options: RoleList,
    },
    {
      id: 3,
      title: "status",
      type: "select",
      value: null,
      placeholder: "Status",
      options: options3,
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
    },
    {
      id: 5,
      title: "createdDateRange",
      type: "rangePicker",
      value: null,
      placeholder: "Created Date Range",
      pickerType: "year",
    },
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
  const [totalElements, setTotalElements] = useState(10);
  const [sortOrder, setSortOrder] = useState("DESC");
  const [useAdd, setUseAdd] = useState(false);
  const [formData, setFormData] = useState(intialValues);
  const [pageNo, setPageNo] = useState(0);
  const [addPatientId, setAddPatientId] = useState(false);
  const [role, setRole] = useState(null);
  const [inputValuePatientId, setInputValuePatientId] = useState({
    patientId: "",
    patientName: "",
  });
  const [activeFilters, setActiveFilters] = useState(["Search"]);
  const [searchText, setSearchText] = useState(null);
  const [selectedOption, setSelectedOption] = useState({});
  const [selectedDateRanges, setSelectedDateRanges] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);
  // const [pageNumber, setPageNumber] = useState(0);
  const [mobileNumber, setMobileNumber] = useState("");
  const [orgAllList, setOrgAllList] = useState("");

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

  useEffect(() => {
    if (usersListData?.data?.response) {
      setTotalElements(usersListData?.data?.response?.totalElements);
    }
  }, [usersListData]);
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
      sort: sort?.sort,
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

  return (
    <div className={`show `}>
      <Header />
      <div className="content-body">
        <div className="container-fluid">
          <div className="table-responsive active-projects task-table">
            <div className="d-flex tbl-caption  align-items-center">
              <div style={{ width: "90%" }}>
                <ReusableFilters
                  showFilter={true}
                  setActiveFilters={setActiveFilters}
                  setSearchText={setSearchText}
                  searchText={searchText}
                  setSelectedOption={setSelectedOption}
                  selectedOption={selectedOption}
                  setSelectedDateRanges={setSelectedDateRanges}
                  selectedDateRanges={selectedDateRanges}
                  setPageNo={setPageNo}
                  FilterItems={commonFilterItems}
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
                className="d-flex justify-content-center align-items-center mt-3"
                style={{ width: "10%" }}
              >
                <Button
                  id={"Add User"}
                  name={"Add User"}
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
              {loading ? (
                <TableSkeleton />
              ) : (
                <>
                  <UsersList
                    switchHandler={switchHandler}
                    setPageNo={setPageNo}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                    setSort={setSort}
                    sort={sort}
                  />

                  <div>
                    <div className="pagination-container">
                      <Paginator
                        id="user-paginator"
                        name="user-paginator"
                        first={pageNo === 0 ? 0 : paginationFirst}
                        rows={15}
                        totalRecords={totalElements}
                        onPageChange={onPageChange}
                      />
                      <div className="total-pages">
                        Total count: {totalElements}
                      </div>
                    </div>
                  </div>
                </>
              )}
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
          <div className={`container-fluid ${styles.formAnimation}`}>
            <Form
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
                    id="patientId"
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
                    id="patientName"
                    required
                    type="text"
                    onChange={handleChangePatientId}
                  />
                </div>
              </div>

              <div>
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
          <div className={`container-fluid ${styles.formAnimation}`}>
            <Form
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
                    <div>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="Enter first name"
                        autoComplete="off"
                      />
                    </div>
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
                    <div>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Enter last name"
                        autoComplete="off"
                      />
                    </div>
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
                    <div>
                      <Input
                        id="emailId"
                        name="emailId"
                        placeholder="Enter email"
                        autoComplete="off"
                      />
                    </div>
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
                    <div>
                      <Input
                        id="userName"
                        name="userName"
                        placeholder="Enter user name"
                        autoComplete="off"
                      />
                    </div>
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
                      id="role"
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
                      id="orgId"
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
                    <div className="confirmPass">
                      <input type="password" style={{ display: "none" }} />
                      <Input.Password
                        name="password"
                        id="password"
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
                    <div className="confirmPass">
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
                    <div>
                      <Input
                        id="mobileNumber"
                        name="mobileNumber"
                        type="text"
                        placeholder="Enter mobile number"
                        autoComplete="off"
                        value={getDisplayValue(mobileNumber)}
                        onChange={handleChange}
                      />
                    </div>
                  </Form.Item>
                </Col>
              </Row>
              <div style={{ display: "flex", gap: "8px" }}>
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
                    id="submit-btn"
                    name="submit-btn"
                  >
                    Submit
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button
                    id="cancle-btn"
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
  }),
  {
    getAllOrganizationList: tenantAdminAction.getAllOrganizationAction,
    getAllUsersList: tenantAdminAction.getAllUsersAction,
    getAddUser: tenantAdminAction.getAddUser,
    addPatients: tenantAdminAction.addPatient,
  }
);
export default enhancer(UserList);
