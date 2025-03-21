import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Header from "../../../jsx/layouts/nav/Header";
import HeaderFilters from "../../../components/headerFilters";
import { actions as allActions } from "../../../stores/supervisor/users";
import Userqueue from "./userqueue";
import AppTable from "../../../components/tables";
import { setStorage } from "../../../utils/storages";
const UserList = ({ getUsers, loader, usersData, routedData }) => {
  const columns = [
    {
      name: "USERNAME",
      isImage: true,
      value: {
        first: "firstName",
        last: "lastName",
        img: "profileImageUrl",
      },
    },
    {
      name: "ALLOCATED",
      value: "totalFileAllocated",
    },
    {
      name: "COMPLETED",
      value: "totalFileProcessed",
    },
    {
      name: "PENDING",
      value: "totalFilePending",
    },
    {
      name: "HOLD",
      value: "batchName",
    },
    {
      name: "INVALID",
      value: "totalFileHold",
    },
    {
      name: "QUALITY",
      value: "accuracy",
      progressBar:true
    },
  ];
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
  const gotoUserQueue = (item) => {
    setStorage("user", item?.userName);
    setViewUsers(item);
  };
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
                    <div className="mt-2">
                      <AppTable
                        data={userListAll?.content}
                        column={columns}
                        loader={loader}
                        onRowClick={gotoUserQueue}
                        first={pageCount === 0 ? 0 : paginationFirst}
                        totalRecords={totalElements}
                        row={15}
                        onPageChange={onPageChange}
                      />
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
