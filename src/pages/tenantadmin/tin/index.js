import React, { useEffect, useState } from "react";
import Header from "../../../jsx/layouts/nav/Header";
import { actions as tinActions } from "../../../stores/tenantAdmin/tin";
import Tab from "../../../mainStream/components/tags";
import { connect } from "react-redux";
import RegularButton from "../../../components/button";
import CustomizableDrawer from "../../../components/customizeDrawer";
import { useRouter } from "next/router";
import ReusableFilters from "../../../components/reusableFilters";
import AppTable from "../../../components/tables";
import { actions as allActions } from "../../../stores/reviewer/workqueue";
import { setStorage } from "../../../utils/storages";
import { statusOptions } from "../../reviewer/patients";
import { getAccessTabItems } from "../../../utils/reusable";
import styles from "../../../styles/visitdata.module.css";
import { Button } from "antd";

const commonFilterItems = [
  {
    id: "01",
    title: "Tin",
    type: "select",
    value: null,
    placeholder: "Tin",
    options: null,
    active: true,
  },
  {
    id: "02",
    title: "Priority",
    type: "select",
    value: null,
    placeholder: "Priority",
    options: null,
    active: true,
  },
];
const columns = [
  {
    name: "Tin",
    value: "patientId",
    isShow: true,
    filterKey: "Search",
  },
  {
    name: "Progress",
    value: "batchName",
    isShow: true,
    filterKey: "batch",
  },
  {
    name: "Providers",
    value: "fileName",
    isShow: true,
  },
  {
    name: "Patients",
    value: "validDiseaseCount",
    isShow: true,
  },
  {
    name: "Not Assigned",
    value: "allocatedOn",
    isShow: true,
    filterKey: "allocatedDate",
  },
  {
    name: "Downloading",
    value: "dueDate",

    isDate: true,
    isShow: true,
    filterKey: "dueDate",
  },
  {
    name: "Coder 1",
    value: "processedDate",
    isDate: true,
    isShow: true,
    filterKey: "completedDate",
  },

  {
    name: "Coder 2",
    isShow: true,
  },
  {
    name: "QA",
    value: "",
    isShow: true,
    filterKey: "Priority",
  },
  {
    name: "Downloader Not Complete",
    value: "statusProxy",
    isShow: true,
    filterKey: "Status",
  },
  {
    name: "Complete",
    value: "statusProxy",
    isShow: true,
    filterKey: "Status",
  },
  {
    name: "priority",
    value: "",
    isShow: true,
    filterKey: "",
  },
];

