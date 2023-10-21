

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

import axios from "../../../utility/axiosConfig";
import ENDPOINTS from "../../../utility/enpoints";
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight,faSpinner,faCheck ,faBan} from "@fortawesome/free-solid-svg-icons";
import { Space, Spin } from 'antd';
import { NativeEventSource, EventSourcePolyfill } from 'event-source-polyfill';
import { connect, useDispatch } from 'react-redux';
import { patientDetails,
} from '../../../store/actions/AuthActions';


export default function Patient() {




  const dispatch = useDispatch();
  const sideMenu = useSelector((state) => state.sideMenu);
  const patientStoreDetails = useSelector((state) => state);

  const navigate = useRouter();
  const [validated, setValidated] = useState(false);
  const [dataValidationList, setDataValidationList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [addUser, setAddUser] = useState(false);

  const recordsPage = 10;
  const lastIndex = currentPage * recordsPage;
  const firstIndex = lastIndex - recordsPage;

  const [npage, setNPage] = useState('');
  const [number, setNumber] = useState([]);
  const [records, setRecords] = useState([]);
  const [addPatient, setAddPatient] = useState(false);
  const [selectFile, setSelectFile] = useState([]);
  const [inputValue, setInputValue] = useState({
    year: "",
    name: "",
    patientId:"",
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


  const statusMessage = {
    subscribed: "Subscribed",
    unsubscribed: "Unsubscribed"
  };







  useEffect(() => {
    var tenId= localStorage.getItem("tenantId");
    var uId= localStorage.getItem("userId");
    var orgId= localStorage.getItem("orgId");
    setTenantId(tenId);
    setLocalOrgId(orgId);
    setLocalUserId(uId);
    console.log(patientStoreDetails)
    const datas = [
      {
        patchJob: "Completed",
        name: "Name 1",
        status: "Completed",
        date: "22 / 12 / 20",
        filename: "test",
      },
      {
        patchJob: "Started",
        name: "Name 1",
        status: "In-Progress",
        date: "22 / 12 / 20",
        filename: "test",
      },
      {
        patchJob: "Completed",
        name: "Name 1",
        status: "Finished Validation",
        date: "22 / 12 / 20",
        filename: "test",
      },
      {
        patchJob: "Patching",
        name: "Name 1",
        status: "In-Validation",
        date: "22 / 12 / 20",
        filename: "test",
      },
      {
        patchJob: "Started",
        name: "Name 1",
        status: "Hold",
        date: "22 / 12 / 20",
        filename: "test",
      },
      {
        patchJob: "Pending",
        name: "Name 1",
        status: "Finished Validation",
        date: "22 / 12 / 20",
        filename: "test",
      },
      {
        patchJob: "Completed",
        name: "Name 1",
        status: "In-Validation",
        date: "22 / 12 / 20",
        filename: "test",
      },
      {
        patchJob: "No Patching",
        name: "Name 1",
        status: "Hold",
        date: "22 / 12 / 20",
        filename: "test",
      },
    ];

    setDataValidationList(datas);
    setIsLoading(false);
    getAllList();
    // fetchData();
  }, []);

  
	const getAllList = async () => {
		const response = await axios.get(ENDPOINTS.apiEndoint + "dbservice/patient/getall?userid=logesh056");
		if (response.data) {
      const records = response.data.slice(firstIndex, lastIndex);
      setPatinetList(records);	
			setPatinetListAll(response.data);
      // setTimeout(() => {
      //  setCanPreviousPage(false);
      //   setCanNextPage(true);
      //   getAllList();
      // }, 5000);	
		}
	}



  const addPatientForm = () => {
    setValidated(false);
    setAddPatient(true);
  };

  const onChangeFile = (e) => {
    setSelectFile(e[0]);
  };

  const handleChange = async (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setInputValue({ ...inputValue, [key]: value });
  };

  const handleSubmit = async (event) => {
    console.log(inputValue);
    const form = event.currentTarget;
    console.log(form);
    event.preventDefault();
    if (form.checkValidity() === true) {
      setIsLoading(true);
      event.preventDefault();
      event.stopPropagation();
      const formData = new FormData();
      formData.append("file", selectFile);
      formData.append("dos", inputValue.year);
      formData.append("orgid", localOrgId);
      formData.append("tenantid", tenantId);
      formData.append("userid", localUserId);
      formData.append("patientid",inputValue.patientId);
      formData.append("patientName",inputValue.name);
      const headers = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      setSelectFile(formData);
      console.log(formData);
      const response = await axios.post(
        ENDPOINTS.apiEndointFileUploadHcc + `aiservice/ai/upload
        `,
        formData,
        headers
      );
      if (response?.status == 200) {
        console.log(response.data);
        setAddPatient(false);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
      setAddPatient(false);
      getAllList();
    }

    setValidated(true);
  };


  const gotoPatientDetails = (data) => {
    dispatch(patientDetails(data));	
    navigate.push('/physician/patients/details');

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


  const subscribe = async () => {
    const status = listening;
    if (!status) {
      const accessToken = localStorage.getItem("token")
      const resoureUrl = "https://hcc.encipherhealth.com/secure/dbservice/events?userid=12345";
      const events = new EventSourcePolyfill("https://hcc.encipherhealth.com/secure/aiservice/ai/events?userId=12345&tenantId=b4d34e42-79a6-478e-b3af-12ce7311fa09", {
        headers: {
          "Authorization": `Bearer `+ accessToken,
          'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
        },
      })

      console.log(events)

      events.onmessage = event => {
        const parsedData = JSON.parse(event.data);
        console.log(event)
        switch (parsedData.type) {
          case "init-connection":
            setProcess(parsedData.processId);
            break;
          case "message":
            setMessage(parsedData.message);
            break;
        }
      };
    } else {
      setProcess({});
      setMessage({});
    }
    setListening(!listening);
  };


  const fetchData = async () => {
    const data = await (await fetchDataApi()).data;
    console.log(data);
    // setNotifications(data);
  };

  const fetchDataApi = async () => {
    return await axios.get(ENDPOINTS.apiEndoint + "aiservice/ai/events?userId=12345&tenantId=b4d34e42-79a6-478e-b3af-12ce7311fa09");
     
  };








  return (
    <>
      <div className={`show ${sideMenu ? "menu-toggle" : ""}`}>
        <NavBar />
        <div class="content-body">
          <div className="container-fluid">
            <div className="row">

              <div className="col-xl-12">
                <div className="card">
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
                        <div className="row">
                          <div className="col-xl-12">
                            <Button onClick={addPatientForm} className="btn btn-primary btn-sm ms-2 flr">+ Add Patient File</Button>

                          </div>

                        </div>
                      </div>
                      <div id="task-tbl_wrapper" className="dataTables_wrapper no-footer">
                        <table
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
                            </tr>
                          </thead>
                          <tbody>
                            {patinetList.map((item, index) => (
                              <tr className='cr-pointer' key={index} onClick={() => { gotoPatientDetails(item) }}>
                                <td>
                                  <span>{index + 1}</span>
                                </td>
                                <td>
                                  <span>{item.patientId}</span>
                                </td>
                                <td>
                                  <span>Arun Kumar</span>
                                </td>
                                <td>
                                  <span>01-01-20 FLORENCE MAKHANI PIETZ</span>
                                </td>
                                <td className='patient-status'>
                                  {item.computing == 2 ?
                                  
                                  // <span className='completed'>Processed <FontAwesomeIcon className='ml-2' icon={faCheck}  />
                                  <span className={`badge badge-success`}>
                                 Processed
                                  <FontAwesomeIcon className='ml-2 ms-1 ' icon={faCheck}  />
                                  </span>
                                  :  item.computing == 1 ?
                                  <span className={`badge badge-primary`}>
                                 Processing
                                 <Spin className='ml-2 ms-1 text-white' size="small" />
                                 </span>
                                   :
                                   <span className={`badge badge-secondary`}>
                                   Not Started
                                   <FontAwesomeIcon className='ml-2 ms-1 ' icon={faBan}  />
                                   </span>
                                  }
                                </td>
                                <td>
                                  <span>{item.createdAt}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="d-flex justify-content-between mrt-15">
                          <span>
                            Page{' '}
                            {/* <strong>
                              {pageIndex + 1} of {pageOptions.length}
                            </strong>{''} */}
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
                              <FontAwesomeIcon icon={faAngleLeft}  />
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
                        </div>
                      </div>
                    </div>
                  </div>


                </div>
              </div>
            </div>
          </div>
        </div>
        <Offcanvas show={addPatient} className="offcanvas-end" placement="end">
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
                      Patient Name <span className="text-danger">*</span>{" "}
                    </Form.Label>
                    <Form.Control
                      name="name"
                      required
                      type="text"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-xl-12 mb-3">
                    <Form.Label>
                      Patient Id <span className="text-danger">*</span>{" "}
                    </Form.Label>
                    <Form.Control
                      name="patientId"
                      required
                      type="text"
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
                    />
                  </div>
                  <div className="col-xl-12 mb-3">
                    <Form.Label>
                      Date of Service <span className="text-danger">*</span>{" "}
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
                    {isLoading ? "Loding..." : "Submit"}
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
      </div>


    </>
  )

}
