import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { notification } from "antd";
import ENDPOINTS from "../../../utility/enpoints";
import axios from "../../../utility/axiosConfig";
import PatientList from "./list";
import Header from "../../../jsx/layouts/nav/Header";
import HeaderFilters from "../../../components/headerFilters";
import { getUsers } from "../../../store/actions/adminAction/usersAction";
import { Paginator } from "primereact/paginator";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InputText } from "primereact/inputtext";

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
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [userListAll, setUserListAll] = useState([]);
  const [totalElements, setTotalElements] = useState(10);
  const [sortOrder, setSortOrder] = useState("DESC");
  const [sort, setSort] = useState({ sortDir: "", sortField: "" });
  const [useAdd, setUseAdd] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setSelectedStatus] = useState("");
  const [selectedDates, setSelectedDates] = useState();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [clear, setClear] = useState(false);

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
    dispatch(
      getUsers({
        pageCount: clear ? "" : pageCount,
        search: clear ? "" : search,
        startDate: clear ? "" : startDate,
        endDate: clear ? "" : endDate,
        status: clear ? "" : status?.value,
        role: clear ? "" : role?.value,
        sort: clear ? "" : sort,
      })
    );
  }, [pageCount, search, startDate, endDate, status, role, sort, useAdd]);
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
                      <div className="row">
                        <div className="col-xl-2">
                          <label style={{ marginLeft: "8px" }}>
                            Search By Name/MRN
                          </label>
                          <div class="form-group has-search">
                            <FontAwesomeIcon
                              className="fa fa-search form-control-feedback"
                              icon={faSearch}
                            />
                            <InputText
                              type="text"
                              className="form-control new-form-control"
                              placeholder="Search"
                            />
                          </div>
                        </div>
                        <div className="col-xl-2">
                          <label style={{ marginLeft: "8px" }}>SSN</label>
                          <div class="form-group has-search">
                            <FontAwesomeIcon
                              className="fa fa-search form-control-feedback"
                              icon={faSearch}
                            />
                            <InputText
                              type="text"
                              className="form-control new-form-control"
                              placeholder="Search"
                            />
                          </div>
                        </div>
                        <div className="col-xl-2">
                          <label style={{ marginLeft: "8px" }}>Sex</label>
                          <div class="form-group has-search">
                            <FontAwesomeIcon
                              className="fa fa-search form-control-feedback"
                              icon={faSearch}
                            />
                            <InputText
                              type="text"
                              className="form-control new-form-control"
                              placeholder="Search"
                            />
                          </div>
                        </div>
                        <div className="col-xl-2">
                          <label style={{ marginLeft: "8px" }}>
                            Date Of Birth
                          </label>
                          <div class="form-group has-search">
                            <FontAwesomeIcon
                              className="fa fa-search form-control-feedback"
                              icon={faSearch}
                            />
                            <input
                              type="text"
                              className="form-control new-form-control"
                              placeholder="Search"
                            />
                          </div>
                        </div>

                        <div className="col-xl-2">
                          <label style={{ marginLeft: "8px" }}>Zip Code</label>
                          <div class="form-group has-search">
                            <FontAwesomeIcon
                              className="fa fa-search form-control-feedback"
                              icon={faSearch}
                            />
                            <InputText
                              type="text"
                              className="form-control new-form-control"
                              placeholder="Search"
                            />
                          </div>
                        </div>
                        <div className="col-xl-2">
                          <label style={{ marginLeft: "8px" }}>Phone</label>
                          <div class="form-group has-search">
                            <FontAwesomeIcon
                              className="fa fa-search form-control-feedback"
                              icon={faSearch}
                            />
                            <InputText
                              type="text"
                              className="form-control new-form-control"
                              placeholder="Search"
                            />
                          </div>
                        </div>
                      </div>
                      {/* <HeaderFilters
                        setSearch={setSearch}
                        isSearch={true}
                        searchlabel="Search By Name/MRN"
                        // select status

                        //  selecte Role
                      /> */}
                    </div>
                    <div
                      id="task-tbl_wrapper"
                      className="dataTables_wrapper no-footer"
                    >
                      <PatientList
                        userList={userListAll?.data?.response?.content}
                        setPageCount={setPageCount}
                        sortOrder={sortOrder}
                        setSortOrder={setSortOrder}
                        setSort={setSort}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserList;
