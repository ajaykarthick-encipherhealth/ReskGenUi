import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Paginator } from "primereact/paginator";
import AdminList from "../table/adminList/adminList";
import Header from "../../../jsx/layouts/nav/Header";
import HeaderFilters from "../../../components/headerFilters";
import SpinnerDots from "../../../components/spinner";
import Footer from "../../../jsx/layouts/Footer";
import { getL2Users } from "../../../store/actions/l2Action/userActions";

const UserList = () => {
  const dispatch = useDispatch();
  const usersData = useSelector((state) => state.l2User?.data);
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
    dispatch(getL2Users( pageCount,search ));
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
                        isSearch={true}
                        searchlabel="Search By Username"
                      />
                    </div>
                    <div
                      id="task-tbl_wrapper"
                      className="dataTables_wrapper no-footer"
                    >
                      {!userListAll?.content ? (
                        <SpinnerDots />
                      ) : (
                        <AdminList
                          userList={userListAll?.content}
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
