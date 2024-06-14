import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Offcanvas } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Form, Input, Button, Select, Row, Col, notification } from "antd";
import styles from "../../../styles/auth.module.css";
import ENDPOINTS from "../../../utility/enpoints";
import axios from "../../../utility/axiosConfig";
import AdminList from "../../../components/table/admin/adminList/adminList";
import Header from "../../../jsx/layouts/nav/Header";
import HeaderFilters from "../../../components/headerFilters";
import { getUsers } from "../../../store/actions/adminAction/usersAction";
import { AddUser } from "../../../services/adminServices/usersService";
import { Paginator } from "primereact/paginator";
import {
  encyptingPass,
  getValidatePassword,
} from "../../../components/headerFilters/functions";
const { Option } = Select;
const options3 = [
  { value: "ALL", label: "ALL" },
  { value: "true", label: "Enabled" },
  { value: "false", label: "Disabled" },
];
const RoleList = [
  { value: "", label: "ALL" },
  { value: "ADMIN", label: "ADMIN" },
  { value: "REVIEWER", label: "REVIEWER" },
  { value: "SUPERVISOR", label: "SUPERVISOR" },
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
const UserList = () => {
  const dispatch = useDispatch();
  const usersData = useSelector((state) => state.adminUsers.usersData);
  const sideMenu = useSelector((state) => state.sideMenu);
  const [localUserId, setLocalUserId] = useState("");
  const [localOrgId, setLocalOrgId] = useState("");
  const [localTenantId, setLocalTenantId] = useState("");
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [validated, setValidated] = useState(false);
  const [userListAll, setUserListAll] = useState([]);
  const [addUser, setAddUser] = useState(false);
  const [isStatus, setStatus] = useState(false);
  const [roleValue, setRoleValue] = useState([]);
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  const [totalElements, setTotalElements] = useState(10);
  const [sortOrder, setSortOrder] = useState("DESC");
  const [sort, setSort] = useState({ sortDir: "", sortField: "" });
  const [useAdd, setUseAdd] = useState(false);
  const [formData, setFormData] = useState(intialValues);
  const [pageCount, setPageCount] = useState(0);
  const [addPatientId, setAddPatientId] = useState(false);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setSelectedStatus] = useState("");
  const [selectedDates, setSelectedDates] = useState();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [inputValuePatientId, setInputValuePatientId] = useState({
    patientId: "",
    patientName: "",
  });

  const [mobileNumber, setMobileNumber] = useState("");

  const handleChange = (e) => {
    let value = e.target.value;
    const val=getDisplayValue(value)
      setMobileNumber(val);
  };
  const getDisplayValue = (number) => {
    if (number.length === 10) {
      return number.slice(0, 7) + "***";
    }
    return number;
  };
  const addUserForm = () => {
    setValidated(false);
    setAddUser(true);
  };
  const [clear, setClear] = useState(false);

  const [form] = Form.useForm();

  const handleSubmit = async (userFormData) => {
    const encrptedData = encyptingPass(userFormData?.password);
    userFormData.tenantId = localTenantId;
    userFormData.organizationId = localOrgId;
    userFormData.role = [userFormData?.role];
    userFormData.password = encrptedData?.pass;
    userFormData.passwordIv = encrptedData.iv;
    const response = await AddUser(userFormData, setFormData);
    if (response?.data?.status === "SUCCESS") {
      setAddUser(false);
      setUseAdd(true);
      form.resetFields();
      setIsLoadingBtn(false);
      setMobileNumber("");
    }
    setRoleValue([]);
    setValidated(true);
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
      const response = await axios.post(
        ENDPOINTS.apiEndoint + `dbservice/patient`,
        inputValuePatientId
      );
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
      // setAddPatientId(false);
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
    setPageCount(e.page);
  };

  useEffect(() => {
    if (usersData) {
      setUserListAll(usersData);
      setTotalElements(usersData?.data?.response?.totalElements);
    }
  }, [usersData]);
  useEffect(() => {
    var tenId = localStorage.getItem("tenantId");
    var uId = localStorage.getItem("userId");
    var orgId = localStorage.getItem("orgId");
    setFormData(intialValues);
    setLocalTenantId(tenId);
    setLocalUserId(uId);
    setLocalOrgId(orgId);
    setUseAdd(false);
    dispatch(
      getUsers({
        pageCount,
        search,
        startDate,
        endDate,
        status,
        role,
        sort,
      })
    );
  }, [
    pageCount,
    search,
    startDate,
    endDate,
    status,
    role,
    sort,
    useAdd,
    clear,
  ]);

  useEffect(() => {
    setTimeout(() => {
      setFormData(intialValues);
    }, 750);
  }, [addUser]);

  const onFinish = (values) => {
    handleSubmit(values);
  };

  return (
    <div className={`show ${sideMenu ? "menu-toggle" : ""}`}>
      <Header />
      <div class="content-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-12">
              <div className="card-body p-0">
                <div className="table-responsive active-projects task-table">
                  <div className="tbl-caption  align-items-center">
                    <HeaderFilters
                      setSearch={setSearch}
                      isSearch={true}
                      searchlabel="Search By Username"
                      search={search}
                      // select status
                      selectlabel="Select Status"
                      isSelector={true}
                      setSelectedOption={setSelectedStatus}
                      selectOptions={options3}
                      defaultSelectValue1={""}
                      selectedValue={status}
                      //  selecte Role
                      selectlabel2="Select Role"
                      selectOptions2={RoleList}
                      defaultSelectValue2={""}
                      setSelectedOption2={setRole}
                      selectedValue2={role}
                      // computation date
                      pickerlabel="Created date Range"
                      selectedDates={selectedDates}
                      setSelectedDates={setSelectedDates}
                      defaultStartDate={""}
                      defaultEndDate={""}
                      setStartDate={setStartDate}
                      setEndDate={setEndDate}
                      pickerStartValue={startDate}
                      pickerEndValue={endDate}
                      isRangePickerUsers={true}
                      addUser={true}
                      addUserForm={addUserForm}
                      btnTitle="Add User"
                      setClear={setClear}
                      clear={clear}
                      addBtn={true}
                      disable="Yes"
                      form={form}
                      setMobileNumber={setMobileNumber}
                    />
                  </div>
                  <div
                    id="task-tbl_wrapper"
                    className="dataTables_wrapper no-footer"
                  >
                    <AdminList
                      userList={userListAll?.data?.response?.content}
                      switchHandler={switchHandler}
                      setPageCount={setPageCount}
                      sortOrder={sortOrder}
                      setSortOrder={setSortOrder}
                      setSort={setSort}
                    />

                    <div>
                      <div className="pagination-container">
                        <Paginator
                          first={paginationFirst}
                          rows={15}
                          totalRecords={totalElements}
                          onPageChange={onPageChange}
                        />
                        <div className="total-pages">
                          Total count: {totalElements}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Offcanvas
        onHide={setAddPatientId}
        show={addPatientId}
        className="offcanvas-end"
        placement="end"
      >
        <div className="offcanvas-header">
          <h5 className="modal-title" id="#gridSystemModal">
            Add Patient Details
          </h5>
          <button
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
                    required
                    type="text"
                    onChange={handleChangePatientId}
                  />
                </div>
              </div>

              <div>
                <Button type="submit" className="btn btn-primary btn-sm me-1">
                  {isLoadingBtn ? "Loading..." : "Submit"}
                </Button>
                <Button
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
                      <Input placeholder="Enter last name" autoComplete="off" />
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
                        type: "email",
                        message: "Please enter a valid email!",
                      },
                    ]}
                  >
                    <div>
                      <Input placeholder="Enter email" autoComplete="off" />
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
                      <Input placeholder="Enter user name" autoComplete="off" />
                    </div>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Mobile Number"
                    name="mobileNumber"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your mobile number!",
                      },
                      {
                        len: 10,
                        message: "Please enter a valid 10-digit mobile number!",
                      },
                    ]}
                  >
                    <div>
                      <Input
                        type="text"
                        placeholder="Enter mobile number"
                        autoComplete="off"
                        value={mobileNumber}
                        onChange={handleChange}
                      />
                    </div>
                  </Form.Item>
                </Col>
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
                      placeholder="Select role"
                      allowClear
                      style={{ height: "42px" }}
                    >
                      <Select.Option value="REVIEWER">REVIEWER</Select.Option>
                      <Select.Option value="SUPERVISOR">
                        SUPERVISOR
                      </Select.Option>
                    </Select>
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
                        validator: (_, value) => {
                          if (
                            value?.length === 0 ||
                            !/[a-z]/.test(value) ||
                            !/[A-Z]/.test(value)
                          ) {
                            return Promise.reject(
                              "Keep it strong! Your password must be case sensitive"
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <div className="confirmPass">
                      <input type="password" style={{ display: "none" }} />
                      <Input.Password
                        // style={{ height: "42px" }}
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
                        // style={{
                        //   height: "42px",
                        // }}
                        placeholder="Re-enter the password"
                        autoComplete="new-password"
                      />
                    </div>
                  </Form.Item>
                </Col>
              </Row>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  name="fakeusernameremembered"
                  value=""
                  style={{ display: "none" }}
                />
                <input
                  type="password"
                  name="fakepasswordremembered"
                  value=""
                  style={{ display: "none" }}
                />
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button
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

export default UserList;
