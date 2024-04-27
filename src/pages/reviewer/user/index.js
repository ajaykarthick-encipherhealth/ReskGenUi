import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { DataTable } from "primereact/datatable";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import LoadingSpinner from "../../../jsx/components/spinner/spinner";
import NavBar from "../../../jsx/layouts/nav";
import AdminList from "../../../components/table/admin/adminList/adminList";
import axios from "../../../utility/axiosConfig";
import ENDPOINTS from "../../../utility/enpoints";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FilterMatchMode } from "primereact/api";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";

export default function Patient() {
  const sideMenu = useSelector((state) => state.sideMenu);
  const [isLoading, setIsLoading] = useState(true);

  const recordsPage = 10;
  const lastIndex = 1 * recordsPage;
  const firstIndex = lastIndex - recordsPage;

  const [patinetList, setPatinetList] = useState([]);
  const [patinetListAll, setPatinetListAll] = useState([]);

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    userId: { value: null, matchMode: FilterMatchMode.CONTAINS },
    userName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const filterChangePatientId = (event) => {
    const value = event.target.value;
    let _filters = { ...filters };
    _filters["userId"].value = value;
    setFilters(_filters);
  };
  const filterChangePatientName = (event) => {
    const value = event.target.value;
    let _filters = { ...filters };
    _filters["userName"].value = value;
    setFilters(_filters);
  };

  useEffect(() => {
    const uId = localStorage.getItem("userId");
    getAllList(uId);
  }, []);

  const getAllList = async (uId) => {
    // logesh056
    const response = await axios.get(
      ENDPOINTS.apiEndoint + "dbservice/patient/getall?userid=" + uId
    );
    if (response?.data) {
      const records = response?.data?.slice(firstIndex, lastIndex);
      setPatinetList(records);
      const userList = [
        {
          userId: "0001",
          userName: "Ajith",
          cost: "$ 4",
        },
        {
          userId: "0002",
          userName: "Priya",
          cost: "$ 1",
        },
        {
          userId: "0003",
          userName: "Ranjith",
          cost: "$ 1",
        },
      ];
      setPatinetListAll(userList);
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={`show ${sideMenu ? "menu-toggle" : ""}`}>
        <NavBar />
        <div class="content-body">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="container-fluid">
              <div className="row">
                <div className="col-xl-12">
                  <div className="card">
                    <div className="card-body p-0">
                      <div className="table-responsive active-projects task-table">
                        <div className="tbl-caption  align-items-center">
                          <div className="row">
                            <div className="col-xl-3">
                              <div class="form-group has-search">
                                <FontAwesomeIcon
                                  className="fa fa-search form-control-feedback"
                                  icon={faSearch}
                                />
                                <InputText
                                  type="text"
                                  onChange={(e) => filterChangePatientId(e)}
                                  className="form-control"
                                  placeholder="User Id"
                                  maxLength={25}
                                  onKeyDown={(e) => {
                                    // Prevent input of backslash ("\")
                                    if (e.key === "\\") {
                                      e.preventDefault();
                                    }
                                  }}
                                />
                              </div>
                            </div>
                            <div className="col-xl-3">
                              <div class="form-group has-search">
                                <FontAwesomeIcon
                                  className="fa fa-search form-control-feedback"
                                  icon={faSearch}
                                />
                                <InputText
                                  type="text"
                                  onChange={(e) => filterChangePatientName(e)}
                                  className="form-control"
                                  placeholder="User Name"
                                  maxLength={25}
                                  onKeyDown={(e) => {
                                    // Prevent input of backslash ("\")
                                    if (e.key === "\\") {
                                      e.preventDefault();
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <AdminList />

                        <div
                          id="task-tbl_wrapper"
                          className="dataTables_wrapper no-footer"
                        >
                          <DataTable
                            value={patinetListAll}
                            paginator
                            rows={10}
                            rowsPerPageOptions={[10, 25, 50, 100]}
                            dataKey="id"
                            filters={filters}
                            filterDisplay="menu"
                          >
                            <Column
                              header="SI.NO"
                              headerStyle={{ width: "3rem" }}
                              body={(data, options) => options.rowIndex + 1}
                            ></Column>
                            <Column field="userId" header="User Id" />
                            <Column field="userName" header="User Name" />
                            <Column field="cost" header="Cost" />
                          </DataTable>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
