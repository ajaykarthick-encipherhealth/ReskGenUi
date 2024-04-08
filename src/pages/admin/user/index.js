import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Offcanvas } from "react-bootstrap";
import { useSelector } from "react-redux";
import { notification } from "antd";
import Form from "react-bootstrap/Form";
import styles from "../../../styles/auth.module.css";
import ENDPOINTS from "../../../utility/enpoints";
import axios from "../../../utility/axiosConfig";
import AdminList from "../../../components/table/admin/adminList/adminList";
import Header from "../../../jsx/layouts/nav/Header";
import HeaderFilters from "../../../components/headerFilters";
import Select from "react-select";
import {
  getAddUser,
  getUsers,
} from "../../../store/actions/adminAction/usersAction";
import { AddUser } from "../../../services/adminServices/usersService";
import { Paginator } from "primereact/paginator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { handleTogglePasswordVisibility } from "../../../components/headerFilters/functions";

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
  const [roleValue, setRoleValue] = useState("");
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

  const addUserForm = () => {
    setValidated(false);
    setAddUser(true);
  };
  const [clear, setClear] = useState(false);

  const handleChange = async (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setFormData({ ...formData, [key]: value });
    if (key == "role") {
      setRoleValue([value]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === true) {
      formData.tenantId = localTenantId;
      formData.organizationId = localOrgId;
      formData.role = roleValue ? roleValue : [role.toUpperCase()];
      const response = await AddUser(formData, setFormData);
      if (response?.data?.status === "SUCCESS") {
        setAddUser(false);
        setUseAdd(true);
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

        setIsLoadingBtn(false);
      }
    }

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
        ENDPOINTS.apiEndointFileUploadHcc + `dbservice/patient`,
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
    }, 650);
  }, [addUser]);
  const getValidatePassword = (formData) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

    if (formData?.password?.length === 0) return "Please enter password";
    if (formData?.password?.length < 8)
      return "Password should be greater than 8 characters";
    if (formData?.password?.length > 14)
      return "Password should be less than 14 characters";
    if (
      formData?.password?.length > 0 &&
      !passwordRegex.test(formData?.password)
    )
      return "Password must contain at least 1 capital letter, 1 small letter, 1 number, and 1 special character";
    else {
      return "";
    }
  };

  return (
    <>
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
                        isRangePicker={true}
                        addUser={true}
                        addUserForm={addUserForm}
                        btnTitle="Add User"
                        setClear={setClear}
                        clear={clear}
                        addBtn={true}
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
            setFormData(intialValues);
          }}
          className="offcanvas-end  offcanvas-md-size"
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
                setFormData();
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
                onSubmit={handleSubmit}
                autoComplete="off"
              >
                <div className="row">
                  <div className="col-xl-6 mb-3">
                    <Form.Label>
                      First Name <span className="text-danger">*</span>{" "}
                    </Form.Label>
                    <Form.Control
                      name="firstName"
                      required
                      type="text"
                      onChange={handleChange}
                      placeholder="Enter First Name"
                    />
                    {validated ? (
                      <div className="text-danger fs-12">
                        {formData?.firstName?.length === 0
                          ? "Please enter the firstname"
                          : ""}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="col-xl-6 mb-3">
                    <Form.Label>
                      Last Name <span className="text-danger">*</span>{" "}
                    </Form.Label>
                    <Form.Control
                      name="lastName"
                      required
                      type="text"
                      onChange={handleChange}
                      placeholder="Enter Last Name"
                    />
                    {validated ? (
                      <div className="text-danger fs-12">
                        {formData?.lastName?.length === 0
                          ? "Please enter the lastname"
                          : ""}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="col-xl-6 mb-3">
                    <Form.Label>
                      Email <span className="text-danger">*</span>{" "}
                    </Form.Label>
                    <Form.Control
                      name="emailId"
                      required
                      type="email"
                      onChange={handleChange}
                      placeholder="Enter Email"
                    />
                    {validated ? (
                      <div className="text-danger fs-12">
                        {formData?.emailId?.length === 0
                          ? "Please enter the email"
                          : !formData.emailId.includes("@")
                          ? "Please enter valid email"
                          : ""}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="col-xl-6 mb-3">
                    <Form.Label>
                      User Name <span className="text-danger">*</span>{" "}
                    </Form.Label>
                    <div className="input-group mb-3">
                      <Form.Control
                        name="userName"
                        required
                        type="text"
                        onChange={handleChange}
                        placeholder="Enter User Name"
                        autoComplete="none"
                        value={formData?.userName}
                      />
                    </div>
                    {validated ? (
                      <div className="text-danger fs-12">
                        {formData?.userName?.length === 0
                          ? "Please enter the username"
                          : formData.userName.includes("@")
                          ? "Username shopuld not contain @ symbol"
                          : ""}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="col-xl-6 mb-3">
                    <Form.Label>
                      Mobile Number <span className="text-danger">*</span>{" "}
                    </Form.Label>
                    <Form.Control
                      name="mobileNumber"
                      required
                      type="number"
                      onChange={handleChange}
                      placeholder="Enter Mobile Number"
                      value={formData?.mobileNumber}
                    />
                    {validated ? (
                      <div className="text-danger fs-12">
                        {formData?.mobileNumber?.length === 0
                          ? "Please enter the mobileNumber"
                          : formData?.mobileNumber?.length > 10 ||
                            formData?.mobileNumber?.length < 10
                          ? "Please enter valid mobileNumber"
                          : ""}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="col-xl-6 mb-3">
                    <Form.Label>
                      Role <span className="text-danger">*</span>{" "}
                    </Form.Label>
                    <div
                      style={{
                        border:
                          validated &&
                          formData?.role?.length === 0 &&
                          "1px solid red",
                        borderRadius: "8px",
                      }}
                    >
                      <Select
                        className="addUserSelector"
                        name="role"
                        options={[
                          { value: "ADMIN", label: "ADMIN" },
                          { value: "REVIEWER", label: "REVIEWER" },
                          { value: "SUPERVISOR", label: "SUPERVISOR" },
                          {
                            value: "ADMIN_TECHNICAL_SUPPORT",
                            label: "ADMIN TECHNICAL SUPPORT",
                          },
                          { value: "L2AUDITOR", label: "ADMIN MEDICAL CODER" },
                        ]}
                        onChange={(selectedOption) =>
                          handleChange({
                            target: {
                              name: "role",
                              value: selectedOption.value,
                            },
                          })
                        }
                        required
                      />
                    </div>
                    {validated ? (
                      <div className="text-danger fs-12">
                        {formData?.role?.length === 0
                          ? "Please select role"
                          : ""}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="col-xl-6 mb-3">
                    <Form.Label>
                      Password <span className="text-danger">*</span>{" "}
                    </Form.Label>

                    <div
                      className={styles.passCOntainer}
                      style={{
                        border:
                          validated &&
                          formData?.password?.length === 0 &&
                          "1px solid red",
                      }}
                    >
                      <div style={{ width: "100%" }}>
                        <Form.Control
                          name="password"
                          required
                          type={showPassword ? "text" : "password"}
                          onChange={handleChange}
                          className={styles.passField}
                          placeholder="Enter Password"
                          value={formData?.password}
                        />
                      </div>
                      <div className={styles.passwordBox2}>
                        <span>
                          <FontAwesomeIcon
                            onClick={() => {
                              handleTogglePasswordVisibility(
                                showPassword,
                                setShowPassword
                              );
                            }}
                            icon={showPassword ? faEye : faEyeSlash}
                          />
                        </span>
                      </div>
                    </div>

                    {validated ? (
                      <div className="text-danger fs-12">
                        {getValidatePassword(formData)}
                      </div>
                    ) : (
                      <small id="emailHelp" class="form-text text-muted">
                        Please enter an number with both lowercase and uppercase
                        characters.
                      </small>
                    )}
                  </div>

                  <div className="col-xl-6 mb-3">
                    <Form.Label>
                      Confirm Password <span className="text-danger">*</span>{" "}
                    </Form.Label>
                    <div
                      className={styles.passCOntainer}
                      style={{
                        border:
                          validated &&
                          formData?.confirmPassword?.length === 0 &&
                          "1px solid red",
                      }}
                    >
                      <div style={{ width: "95%" }}>
                        <Form.Control
                          name="confirmPassword"
                          required
                          type={showConfirmPassword ? "text" : "password"}
                          onChange={handleChange}
                          className={styles.passField}
                          placeholder="Confirm Password"
                        />
                      </div>
                      <div className={styles.passwordBox2}>
                        <span>
                          <FontAwesomeIcon
                            onClick={() => {
                              handleTogglePasswordVisibility(
                                showConfirmPassword,
                                setShowConfirmPassword
                              );
                            }}
                            icon={showConfirmPassword ? faEye : faEyeSlash}
                          />
                        </span>
                      </div>
                    </div>
                    {validated ? (
                      <div className="text-danger fs-12">
                        {formData?.confirmPassword?.length === 0
                          ? "Please enter confirm password"
                          : formData?.password !== formData?.confirmPassword
                          ? "Password is not matched"
                          : ""}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div>
                  <Button type="submit" className="btn btn-primary btn-sm me-1">
                    Submit
                  </Button>
                  <Button
                    onClick={() => {
                      setAddUser(false);
                    }}
                    className="btn btn-danger btn-sm light ms-1"
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
              {/* <div>
                <label>User Name</label>
                <input name="user name" type="text" autoComplete="off" value={""} />
              </div>
              <div>
                <label>Password</label>
                <input name="password" type="password" autoComplete="off"  value={""}/>
              </div> */}
            </div>
          </div>
        </Offcanvas>
      </div>
    </>
  );
};

export default UserList;
