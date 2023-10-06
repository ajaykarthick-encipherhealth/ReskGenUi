import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Tab, Nav } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import { Offcanvas } from 'react-bootstrap';
import { SVGICON } from "../../../jsx/constant/theme";
import axios from '../../../utility/fileAxiosConfig';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import LoadingSpinner from "../../../jsx/components/spinner/spinner";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faCheck } from "@fortawesome/free-solid-svg-icons";


// import "@react-pdf-viewer/core/lib/styles/index.css";
// import "@react-pdf-viewer/default-layout/lib/styles/index.css";





const FileView = () => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    const [validated, setValidated] = useState(false);
    const [addPatient, setAddPatient] = useState(false);
    const [selectFile, setSelectFile] = useState([]);
    const [selectFileURL, setSelectFileURL] = useState([]);
    const [isLoading, setIsLoading] = useState(false);


    const [selectFileName, setSelectFileName] = useState('Upload File');


    useEffect(() => {
    }, []);





    const addPatientForm = () => {
        setValidated(false);
        setAddPatient(true);
    }



    const onChangeFile = (e) => {
        let value = URL.createObjectURL(e[0]);
        console.log(e[0])
        console.log(value)
        var splitString = e[0].name.split(".");
        setSelectFileName(splitString[0]);
        setSelectFileURL(value);
        setSelectFile(e[0]);
    };




    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        console.log(form)
        event.preventDefault();
        if (form.checkValidity() === true) {
            event.preventDefault();
            event.stopPropagation();
            const formData = new FormData();
            formData.append('file', selectFile);
            const headers = {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            };
            // setSelectFile(formData);
            // console.log(formData)
            // const response = await axios.post(`upload`, formData, headers)
            // if (response?.status == 200) {
            //     setAddPatient(false);

            // } else {

            // }
        }

        setValidated(true);
    };



    return (
        <>
            {/* <LoadingSpinner />  */}

            <div className="container-fluid">
                <div className="row">
                    <div className='col-xl-12'>
                        <div className="card">
                            <div className="card-body p-0">
                                <div className="table-responsive active-projects task-table">
                                    <div className="tbl-caption d-flex justify-content-between align-items-center">
                                        <h4 className="heading mb-0">File View</h4>
                                        <div>
                                            <Button onClick={addPatientForm} className="btn btn-primary btn-sm ms-2">+ Add File</Button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="col-xl-12">
                        <div className="row">

                            <div className='col-xl-5'>
                                <div className="card">
                                    <div className="card-body p-0">
                                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
                                            <div
                                                style={{
                                                    height: "600px",
                                                    maxWidth: "900px",
                                                    marginLeft: "auto",
                                                    marginRight: "auto"
                                                }}
                                            >                          <Viewer
                                                    fileUrl={selectFileURL}
                                                    plugins={[defaultLayoutPluginInstance]}
                                                />
                                            </div>
                                        </Worker>
                                    </div>
                                </div>
                            </div>
                            <div className='col-xl-7'>
                                <div className="card height450">
                                    <div className="card-body">
                                        <div className="profile-tab">
                                            <div className="custom-tab-1">
                                                <Tab.Container defaultActiveKey='validDiseases'>
                                                    <Nav as='ul' className="nav nav-tabs">
                                                        <Nav.Item as='li' className="nav-item">
                                                            <Nav.Link to="#my-posts" eventKey='validDiseases'>Valid Diseases</Nav.Link>
                                                        </Nav.Item>
                                                        <Nav.Item as='li' className="nav-item">
                                                            <Nav.Link to="#my-posts" eventKey='invalidDiseases'>Invalid Diseases</Nav.Link>
                                                        </Nav.Item>
                                                        <Nav.Item as='li' className="nav-item">
                                                            <Nav.Link to="#my-posts" eventKey='comboDiseases'>Combo Diseases</Nav.Link>
                                                        </Nav.Item>
                                                        <Nav.Item as='li' className="nav-item">
                                                            <Nav.Link to="#my-posts" eventKey='meat'>MEAT</Nav.Link>
                                                        </Nav.Item>
                                                    </Nav>
                                                    <Tab.Content>
                                                        <Tab.Pane id="my-posts" eventKey='validDiseases'>
                                                            <div className="my-post-content pt-3">
                                                                <div className="widget-media  ps--active-y" >
                                                                    <ul className="timeline">
                                                                        <li>
                                                                            <div className="timeline-panel">
                                                                                <div className="media-body">
                                                                                    <h5 className="mb-1">I6523 - Occlusion and stenosis of bilateral carotid arteries</h5>
                                                                                </div>
                                                                                <div className="icon-box icon-box-sm bg-danger-light me-1">
                                                                                    <FontAwesomeIcon icon={faClose} style={{ color: "red" }} />
                                                                                </div>
                                                                            </div>
                                                                        </li>
                                                                        <li>
                                                                            <div className="timeline-panel">
                                                                                <div className="media-body">
                                                                                    <h5 className="mb-1">I6523 - Occlusion and stenosis of bilateral carotid arteries</h5>
                                                                                </div>
                                                                                <div className="icon-box icon-box-sm bg-danger-light me-1">
                                                                                    <FontAwesomeIcon icon={faClose} style={{ color: "red" }} />
                                                                                </div>
                                                                            </div>
                                                                        </li>

                                                                        <li>
                                                                            <div className="timeline-panel">
                                                                                <div className="media-body">
                                                                                    <h5 className="mb-1">I6523 - Occlusion and stenosis of bilateral carotid arteries</h5>
                                                                                </div>
                                                                                <div className="icon-box icon-box-sm bg-danger-light me-1">
                                                                                    <FontAwesomeIcon icon={faClose} style={{ color: "red" }} />
                                                                                </div>
                                                                            </div>
                                                                        </li>
                                                                        <li>
                                                                            <div className="timeline-panel">
                                                                                <div className="media-body">
                                                                                    <h5 className="mb-1">I6523 - Occlusion and stenosis of bilateral carotid arteries</h5>
                                                                                </div>
                                                                                <div className="icon-box icon-box-sm bg-danger-light me-1">
                                                                                    <FontAwesomeIcon icon={faClose} style={{ color: "red" }} />
                                                                                </div>
                                                                            </div>
                                                                        </li>

                                                                    </ul>
                                                                </div>


                                                            </div>
                                                        </Tab.Pane>
                                                        <Tab.Pane id="my-posts" eventKey='invalidDiseases'>
                                                            <div className="my-post-content pt-3">
                                                                <div className="widget-media  ps--active-y" >
                                                                    <ul className="timeline">
                                                                        <li>
                                                                            <div className="timeline-panel">
                                                                                <div className="media-body">
                                                                                    <h5 className="mb-1">I6523 - Occlusion and stenosis of bilateral carotid arteries</h5>
                                                                                </div>
                                                                                <div className="icon-box icon-box-sm bg-danger-light me-1">
                                                                                    <FontAwesomeIcon icon={faCheck} style={{ color: "orange" }} />
                                                                                </div>
                                                                            </div>
                                                                        </li>
                                                                        <li>
                                                                            <div className="timeline-panel">
                                                                                <div className="media-body">
                                                                                    <h5 className="mb-1">I6523 - Occlusion and stenosis of bilateral carotid arteries</h5>
                                                                                </div>
                                                                                <div className="icon-box icon-box-sm bg-danger-light me-1">
                                                                                    <FontAwesomeIcon icon={faCheck} style={{ color: "orange" }} />
                                                                                </div>
                                                                            </div>
                                                                        </li>

                                                                        <li>
                                                                            <div className="timeline-panel">
                                                                                <div className="media-body">
                                                                                    <h5 className="mb-1">I6523 - Occlusion and stenosis of bilateral carotid arteries</h5>
                                                                                </div>
                                                                                <div className="icon-box icon-box-sm bg-danger-light me-1">
                                                                                    <FontAwesomeIcon icon={faCheck} style={{ color: "orange" }} />
                                                                                </div>
                                                                            </div>
                                                                        </li>
                                                                        <li>
                                                                            <div className="timeline-panel">
                                                                                <div className="media-body">
                                                                                    <h5 className="mb-1">I6523 - Occlusion and stenosis of bilateral carotid arteries</h5>
                                                                                </div>
                                                                                <div className="icon-box icon-box-sm bg-danger-light me-1">
                                                                                    <FontAwesomeIcon icon={faCheck} style={{ color: "orange" }} />
                                                                                </div>
                                                                            </div>
                                                                        </li>

                                                                    </ul>
                                                                </div>


                                                            </div>
                                                        </Tab.Pane>

                                                    </Tab.Content>
                                                </Tab.Container>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-footer d-flex justify-content-between flex-wrap">
                                        <div className="due-progress">
                                            <Button className="btn btn-primary btn-sm ms-2">Find Score</Button>
                                        </div>

                                    </div>
                                </div>




                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <Offcanvas show={addPatient} onHide={setAddPatient} className="offcanvas-end" placement='end'>
                <div className="offcanvas-header">
                    <h5 className="modal-title" id="#gridSystemModal">Add File</h5>
                    <button type="button" className="btn-close"
                        onClick={() => setAddPatient(false)}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div className="offcanvas-body">
                    <div className="container-fluid">

                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-xl-12 mb-4">
                                    <Form.Label>File  <span className="text-danger">*</span> </Form.Label>
                                    <Form.Control required type="file" accept="application/pdf,text/plain" onChange={(e) => onChangeFile(e.target.files)} />
                                </div>
                            </div>

                            <div>
                                <Button type='submit' className="btn btn-primary btn-sm me-1">Submit</Button>
                                <Button onClick={() => setAddPatient(false)} className="btn btn-danger btn-sm light ms-1">Cancel</Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </Offcanvas>
        </>
    );
};

export default FileView;