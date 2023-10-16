import React, { useState, useRef, useEffect, useContext } from 'react';
import { Button } from 'react-bootstrap';
import axios from '../../../utility/axiosConfig';
import ENDPOINTS from '../../../utility/enpoints';
import { Offcanvas } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';
import Header from "../../../jsx/layouts/nav/Header";
import { useSelector } from "react-redux";
import { ThemeContext } from "../../../context/ThemeContext";
import { Switch } from 'antd';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";





const UserList = () => {

    // const { sidebariconHover} = useContext(ThemeContext);

    const sideMenu = useSelector(state => state.sideMenu);


    const [validated, setValidated] = useState(false);
    const [userList, setUserList] = useState([]);
    const [userListAll, setUserListAll] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [addUser, setAddUser] = useState(false);

    const recordsPage = 10;
    const lastIndex = currentPage * recordsPage;
    const firstIndex = lastIndex - recordsPage;

    const [npage, setNPage] = useState('');
    const [number, setNumber] = useState([]);
    const [records, setRecords] = useState([]);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [isStatus, setStatus] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: '',
    });


    const [pageCount, setPageCount] = useState(0);
    const [pageIndex, setPageIndex] = useState(0);
    const [pageOptions, setPageOptions] = useState(0);
    const [canPreviousPage, setCanPreviousPage] = useState(false);
    const [canNextPage, setCanNextPage] = useState(true);
    const [canMaxPage, setCanMaxPage] = useState(10);



    useEffect(() => {
        console.log(sideMenu)
        getAllList();
    }, []);



    const getAllList = async () => {
        const response = await axios.get(ENDPOINTS.apiEndoint + "/patient/getall");
        console.log(response.data);
        if (response.data) {
            const records = response.data.slice(firstIndex, lastIndex);
            setUserListAll(response.data);
            setUserList(records);
            setRecords(records);
            const npage = Math.ceil(response.data.length / recordsPage)
            const number = [...Array(npage + 1).keys()].slice(1);
            setNPage(npage);
            setNumber(number);
            setIsDataLoading(false);
            setIsLoading(false);
        }
    }

    const addUserForm = () => {
        setValidated(false);
        setAddUser(true);
    }

    const handleChange = async (e) => {
        const key = e.target.name;
        const value = e.target.value;
        setFormData({ ...formData, [key]: value })
    }

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === true) {
            console.log(formData)
            // postPatient(formData);
        }
        setValidated(true);

    };
    const postPatient = async (data) => {
        setIsLoading(true);
        const response = await axios.post(ENDPOINTS.apiEndoint + `patient`, data)
        if (response?.status == 200) {
            setAddUser(false);
            getAllList();
        } else {

        }
    }
    const roleUpdate = async (data) => {
        setIsLoading(true);
        const response = await axios.post(ENDPOINTS.apiEndoint + `patient`, data)
        if (response?.status == 200) {
            setAddUser(false);
            getAllList();
        } else {

        }
    }

    const options3 = [
        { value: '1', label: 'ALL' },
        { value: '2', label: 'Enabled' },
        { value: '3', label: 'Disabled' },
    ]
    const RoleList = [
        { value: 'Coder(Level 1)', label: 'Coder(Level 1)' },
        { value: 'Coder(Level 2)', label: 'Coder(Level 2)' },
        { value: 'Auditor', label: 'Auditor' },
        { value: 'Team Lead', label: 'Team Lead' },
    ];


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
        const records = userListAll.slice(start, end);
        setUserList(records);
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
        const records = userListAll.slice(start, end);
        setUserList(records);
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
        const records = userListAll.slice(start, end);
        setUserList(records);
    }

    const roleChange = async (e) => {
        console.log(e.value);
        var data = {};
        data.role = e.value;
        console.log(data);
        // roleUpdate(data);
    }

    const switchHandler = (event, id) => {

        const isChecked = event;
        setStatus(
            ({ isStatus }) => ({
                isStatus: {
                    ...isStatus,
                    [id]: isChecked,
                }
            })
        );

        console.log(isStatus)
    }




    return (
        <>
            <div className={`show ${sideMenu ? "menu-toggle" : ""}`}>
                <Header />
                <div className="content-body show menu-toggle no-sidebar">
                    <div className="container-fluid">
                        <div className='page-title-card'>
                            <div className="page-titles">
                                <ol className="breadcrumb">
                                    <li><h5 className="bc-title">Provider List</h5></li>
                                </ol>

                            </div>
                        </div>

                        <div className="row">
                            <div className='col-xl-12'>
                                <div className="card">
                                    <div className="card-body p-0">
                                        <div className="table-responsive active-projects task-table">
                                            <div className="tbl-caption  align-items-center">
                                                <div className="row">
                                                    <div className='col-xl-4'>
                                                        <input type="text" className="form-control" placeholder="Search Provider" />
                                                    </div>
                                                  
                                                </div>

                                            </div>
                                            <div id="task-tbl_wrapper" className="dataTables_wrapper no-footer">
                                                <table id="empoloyeestbl2" className="table ItemsCheckboxSec dataTable no-footer mb-2 mb-sm-0">
                                                    <thead>
                                                        <tr>
                                                            <th>SI.NO</th>
                                                            <th>First Name</th>
                                                            <th>Last Name</th>
                                                          
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {userList.map((item, index) => (
                                                            <tr key={index}>
                                                                <td><span>{index + 1}</span></td>
                                                                <td><span>{item.firstName}</span></td>
                                                                <td><span>{item.lastName}</span></td>                                                            

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
                                                            {pageIndex + 1} of 3
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
        
        </>
    );
};

export default UserList;