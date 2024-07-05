import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import "react-facebook-loading/dist/react-facebook-loading.css";
import { Paginator } from "primereact/paginator";
import Header from "../../../jsx/layouts/nav/Header";
import SpinnerDots from "../../../components/spinner";
import HeaderFilters from "../../../components/headerFilters";
import { getPatients } from "../../../store/actions/physicianAction/patientsActions";
import PatientTable from "../table/PatientList/patientList";
import { patientDetails } from "../../../stores/authflow/actions";

export function extractLatestData(notes) {
  let declinedData;

  if (notes && typeof notes === "object") {
    const entries = Object.entries(notes);

    const latestKey = Math.max(...entries.map(([key, value]) => parseInt(key)));

    entries.forEach(([key, value]) => {
      if (parseInt(key) === latestKey) {
        declinedData = value;
      }
    });
  }

  return declinedData;
}


const statusOptions = [
  { label: "ALL", value: "" },
  { label: "AUDITED", value: "AUDITED" },
  { label: "AUDIT_PENDING", value: "AUDIT_PENDING" },
  { label: "RE AUDIT", value: "REAUDIT" },
  // { label: "DECLINED", value: "DECLINED" },
  { label: "AUDIT HOLD", value: "AUDITHOLD" },
  { label: "AUDIT DECLINED", value: "AUDIT_DECLINED" },
];

export default function Patients() {
  const navigate = useRouter();
  const dispatch = useDispatch();
  const sideMenu = useSelector((state) => state.sideMenu);
  const response = useSelector((state) => state.phyicianReducer.patients);
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingBtn, setIsLoadingBtn] = useState(true);
  const [addPatient, setAddPatient] = useState(false);
  const [addPatientId, setAddPatientId] = useState(false);
  const [completedStartDate, setCompletedStartDate] = useState("");
  const [completedEndDate, setCompletedEndDate] = useState("");
  const [computedStartDate, setComputedStartDate] = useState("");
  const [computedEndDate, setComputedEndDate] = useState("");
  const [selectedOption, SetSelectedOption] = useState("");
  const [patientSortOrder, setPatientSortOrder] = useState("ASC");
  const [sort, setSort] = useState({ sortDir: "", sortField: "" });
  const [selAllocatedBy, setSelAllocatedBy] = useState("");
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [totalElements, setTotalElements] = useState(10);
  const [tableLoading, setTableLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selCreatedBy, setSelCreatedBy] = useState("");

  useEffect(() => {
    const datas = {
      pageNo,
      computedStartDate,
      computedEndDate,
      selectedOption,
      search,
      completedStartDate,
      completedEndDate,
      patientSortOrder,
      selAllocatedBy,
      sort,
      selCreatedBy,
    };

    dispatch(getPatients(datas));
  }, [
    pageNo,
    computedStartDate,
    computedEndDate,
    selectedOption,
    selAllocatedBy,
    search,
    completedStartDate,
    completedEndDate,
    patientSortOrder,
    sort,
    selCreatedBy,
  ]);

  const onPageChange = (e) => {
    setIsLoading(true);
    setPaginationFirst(e.first);
    setPageNo(e.page);
    setPageSize(e.rows);
    setTableLoading(true);
    getAllList(response?.response);
  };

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
                        <div className="tbl-caption  align-items-center">
                          <HeaderFilters
                            setSearch={setSearch}
                            isSearch={true}
                            searchlabel="Search By Patient MRN / Name"
                            // select status
                            selectlabel="Select Priority"
                            isSelector={true}
                            setSelectedOption={SetSelectedOption}
                            selectOptions={[]}
                            defaultSelectValue1={"Select Status"}
                            // select status
                            pickerlabe6="Select Priority"
                            isAnotherPicker6={true}
                            //  setSelectedOption={SetSelectedOption}
                            allocatedToOptoons={statusOptions}
                            defaultPriority={"Select Status"}
                            // computation date
                            pickerlabel="Date"
                            defaultStartDate={""}
                            defaultEndDate={""}
                            setStartDate={setComputedStartDate}
                            setEndDate={setComputedEndDate}
                            isRangePicker={true}
                            addUser={false}
                            
                          />
                        </div>
                      </div>

                      <div
                        id="task-tbl_wrapper"
                        className="dataTables_wrapper no-footer"
                      >
                       
                        {response?.loading || !response ? (
                          <SpinnerDots />
                        ) : (
                          <>
                            <PatientTable
                              patinetListAll={response?.data?.response}
                              patientDetails={patientDetails}
                              sort={sort}
                              setSort={setSort}
                            />
                            <div>
                              <div className="pagination-container">
                                <Paginator
                                  first={pageNo===0?0:paginationFirst}
                                  rows={15}
                                  totalRecords={totalElements}
                                  onPageChange={onPageChange}
                                />
                                <div className="total-pages">
                                  Total count: {totalElements}
                                </div>
                              </div>
                            </div>
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
    </>
  );
}
