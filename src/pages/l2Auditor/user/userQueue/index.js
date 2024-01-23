import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Paginator } from "primereact/paginator";
import TableStyle from "../../../../components/table/table.module.css";
import Header from "../../../../jsx/layouts/nav/Header";
import HeaderFilters from "../../../../components/headerFilters";
import SpinnerDots from "../../../../components/spinner";
import Footer from "../../../../jsx/layouts/Footer";
import { getL2Users } from "../../../../store/actions/l2Actions/userActions";
import UserQueue from "../../table/adminList/userQueue";

const index = () => {
  const dispatch = useDispatch();
  const usersData = useSelector((state) => state.l1User.data);
  const sideMenu = useSelector((state) => state.sideMenu);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [userListAll, setUserListAll] = useState([]);

  const [totalElements, setTotalElements] = useState(10);
  const [pageCount, setPageCount] = useState(0);

  const [search, setSearch] = useState("");

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
    //  getFilteApi(
    //     0,
    //     pageSize,
    // search,
    //     statusSelectedValue,
    //     dueStartDate,
    //     dueEndDate,
    //     completedStart,
    //     completedEnd,

    //   );
  }, [pageCount, search]);

  const response = {
    status: "SUCCESS",
    message: "Success!!",
    response: [
      {
        active: true,
        allocatedBy: "henry@encipherhealth.onmicrosoft.com",
        allocatedOn: "2024-01-20T16:16:20.104Z",
        auditedBy: null,
        auditedDate: null,
        auditedStatus: null,
        computedDate: "2024-01-20T13:08:06.815Z",
        computing: 2,
        createdAt: "2024-01-20T13:00:53.461Z",
        createdBy: "ranjith01@encipherhealth.onmicrosoft.com",
        createdDate: "2024-01-20T13:00:53.461Z",
        dueDate: "2024-01-22T00:00:00Z",
        fileName: null,
        lastModifiedDate: "2024-01-20T16:16:21.181Z",
        patientAllocated: "ranjith01@encipherhealth.onmicrosoft.com",
        patientId: "logesh-100",
        patientName: "logesh",
        priority: "URGENT",
        processStageChart: "FINISHED",
        processStageId: "338c3432-d594-4434-9700-08a2e36e159b",
        processStageIdLab: null,
        processStageIdRadiology: null,
        processStageLab: null,
        processStageRadiology: null,
        processedDate: null,
        processedStatus: "PENDING",
        rafScore: 1.149,
        updatedAt: "2024-01-20T16:16:21.181Z",
        updatedBy: "anonymousUser",
        version: null,
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
                        <UserQueue
                          userList={response?.response}
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
      <Footer />
    </>
  );
};

export default index;
