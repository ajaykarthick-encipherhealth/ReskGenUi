import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import axios from '../../../utility/axiosConfig';
import { Offcanvas } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { SVGICON } from "../../../jsx/constant/theme";
import LoadingSpinner from "../../../jsx/components/spinner/spinner";
import './file-management.css';





const FileProcessing = () => {
    const [validated, setValidated] = useState(false);
    const [fileProcessingList, setFileProcessingList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [addUser, setAddUser] = useState(false);

    const recordsPage = 10;
    const lastIndex = currentPage * recordsPage;
    const firstIndex = lastIndex - recordsPage;

    const [npage, setNPage] = useState('');
    const [number, setNumber] = useState([]);
    const [records, setRecords] = useState([]);



    function prePage() {
        if (currentPage !== 1) {
            setCurrentPage(currentPage - 1)
        }
    }
    function changeCPage(id) {
        setCurrentPage(id);
    }
    function nextPage() {
        if (currentPage !== npage) {
            setCurrentPage(currentPage + 1)
        }
    }


    useEffect(() => {
        const datas = [
            {
                name: "Name 1",
                status: "Completed",
                date: "22 / 12 / 20",
            },
            {
                name: "Name 1",
                status: "In-Progress",
                date: "22 / 12 / 20",
            },
            {
                name: "Name 1",
                status: "Finished Validation",
                date: "22 / 12 / 20",
            },
            {
                name: "Name 1",
                status: "In-Validation",
                date: "22 / 12 / 20",
            },
            {
                name: "Name 1",
                status: "Hold",
                date: "22 / 12 / 20",
            },
            {
                name: "Name 1",
                status: "Finished Validation",
                date: "22 / 12 / 20",
            },
            {
                name: "Name 1",
                status: "Hold",
                date: "22 / 12 / 20",
            },
            {
                name: "Name 1",
                status: "In-Progress",
                date: "22 / 12 / 20",
            },

        ];

        setFileProcessingList(datas);
        setIsLoading(false);
    }, []);

    const options3 = [
        { value: '1', label: 'ALL' },
        { value: '2', label: 'Enabled' },
        { value: '3', label: 'Disabled' },
    ]




    return (
        <>
            {isLoading ? <LoadingSpinner /> :
                <div className="table-responsive active-projects task-table">
                    <div className="tbl-caption  align-items-center">
                        <div className="row">
                            <div className='col-xl-3'>
                                <input type="date" className="form-control" placeholder="Date" />
                            </div>
                            <div className='col-xl-3'>
                                <Select options={options3} className="custom-react-select"
                                    defaultValue={options3[0]}
                                    isSearchable={false}
                                />
                            </div>
                        </div>

                    </div>
                    <div id="task-tbl_wrapper" className="dataTables_wrapper no-footer">
                        <table id="empoloyeestbl2" className="table ItemsCheckboxSec dataTable no-footer mb-2 mb-sm-0">
                            <thead>
                                <tr>
                                    <th>SI.NO</th>
                                    <th>File Name</th>
                                    <th>Status</th>
                                    <th>Created Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fileProcessingList.map((item, index) => (
                                    <tr key={index}>
                                        <td><span>{index + 1}</span></td>
                                        <td><span>{item.name}</span></td>
                                        <td>
                                            <span className={`${item.status === "Completed"
                                                ? "completed badge badge-rounded badge-primary"
                                                : item.status === "In-Progress"
                                                    ? "in-progress badge badge-rounded badge-primary"
                                                    : item.status === "Finished Validation"
                                                        ? "finished-validation badge badge-rounded badge-primary"
                                                        : item.status === "Hold"
                                                            ? "hold badge badge-rounded badge-primary"
                                                            : item.status === "In-Validation"
                                                                ? "invalidation badge badge-rounded badge-primary"
                                                                : ""
                                                } status-gray`} >
                                                {item.status}
                                            </span>
                                        </td>
                                        <td><span>{item.date}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="d-sm-flex text-center justify-content-between align-items-center">
                            <div className='dataTables_info'>
                                Showing {lastIndex - recordsPage + 1} to{" "}
                                {fileProcessingList.length < lastIndex ? fileProcessingList.length : lastIndex}
                                {" "}of {fileProcessingList.length} entries
                            </div>
                            <div
                                className="dataTables_paginate paging_simple_numbers justify-content-center"
                                id="example2_paginate"
                            >
                                <Link
                                    className="paginate_button previous disabled"
                                    to="#"
                                    onClick={prePage}
                                >
                                    <i className="fa-solid fa-angle-left" />
                                </Link>
                                <span>
                                    {number.map((n, i) => (
                                        <Link className={`paginate_button ${currentPage === n ? 'current' : ''} `} key={i}
                                            onClick={() => changeCPage(n)}
                                        >
                                            {n}

                                        </Link>
                                    ))}
                                </span>
                                <Link
                                    className="paginate_button next"
                                    to="#"
                                    onClick={nextPage}
                                >
                                    <i className="fa fa-search" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

            }

        </>
    );
};

export default FileProcessing;