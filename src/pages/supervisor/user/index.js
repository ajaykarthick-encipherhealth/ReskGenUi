import React, { useState, useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Paginator } from "primereact/paginator";
import AdminList from "../table/adminList/adminList";
import Header from "../../../jsx/layouts/nav/Header";
import HeaderFilters from "../../../components/headerFilters";
import SpinnerDots from "../../../components/spinner";
import {actions as allActions} from '../../../stores/supervisor/users'
import { renderSkeleton } from "../../../components/reuseableFunctions";
const UserList = ({getUsers,loader,usersData}) => {
  const sideMenu = useSelector((state) => state.sideMenu);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [userListAll, setUserListAll] = useState([]);
  const [totalElements, setTotalElements] = useState(15);
  const [pageCount, setPageCount] = useState(0);
  const [search, setSearch] = useState("");

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
    getUsers({page:pageCount, search:search});
  }, [pageCount, search]);

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
                        search={search}
                        isSearch={true}
                        searchlabel="Search By Username"
                        setPageNo={setPageCount}
                      />
                    </div>
                    <div
                      id="task-tbl_wrapper"
                      className="dataTables_wrapper no-footer"
                    >
                      {loader ? (
                         renderSkeleton()
                      ) : (
                        <AdminList
                          userList={userListAll?.content}
                          setPageCount={setPageCount}
                        />
                      )}
                      <div>
                        <div className="pagination-container">
                          <Paginator
                            first={pageCount===0?0:paginationFirst}
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
    </>
  );
};
const connector=connect((state)=>({
  usersData:state.supervisor.users?.getUsersList,
  loader:state.supervisor.users?.usersLoading,
}),{
  getUsers:allActions.getUsers
})
export default connector(UserList);
