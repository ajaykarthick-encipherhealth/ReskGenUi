import React, { useState, useEffect, useCallback } from "react";
import { DatePicker, Form, Input, Modal, Select, Button, Popover } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tab, Nav } from "react-bootstrap";
import { faCircleInfo, faSearch } from "@fortawesome/free-solid-svg-icons";
import "react-circular-progressbar/dist/styles.css";
import styles from "./fhir.module.css";
import Header from "../../../jsx/layouts/nav/Header";
import { disableFutureDate } from "../../../components/headerFilters/functions";
import FHIRPatinetTable from "../../../components/table/tenantTable/fhirPatient/index";
import DetailedViewPdfTable from "./pdftable";
import PdfTable from "../../../components/table/tenantTable/pdfTable";
import RegularButton from "../../../components/button";
import { actions as allActions } from "../../../stores/tenantAdmin/patientSync";
import { actions as allReportActions } from "../../../stores/admin/report";
import { debounce } from "../../../components/input";
import { statusOptions, statusOptions2 } from "./pdftable";
import moment from "moment";
import PdfDrawer from "./modals/PdfDrawer";
import FhirDrawer from "./modals/FhirDrawer";
import UploadFile from "./uploadfile";
import { connect } from "react-redux";
import { actions as patientSyncAction } from "../../../stores/tenantAdmin/patientSync";
import UploadModal from "./uploadfile/uploadModal";
import { useRouter } from "next/router";
import {
  disabledDate,
  formatDateForIndex,
  getResponePopup,
} from "../../../utils/reusable";
import { useRef } from "react";
import PatientRoasterTable from "../../../components/table/tenantTable/patientRoasterTable";
import ProviderRoasterTable from "../../../components/table/tenantTable/providerRoasterTable";
import PracticeRoasterTable from "../../../components/table/tenantTable/practiceRoasterTable";
import RoasterDrawer from "./modals/roasterDrawer";
import TinRoasterTable from "../../../components/table/tenantTable/tinRoasterTable";
import AppTable from "../../../components/tables";
import { actions as tableAction } from "../../../stores/tableView";
import ReusableFilters from "../../../components/reusableFilters";
import { getStorage } from "../../../utils/storages";

const { RangePicker } = DatePicker;