const Tin = ({
  getProjectActiveTab,
  activeTabName,
  getFilteApi,
  loading,
  routedData,
}) => {
  const tabs = getAccessTabItems({ page: "Tin", tabsMenu: "tabMenuList" });
  const router = useRouter();
  const { tab } = router.query;
  const activeTab = tab || activeTabName?.tinDetailsTab || "Active";
  const [activeFilters, setActiveFilters] = useState(commonFilterItems);
  const [sort, setSort] = useState({
    allocatedOn: {
      sortDir: "DESC",
      sortField: "allocatedOn",
    },
    dueDate: {
      sortDir: "DESC",
      sortField: "dueDate",
    },
    processedDate: {
      sortDir: "DESC",
      sortField: "processedDate",
    },
  });

  const [selectedOption, setSelectedOption] = useState({});
  const [pageNo, setPageNo] = useState(0);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [paramsFilter, setParamsFilter] = useState(null);
  const [test, setTest] = useState(columns);
  const [open, setOpen] = useState(false);

  const gotoPatientDetails = (data) => {
    setStorage("patientId", data.patientId);
    setStorage("routeBackTo", "/tenantadmin/tin");
    getProjectActiveTab({
      tinFilter: params,
    });
    router.push("/tenantadmin/tin/tindetails");
  };
  const handleTabs = (name) => {
    getProjectActiveTab({
      tinTabName: name,
    });
    router.replace({
      pathname: router.pathname,
      query: { ...router.query, tab: name },
    });
    setSelectedOption({});
  };

  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPageNo(e.page);
    setPageSize(e.rows);
  };

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const getReviewerApi = async () => {
    const res = await getFilteApi({
      pageNo,
      selectedOption,
      sort: sort,
    });
  };
  useEffect(() => {
    setParamsFilter("check");
    if (window !== "undefined" && paramsFilter) {
      getReviewerApi();
    }
  }, [selectedOption, pageNo, paramsFilter, sort]);
  const opt = {
    Priority: statusOptions,
  };

  const params = {
    pageNo,
    paginationFirst,
    sort,
    activeFilters,
    selectedOption,
  };
  useEffect(() => {
    if (routedData) {
      const { pageNo, selectedOption, activeFilters, paginationFirst, sort } =
        routedData;
      setPageNo(pageNo ? pageNo : 0);
      setSelectedOption(selectedOption);
      setActiveFilters(activeFilters);
      setPaginationFirst(paginationFirst);
      setSort(sort);
    }
  }, [routedData]);
  const mockData = [
    {
      batchName: "1001",
      diagnosisCode: "I110",
      description: "TESing fasdfsadfaserevvasde",
      reason:
        "Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      patientId: "EH-1001",
      fileName: "John Jacobs",
      createdData: "2024-03-11T12:16:30.091Z",
      firstName: "john jacobs",
      lastName: "Grey",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/0dc96dc1-8fc6-4dab-8986-bfa8b9da4729.jpeg",
      priority: "pending",
    },
    {
      batchName: "1001",
      diagnosisCode: "I110",
      description: "TESing fasdfsadfaserevvasde",
      reason:
        "Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      patientId: "EH-1001",
      fileName: "John Jacobs",
      createdData: "2024-03-11T12:16:30.091Z",
      firstName: "john jacobs",
      lastName: "Grey",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/0dc96dc1-8fc6-4dab-8986-bfa8b9da4729.jpeg",
      priority: "pending",
    },
    {
      batchName: "1001",
      diagnosisCode: "I110",
      description: "TESing fasdfsadfaserevvasde",
      reason:
        "Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      patientId: "EH-1001",
      fileName: "John Jacobs",
      createdData: "2024-03-11T12:16:30.091Z",
      firstName: "john jacobs",
      lastName: "Grey",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/0dc96dc1-8fc6-4dab-8986-bfa8b9da4729.jpeg",
      priority: "pending",
    },
    {
      batchName: "1001",
      diagnosisCode: "I110",
      description: "TESing fasdfsadfaserevvasde",
      reason:
        "Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      patientId: "EH-1001",
      fileName: "John Jacobs",
      createdData: "2024-03-11T12:16:30.091Z",
      firstName: "john jacobs",
      lastName: "Grey",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/0dc96dc1-8fc6-4dab-8986-bfa8b9da4729.jpeg",
      priority: "pending",
    },
    {
      batchName: "1001",
      diagnosisCode: "I110",
      description: "TESing fasdfsadfaserevvasde",
      reason:
        "Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      patientId: "EH-1001",
      fileName: "John Jacobs",
      createdData: "2024-03-11T12:16:30.091Z",
      firstName: "john jacobs",
      lastName: "Grey",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/0dc96dc1-8fc6-4dab-8986-bfa8b9da4729.jpeg",
      priority: "pending",
    },
    {
      batchName: "1001",
      diagnosisCode: "I110",
      description: "TESing fasdfsadfaserevvasde",
      reason:
        "Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      patientId: "EH-1001",
      fileName: "John Jacobs",
      createdData: "2024-03-11T12:16:30.091Z",
      firstName: "john jacobs",
      lastName: "Grey",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/0dc96dc1-8fc6-4dab-8986-bfa8b9da4729.jpeg",
      priority: "pending",
    },
    {
      batchName: "1001",
      diagnosisCode: "I110",
      description: "TESing fasdfsadfaserevvasde",
      reason:
        "Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      patientId: "EH-1001",
      fileName: "John Jacobs",
      createdData: "2024-03-11T12:16:30.091Z",
      firstName: "john jacobs",
      lastName: "Grey",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/0dc96dc1-8fc6-4dab-8986-bfa8b9da4729.jpeg",
      priority: "decline",
    },
    {
      batchName: "1001",
      diagnosisCode: "I110",
      description: "TESing fasdfsadfaserevvasde",
      reason:
        "Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      patientId: "EH-1001",
      fileName: "John Jacobs",
      createdData: "2024-03-11T12:16:30.091Z",
      firstName: "John Jacobs",
      priority: "approved",
    },
    {
      batchName: "1001",
      diagnosisCode: "I110",
      description: "TESing fasdfsadfaserevvasde",
      reason:
        "Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      patientId: "EH-1001",
      fileName: "John Jacobs",
      createdData: "2024-03-11T12:16:30.091Z",
      firstName: "John Jacobs",
      priority: "pending",
    },
    {
      batchName: "1001",
      diagnosisCode: "I110",
      description: "TESing fasdfsadfaserevvasde",
      reason:
        "Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      patientId: "EH-1001",
      fileName: "John Jacobs",
      createdData: "2024-03-11T12:16:30.091Z",
      firstName: "John Jacobs",
      priority: "pending",
    },
  ];

  return (
    <div className={`show`}>
      <Header />
      <div
        className="d-flex justify-content-end position-relative"
        style={{ marginTop: "5%", width: "100%" }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Tab
            activeTab={activeTab}
            handleTabs={handleTabs}
            tabs={tabs}
            margin={"0"}
            width={"100%"}
            padding={"50px"}
          />
        </div>

        <div className="d-flex align-items-center justify-content-end gap-4">
          <div className={styles.font}>Total Tin : 45</div>
          <div className={styles.font}>Active Tin : 45</div>
          <div className={styles.font}>InActive Tin : 45</div>
          <Button
            data-testid="activeBtn"
            name="activeBtn"
            className="btn btn-sm   tableButton"
          >
            Change to Inactive
          </Button>
        </div>
      </div>

      <div className=" mt-3  container-fluid table-responsive active-projects task-table">
        <div className="d-flex">
          <div style={{ width: "90%" }}>
            <ReusableFilters
              showFilter={true}
              setActiveFilters={setActiveFilters}
              setSelectedOption={setSelectedOption}
              selectedOption={selectedOption}
              FilterItems={activeFilters}
              activeFilters={activeFilters}
              setPageNo={setPageNo}
              opt={opt}
              columns={columns}
              commonFilterItems={commonFilterItems}
            />
          </div>
          <div
            id="table-btn"
            name="table-btn"
            className="d-flex justify-content-center align-items-center   mt-4"
          >
            <Button
              data-testid="table-custom"
              name="table-custom"
              // onClick={showDrawer}
              className="btn btn-sm w-full text-ellipsis tableButton"
            >
              Table Customization
            </Button>
          </div>
        </div>
        <div className="profile-tab  mt-3">
          <div className="mt-3">
            <AppTable
              data={mockData}
              column={test.filter((item) => item.isShow)}
              loader={loading}
              onRowClick={gotoPatientDetails}
              pagination={false}
              setSort={setSort}
              sort={sort}
              first={pageNo === 0 ? 0 : paginationFirst}
              totalRecords={0}
              row={15}
              onPageChange={onPageChange}
            />
          </div>
        </div>
        <div>
          <CustomizableDrawer
            open={open}
            onClose={onClose}
            options={columns}
            selectedColumns={test}
            setSelectedColumns={setTest}
            setActiveFilters={setActiveFilters}
          />
        </div>
      </div>
    </div>
  );
};

const enhancer = connect(
  (state) => ({
    activeTabName: state.tenantAdmin.tin?.activeTabRoutedData?.tinTabName,
    routedData: state.tenantAdmin?.tin?.activeTabRoutedData?.tinFilter,
  }),
  {
    getProjectActiveTab: tinActions.getProjectActiveTab,
    getFilteApi: allActions.getReviewerPatients,
  }
);

export default enhancer(Tin);
