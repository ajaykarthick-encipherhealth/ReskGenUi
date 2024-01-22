import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Offcanvas } from "react-bootstrap";
import { useSelector } from "react-redux";
import { notification } from "antd";
import Form from "react-bootstrap/Form";
import ENDPOINTS from "../../../utility/enpoints";
import axios from "../../../utility/axiosConfig";
import AdminList from "../../../components/table/admin/adminList/adminList";
import Header from "../../../jsx/layouts/nav/Header";
import HeaderFilters from "../../../components/headerFilters";
import {
  getAddUser,
  getUsers,
} from "../../../store/actions/adminAction/usersAction";
import { Paginator } from "primereact/paginator";
import SpinnerDots from "../../../components/spinner";
import Footer from "../../../jsx/layouts/Footer";

const options3 = [
  { value: "ALL", label: "ALL" },
  { value: "true", label: "Enabled" },
  { value: "false", label: "Disabled" },
];
const RoleList = [
  { value: "ADMIN", label: "Admin" },
  { value: "L1AUDITOR", label: "L1Auditor" },
  { value: "L2AUDITOR", label: "L2Auditor" },
];

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

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
    role: "",
    userName: "",
    mobileNumber: "",
  });
  const [pageCount, setPageCount] = useState(0);
  const [addPatientId, setAddPatientId] = useState(false);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setSelectedStatus] = useState("");
  const [selectedDates, setSelectedDates] = useState();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [inputValuePatientId, setInputValuePatientId] = useState({
    patientId: "",
    patientName: "",
  });

  const addUserForm = () => {
    setValidated(false);
    setAddUser(true);
  };

  const handleChange = async (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setFormData({ ...formData, [key]: value });
    if (key == "role") {
      setRoleValue([value]);
    }
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === true) {
      formData.tenantId = localTenantId;
      formData.orgId = localOrgId;
      formData.role = roleValue;
      dispatch(getAddUser(formData,));
    }
    setValidated(true);
  };

  // const roleUpdate = async (data) => {
  //   setIsLoading(true);
  //   const response = await axios.post(ENDPOINTS.apiEndoint + `patient`, data);
  //   if (response?.status == 200) {
  //     setAddUser(false);
  //     getAllList(tenId, orgId, pageDataCount, pageLimitCount, "");
  //   } else {
  //   }
  // };

  // const roleChange = async (e) => {
  //   console.log(e.value);
  //   var data = {};
  //   data.role = e.value;
  //   console.log(data);
  //   // roleUpdate(data);
  // };

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
            message: "Patient Id Already Present",
            duration: 1,
          });
        } else {
          notification.success({
            message: "Patient Id Created Successfully!",
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
    setLocalTenantId(tenId);
    setLocalUserId(uId);
    setLocalOrgId(orgId);
    dispatch(getUsers({ pageCount, search, startDate, endDate, status, role }));
  }, [pageCount, search, startDate, endDate, status, role]);

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
                        // select status
                        selectlabel="Select Status"
                        isSelector={true}
                        setSelectedOption={setSelectedStatus}
                        selectOptions={options3}
                        defaultSelectValue1={options3[0]}
                        //  selecte Role
                        selectlabel2="Select Role"
                        selectOptions2={RoleList}
                        defaultSelectValue2={RoleList[0]}
                        setSelectedOption2={setRole}
                        // computation date
                        pickerlabel="Select Range"
                        selectedDates={selectedDates}
                        setSelectedDates={setSelectedDates}
                        defaultStartDate={""}
                        defaultEndDate={""}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        isRangePicker={true}
                        addUser={true}
                        addUserForm={addUserForm}
                        btnTitle="Add User"
                      />
                    </div>
                    <div
                      id="task-tbl_wrapper"
                      className="dataTables_wrapper no-footer"
                    >
                      {userListAll?.loading ? (
                        <SpinnerDots />
                      ) : (
                        <AdminList
                          userList={userListAll?.data?.response?.content}
                          switchHandler={switchHandler}
                          setPageCount={setPageCount}
                        />
                      )}
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
              onClick={() => setAddPatientId(false)}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div className="offcanvas-body">
            <div className="container-fluid">
              <Form
                noValidate
                validated={validated}
                onSubmit={handleSubmitPatientId}
              >
                <div className="row">
                  <div className="col-xl-12 mb-3">
                    <Form.Label>
                      Patient Id <span className="text-danger">*</span>{" "}
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
          onHide={setAddUser}
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
              onClick={() => setAddUser(false)}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div className="offcanvas-body">
            <div className="container-fluid">
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
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
                    />
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
                    />
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
                    />
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
                      />
                      {/* <span className="input-group-text">@encipherhealth.com</span> */}
                    </div>
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
                    />
                  </div>
                  <div className="col-xl-6 mb-3">
                    <Form.Label>
                      Role <span className="text-danger">*</span>{" "}
                    </Form.Label>
                    <Form.Control
                      name="role"
                      as="select"
                      required
                      onChange={handleChange}
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="L1AUDITOR">L1AUDITOR</option>
                      <option value="L2AUDITOR">L2AUDITOR</option>
                    </Form.Control>
                  </div>
                  <div className="col-xl-6 mb-3">
                    <Form.Label>
                      Password <span className="text-danger">*</span>{" "}
                    </Form.Label>
                    <Form.Control
                      name="password"
                      required
                      type="text"
                      onChange={handleChange}
                    />
                    <small id="emailHelp" class="form-text text-muted">
                      Please enter an numeric, number with both lowercase and
                      uppercase characters.
                    </small>
                  </div>
                  <div className="col-xl-6 mb-3">
                    <Form.Label>
                      Confirm Password <span className="text-danger">*</span>{" "}
                    </Form.Label>
                    <Form.Control
                      name="password"
                      required
                      type="text"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <Button type="submit" className="btn btn-primary btn-sm me-1">
                    Submit
                  </Button>
                  <Button
                    onClick={() => setAddUser(false)}
                    className="btn btn-danger btn-sm light ms-1"
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </Offcanvas>
      </div>
      <Footer />
    </>
  );
};

export default UserList;