const FHIRData = [
  {
    batchID: "#111",
    batchName: "Batch Name1",
    patientCount: "100",
    status: "processing",
    statusValue: "200/23",
    yearOfService: [
      "2024-03-11T12:16:30.091Z",
      "2023-03-11T12:16:30.091Z",
      "2022-03-11T12:16:30.091Z",
    ],
    initiatedByFirstName: "John",
    initiatedByLastName: "Jacobs",
    initialedDate: "2024-03-11T12:16:30.091Z",
  },
  {
    batchID: "#222",
    batchName: "Batch Name2",
    patientCount: "100",
    status: "processing",
    statusValue: "200/23",
    yearOfService: [
      "2024-03-11T12:16:30.091Z",
      "2023-03-11T12:16:30.091Z",
      "2022-03-11T12:16:30.091Z",
    ],
    initiatedByFirstName: "John",
    initiatedByLastName: "Jacobs",
    initialedDate: "2024-03-11T12:16:30.091Z",
  },
  {
    batchID: "#333",
    batchName: "Batch Name3",
    patientCount: "100",
    status: "completed",
    statusValue: "200/23",
    yearOfService: [
      "2024-03-11T12:16:30.091Z",
      "2023-03-11T12:16:30.091Z",
      "2022-03-11T12:16:30.091Z",
    ],
    initiatedByFirstName: "John",
    initiatedByLastName: "Jacobs",
    initialedDate: "2024-03-11T12:16:30.091Z",
  },
  {
    batchID: "#444",
    batchName: "Batch Name4",
    patientCount: "100",
    status: "processing",
    statusValue: "200/23",
    yearOfService: [
      "2024-03-11T12:16:30.091Z",
      "2023-03-11T12:16:30.091Z",
      "2022-03-11T12:16:30.091Z",
    ],
    initiatedByFirstName: "John",
    initiatedByLastName: "Jacobs",
    initialedDate: "2024-03-11T12:16:30.091Z",
  },
  {
    batchID: "#555",
    batchName: "Batch Name5",
    patientCount: "100",
    status: "processing",
    statusValue: "200/23",
    yearOfService: [
      "2024-03-11T12:16:30.091Z",
      "2023-03-11T12:16:30.091Z",
      "2022-03-11T12:16:30.091Z",
    ],
    initiatedByFirstName: "John",
    initiatedByLastName: "Jacobs",
    initialedDate: "2024-03-11T12:16:30.091Z",
    failedCount: "200",
  },
  {
    batchID: "#666",
    batchName: "Batch Name6",
    patientCount: "100",
    status: "failed",
    statusValue: "200/23",
    yearOfService: [
      "2024-03-11T12:16:30.091Z",
      "2023-03-11T12:16:30.091Z",
      "2022-03-11T12:16:30.091Z",
    ],
    initiatedByFirstName: "John",
    initiatedByLastName: "Jacobs",
    initialedDate: "2024-03-11T12:16:30.091Z",
  },
  {
    batchID: "#777",
    batchName: "Batch Name7",
    patientCount: "100",
    status: "processing",
    statusValue: "200/23",
    yearOfService: [
      "2024-03-11T12:16:30.091Z",
      "2023-03-11T12:16:30.091Z",
      "2022-03-11T12:16:30.091Z",
    ],
    initiatedByFirstName: "John",
    initiatedByLastName: "Jacobs",
    initialedDate: "2024-03-11T12:16:30.091Z",
  },
  {
    batchID: "#888",
    batchName: "Batch Name8",
    patientCount: "100",
    status: "processing",
    statusValue: "200/23",
    yearOfService: [
      "2024-03-11T12:16:30.091Z",
      "2023-03-11T12:16:30.091Z",
      "2022-03-11T12:16:30.091Z",
    ],
    initiatedByFirstName: "John",
    initiatedByLastName: "Jacobs",
    initialedDate: "2024-03-11T12:16:30.091Z",
  },
  {
    batchID: "#999",
    batchName: "Batch Name9",
    patientCount: "100",
    status: "processing",
    statusValue: "200/23",
    yearOfService: [
      "2024-03-11T12:16:30.091Z",
      "2023-03-11T12:16:30.091Z",
      "2022-03-11T12:16:30.091Z",
    ],
    initiatedByFirstName: "John",
    initiatedByLastName: "Jacobs",
    initialedDate: "2024-03-11T12:16:30.091Z",
    failedCount: "200",
  },
  {
    batchID: "#101",
    batchName: "Batch Name10",
    patientCount: "100",
    status: "processing",
    statusValue: "200/23",
    yearOfService: [
      "2024-03-11T12:16:30.091Z",
      "2023-03-11T12:16:30.091Z",
      "2022-03-11T12:16:30.091Z",
    ],
    initiatedByFirstName: "John",
    initiatedByLastName: "Jacobs",
    initialedDate: "2024-03-11T12:16:30.091Z",
  },
  {
    batchID: "#102",
    patientCount: "100",
    batchName: "Batch Name11",
    status: "processing",
    statusValue: "200/23",
    yearOfService: [
      "2024-03-11T12:16:30.091Z",
      "2023-03-11T12:16:30.091Z",
      "2022-03-11T12:16:30.091Z",
    ],
    initiatedByFirstName: "John",
    initiatedByLastName: "Jacobs",
    initialedDate: "2024-03-11T12:16:30.091Z",
  },
  {
    batchID: "#103",
    patientCount: "100",
    batchName: "Batch Name12",
    status: "processing",
    statusValue: "200/23",
    yearOfService: [
      "2024-03-11T12:16:30.091Z",
      "2023-03-11T12:16:30.091Z",
      "2022-03-11T12:16:30.091Z",
    ],
    initiatedByFirstName: "John",
    initiatedByLastName: "Jacobs",
    initialedDate: "2024-03-11T12:16:30.091Z",
  },
  {
    batchID: "#104",
    patientCount: "100",
    batchName: "Batch Name13",
    status: "processing",
    statusValue: "200/23",
    yearOfService: [
      "2024-03-11T12:16:30.091Z",
      "2023-03-11T12:16:30.091Z",
      "2022-03-11T12:16:30.091Z",
    ],
    initiatedByFirstName: "John",
    initiatedByLastName: "Jacobs",
    initialedDate: "2024-03-11T12:16:30.091Z",
  },

  {
    batchID: "#105",
    batchName: "Batch Name14",
    patientCount: "100",
    status: "failed",
    statusValue: "200/23",
    yearOfService: [
      "2024-03-11T12:16:30.091Z",
      "2023-03-11T12:16:30.091Z",
      "2022-03-11T12:16:30.091Z",
    ],
    initiatedByFirstName: "John",
    initiatedByLastName: "Jacobs",
    initialedDate: "2024-03-11T12:16:30.091Z",
  },
  {
    batchID: "#106",
    batchName: "Batch Name15",
    patientCount: "100",
    status: "processing",
    statusValue: "200/23",
    yearOfService: [
      "2024-03-11T12:16:30.091Z",
      "2023-03-11T12:16:30.091Z",
      "2022-03-11T12:16:30.091Z",
    ],
    initiatedByFirstName: "John",
    initiatedByLastName: "Jacobs",
    initialedDate: "2024-03-11T12:16:30.091Z",
  },
  {
    batchID: "#107",
    batchName: "Batch Name16",
    patientCount: "100",
    status: "processing",
    statusValue: "200/23",
    yearOfService: [
      "2024-03-11T12:16:30.091Z",
      "2023-03-11T12:16:30.091Z",
      "2022-03-11T12:16:30.091Z",
    ],
    initiatedByFirstName: "John",
    initiatedByLastName: "Jacobs",
    initialedDate: "2024-03-11T12:16:30.091Z",
  },
  {
    batchID: "#108",
    patientCount: "100",
    batchName: "Batch Name17",
    status: "processing",
    statusValue: "200/23",
    yearOfService: [
      "2024-03-11T12:16:30.091Z",
      "2023-03-11T12:16:30.091Z",
      "2022-03-11T12:16:30.091Z",
    ],
    initiatedByFirstName: "John",
    initiatedByLastName: "Jacobs",
    initialedDate: "2024-03-11T12:16:30.091Z",
  },
  {
    batchID: "#109",
    patientCount: "100",
    batchName: "Batch Name18",
    status: "processing",
    statusValue: "200/23",
    yearOfService: [
      "2024-03-11T12:16:30.091Z",
      "2023-03-11T12:16:30.091Z",
      "2022-03-11T12:16:30.091Z",
    ],
    initiatedByFirstName: "John",
    initiatedByLastName: "Jacobs",
    initialedDate: "2024-03-11T12:16:30.091Z",
  },
];
const commonFilterItems = [
  {
    id: 1,
    title: "Search",
    type: "search",
    value: null,
    placeholder: "Search",
    active: true,
    header: "Search by UserName",
  },
];
const PatientSync = ({
  getAllBatches,
  pdfTableData,
  pdfLoader,
  getActiveTab,
  reportActiveTab,
  routedData,
  webSocketData,
  getProviderRoaster,
  getPatientRoaster,
  getPracticeRoaster,
  getTinRoaster,
  getTableData,
  data,
  tableDynamicColumn,
  tableDynamicColumnReset,
  pageLoad,
}) => {
  const columns = [
    {
      name: "BATCH ID",
      value: "id",
      isShow: true,
      filterKey: "Search",
    },
    {
      name: "BATCH Name",
      value: "name",
      isShow: true,
      filterKey: "Search",
    },
    {
      name: "COUNT",
      value: "totalFileCount",
      isShow: true,
      filterKey: "batch",
      countInfo: true,
    },
    {
      name: "YEAR OF SERVICE",
      value: "yearOfService",
      isShow: true,
      arrayDataFormat: true,
    },
    {
      name: "EMR",
      value: "emrType",
      isShow: true,
    },
    {
      name: "SOURCE",
      value: "source",
      sortable: true,

      isShow: true,
    },
    {
      name: "INITIATED BY",
      value: "createdBy",
      sortable: true,
      isShow: true,
    },
    {
      name: "INITIATED DATE",
      value: "createdDate",
      sortable: true,
      isDate: true,
      isShow: true,
      filterKey: "completedDate",
    },

    {
      name: "Status",
      value: "statusProxy",

      infoIcon: true,
      isShow: true,
      filterKey: "Status",
      batchButtons: true,
    },
  ];
  const pickerRef = useRef();
  const router = useRouter();
  const [filteredCOder, setFilteredCoder] = useState(null);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [uploadType, setUploadType] = useState("");
  const [pageNo, setPageNo] = useState(0);
  const [selectedBatch, setSelectedBatch] = useState();
  const [searchVal, setSearchVal] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [search, setSearch] = useState();
  const [selectedDateRanges, setSelectedDateRanges] = useState({});
  const [isOpenFhirDrawer, setIsOpenFhirDrawer] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [openUpload, setOpenUpload] = useState({ status: false, data: null });
  const [form] = Form.useForm();
  const [fileLoading, setFileLoading] = useState(false);
  const [uploadAction, setUploadAction] = useState(null);
  const [viewDetailedBatch, setViewDetailedBatch] = useState({
    status: false,
    data: null,
  });
  const [socketData, setSocketData] = useState(null);
  const [paramsFilter, setParamsFilter] = useState(null);
  const [roasterDrawer, setRoasterDrawer] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [pagination, setPagination] = useState(0);
  const [test, setTest] = useState(data?.response?.metaDataDTO);
  const [roleId, setRoleId] = useState(null);
  const [open, setOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [drawerProps, setDrawerProps] = useState({
    isDrawerOpen: false,
    reUpload: null,
  });
  const [searchText, setSearchText] = useState(null);
  const [selectedOption, setSelectedOption] = useState({});
  const [clear, setClear] = useState(false);
  const [sort, setSort] = useState(null);

  const handleUploadButtonClick = (e) => {
    setIsDrawerOpen(!isDrawerOpen);
    setUploadType(e.target.name);
    setSelectedBatch();
  };
  const handleFhirUpload = (e) => {
    setIsOpenFhirDrawer(!isOpenFhirDrawer);
    setUploadType(e.target.name);
    setSelectedBatch();
  };
  // const handleRoasterBtn = () => {
  //   setRoasterDrawer(!roasterDrawer);
  // };
  const handleRoasterBtn = (item) => {
    setDrawerProps({
      isDrawerOpen: true,
      reUpload: item?.reUploadId || item?.id,
    });
  };
  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPageNo(e.page);
  };

  const renderButton = () => {
    switch (reportActiveTab) {
      case "FHIR":
        return (
          <RegularButton
            name="Upload"
            onClick={handleFhirUpload}
            padding={"5px 10px"}
            height={"35px"}
            width={"120px"}
          />
        );
      case "PDF":
        return (
          <RegularButton
            name="Create Batch"
            onClick={handleUploadButtonClick}
            padding={"5px 10px"}
            height={"35px"}
            width={"120px"}
          />
        );
      case "Patient Roaster":
      case "Practice Roaster":
      case "Provider Roaster":
      case "Tin Roaster":
        return (
          <RegularButton
            name="Add Roaster"
            onClick={handleRoasterBtn}
            padding={"5px 10px"}
            height={"35px"}
            width={"120px"}
          />
        );
      default:
        return (
          <RegularButton
            name="Upload"
            onClick={handleRoasterBtn}
            padding={"5px 10px"}
            height={"35px"}
            width={"120px"}
          />
        );
    }
  };
  const handleRowActionClick = (row) => {
    getActiveTab("PDF");
    if (row?.batchUploadStatus) {
      setViewDetailedBatch({ status: true, data: row });
    }
  };

  const renderCountDetailsPopover = (row) => {
    if (!row) return null;

    const success = row?.totalSuccessCount || 0;
    const failed = row?.totalFailedCount || 0;
    const processing = row?.totalProcessingCount || 0;

    const color = processing > 0 ? "#FF7D2A" : failed > 0 ? "red" : "#04306f";

    return (
      <Popover
        content={
          <>
            <span> Computed&nbsp; :</span>
            <span>&nbsp;{success}</span>
            <br />
            <span> Failed&nbsp; :</span>
            <span>&nbsp;{failed}</span>
            <br />
            <span> Processing&nbsp; :</span>
            <span>&nbsp;{processing}</span>
          </>
        }
      >
        <FontAwesomeIcon
          icon={faCircleInfo}
          style={{ color }}
          className="mx-1 d-flex justify-content-center align-items-center pt-1"
        />
      </Popover>
    );
  };

  const handleTabs = (name) => {
    setSort("");
    getActiveTab(name);
    setSearch();
    setSearchVal(null);
    setSelectedDates(null);
    setSelectedDateRanges([]);
  };
  const debouncedSearch = useCallback(
    debounce((text, setSearchVal, field) => {
      setSearchVal(text);
    }, 1000),
    []
  );
  const getNameSearch = (event) => {
    const value = event.target.value;
    const field = event.target.name;
    setSearch({
      name: event.target.name,
      searchVal: value,
    });
    setPageNo(0);
    setPaginationFirst(0);
    debouncedSearch(value, setSearchVal, field);
  };
  const handleRangePicker = (date, dateString, tabName) => {
    const formattedDates = dateString?.map((date, index) =>
      formatDateForIndex({ date: date, index: index })
    );

    setSelectedDates((prevOptions) => ({
      ...prevOptions,
      [tabName]: date,
    }));
    setSelectedDateRanges((prevOptions) => ({
      ...prevOptions,
      [tabName]: { from: formattedDates[0], to: formattedDates[1] },
    }));
  };

  const dosOnChange = (selectedOption, name) => {
    const nameString = name?.split(" ").join("");
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [nameString]: selectedOption,
    }));
  };
  const dateFormateAlign = (dates) => (
    <div className="d-flex justify-content-center align-items-center">
      {dates?.map((res, index) => {
        if (index < 1) {
          // let sectionMapArr = <span>{dayjs(res).format("YYYY")}</span>;
          return (
            <div className="text-center">{`${res}${
              (index + 1) / 2 == 0 ? "," : ""
            }`}</div>
          );
        } else if (dates?.length - 1 == index) {
          let sectionMapArr = (
            <Popover
              content={
                <>
                  {dates?.map((item, i) =>
                    i > 0 ? (
                      <div className="text-center">{`${item}${
                        i / 2 == 0 ? "," : ""
                      }`}</div>
                    ) : null
                  )}
                </>
              }
              placement="bottom"
            >
              <span
                id="popover-year"
                name="popover-year"
                style={{ width: "22px", height: "22px" }}
                className={`border border-success-subtle rounded-circle text-center mx-1`}
              >
                {dates.length - 1}+
              </span>
            </Popover>
          );
          return sectionMapArr;
        }
      })}
    </div>
  );
  const getStatusStyles = ({ status, isBorder }) => {
    // const isProcessing = status === "PROCESSING";
    return {
      background:
        status === "PROCESSING"
          ? "#FFE0CB"
          : status === "FAILED"
          ? "red"
          : "#CFE5FC",
      color:
        status === "PROCESSING"
          ? "#FF7D2A"
          : status === "FAILED"
          ? "red"
          : "#1B67B3",
      border: isBorder
        ? `1px solid ${
            status === "PROCESSING"
              ? "#FF7D2A"
              : status === "FAILED"
              ? "red"
              : "#1B67B3"
          }`
        : "none",
    };
  };

  const onClose = () => {
    setOpen(false);
  };
  const showDrawer = () => {
    setTest(data?.response?.metaDataDTO);
    setOpen(true);
  };

  useEffect(() => {
    if (routedData) {
      setParamsFilter("check");
      setViewDetailedBatch(routedData?.viewDetailedBatch);
    }
  }, []);
  useEffect(() => {
    setFilteredCoder(null);
    // if (reportActiveTab) {
      getActiveTab("FHIR");
    // }
  }, []);

  useEffect(() => {
    if (reportActiveTab === "PDF") {
      getAllBatches({
        page: pageNo,
        search: searchVal || "",
        startDate: selectedDateRanges?.PDF?.from,
        endDate: selectedDateRanges?.PDF?.to,
        batchUploadStatus: selectedOptions?.PDF,
      });
    }
  }, [
    reportActiveTab,
    pageNo,
    selectedDateRanges,
    searchVal,
    selectedOptions,
    viewDetailedBatch?.status,
  ]);
  useEffect(() => {
    if (webSocketData && webSocketData?.webSocketType === "BATCH_STATUS") {
      const updatedTableData = pdfTableData?.content?.map((item) => {
        if (item?.id === webSocketData?.id) {
          return {
            ...item,
            batchUploadStatus: webSocketData?.batchUploadStatus || "PROCESSING",
          };
        }
        return item;
      });
      setSocketData((prevState) => ({
        ...prevState,
        content: updatedTableData,
      }));
    }
    // else {
    //   setSocketData(pdfTableData);
    // }
  }, [webSocketData, pdfTableData]);

  const handleBatchTrigger = async (data) => {
    const triggerData = {
      batchId: data?.id,
      ftpRequestFrom: "COGENT_AI",
    };
    const res = await getTriggerBatch({ obj: triggerData });
    if (res.status === "SUCCESS") {
      getResponePopup(res);
      getAllBatches({ page: pageNo });
    }
  };
  const getAllProviderApi = async () => {
    const projectId = getStorage("project");
    const response = await getTableData({
      pageId: "42136c12-83df-46fc-8c8a-200d97f154be",
      pageNo,
      pageSize: 15,
      roleId,
      projectId: projectId,
      searchText,
      selectedDateRanges,
      selectedOption,
      sort,
    });
  };
  const getAllPracticeApi = async () => {
    const projectId = getStorage("project");
    const response = await getTableData({
      pageId: "e2785147-39dc-4bd3-828c-c0d5168acba7",
      pageNo,
      pageSize: 15,
      roleId,
      projectId: projectId,
      searchText,
      selectedDateRanges,
      sort,
    });
  };
  const getAllPatientApi = async () => {
    const projectId = getStorage("project");
    const response = await getTableData({
      pageId: "c60dec23-bcfa-48ce-966e-dbf1ce3d41b2",
      pageNo,
      pageSize: 15,
      roleId,
      projectId: projectId,
      searchText,
      selectedDateRanges,
      sort,
    });
  };
  const getTinApi = async () => {
    const projectId = getStorage("project");
    const response = await getTableData({
      pageId: "1ff437a0-18a8-47de-893d-41dc669e3cbd",
      pageNo,
      pageSize: 15,
      roleId,
      projectId: projectId,
      searchText,
      selectedDateRanges,
      sort,
    });
  };
  const pageIds =
    reportActiveTab === "Provider Roaster"
      ? "42136c12-83df-46fc-8c8a-200d97f154be"
      : reportActiveTab === "Practice Roaster"
      ? "e2785147-39dc-4bd3-828c-c0d5168acba7"
      : reportActiveTab === "Patient Roaster"
      ? "c60dec23-bcfa-48ce-966e-dbf1ce3d41b2"
      : reportActiveTab === "Tin Roaster"
      ? "1ff437a0-18a8-47de-893d-41dc669e3cbd"
      : "";
  const handleSubmitInsert = async () => {
    setIsSubmitting(true);

    const payload = {
      pageId: pageIds,
      headerNames: test
        .filter((col) => col.active)
        .map((col) => col.actualField),
    };

    try {
      const response = await tableDynamicColumn({ payload });
      if (response?.status === "SUCCESS") {
        if (reportActiveTab === "Provider Roaster") {
          getAllProviderApi();
        } else if (reportActiveTab === "Practice Roaster") {
          getAllPracticeApi();
        } else if (reportActiveTab === "Patient Roaster") {
          getAllPatientApi();
        } else if (reportActiveTab === "Tin Roaster") {
          getTinApi();
        }
        onClose();
        getResponePopup(response);
      }
      setIsSubmitting(false);
    } catch (error) {
      getResponePopup(error?.response);
    }
  };
  const handleReset = async () => {
    setIsResetting(true);

    const payload = {
      pageId: pageIds,
    };
    try {
      const response = await tableDynamicColumnReset({ payload });
      if (response?.status === "SUCCESS") {
        if (reportActiveTab === "Provider Roaster") {
          getAllProviderApi();
        } else if (reportActiveTab === "Practice Roaster") {
          getAllPracticeApi();
        } else if (reportActiveTab === "Patient Roaster") {
          getAllPatientApi();
        } else if (reportActiveTab === "Tin Roaster") {
          getTinApi();
        }
        onClose();
        getResponePopup(response);
      }
      setIsResetting(false);
    } catch (error) {
      getResponePopup(error?.response);
    }
  };
  useEffect(() => {
    if (reportActiveTab === "Provider Roaster") {
      getAllProviderApi();
    } else if (reportActiveTab === "Practice Roaster") {
      getAllPracticeApi();
    } else if (reportActiveTab === "Patient Roaster") {
      getAllPatientApi();
    } else if (reportActiveTab === "Tin Roaster") {
      getTinApi();
    }
  }, [
    reportActiveTab,
    pageNumber,
    pagination,
    pageLoad,
    searchText,
    selectedDateRanges,
    sort,
  ]);
  useEffect(() => {
    setActiveFilters(
      data?.response?.metaDataDTO.filter(
        (item) => item.active && item?.filter?.style
      )
    );
  }, [data?.response?.metaDataDTO]);

  return (
    <>
      <Header />
      {viewDetailedBatch?.status ? (
        <DetailedViewPdfTable
          params={{
            batchId: viewDetailedBatch?.data?.id,
            pageNo: pageNo,
            viewDetailedBatch,
            selectedDateRanges,
            selectedOptions,
            search,
            selectedDates,
          }}
          setViewDetailedBatch={setViewDetailedBatch}
          viewDetailedBatch={viewDetailedBatch}
          paramsFilter={paramsFilter}
          setParamsFilter={setParamsFilter}
          setSelectedDates={setSelectedDates}
          setSelectedDateRanges={setSelectedDateRanges}
          setListSearch={setSearch}
          setSelectedOptions={setSelectedOptions}
          setListPageNo={setPageNo}
          setListSearchVal={setSearchVal}
          initialTableData={
            socketData?.content?.length > 0 ? socketData : pdfTableData
          }
        />
      ) : (
        <div className={styles.maincontainer}>
          <div class="content-body">
            <div className="container-fluid">
              <div className="row">
                <div className="col-12">
                  <div className="">
                    <div className="card-body p-0">
                      <div className="table-responsive active-projects task-table">
                        <div
                          className="d-flex"
                          style={{ width: "100%", margin: "auto" }}
                        >
                          {reportActiveTab === "FHIR" ||
                          reportActiveTab === "PDF" ? (
                            <div
                              className="d-flex flex-wrap col-10 "
                              style={{ width: "85%" }}
                            >
                              <div className="default-filter-size col-2 col-xl-2 col-md-4 mx-1">
                                <label>Search by Name or ID</label>
                                <div
                                  id="searc-name"
                                  name="search-name"
                                  style={{ height: "45px" }}
                                >
                                  <Input
                                    type="text"
                                    name="initialSearch"
                                    data-testid="initialSearch"
                                    onChange={(e) => getNameSearch(e)}
                                    value={search?.searchVal || ""}
                                    className={
                                      "w-100 new-search-control border-none"
                                    }
                                    placeholder="Search"
                                    maxLength={25}
                                    onKeyDown={(e) => {
                                      // Prevent input of backslash ("\")
                                      if (e.key === "\\") {
                                        e.preventDefault();
                                      }
                                    }}
                                    prefix={
                                      <FontAwesomeIcon
                                        className="searchPrefix"
                                        icon={faSearch}
                                      />
                                    }
                                    allowClear={true}
                                    autoComplete="off"
                                  />
                                </div>
                              </div>
                              <div className="default-filter-size col-2 col-xl-2 col-md-3 mx-1">
                                <label>Date</label>
                                <div
                                  id="picker-date"
                                  name="picker-date"
                                  class="form-group has-search"
                                >
                                  <RangePicker
                                    ref={pickerRef}
                                    data-testid="select-date"
                                    name="select-date"
                                    format="MM-DD-YYYY"
                                    value={
                                      selectedDates
                                        ? selectedDates[reportActiveTab]
                                        : undefined
                                    }
                                    onChange={(dates, dateStrings) => {
                                      if (!dates || dates.length === 0) {
                                        setTimeout(
                                          () => pickerRef.current?.focus(),
                                          100
                                        );
                                      }
                                      handleRangePicker(
                                        dates,
                                        dateStrings,
                                        reportActiveTab
                                      );
                                    }}
                                    onCalendarChange={(val) => {
                                      setSelectedDates((prev) => ({
                                        ...prev,
                                        [reportActiveTab]: val,
                                      }));
                                    }}
                                    disabledDate={(currentDate) => {
                                      const selectedRange = selectedDates
                                        ? selectedDates[reportActiveTab]
                                        : [];
                                      return disabledDate(
                                        currentDate,
                                        selectedRange
                                      );
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="default-filter-size col-2 col-xl-2 col-md-3 mx-1">
                                <label>Status</label>
                                <div
                                  id="status-select"
                                  name="status-select"
                                  className={`custom-react-select`}
                                >
                                  <Select
                                    data-testid="select-status"
                                    name="select-status"
                                    placeholder={"Select"}
                                    options={
                                      reportActiveTab === "FHIR"
                                        ? statusOptions
                                        : statusOptions2
                                    }
                                    onChange={(selectedOption) => {
                                      dosOnChange(
                                        selectedOption,
                                        reportActiveTab
                                      );
                                    }}
                                    value={selectedOptions[reportActiveTab]}
                                    allowClear
                                  />
                                </div>
                              </div>
                              {!reportActiveTab ||
                                (reportActiveTab === "FHIR" && (
                                  <div className=" default-filter-size col-xl-2 col-md-4 mx-1">
                                    <label>Initiated By</label>
                                    <div
                                      ID="initiated"
                                      name="initiated"
                                      className={`custom-react-select`}
                                    >
                                      <Select
                                        data-testid="initiated-by"
                                        name="initiated-by"
                                        placeholder={"Select"}
                                        options={statusOptions}
                                        onChange={(selectedOption) => {
                                          dosOnChange(
                                            selectedOption,
                                            reportActiveTab
                                          );
                                        }}
                                        allowClear
                                      />
                                    </div>
                                  </div>
                                ))}
                            </div>
                          ) : (
                            <div
                              className="d-flex flex-wrap col-10 "
                              style={{ width: "85%" }}
                            >
                              {reportActiveTab === "Tin Roaster" ||
                              reportActiveTab === "Patient Roaster" ||
                              reportActiveTab === "Practice Roaster" ||
                              reportActiveTab === "Provider Roaster" ? (
                                <ReusableFilters
                                  showFilter={true}
                                  setActiveFilters={setActiveFilters}
                                  setSearchText={setSearchText}
                                  searchText={searchText}
                                  setSelectedOption={setSelectedOption}
                                  selectedOption={selectedOption}
                                  setSelectedDateRanges={setSelectedDateRanges}
                                  selectedDateRanges={selectedDateRanges}
                                  setPageNumber={setPageNumber}
                                  FilterItems={activeFilters}
                                  selectedDates={selectedDates}
                                  setSelectedDates={setSelectedDates}
                                  activeFilters={activeFilters}
                                  setClear={setClear}
                                  clear={clear}
                                  setPageNo={setPageNo}
                                  // opt={opt}
                                  commonFilterItems={commonFilterItems}
                                  open={open}
                                  onClose={onClose}
                                  selectedColumns={test}
                                  setSelectedColumns={setTest}
                                  showDrawer={showDrawer}
                                  handleSubmit={handleSubmitInsert}
                                  handleReset={handleReset}
                                  isSubmitting={isSubmitting}
                                  isResetting={isResetting}
                                />
                              ) : null}
                            </div>
                          )}
                          <div
                            className="d-flex justify-content-center align-items-center"
                            style={{ width: "10%" }}
                          >
                            <div className=" mt-4">{renderButton()}</div>
                            <div
                              id="table-btn"
                              name="table-btn"
                              className="d-flex justify-content-center align-items-center  mt-4"
                            >
                              <Button
                                data-testid="table-custom"
                                name="table-custom"
                                onClick={showDrawer}
                                className="btn btn-sm w-full text-ellipsis tableButton"
                              >
                                Table Customization
                              </Button>
                            </div>
                          </div>{" "}
                        </div>

                        <div
                          id="task-tbl_wrapper"
                          className="dataTables_wrapper no-footer"
                        >
                          <div
                            className="profile-tab "
                            style={{ marginTop: "20px" }}
                          >
                            <div className="custom-tab-1">
                              <Tab.Container defaultActiveKey="fhir">
                                <Nav as="ul" className="nav nav-tabs">
                                  <Nav.Item
                                    as="li"
                                    className="nav-item"
                                    onClick={() => {
                                      handleTabs("FHIR");
                                    }}
                                  >
                                    <Nav.Link
                                      id="fhir"
                                      name="fhir"
                                      to="#my-posts"
                                      eventKey="fhir"
                                    >
                                      FHIR
                                    </Nav.Link>
                                  </Nav.Item>
                                  <Nav.Item
                                    as="li"
                                    className="nav-item"
                                    onClick={() => {
                                      handleTabs("PDF");
                                    }}
                                  >
                                    <Nav.Link
                                      id="pdf"
                                      name="pdf"
                                      to="#my-posts"
                                      eventKey="pdf"
                                    >
                                      PDF
                                    </Nav.Link>
                                  </Nav.Item>
                                  <Nav.Item
                                    as="li"
                                    className="nav-item"
                                    onClick={() => {
                                      handleTabs("Tin Roaster");
                                    }}
                                  >
                                    <Nav.Link
                                      id="tinRoaster"
                                      name="tinRoaster"
                                      to="#my-posts"
                                      eventKey="tinRoaster"
                                    >
                                      Tin Roaster
                                    </Nav.Link>
                                  </Nav.Item>

                                  <Nav.Item
                                    as="li"
                                    className="nav-item"
                                    onClick={() => {
                                      handleTabs("Practice Roaster");
                                    }}
                                  >
                                    <Nav.Link
                                      id="practiceRoaster"
                                      name="practiceRoaster"
                                      to="#my-posts"
                                      eventKey="practiceRoaster"
                                    >
                                      Practice
                                    </Nav.Link>
                                  </Nav.Item>
                                  <Nav.Item
                                    as="li"
                                    className="nav-item"
                                    onClick={() => {
                                      handleTabs("Provider Roaster");
                                    }}
                                  >
                                    <Nav.Link
                                      id="providerRoaster"
                                      name="providerRoaster"
                                      to="#my-posts"
                                      eventKey="providerRoaster"
                                    >
                                      Provider Roaster
                                    </Nav.Link>
                                  </Nav.Item>

                                  <Nav.Item
                                    as="li"
                                    className="nav-item"
                                    onClick={() => {
                                      handleTabs("Patient Roaster");
                                    }}
                                  >
                                    <Nav.Link
                                      id="patientRoaster"
                                      name="patientRoaster"
                                      to="#my-posts"
                                      eventKey="patientRoaster"
                                    >
                                      Patient
                                    </Nav.Link>
                                  </Nav.Item>
                                </Nav>
                                <Tab.Content>
                                  <Tab.Pane id="my-posts" eventKey="fhir">
                                    <FHIRPatinetTable
                                      paginationFirst={paginationFirst}
                                      onPageChange={onPageChange}
                                      tableData={FHIRData}
                                    />
                                  </Tab.Pane>
                                  <Tab.Pane id="my-posts" eventKey="pdf">
                                    <PdfTable
                                      paginationFirst={paginationFirst}
                                      setSelectedBatch={setSelectedBatch}
                                      onPageChange={onPageChange}
                                      tableData={
                                        socketData?.content?.length > 0
                                          ? socketData
                                          : pdfTableData
                                      }
                                      selectedBatch={selectedBatch}
                                      loader={pdfLoader}
                                      openUpload={openUpload}
                                      setOpenUpload={setOpenUpload}
                                      pageNo={pageNo}
                                      setViewDetailedBatch={
                                        setViewDetailedBatch
                                      }
                                      viewDetailedBatch={viewDetailedBatch}
                                      pdfTableData={pdfTableData}
                                    />
                                    {/* <AppTable
                                      data={
                                        socketData?.content?.length > 0
                                          ? socketData?.content
                                          : pdfTableData?.content
                                      }
                                      column={test?.filter(
                                        (item) => item.isShow
                                      )}
                                      // loader={loading}
                                      onRowClick={handleRowActionClick}
                                      first={pageNo === 0 ? 0 : paginationFirst}
                                      totalRecords={pdfTableData?.totalElements}
                                      row={15}
                                      onPageChange={onPageChange}
                                      dateFormateAlign={dateFormateAlign}
                                      getStatusStyles={getStatusStyles}
                                      handleBatchTrigger={handleBatchTrigger}
                                      renderCountDetailsPopover={
                                        renderCountDetailsPopover
                                      }
                                    /> */}
                                  </Tab.Pane>
                                  <Tab.Pane id="my-posts" eventKey="tinRoaster">
                                    <TinRoasterTable
                                      pageNumber={pageNumber}
                                      setPageNumber={setPageNumber}
                                      setPagination={setPagination}
                                      pagination={pagination}
                                      handleRoasterBtn={handleRoasterBtn}
                                      data={data}
                                      setSort={setSort}
                                      sort={sort}
                                    />
                                  </Tab.Pane>

                                  <Tab.Pane
                                    id="my-posts"
                                    eventKey="patientRoaster"
                                  >
                                    <PatientRoasterTable
                                      pageNumber={pageNumber}
                                      setPageNumber={setPageNumber}
                                      setPagination={setPagination}
                                      pagination={pagination}
                                      handleRoasterBtn={handleRoasterBtn}
                                      data={data}
                                      setSort={setSort}
                                      sort={sort}
                                    />
                                  </Tab.Pane>

                                  <Tab.Pane
                                    id="my-posts"
                                    eventKey="providerRoaster"
                                  >
                                    <ProviderRoasterTable
                                      pageNumber={pageNumber}
                                      setPageNumber={setPageNumber}
                                      setPagination={setPagination}
                                      pagination={pagination}
                                      handleRoasterBtn={handleRoasterBtn}
                                      data={data}
                                      setSort={setSort}
                                      sort={sort}
                                    />
                                  </Tab.Pane>

                                  <Tab.Pane
                                    id="my-posts"
                                    eventKey="practiceRoaster"
                                  >
                                    <PracticeRoasterTable
                                      pageNumber={pageNumber}
                                      setPageNumber={setPageNumber}
                                      setPagination={setPagination}
                                      pagination={pagination}
                                      handleRoasterBtn={handleRoasterBtn}
                                      data={data}
                                      setSort={setSort}
                                      sort={sort}
                                    />
                                  </Tab.Pane>
                                </Tab.Content>
                              </Tab.Container>
                            </div>
                          </div>

                          {isDrawerOpen && (
                            <PdfDrawer
                              isDrawerOpen={isDrawerOpen}
                              setIsDrawerOpen={setIsDrawerOpen}
                              uploadType={uploadType}
                              setUploadType={setUploadType}
                              selectedBatch={selectedBatch}
                              setFileList={setFileList}
                              fileList={fileList}
                              pageNo={pageNo}
                            />
                          )}

                          <FhirDrawer
                            isDrawerOpen={isOpenFhirDrawer}
                            setIsDrawerOpen={setIsOpenFhirDrawer}
                            uploadType={uploadType}
                            setUploadType={setUploadType}
                            selectedBatch={selectedBatch}
                          />
                          <RoasterDrawer
                            isDrawerOpen={drawerProps.isDrawerOpen}
                            setIsDrawerOpen={(val) =>
                              setDrawerProps((prev) => ({
                                ...prev,
                                isDrawerOpen: val,
                              }))
                            }
                            reportActiveTab={reportActiveTab}
                            reUpload={drawerProps.reUpload}
                            pageNumber={pageNumber}
                            getProviderRoaster={getAllProviderApi}
                            getPatientRoaster={getAllPatientApi}
                            getTinRoaster={getTinApi}
                            getPracticeRoaster={getAllPracticeApi}
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
      )}
      <UploadModal
        openUpload={openUpload}
        setOpenUpload={setOpenUpload}
        setUploadAction={setUploadAction}
        setFileLoading={setFileLoading}
        fileList={fileList}
        setFileList={setFileList}
        fileLoading={fileLoading}
        uploadAction={uploadAction}
        pageNo={pageNo}
        singleUpload={false}
      />
    </>
  );
};

const connector = connect(
  (state) => ({
    pdfTableData: state.tenantAdmin?.patientSync?.allBatches?.data?.response,
    pdfLoader: state.tenantAdmin?.patientSync?.batchLoader,
    reportActiveTab: state.admin?.report?.activeTab,
    uploadFilesLoader: state?.tenantAdmin?.patientSync?.uploadFilesLoader,
    routedData: state.tenantAdmin?.patientSync?.routedData,
    webSocketData: state?.tenantAdmin?.webSocket?.webSocketDetails?.data,
    tableLoader: state?.tableView?.tableViewLoading,
    data: state?.tableView?.tableView?.data,
    pageLoad: state?.tenantAdmin?.tin?.getPageRendering,
  }),
  {
    getAllBatches: allActions.getAllBatches,
    getActiveTab: allReportActions.activeTab,
    uploadFiles: allActions.upoloadFiles,
    getRoutedData: patientSyncAction.getRoutedData,
    getProviderRoaster: patientSyncAction.providerRoasterAction,
    getPatientRoaster: patientSyncAction.patientRoasterAction,
    getPracticeRoaster: patientSyncAction.praticeRoasterAction,
    getTinRoaster: patientSyncAction.tinRoasterAction,
    getTableData: tableAction.tableViewAction,
    tableDynamicColumn: tableAction.tableDynamicColumn,
    tableDynamicColumnReset: tableAction.tableDynamicColumnReset,
  }
);
export default connector(PatientSync);
