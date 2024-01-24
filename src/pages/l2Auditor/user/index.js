import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Paginator } from "primereact/paginator";
import AdminList from "../table/adminList/adminList";
import Header from "../../../jsx/layouts/nav/Header";
import HeaderFilters from "../../../components/headerFilters";
import SpinnerDots from "../../../components/spinner";
import Footer from "../../../jsx/layouts/Footer";
import { getL2Users } from "../../../store/actions/l2Actions/userActions";

const UserList = () => {
  const dispatch = useDispatch();
  const usersData = useSelector((state) => state.l1User.data);
  const sideMenu = useSelector((state) => state.sideMenu);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [userListAll, setUserListAll] = useState([]);

  const [totalElements, setTotalElements] = useState(10);
  const [pageCount, setPageCount] = useState(0);

  const [search, setSearch] = useState(" ");

  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPageCount(e.page);
  };

  useEffect(() => {
    if (usersData) {
      setUserListAll(usersData);
      setTotalElements(usersData?.response?.totalElements);
    }
  }, [usersData]);

  useEffect(() => {
    var orgId = localStorage.getItem("orgId");
    dispatch(getL2Users({ pageCount, orgId, search }));
  }, [pageCount, search]);

  const response = {
    status: "SUCCESS",
    message: "Success!!",
    response: [
      {
        createdBy: null,
        updatedBy: "ranjith01@encipherhealth.onmicrosoft.com",
        id: "99032e79-98f9-4f99-9f65-54d5f4c639ef",
        role: ["ADMIN"],
        organizationId: "daa95f13-8b1d-4dc3-8d1c-c15d192c6cd5",
        userId: "fa1b21aa-9773-4f2a-b5a1-6bd04123f669",
        email: "ranjith@innoura.com",
        managerId: "praveen01@encipherhealth.onmicrosoft.com",
        tenantId: "b4d34e42-79a6-478e-b3af-12ce7311fa09",
        userName: "ranjith01@encipherhealth.onmicrosoft.com",
        firstName: "Ranjith",
        lastName: "Kumar R",
        userType: "Member",
        accountStatus: "true",
        totalFileProcessed: 41,
        totalFileAllocated: 97,
        totalFilePending: 21,
        totalFileHold: 3,
        totalFileDeclined: 3,
        createdDate: null,
        lastModifiedDate: "2024-01-23T12:39:32.472Z",
      },
    ],
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
                          userList={userListAll?.length>0?userListAll:response?.response}
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
                            Total count: {totalElements?totalElements:0}
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
      <Footer />
    </>
  );
};

export default UserList;
