import React, { useEffect, useState } from "react";
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

  const [physicianId, setPhysicianId] = useState("ID-001");
  const [from, setFrom] = useState("2024-03-20T00:00:00Z");
  const [to, setTo] = useState("2024-03-20T23:59:59Z");
  const [priority, setPriority] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getPatients(physicianId, from, to, priority, search));
  }, [dispatch, physicianId, from, to, priority, search]);

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
                            isSearch={true}
                            searchlabel="Search By MRN / Patient Name"
                            defaultSelectValue1={"Select Status"}
                            defaultPriority={"Select Status"}
                            defaultStartDate={""}
                            defaultEndDate={""}
                            isRangeTimePicker={true}
                            timePickerlabel={"Date and time Range"}
                            addUser={false}
                            setSearch={setSearch}
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
                                <Paginator rows={15} />
                                <div className="total-pages"></div>
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
