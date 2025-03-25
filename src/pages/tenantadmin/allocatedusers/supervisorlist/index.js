import React, { useEffect, useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import AppTable from "../../../../components/tables";
import { connect } from "react-redux";
import { actions as allActions } from "../../../../stores/tenantAdmin/patientAllocations";
import { actions as allPatientSyncAction } from "../../../../stores/tenantAdmin/patientSync";
import styles from "../styles.module.css";
import { Button, Spin, Tooltip } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { getStorage } from "../../../../utils/storages";
import Header from "../../../../jsx/layouts/nav/Header";
import ReusableFilters from "../../../../components/reusableFilters";
import { generateOptionsForNewStore } from "../../../../components/headerFilters/functions";
import SupervisorAllocationModal from "../supervisorAllocation/supervisorAllocationModal";
import { LoadingOutlined } from "@ant-design/icons";

const SupervisorList = ({
  supervisorListLoader,
  allocationListData,
  getRoutedData,
  routedData,
  reviewerList,
  supervisorUserName,
  allocationList,
  getReviewerList,
}) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowsId, setSelectedRowsId] = useState([]);
  const [selectedUserName, setSelectedUserName] = useState([]);
  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPageNo(e.page);
  };
  const commonFilterItems = [
    {
      id: 1,
      title: "Search",
      type: "search",
      value: null,
      placeholder: "Search",
      header: "Patient Name / ID",
      active: true,
    },
    {
      id: 2,
      title: "Search by Code",
      type: "search1",
      value: null,
      placeholder: "Search",
      header: "Search by Code",
      active: true,
    },
    {
      id: 3,
      title: "Search by Description",
      type: "search1",
      value: null,
      placeholder: "Search",
      header: "Search by Description",
      active: true,
    },
    {
      id: 5,
      title: "reviewer",
      type: "select",
      value: null,
      placeholder: "Reviewer",
      options: generateOptionsForNewStore(reviewerList),
      active: true,
    },
    {
      id: 6,
      title: "status",
      type: "select",
      value: null,
      placeholder: "Status",
      options: [
        { label: "COMPLETED", value: "COMPLETED", status: 2 },
        { label: "DECLINED", value: "DECLINED", status: 0 },
      ],
      active: true,
    },
  ];
  const router = useRouter();
  const [activeFilters, setActiveFilters] = useState(commonFilterItems);
  const [searchText, setSearchText] = useState(null);
  const [selectedOption, setSelectedOption] = useState({});
  const [checkedLoader, setCheckedLoader] = useState(false);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [pageNo, setPageNo] = useState(0);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [allocateModalL2, setAllocateModalL2] = useState(false);
  const [selectedChart, setSelectedChart] = useState([]);
  const [search, setSearch] = useState({})
  const [sort, setSort] = useState({
    dueDate: {
      sortDir: "DESC",
      sortField: "dueDate",
    },
    processedDate: {
      sortDir: "DESC",
      sortField: "processedDate",
    },
  });

  const handleOpenModal = () => {
    setAllocateModalL2(true);
  };
  const handleRowCheckboxChange = async ({ e, row, singleCheck, checked }) => {
    if (!singleCheck) {
      if (checked) {
        setCheckedLoader(true);
        // const response = await getSupervisorChecked({
        //   fromTenant: true,
        //   // allPatientIds: checked,
        //   userName: supervisorUserName?.userName,
        // });

        // if (response?.status === "SUCCESS") {
        //   let result = response?.response;
        //   const data = result?.content?.map((item) => ({
        //     id: item.patientId,
        //     name: item.patientName,
        //   }));
        //   setSelectedRowsId(data);
        //   setSelectedRows(data);
        // }
        setCheckedLoader(false);
      } else {
        setSelectedRows([]);
        setSelectedRowsId([]);
        setCheckedLoader(false);
      }
    } else {
      setSelectedUserName((prev) => {
        let updatedSelection;
        if (e.target.checked) {
          updatedSelection = prev.some(
            (user) => user.patientId === row.patientId
          )
            ? prev
            : [...prev, row];
        } else {
          updatedSelection = prev.filter(
            (user) => user.patientId !== row.patientId
          );
        }
        return updatedSelection;
      });

      setSelectedRows((prev) => {
        let updatedSelection;
        if (e.target.checked) {
          updatedSelection = prev.includes(row.patientId)
            ? prev
            : [...prev, row.patientId];
        } else {
          updatedSelection = prev.filter((id) => id !== row.patientId);
        }

        setSelectedRowsId(updatedSelection);
        return updatedSelection;
      });
    }
  };
  const allocationColumns = [
    { name: "PATIENT ID", value: "patientId" },
    { name: "PATIENT NAME", value: "patientName" },
    {
      name: "REVIEWER",
      value: {
        first: "patientAllocatedFirstName",
        last: "patientAllocatedLastName",
        img: "patientAllocatedProfileImage",
      },
      isImage: true,
    },
    { name: "DUE DATE", value: "status", sortable: true },
    {
      name: "COMPLETED DATE",
      value: "processedDate",
      isDate: true,
      sortable: true,
    },
    {
      name: "STATUS",
      value: "processedStatus",
      status: true,
      isInfoIcon: false,
    },
    {
      name: (
        <div>
          {allocationListData?.content.length > 0 && (
            <div className="w-full d-flex justify-content-center">
              {checkedLoader ? (
                <Spin
                  indicator={<LoadingOutlined className="text-white font2" />}
                  className={`mx-4 ${styles.spinnerStyle}`}
                />
              ) : (
                <input
                  type="checkbox"
                  onChange={(e) => {
                    let checked = !selectAllChecked;
                    setSelectAllChecked(checked);
                    if (
                      selectedRows?.length < allocationListData?.totalElements
                    ) {
                      checked = true;
                      setSelectAllChecked(true);
                    }
                    handleRowCheckboxChange({
                      e,
                      row: null,
                      singleCheck: false,
                      checked,
                    });
                  }}
                  style={{
                    width: "20px",
                    height: "20px",
                    flexShrink: "0",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  checked={
                    selectedRows?.length === allocationListData?.totalElements
                  }
                  className={`mx-4 ${styles.checkBox} ${
                    selectedRows?.length === allocationListData?.totalElements
                      ? styles.customChecked2
                      : ""
                  }`}
                />
              )}
            </div>
          )}
        </div>
      ),
      value: "patientId",
      isCheckbox: true,
    },
  ];
  const backToData = (action) => {
    const revampData = { ...routedData, activeTab: action };
    getRoutedData(revampData);
    const backRoute = getStorage("routeBackTo");
    router.push(backRoute);
  };
  const supervisorName = getStorage("supervisorUser");
  const getAllAllocationList = async () => {
    const res = await allocationList({
      data: { userName: supervisorName },
      pageNo,
      selectedOption,
      searchText,
      sort,
      search
    });
  };
  useEffect(() => {
    getReviewerList({ field: "patientAllocated" });
  }, []);

  useEffect(() => {
    getAllAllocationList();
  }, [searchText, selectedOption, sort, search]);
  const opt = {
    status: [
      { label: "COMPLETED", value: "COMPLETED", status: 2 },
      { label: "DECLINED", value: "DECLINED", status: 0 },
    ],
    reviewer: generateOptionsForNewStore(reviewerList),
  };

  const handleTabChange = (key) => {
    backToData("1");
  };

  return (
    <div>
      <Header />
      <div className="content-body">
        <div className="container-fluid">
          <div className="table-responsive active-projects task-table">
            <div className="d-flex align-items-center justify-content-center  gap-3">
              <Button
                data-testid="back-arrow"
                name="back-arrow"
                className={`mt-3 ${styles.filterBtn}`}
                onClick={() => backToData("2")}
              >
                <FontAwesomeIcon icon={faArrowLeftLong} color="#03316f" />
              </Button>
              <div style={{ width: "95%" }}>
                <ReusableFilters
                  showFilter={false}
                  setActiveFilters={setActiveFilters}
                  setSearchText={setSearchText}
                  searchText={searchText}
                  setSelectedOption={setSelectedOption}
                  selectedOption={selectedOption}
                  setPageNumber={setPageNo}
                  FilterItems={activeFilters}
                  activeFilters={activeFilters}
                  setPageNo={setPageNo}
                  opt={opt}
                  setSearch={setSearch}
                  search={search}
                />
              </div>
              <Tooltip
                title={
                  selectedRows?.length === 0
                    ? "Select patients to Allocate"
                    : ""
                }
              >
                <Button
                  data-testid="supervisor-allocate"
                  name="supervisor-allocate"
                  type="primary"
                  className={`mb-3 ${styles.allocate}`}
                  onClick={handleOpenModal}
                  disabled={selectedRows?.length === 0}
                >
                  Allocate
                </Button>
              </Tooltip>
            </div>
            <div className="profile-tab" style={{ marginTop: "20px" }}>
              <div className="custom-tab-1">
                <Tab.Container
                  activeKey={routedData?.activeTab}
                  onSelect={handleTabChange}
                >
                  <Nav variant="tabs" className="nav nav-tabs">
                    <Nav.Item
                      style={{ cursor: "pointer" }}
                      className="nav-item"
                    >
                      <Nav.Link style={{ cursor: "pointer" }} eventKey="1">
                        Reviewer Allocation
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="nav-item">
                      <Nav.Link eventKey="2">Supervisor Allocation</Nav.Link>
                    </Nav.Item>
                  </Nav>
                  <Tab.Content>
                    <Tab.Pane eventKey="1"></Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </div>
            </div>
            <div className="mt-4">
              <AppTable
                data={allocationListData?.content}
                column={allocationColumns}
                loader={supervisorListLoader}
                handleRowCheckboxChange={handleRowCheckboxChange}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                pagination={false}
                sort={sort}
                setSort={setSort}
                tableId={"supervisor-list-table"}
                first={pageNo === 0 ? 0 : paginationFirst}
                totalRecords={allocationListData?.totalElements}
                row={15}
                onPageChange={onPageChange}
              />
            </div>
          </div>
        </div>
      </div>
      <SupervisorAllocationModal
        open={allocateModalL2}
        setOpen={setAllocateModalL2}
        selectedRowsId={selectedRowsId}
        setSelectedRowsId={setSelectedRowsId}
        setSelectedChart={setSelectedChart}
        selectedChart={selectedChart}
        setSelectedRows={setSelectedRows}
        selectedRows={selectedRows}
        setSelectAllChecked={setSelectAllChecked}
        pageNo={pageNo}
        selectedOption={selectedOption}
        selectedUserName={selectedUserName}
        setSelectedUserName={setSelectedUserName}
      />
    </div>
  );
};
const connector = connect(
  (state) => ({
    supervisorListLoader:
      state.tenantAdmin?.patientsAllocation?.supervisorListLoader,
    allocationListData:
      state.tenantAdmin.patientsAllocation?.allocationList?.data?.response,
    loading: state.tenantAdmin?.patientsAllocation?.supervisorLoader,
    routedData: state.tenantAdmin?.patientSync?.routedData,
    reviewerList:
      state.tenantAdmin?.patientsAllocation?.filterOptions?.data?.response,
    supervisorUserName: state.tenantAdmin?.patientSync?.supervisorUserName,
  }),
  {
    getAllSupervisorList: allActions.getAllSupervisorList,
    allocationList: allActions.getAllAllocationList,
    getAllCheckedReviewers: allActions.getAllCheckedReviewers,
    getRoutedData: allPatientSyncAction.getRoutedData,
    getSupervisorChecked: allActions.getSelectedSupervisorList,
    getReviewerList: allActions.getFilterOptions,
  }
);

export default connector(SupervisorList);
