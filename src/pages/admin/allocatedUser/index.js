import React, { useState, useEffect } from "react";
import { Button, Spinner } from "react-bootstrap";
import Header from "../../../jsx/layouts/nav/Header";
import { useSelector } from "react-redux";
import axios from "../../../utility/axiosConfig";
import ENDPOINTS from "../../../utility/enpoints";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "react-facebook-loading/dist/react-facebook-loading.css";
import { faUpload, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { patientDetails } from "../../../store/actions/AuthActions";
import { DatePicker, notification } from "antd";
import { InputText } from "primereact/inputtext";
import { Paginator } from "primereact/paginator";
import Footer from "../../../jsx/layouts/Footer";
import visitStyles from "../../../styles/visitdata.module.css";
import AddPatientListTable from "../../../components/table/admin/AddPatients/addPatients";
import { getMessagesList } from "../../../store/actions/adminAction/fileProcessingActions";
import { getPatients } from "../../../store/actions/adminAction/patientsActions";
import FileUploading from "../file-processing/FileUploading";
import Addpatients from "../file-processing/Addpatiens";
import AllocatedAdminList from "../../../components/table/admin/allocatedAdminList/allocatedAdminList";
import allocateStyle from "./allocate/style.module.css";
import AllocateModal from "./allocate";
import moment from "moment/moment";
const { RangePicker } = DatePicker;
export default function Patient() {
  const navigate = useRouter();
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [addPatientId, setAddPatientId] = useState(false);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectedRowsId, setSelectedRowsId] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const [allocateClicked, setAllocateClicked] = useState(false);
  const [allocateModal, setAllocateModal] = useState(false);
  const [selectedChart, setSelectedChart] = useState([]);
  const [headerCheckValidation, setHeaderCheckValidation] = useState([]);
  const [patinetListAll, setPatinetListAll] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [totalElements, setTotalElements] = useState(10);
  const [tableLoading, setTableLoading] = useState(true);
  const sideMenu = useSelector((state) => state.sideMenu);

  useEffect(() => {
    if (typeof pageNo == "number") {
      getAllList(pageNo, pageSize, "", "", true, 2);
    }
  }, [pageNo, pageSize]);

  const getAllList = async (
    pageNo = 0,
    pageSize = 15,
    startDate = "",
    endDate = "",
    allocate = true,
    status = 2,
    search = ""
  ) => {
    var resoureUrl = `dbservice/patient/admin/computation/filter?page=${pageNo}&size=${pageSize}&userId=uavis01@encipherhealth.onmicrosoft.com&computationStart=${startDate}&computationEnd=${endDate}&isAllocation=${allocate}&status=${status}&searchString=${search}`;
    const response = await axios.get(ENDPOINTS.apiEndoint + resoureUrl);
    if (response.data) {
      var resultMap = [];
      var result = response?.data?.response?.content;
      setTotalElements(response?.data?.response?.totalElements);
      result?.map((res) => {
        resultMap.push({
          ...res,
          patientId: res.patientId,
          patientName: res.patientName,
          computedDate: res.computedDate,
        });
      });
      if (result.length > 0) {
        setPatinetListAll(result);
      } else {
        setPatinetListAll([]);
      }

      setIsLoading(false);
      setTableLoading(false);
    }
  };
  const getAllCheckList = async () => {
    var resoureUrl = `dbservice/patient/admin/computation/filter?page=0&size=${totalElements}&userId=uavis01@encipherhealth.onmicrosoft.com&computationStart=&computationEnd=&isAllocation=true&status=2`;
    const response = await axios.get(ENDPOINTS.apiEndoint + resoureUrl);
    if (response.data) {
      var result = response?.data?.response?.content;
      const data = result.map((item) => ({
        id: item.patientId,
        name: item.patientName,
      }));
      setSelectedRowsId(data);
      setHeaderCheckValidation(data);
    }
  };

  useEffect(() => {
    if (selectAllChecked) {
      getAllCheckList();
    } else {
      setSelectedRowsId([]);
    }
  }, [selectAllChecked]);

  const handleReceivedDatePicker = (date, dateString) => {
    if (dateString[0] == "") {
      getAllList(pageNo, pageSize, "", "", true, 2);
    } else if (dateString.length > 1) {
      const formattedDates = dateString?.map((date, index) => {
        const formattedDate =
          index === 1
            ? `${moment(date).format("YYYY-MM-DD")}T23:59:59.999Z`
            : `${moment(date).format("YYYY-MM-DD")}T00:00:00.000Z`;
        return formattedDate;
      });
      if (dateString.length > 0) {
        getAllList(
          pageNo,
          pageSize,
          formattedDates[0],
          formattedDates[1],
          true,
          2
        );
      }
    }
  };

  const getNameSearch = (search) => {
    getAllList(
      pageNo,
      pageSize,
      dateRange ? dateRange[0] : "",
      dateRange ? dateRange[1] : "",
      true,
      2,
      search
    );
  };

  const onPageChange = (e) => {
    setIsLoading(true);
    setPaginationFirst(e.first);
    setPageNo(e.page);
    setPageSize(e.rows);
    setTableLoading(true);
  };

  const handleOpneModal = () => {
    setValidated(false);
    setAddPatientId(false);
    setAllocateModal(true);
  };
  useEffect(() => {
    if (allocateClicked) {
      getAllList(pageNo, pageSize, "", "", true, 2);
      setAllocateClicked(false);
      setSelectedRowsId([]);
      setSelectAllChecked(false);
    }
  }, [allocateClicked]);
  return (
    <>
      <div className={`show ${sideMenu ? "menu-toggle" : ""}`}>
        <Header />
        <div class="content-body">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xl-12">
                <div className="">
                  <div className="card-body p-0">
                    <div className="table-responsive active-projects task-table">
                      <div className="tbl-caption  align-items-center">
                        <div className="row filter-contain">
                          <div className="col-xl-2">
                            <label>Search by Name or ID</label>
                            <div class="form-group has-search">
                              <FontAwesomeIcon
                                className="fa fa-search form-control-feedback"
                                icon={faSearch}
                              />
                              <InputText
                                type="text"
                                onChange={(e) => getNameSearch(e.target.value)}
                                className="form-control new-form-control"
                                placeholder="Search"
                              />
                            </div>
                          </div>
                          <div className="col-xl-2">
                            <label>Computed Date</label>
                            <div>
                              <RangePicker
                                format="MM-DD-YYYY"
                                onChange={(dates, dateStrings) => {
                                  setDateRange(dateStrings);
                                  handleReceivedDatePicker(dates, dateStrings);
                                }}
                              />
                            </div>
                          </div>

                          <div className="col-xl-8 mt-4">
                            <button
                              onClick={handleOpneModal}
                              className={`btn btn-primary btn-sm mx-4 ms-2 flr ${allocateStyle.modalBtn}`}
                              disabled={!selectedRowsId.length > 0}
                            >
                              Allocate
                            </button>
                          </div>
                        </div>
                      </div>

                      <div
                        id="task-tbl_wrapper"
                        className="dataTables_wrapper no-footer"
                      >
                        {isLoading ? (
                          <Spinner />
                        ) : (
                          <>
                            <AllocatedAdminList
                              patinetListAll={patinetListAll}
                              selectAllChecked={selectAllChecked}
                              setSelectAllChecked={setSelectAllChecked}
                              selectedRowsId={selectedRowsId}
                              setSelectedRowsId={setSelectedRowsId}
                              selectedChart={headerCheckValidation}
                            />
                            <div>
                              <div className="pagination-container">
                                <Paginator
                                  first={paginationFirst}
                                  rows={15}
                                  totalRecords={totalElements}
                                  onPageChange={onPageChange}
                                />
                                <div className="total-pages">
                                  Total count: {totalElements}
                                </div>
                              </div>
                            </div>

                            <Footer />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AllocateModal
        open={allocateModal}
        setOpen={setAllocateModal}
        selectedRowsId={selectedRowsId}
        setSelectedRowsId={setSelectedRowsId}
        setAllocateClicked={setAllocateClicked}
        setSelectAllChecked={setSelectAllChecked}
        setSelectedChart={setSelectedChart}
        selectedChart={selectedChart}
      />
    </>
  );
}
