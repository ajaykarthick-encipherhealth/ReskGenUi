import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import axios from '../../../utility/axiosConfig';
import { Badge } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';
import { SVGICON } from "../../../jsx/constant/theme";
import LoadingSpinner from "../../../jsx/components/spinner/spinner";
// import './file-management.css';





const DataValidation = () => {
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
                patchJob: "Completed",
                name: "Name 1",
                status: "Completed",
                date: "22 / 12 / 20",
            },
            {
                patchJob: "Started",
                name: "Name 1",
                status: "In-Progress",
                date: "22 / 12 / 20",
            },
            {
                patchJob: "Completed",
                name: "Name 1",
                status: "Finished Validation",
                date: "22 / 12 / 20",
            },
            {
                patchJob: "Patching",
                name: "Name 1",
                status: "In-Validation",
                date: "22 / 12 / 20",
            },
            {
                patchJob: "Started",
                name: "Name 1",
                status: "Hold",
                date: "22 / 12 / 20",
            },
            {
                patchJob: "Pending",
                name: "Name 1",
                status: "Finished Validation",
                date: "22 / 12 / 20",
            },
            {
                patchJob: "Completed",
                name: "Name 1",
                status: "In-Validation",
                date: "22 / 12 / 20",
            },
            {
                patchJob: "No Patching",
                name: "Name 1",
                status: "Hold",
                date: "22 / 12 / 20",
            },
        ];

        setDataValidationList(datas);
        setIsLoading(false);
    }, []);



    const options = [
        {
            value: "All",
            label: "All",
        },
        {
            value: "Completed",
            label: "Completed",
        },

        {
            value: "InProgress",
            label: "InProgress",
        },
        {
            value: "Finished Validation",
            label: "Finished Validation",
        },
        {
            value: "Invalidation",
            label: "Invalidation",
        },
    ];
    const patchStatusOptions = [
        {
            value: "Completed",
            label: "Completed",
        },
        {
            value: "Started",
            label: "Started",
        },

        {
            value: "Pending",
            label: "Pending",
        },
        {
            value: "Patching",
            label: "Patching",
        },
        {
            value: "No Patching",
            label: "No Patching",
        },
        {
            value: "Resume",
            label: "Resume",
        },
    ];




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
                                <Select options={options} className="custom-react-select"
                                    defaultValue={options[0]}
                                    isSearchable={false}
                                />
                            </div>
                            <div className='col-xl-3'>
                                <Select options={patchStatusOptions} className="custom-react-select"
                                    defaultValue={patchStatusOptions[0]}
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
                                    <th>Patch Job Status</th>
                                    <th>Status</th>
                                    <th>Created Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataValidationList.map((item, index) => (
                                    <tr key={index}>
                                        <td><span>{index + 1}</span></td>
                                        <td><span>{item.name}</span></td>
                                        <td>
                                            <span as="a" href="" bg=" badge-rounded" className={
                                                item.patchJob === "Completed"
                                                    ? "completed-patch badge-outline-secondary"
                                                    : item.patchJob === "Started"
                                                        ? "in-progress-patch badge-outline-secondary"
                                                        : item.patchJob === "Patching"
                                                            ? "finished-validation-patch badge-outline-secondary"
                                                            : item.patchJob === "Pending"
                                                                ? "hold-patch badge-outline-secondary"
                                                                : item.patchJob === "No Patching"
                                                                    ? "nopatching-patch badge-outline-secondary"
                                                                    : ""
                                            }>
                                                {item.patchJob}
                                            </span>
                                        </td>
                                        <td>
                                            <span
                                                className={
                                                    item.status === "Completed"
                                                        ? "completed"
                                                        : item.status === "In-Progress"
                                                            ? "in-progress"
                                                            : item.status === "Finished Validation"
                                                                ? "finished-validation"
                                                                : item.status === "Hold"
                                                                    ? "hold"
                                                                    : item.status === "In-Validation"
                                                                        ? "invalidation"
                                                                        : ""
                                                }
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                        <td><span>{item.date}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                </div>

            }

        </>
    );
};

export default DataValidation;