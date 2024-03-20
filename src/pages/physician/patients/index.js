import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Paginator } from "primereact/paginator";

import "react-facebook-loading/dist/react-facebook-loading.css";
import Header from "../../../jsx/layouts/nav/Header";
import PatientTable from "../table/PatientList/patientList";
import HeaderFilters from "../../../components/headerFilters";
import { getPatients } from "../../../store/actions/physicianAction/patientsActions";
import SpinnerDots from "../../../components/spinner";

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

export default function Patients() {
  const dispatch = useDispatch();
  const sideMenu = useSelector((state) => state.sideMenu);
  const response = useSelector((state) => state.PhyicianReducer.patients);

  useEffect(() => {
    dispatch(getPatients());
  }, []);

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
                            // setSearch={setSearch}
                            isSearch={true}
                            searchlabel="Search By Patient Id / Name"
                            // select status
                            selectlabel="Select Priority"
                            isSelector={true}
                            // setSelectedOption={SetSelectedOption}
                            // selectOptions={options}
                            defaultSelectValue1={"Select Status"}
                            // select status
                            pickerlabe6="Select Priority"
                            isAnotherPicker6={true}
                            //  setSelectedOption={SetSelectedOption}
                            // allocatedToOptoons={statusOptions}
                            defaultPriority={"Select Status"}
                            // computation date
                            pickerlabel="Date"
                            defaultStartDate={""}
                            defaultEndDate={""}
                            // setStartDate={setstartDate}
                            // setEndDate={setendDate}
                            isRangePicker={true}
                            // created by
                            // isNextCreatedBySelector={true}
                            // createdTolabel="Select Priority"
                            // optionKey="patientAllocated"
                            // createdByOptoons={generateOptionsList(filteredList)}
                            // setSelCreatedBy={setSelCreatedBy}
                            addUser={false}
                            // addUserForm={addPatientFormId}
                            // bullets={bullets}
                            // isNextRow={true}
                          />
                        </div>
                      </div>

                      <div
                        id="task-tbl_wrapper"
                        className="dataTables_wrapper no-footer"
                      >
                        {response?.loading === undefined ||
                        response?.loading ? (
                          <SpinnerDots />
                        ) : (
                          <>
                            <PatientTable
                              patinetListAll={response?.data?.response}
                            />
                            <div>
                              <div className="pagination-container">
                                <Paginator
                                  // first={paginationFirst}
                                  rows={15}
                                  // totalRecords={totalElements}
                                  // onPageChange={onPageChange}
                                />
                                <div className="total-pages">
                                  {/* Total count: {totalElements} */}
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
