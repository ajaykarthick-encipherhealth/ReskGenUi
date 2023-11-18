

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Button } from 'react-bootstrap';
import { Badge } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';
import { SVGICON } from "../../../../jsx/constant/theme";
import LoadingSpinner from "../../../../jsx/components/spinner/spinner";
import Header from "../../../../jsx/layouts/nav/Header";
import SideBar from "../../../../jsx/layouts/nav/SideBar";
import Link from "next/link";
import { useSelector } from "react-redux";
import { Offcanvas } from "react-bootstrap";

import axios from "../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../utility/enpoints";
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight, faClose, faUpload, faCheck, faBan, faAdd, faSearch,faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Space, Spin } from 'antd';
import { NativeEventSource, EventSourcePolyfill } from 'event-source-polyfill';
import { connect, useDispatch } from 'react-redux';
import {
  patientDetails,
} from '../../../../store/actions/AuthActions';
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
import { Paginator } from 'primereact/paginator';
import { Calendar } from 'primereact/calendar';









export default function Patient() {




  const dispatch = useDispatch();
  const sideMenu = useSelector((state) => state.sideMenu);
  const patientStoreDetails = useSelector((state) => state);
  const controller = new AbortController()
  const signal = controller.signal

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
  const [dates, setDates] = useState(null);


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

  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [paginationFirst, setPaginationFirst] = useState(0);

  const [totalElements, setTotalElements] = useState(10);
  const [tableLoading, setTableLoading] = useState(true);



  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    patientId: { value: null, matchMode: FilterMatchMode.CONTAINS },
    patientName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });


  const statusMessage = {
    subscribed: "Subscribed",
    unsubscribed: "Unsubscribed"
  };



  const filterChangePatientId = (event) => {
    const value = event.target.value;
    let _filters = { ...filters };
    _filters['patientId'].value = value;
    setFilters(_filters);
  };
  const filterChangePatientName = (event) => {
    const value = event.target.value;
    let _filters = { ...filters };
    _filters['patientName'].value = value;
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
    getAllList(uId,pageNo,pageSize);
    // fetchData();
  }, []);


  const getAllList = async (uId,pageNo,pageSize) => {
    var resoureUrl = `dbservice/patient/getbyuser?userId=${uId}&page=${pageNo}&size=${pageSize}`
    const response = await axios.get(ENDPOINTS.apiEndoint + resoureUrl);
    if (response.data) {
      var resultMap = [];
      var result = response.data.content;
      setTotalElements(response.data.totalElements);

      result.map((res) => {
        resultMap.push({
          "patientId": res.patientId,
          "patientName": res.patientName,
          "fileName": res.fileName,
          "computing": res.computing,
          "createdAt": res.createdAt,
          "lastModifiedDate": res.lastModifiedDate,
          "dueDate": res.dueDate,
          "processedStatus": res.processedStatus,
          "createdAt": res.createdAt,
        })

      }
      )
      var newArray = [];
      newArray = [...patinetListAll, ...resultMap];
      setPatinetListAll(resultMap);

      // console.log(newArray)
      setIsLoading(false);
      setTableLoading(false)
    //     setTimeout(() => {
    //     subscribe(resultMap);
    // }, 3000);
    }
  }




  const addPatientFormId = () => {
    setValidated(false);
    setAddPatientId(true);
  };

  const addPatientFile = (data) => {
    inputValue.patientId = data.patientId;
    inputValue.name = data.patientName;
    setValidated(false);
    setAddPatient(true);
    setIsLoadingBtn(false);
  };

  const onChangeFile = (e) => {
    setSelectFile(e[0]);
  };
  const onChangeFileRadiology = (e) => {
    setSelectFileRadiology(e[0]);
  };

  const handleChange = async (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setInputValue({ ...inputValue, [key]: value });
  };

  const handleChangePatientId = async (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setInputValuePatientId({ ...inputValuePatientId, [key]: value });
  };

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === true) {
      setIsLoadingBtn(true);
      event.preventDefault();
      event.stopPropagation();
      if (selectFile != null) {
        submitPatientFile();
      }
      if (selectFileRadiology != null) {
        submitRadiology();
      }
      // const formData = new FormData();
      // formData.append("file", selectFile);
      // formData.append("dos", inputValue.year);
      // formData.append("orgid", localOrgId);
      // formData.append("tenantid", tenantId);
      // formData.append("userid", localUserId);
      // formData.append("patientid", inputValue.patientId);
      // formData.append("patientname", inputValue.name);
      // const headers = {
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      // };
      // setSelectFile(formData);
      // const response = await axios.post(
      //   ENDPOINTS.apiEndointFileUploadHcc + `aiservice/ai/upload
      //   `,
      //   formData,
      //   headers
      // );
      // if (response?.status == 200) {
      //   notification.success({
      //     message: "Patient File Upload Successfully!",
      //   });
      //   setAddPatient(false);
      //   setIsLoadingBtn(false);
      // } else {
      //   setIsLoadingBtn(false);
      // }
      // setAddPatient(false);
      // getAllList(localUserId);
    }

    setValidated(true);
  };
  const handleSubmitPatientId = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    inputValuePatientId.patientAllocated = localUserId;
    inputValuePatientId.computing = 0;
    inputValuePatientId.allocatedUserId = localUserId;

    if (form.checkValidity() === true) {
      setIsLoadingBtn(true);
      const response = await axios.post(
        ENDPOINTS.apiEndointFileUploadHcc + `dbservice/patient`, inputValuePatientId,
      );
      if (response?.status == 200) {
        notification.success({
          message: "Patient Id Created Successfully!",
        });
        setAddPatientId(false);
        setIsLoadingBtn(false);
      } else {
        setIsLoadingBtn(false);
      }
      setAddPatientId(false);
      getAllList(localUserId,pageNo,pageSize);
    }

    setValidated(true);
  };


  const gotoPatientDetails = (data) => {
    dispatch(patientDetails(data));
    if (data.computing == 2) {
      const controller = new AbortController()
      const { signal } = controller
      controller.abort()
      localStorage.setItem("patientId", data.patientId)
      navigate.push('/coder/auditing/details');
    } else {
      notification.warning({
        message: data.patientId + " file not processed Please wait",
      });
    }

  };


  function gotoPage(number) {
    if (canMaxPage > number) {
      setCanNextPage(true);
      setPageIndex(number);
      if (number > 0) {
        setCanPreviousPage(true);
      } else {
        setCanPreviousPage(false);
      }
      setPageCount(number);
    } else {
      setCanNextPage(false);
    }
    var start = number * 10;
    var end = start + 10;
    const records = patinetListAll.slice(start, end);
    setPatinetList(records);
  }
  function nextPage(number) {
    if (canMaxPage > number) {
      setPageCount(number);
      setPageIndex(number);
      setCanPreviousPage(true);
    } else {
      setCanNextPage(false);
    }
    var start = number * 10;
    var end = start + 10;
    const records = patinetListAll.slice(start, end);
    setPatinetList(records);
  }

  function previousPage(number) {
    setCanNextPage(true);
    setPageIndex(number);
    if (number > 0) {
      setCanPreviousPage(true);
    } else {
      setCanPreviousPage(false);
    }
    setPageCount(number);
    var start = number * 10;
    var end = start + 10;
    const records = patinetListAll.slice(start, end);
    setPatinetList(records);
  }


  const subscribe = async (patientResult) => {
    const accessToken = localStorage.getItem("token");
    var uId = localStorage.getItem("userId");
    var tenId = localStorage.getItem("tenantId");
    var processedList = [];



    var resoureUrl = `https://hcc.encipherhealth.com/secure/aiservice/ai/events?userId=${uId}&tenantId=${tenId}`
    const fetchData = async () => {
     let eventSource = await fetchEventSource(resoureUrl, {
        method: "get",
        mode: 'cors',
        signal: signal,
        headers: {
          // Accept: "text/event-stream",
          "Authorization": `Bearer ` + accessToken,
          // 'Cache-Control': 'no-cache',
          // 'Connection': 'keep-alive',
          // 'Accept': "text/event-stream",
          // 'Access-Control-Allow-Origin':"*"
        },
        withCredentials: true,
        onopen(res) {        
            console.log("Client side error ", res);
        },
        onmessage(event) {
          console.log("Client Events Trigger ");
          const parsedData = JSON.parse(event.data);
          processedList = parsedData;
          var checkProcessedValue =[];
          processedList.map((res) => {
            checkProcessedValue.push({
              "patientId":res,             
            })
          }
          )



          const array1 = patientResult;
          const array2 = checkProcessedValue;
          console.log(array2)
          console.log(patientResult)

    
          const hashMap2 = array2.reduce((carry, item) => {
            const { patientId } = item;
            if (!carry[patientId]) {
              carry[patientId] = item;
            }
            return carry;
          }, {});
    
    
          const output = array1.map(item => {
            const newName = hashMap2[item.patientId];
            if (newName) {
              item.computing = 2;
            }
            return item;
          });
    
          setPatinetListAll(output);
        },
        onclose() {
          controller.abort();
          console.log("Connection closed by the server");
        },
        onerror(err) {
          controller.abort()
          console.log("There was an error from server", err);
        },
      });
    };


 


    fetchData();  
  };

  function abortFetching() {
    console.log('Now aborting');
    // Abort.
    controller.abort()
}


  // const fetchData = async () => {
  //   const data = await (await fetchDataApi()).data;
  //   console.log(data);
  //   // setNotifications(data);
  // };

  // const fetchDataApi = async () => {
  //   return await axios.get(ENDPOINTS.apiEndoint + "aiservice/ai/events?userId=12345&tenantId=b4d34e42-79a6-478e-b3af-12ce7311fa09");

  // };

  const statusBodyTemplate = (rowData) => {
    //   console.log(rowData.computing)
    //   return <span className={`badge badge-success`}>
    //   Processed
    //   <FontAwesomeIcon className='ml-2 ms-1 ' icon={faCheck} />
    // </span>;

    switch (rowData.computing) {
      case 2:
        return <div className='patient-status'><span className={`badge processed-text`}>
          Processed
        </span></div>
          ;

      case 1:
        return <div className='patient-status'><span className={`badge processing-text`}>
          Processing
        </span></div>;

      case 3:
        return <div className='patient-status'><span className={`badge failed-text`}>
          Failed
        </span></div>;

      case 0:
        return <div className='patient-status'><span className={`badge not-started-text`}>
          Not Started
        </span>
        </div>;

    }
  };
  const dateFormateChange = (rowData) => {
    console.log(rowData)

  }

  const processstatusBodyTemplate = (rowData) => {
    //   console.log(rowData.computing)
    //   return <span className={`badge badge-success`}>
    //   Processed
    //   <FontAwesomeIcon className='ml-2 ms-1 ' icon={faCheck} />
    // </span>;

    switch (rowData.processedStatus) {
      case "COMPLETED":
        return <div className='patient-status'><span className={`badge badge-success`}>
          COMPLETED
          <FontAwesomeIcon className='ml-2 ms-1 ' icon={faCheck} />
        </span></div>
          ;

      case "PENDING":
        return <div className='patient-status'><span className={`badge badge-primary`}>
          PENDING
          <Spin className='ml-2 processingSpin ms-1 text-white' size="small" />
        </span></div>;

      case "DECLINE":
        return <div className='patient-status'><span className={`badge badge-danger`}>
          DECLINE
          <FontAwesomeIcon className='ml-2 ms-1 ' icon={faClose} />
        </span></div>;

      case "NOTCOMPUTED":
        return <div className='patient-status'><span className={`badge btn-notstarted`}>
         NOTCOMPUTED
          <FontAwesomeIcon className='ml-2 ms-1 ' icon={faBan} />
        </span>
        </div>;

    }
  };

  const actionBodyTemplate = (rowData) => {
    return <div className="d-flex justify-content-center">
      {rowData.computing == 2 ?
        <button onClick={() => gotoPatientDetails(rowData)} className="btn hegiht10 btn-notstarted shadow  sharp me-1 action-btn">
          <EyeOutlined className='text-white' />
        </button> : <button disabled className="btn hegiht10 btn-notstarted shadow  sharp me-1 action-btn">
          <EyeInvisibleOutlined className='text-white' />
        </button>}
      <button onClick={() => addPatientFile(rowData)} className="btn hegiht10 btn-primary shadow  sharp me-1 action-btn">
        <FontAwesomeIcon icon={faUpload} fontSize={11} />
      </button>

    </div>
  };




  const submitPatientFile = async () => {
    // setIsLoadingBtn(false);
    const formData = new FormData();
    formData.append("file", selectFile);
    formData.append("dos", inputValue.year);
    formData.append("orgid", localOrgId);
    formData.append("tenantid", tenantId);
    formData.append("userid", localUserId);
    formData.append("patientid", inputValue.patientId);
    formData.append("patientname", inputValue.name);
    const headers = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    setSelectFile(formData);
    const response = await axios.post(
      ENDPOINTS.apiEndointFileUploadHcc + `aiservice/ai/upload
      `,
      formData,
      headers
    );
    if (response?.status == 202) {
      getAllList(localUserId,pageNo,pageSize);

      notification.success({
        message: "Patient File Upload Successfully!",
      });
      setAddPatient(false);
      setIsLoadingBtn(false);

    } else {
      setIsLoadingBtn(false);
    }
    setAddPatient(false);
    setIsLoadingBtn(false);

    // getAllList(localUserId);

    // console.log("1");


  };
  const submitRadiology = async () => {
    const formData = new FormData();
    formData.append("file", selectFileRadiology);
    formData.append("orgid", localOrgId);
    formData.append("tenantid", tenantId);
    formData.append("userid", localUserId);
    formData.append("patientid", inputValue.patientId);
    formData.append("patientname", inputValue.name);
    const headers = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    setSelectFile(formData);
    const response = await axios.post(
      ENDPOINTS.apiEndointFileUploadHcc + `aiservice/ai/upload/radiology
    `,
      formData,
      headers
    );
    if (response?.status == 202) {
      getAllList(localUserId,pageNo,pageSize);
      setAddPatient(false);
      setIsLoadingBtn(false);
    } else {
      setIsLoadingBtn(false);
    }
    setAddPatient(false);
    // setIsLoadingBtn(false);
    setSelectFileRadiology(null);


  };

  const onPageChange =(e)=>{
    console.log(dates)
    console.log(e)
   setPaginationFirst(e.first)
   setPageNo(e.page)
   setPageSize(e.rows)
   setTableLoading(true)
   getAllList(localUserId,e.page,e.rows);
   console.log("test")
  }


  const gotoUserList = (data) => {
 

    navigate.push('/coder/auditing');

  };










  return (
    <>
      <div className={`show ${sideMenu ? "menu-toggle" : ""}`}>
        <Header />
        <div class="content-body">
          {isLoading ? <LoadingSpinner /> :
            <div className="container-fluid">
              <div className="row">

                <div className="col-xl-12">
                  <div className="">
                    {/* <div>
      <p>{listening ? statusMessage.subscribed : statusMessage.unsubscribed}</p>
      <p>{JSON.stringify(process)}</p>
      <button onClick={subscribe}>
        {listening ? statusMessage.unsubscribed : statusMessage.subscribed}
      </button>
      <br />
      <p>{JSON.stringify(message)}</p>
    </div> */}
                    <div className="card-body p-0">
                      <div className="table-responsive active-projects task-table">
                        <div className="tbl-caption  align-items-center">
                          <div className="row filter-contain">
                          <div className='col-xl-1'>                            
                              <Button onClick={gotoUserList} className="btn btn-secondary btn-sm ms-2">
                              <FontAwesomeIcon className='fa fa-search form-control-feedback' icon={faArrowLeft} />
                              </Button>
                            </div>
                            <div className='col-xl-3'>
                              <div class="form-group has-search">
                                <FontAwesomeIcon className='fa fa-search form-control-feedback' icon={faSearch} />
                                <InputText type="text" onChange={(e) => filterChangePatientId(e)} className="form-control new-form-control" placeholder="Patient Id" />
                              </div>

                            </div>
                            <div className='col-xl-3'>
                              <div class="form-group has-search">
                                <FontAwesomeIcon className='fa fa-search form-control-feedback' icon={faSearch} />
                                <InputText type="text" onChange={(e) => filterChangePatientName(e)} className="form-control new-form-control" placeholder="Patient Name" />
                              </div>
                            </div>
                            <div className='col-xl-3'>
                              <div class="form-group has-search">
                              <FontAwesomeIcon className='fa fa-search form-control-feedback' icon={faSearch} />
                                <Calendar className="form-control new-form-control calender-pri-input" value={dates} onChange={(e) => setDates(e.value)}    selectionMode="range" readOnlyInput />
                              </div>
                            </div>


                          </div>
                        </div>



                        <div id="task-tbl_wrapper" className="dataTables_wrapper no-footer">
                          <DataTable value={patinetListAll} paginator={false} rows={10} rowsPerPageOptions={[10, 25, 50, 100]} dataKey="id" filters={filters} filterDisplay="menu">
                            <Column header="SI.NO" headerStyle={{ width: '3rem' }} body={(data, options) => paginationFirst +  options.rowIndex + 1}></Column>
                            <Column field="patientId" header="Patient Id" />
                            <Column field="patientName" header="Patient Name" />
                            <Column field="fileName" header="File Name" />
                            <Column field="status" body={statusBodyTemplate} header="File Status" />
                            <Column field="processedStatus" body={processstatusBodyTemplate} header="Processing Status" />
                            <Column field="dueDate" body={(data) => moment(data.dueDate).format("MM-DD-YYYY")}  sortable header="Due Date" />
                            <Column field="lastModifiedDate" body={(data) => moment(data.dueDate).format("MM-DD-YYYY hh:MM:A")} sortable header="Modfied Date" />
                            <Column field="action" body={actionBodyTemplate} header="Action" />
                          </DataTable>
                          <div className='pagination-container'>
                          <Paginator first={paginationFirst} rows={10} totalRecords={totalElements}  onPageChange={onPageChange} />

                            </div>

                          {/* <table
                            id="empoloyeestbl2"
                            className="table ItemsCheckboxSec dataTable no-footer mb-2 mb-sm-0"
                          >
                            <thead>
                              <tr>
                                <th>SI.NO</th>
                                <th>Patient Id</th>
                                <th>Patient Name</th>
                                <th>File Name</th>
                                <th>Status</th>
                                <th>Created Date</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {patinetList.map((item, index) => (
                                <tr className='cr-pointer' key={index}>
                                  <td onClick={() => { gotoPatientDetails(item) }}>
                                    <span>{index + 1}</span>
                                  </td>
                                  <td onClick={() => { gotoPatientDetails(item) }}>
                                    <span>{item.patientId}</span>
                                  </td>
                                  <td onClick={() => { gotoPatientDetails(item) }}>
                                    <span>{item.patientName}</span>
                                  </td>
                                  <td onClick={() => { gotoPatientDetails(item) }}>
                                    <span>{item.fileName}</span>
                                  </td>
                                  <td onClick={() => { gotoPatientDetails(item) }} className='patient-status'>
                                    {item.computing == 2 ?

                                      <span className={`badge badge-success`}>
                                        Processed
                                        <FontAwesomeIcon className='ml-2 ms-1 ' icon={faCheck} />
                                      </span>
                                      : item.computing == 1 ?
                                        <span className={`badge badge-primary`}>
                                          Processing
                                          <Spin className='ml-2 processingSpin ms-1 text-white' size="small" />
                                        </span> :
                                        item.computing == 3 ?
                                          <span className={`badge badge-danger`}>
                                            Failed
                                            <FontAwesomeIcon className='ml-2 ms-1 ' icon={faClose} />
                                          </span>


                                          :
                                          <span className={`badge badge-secondary`}>
                                            Not Started
                                            <FontAwesomeIcon className='ml-2 ms-1 ' icon={faBan} />
                                          </span>
                                    }
                                  </td>
                                  <td onClick={() => { gotoPatientDetails(item) }}>
                                    <span>{item.createdAt}</span>
                                  </td>
                                  <td>
                                    <div className="d-flex justify-content-center">
                                      <button onClick={() => addPatientFile(item)} className="btn hegiht10 btn-primary shadow  sharp me-1 action-btn">
                                        <FontAwesomeIcon icon={faUpload} fontSize={11} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <div className="d-flex justify-content-between mrt-15">
                            <span>
                              Page{' '}
                              <strong>
                                {pageIndex + 1} of 10
                              </strong>{''}
                            </span>
                            <span className="table-index">
                              Go to page : {' '}
                              <input type="number" className="ml-2" defaultValue={pageIndex + 1} min="1" max={canMaxPage}
                                onChange={e => {
                                  const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0
                                  gotoPage(pageNumber)
                                }}
                              />
                            </span>
                          </div>
                          <div className="text-center mb-3">
                            <div className="filter-pagination  mt-3">
                              <button className="previous-button" onClick={() => gotoPage(pageCount - 1)} disabled={!canPreviousPage}>
                                <FontAwesomeIcon icon={faAngleLeft} />
                              </button>
                              <button className="previous-button" onClick={() => previousPage(pageCount - 1)} disabled={!canPreviousPage}>
                                Previous
                              </button>
                              <button className="next-button" onClick={() => nextPage(pageCount + 1)} disabled={!canNextPage}>
                                Next
                              </button>
                              <button className="next-button" onClick={() => gotoPage(pageCount + 1)} disabled={!canNextPage}>
                                <FontAwesomeIcon icon={faAngleRight} />
                              </button>
                            </div>
                          </div> */}
                        </div>
                      </div>
                    </div>


                  </div>
                </div>
              </div>
            </div>
          }
        </div>
        <Offcanvas onHide={setAddPatient} show={addPatient} className="offcanvas-end" placement="end">
          <div className="offcanvas-header">
            <h5 className="modal-title" id="#gridSystemModal">
              Add Patient Details
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setAddPatient(false)}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div className="offcanvas-body">
            <div className="container-fluid">
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-xl-12 mb-3">
                    <Form.Label>
                      Patient Id <span className="text-danger">*</span>{" "}
                    </Form.Label>
                    <Form.Control
                      name="patientId"
                      required
                      type="text"
                      value={inputValue.patientId}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-xl-12 mb-3">
                    <Form.Label>
                      Patient Name <span className="text-danger">*</span>{" "}
                    </Form.Label>
                    <Form.Control
                      name="name"
                      required
                      type="text"
                      value={inputValue.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-xl-12 mb-3">
                    <Form.Label>
                      File <span className="text-danger">*</span>{" "}
                    </Form.Label>
                    <Form.Control
                      required
                      type="file"
                      accept="application/pdf,text/plain"
                      onChange={(e) => onChangeFile(e.target.files)}
                      disabled={isLoadingBtn ? true : false}
                    />
                  </div>
                  {/* <div className="col-xl-12 mb-3">
                    <Form.Label>
                      Radiology
                    </Form.Label>
                    <Form.Control
                      type="file"
                      accept="application/pdf,text/plain"
                      onChange={(e) => onChangeFileRadiology(e.target.files)}
                      disabled={isLoadingBtn ? true : false}
                    />
                  </div> */}
                  <div className="col-xl-12 mb-3">
                    <Form.Label>
                      Year of Service <span className="text-danger">*</span>{" "}
                    </Form.Label>
                    <Form.Control
                      name="year"
                      required
                      type="number"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <Button type="submit" className="btn btn-primary btn-sm me-1">
                    {isLoadingBtn ? "Loading..." : "Submit"}
                  </Button>
                  <Button
                    onClick={() => setAddPatient(false)}
                    className="btn btn-danger btn-sm light ms-1"
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </Offcanvas>
        <Offcanvas onHide={setAddPatientId} show={addPatientId} className="offcanvas-end" placement="end">
          <div className="offcanvas-header">
            <h5 className="modal-title" id="#gridSystemModal">
              Add Patient Details
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setAddPatientId(false)}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div className="offcanvas-body">
            <div className="container-fluid">
              <Form noValidate validated={validated} onSubmit={handleSubmitPatientId}>
                <div className="row">
                  <div className="col-xl-12 mb-3">
                    <Form.Label>
                      Patient Id <span className="text-danger">*</span>{" "}
                    </Form.Label>
                    <Form.Control
                      name="patientId"
                      required
                      type="text"
                      onChange={handleChangePatientId}
                    />
                  </div>
                  <div className="col-xl-12 mb-3">
                    <Form.Label>
                      Patient Name <span className="text-danger">*</span>{" "}
                    </Form.Label>
                    <Form.Control
                      name="patientName"
                      required
                      type="text"
                      onChange={handleChangePatientId}
                    />
                  </div>
                </div>

                <div>
                  <Button type="submit" className="btn btn-primary btn-sm me-1">
                    {isLoadingBtn ? "Loading..." : "Submit"}
                  </Button>
                  <Button
                    onClick={() => setAddPatientId(false)}
                    className="btn btn-danger btn-sm light ms-1"
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </Offcanvas>
      </div>


    </>
  )

}
