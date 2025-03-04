import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Paginator } from "primereact/paginator";
import AdminList from "../table/adminList/adminList";
import Header from "../../../jsx/layouts/nav/Header";
import HeaderFilters from "../../../components/headerFilters";
import { actions as allActions } from "../../../stores/supervisor/users";
import TableSkeleton from "../../../components/skeleton/table";
import Userqueue from "./userqueue";
const UserList = ({ getUsers, loader, usersData, routedData }) => {
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [userListAll, setUserListAll] = useState([]);
  const [totalElements, setTotalElements] = useState(15);
  const [pageCount, setPageCount] = useState(0);
  const [search, setSearch] = useState("");
  const [paramsCheck, setParamCheck] = useState(null);
  const [searchVal, setSearchVal] = useState(null);
  const [viewUsers, setViewUsers] = useState(null);

  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPageCount(e.page);
  };

  useEffect(() => {
    if (usersData) {
      setUserListAll(usersData?.data?.response);
      setTotalElements(usersData?.data?.response?.totalElements);
    }
  }, [usersData]);
  useEffect(() => {
    setParamCheck("check");
    if (routedData?.userData) {
      const { userPageNumber, userSearch, userSearchVal } =
        routedData?.userData;
      setPageCount(userPageNumber);
      setSearch(userSearch);
      setSearchVal(userSearchVal);
      setViewUsers(routedData?.viewUsers);
    }
  }, [routedData]);

  useEffect(() => {
    if (paramsCheck) {
      getUsers({ page: pageCount || 0, search: search || "" });
    }
  }, [pageCount, search, paramsCheck]);

  return viewUsers != null ? (
    <Userqueue
      setViewUsers={setViewUsers}
      viewUsers={viewUsers}
      userParams={{
        userPageNumber: pageCount,
        userSearch: search,
        userSearchVal: searchVal,
      }}
    />
  ) : (
    <div className={`show `}>
      <Header />
      <div className="content-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-12">
              <div className="card-body p-0">
                <div className="table-responsive active-projects task-table">
                  <div className="tbl-caption  align-items-center">
                    <HeaderFilters
                      setSearch={setSearch}
                      search={search}
                      isSearch={true}
                      searchlabel="Search By Username"
                      setPageNo={setPageCount}
                      searchVal={searchVal}
                      setSearchVal={setSearchVal}
                      activeTab="user"
                    />
                  </div>
                  <div
                    id="task-tbl_wrapper"
                    className="dataTables_wrapper no-footer"
                  >
                    {loader ? (
                      <div className="mt-2">
                        <TableSkeleton />
                      </div>
                    ) : (
                      <AdminList
                        userList={userListAll?.content}
                        setPageCount={setPageCount}
                        setViewUsers={setViewUsers}
                      />
                    )}
                    <div>
                      <div className="pagination-container">
                        <Paginator
                          first={pageCount === 0 ? 0 : paginationFirst}
                          rows={15}
                          totalRecords={totalElements}
                          onPageChange={onPageChange}
                        />
                        <div className="total-pages">
                          Total count: {totalElements ? totalElements : 0}
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
    </div>
  );
};
const connector = connect(
  (state) => ({
    usersData: state.supervisor.users?.getUsersList,
    loader: state.supervisor.users?.usersLoading,
    routedData: state.tenantAdmin?.patientSync?.routedData,
  }),
  {
    getUsers: allActions.getUsers,
  }
);
export default connector(UserList);
