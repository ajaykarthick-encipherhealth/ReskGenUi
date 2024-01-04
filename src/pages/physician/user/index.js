

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Button } from 'react-bootstrap';
import { Badge } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';
import { SVGICON } from "../../../jsx/constant/theme";
import LoadingSpinner from "../../../jsx/components/spinner/spinner";
import NavBar from "../../../jsx/layouts/nav";
import { useSelector } from "react-redux";
import { Offcanvas } from "react-bootstrap";
import AdminList from "../../../components/table/admin/adminList/adminList";

import axios from "../../../utility/axiosConfig";
import ENDPOINTS from "../../../utility/enpoints";
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight, faClose, faUpload, faCheck, faBan, faAdd, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Space, Spin } from 'antd';
import { NativeEventSource, EventSourcePolyfill } from 'event-source-polyfill';
import { connect, useDispatch } from 'react-redux';
import {
  patientDetails,
} from '../../../store/actions/AuthActions';
import { notification } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import {
  EyeOutlined, EyeInvisibleOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { AdminMenuList } from '../../../jsx/layouts/nav/Menu';









export default function Patient() {




  const dispatch = useDispatch();
  const sideMenu = useSelector((state) => state.sideMenu);
  const patientStoreDetails = useSelector((state) => state);

  const navigate = useRouter();
  const [validated, setValidated] = useState(false);
  const [dataValidationList, setDataValidationList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [addUser, setAddUser] = useState(false);

  const recordsPage = 10;
  const lastIndex = currentPage * recordsPage;
  const firstIndex = lastIndex - recordsPage;

  const [npage, setNPage] = useState('');
  const [number, setNumber] = useState([]);
  const [records, setRecords] = useState([]);
  const [addPatient, setAddPatient] = useState(false);
  const [addPatientId, setAddPatientId] = useState(false);
  const [selectFile, setSelectFile] = useState(null);
  const [selectFileRadiology, setSelectFileRadiology] = useState(null);

  const [inputValue, setInputValue] = useState({
    year: "",
    name: "",
    patientId: "",
  });
  const [inputValuePatientId, setInputValuePatientId] = useState({
    patientId: "",
    patientName: ""
  });

  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageOptions, setPageOptions] = useState(0);
  const [canPreviousPage, setCanPreviousPage] = useState(false);
  const [canNextPage, setCanNextPage] = useState(true);
  const [canMaxPage, setCanMaxPage] = useState(10);

  const [process, setProcess] = useState({});
  const [message, setMessage] = useState({});
  const [listening, setListening] = useState(false);

  const [patinetList, setPatinetList] = useState([]);
  const [patinetListAll, setPatinetListAll] = useState([]);
  const [tenantId, setTenantId] = useState('');
  const [localOrgId, setLocalOrgId] = useState('');
  const [localUserId, setLocalUserId] = useState('');


  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    userId: { value: null, matchMode: FilterMatchMode.CONTAINS },
    userName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });


  const statusMessage = {
    subscribed: "Subscribed",
    unsubscribed: "Unsubscribed"
  };



  const filterChangePatientId = (event) => {
    const value = event.target.value;
    let _filters = { ...filters };
    _filters['userId'].value = value;
    setFilters(_filters);
  };
  const filterChangePatientName = (event) => {
    const value = event.target.value;
    let _filters = { ...filters };
    _filters['userName'].value = value;
    setFilters(_filters);
  };






  useEffect(() => {
    var tenId = localStorage.getItem("tenantId");
    var uId = localStorage.getItem("userId");
    var orgId = localStorage.getItem("orgId");
    setTenantId(tenId);
    setLocalOrgId(orgId);
    setLocalUserId(uId);
    // setIsLoading(false);
    getAllList(uId);
    // fetchData();
  }, []);


  const getAllList = async (uId) => {
    // logesh056
    const response = await axios.get(ENDPOINTS.apiEndoint + "dbservice/patient/getall?userid=" + uId);
    if (response.data) {
      const records = response.data.slice(firstIndex, lastIndex);
      setPatinetList(records);
      var userList = [{
        userId:"0001",
        userName:"Ajith",
        cost:"$ 4",
      },
      {
        userId:"0002",
        userName:"Priya",
        cost:"$ 1",
      },
      {
        userId:"0003",
        userName:"Ranjith",
        cost:"$ 1",
      }
    ]
      setPatinetListAll(userList);
      setIsLoading(false);

    }
  }

 









  return (
    <>
      <div className={`show ${sideMenu ? "menu-toggle" : ""}`}>
        <NavBar />
        <div class="content-body">
          {isLoading ? <LoadingSpinner /> :
            <div className="container-fluid">
              <div className="row">

                <div className="col-xl-12">
                  <div className="card">
                   
                    <div className="card-body p-0">
                      <div className="table-responsive active-projects task-table">
                        <div className="tbl-caption  align-items-center">
                          <div className="row">
                            <div className='col-xl-3'>
                            <div class="form-group has-search">
                                <FontAwesomeIcon className='fa fa-search form-control-feedback' icon={faSearch} />
                                <InputText type="text" onChange={(e) => filterChangePatientId(e)} className="form-control" placeholder="User Id" />
                              </div>

                            </div>
                            <div className='col-xl-3'>
                              <div class="form-group has-search">
                                <FontAwesomeIcon className='fa fa-search form-control-feedback' icon={faSearch} />
                                <InputText type="text" onChange={(e) => filterChangePatientName(e)} className="form-control" placeholder="User Name" />
                              </div>
                            </div>

                          </div>
                        </div>
<AdminList/>


                        <div id="task-tbl_wrapper" className="dataTables_wrapper no-footer">
                          <DataTable value={patinetListAll} paginator rows={10} rowsPerPageOptions={[10, 25, 50, 100]} dataKey="id" filters={filters} filterDisplay="menu">
                            <Column header="SI.NO" headerStyle={{ width: '3rem' }} body={(data, options) => options.rowIndex + 1}></Column>
                            <Column field="userId" header="User Id" />
                            <Column field="userName" header="User Name" />
                            <Column field="cost" header="Cost" />
                          </DataTable>                    
                        </div>
                      </div>
                    </div>


                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      
      </div>


    </>
  )

}
