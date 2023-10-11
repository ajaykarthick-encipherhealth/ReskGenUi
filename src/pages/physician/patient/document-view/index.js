import React, { useState, useRef, useEffect } from 'react';
import Select from 'react-select';
import { IMAGES, SVGICON } from "../../../../jsx/constant/theme";
// import './patient.css';

import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faCheck } from "@fortawesome/free-solid-svg-icons";
import { Popconfirm } from 'antd';
import { Tab, Nav, Badge, Accordion } from "react-bootstrap";
import { Avatar, Space, DatePicker } from "antd";
import NavBar from "../../../../jsx/layouts/nav";
import { useSelector } from "react-redux";





const PatientDocumentView = () => {
    const sideMenu = useSelector(state => state.sideMenu);
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const [selectFile, setSelectFile] = useState([]);
    const [selectFileURL, setSelectFileURL] = useState([]);
    const [invalidDiseasesList, setInvalidDiseasesList] = useState([]);
    const [comboDiseaseCodesList, setComboDiseaseCodesList] = useState([]);
    const [validDiseasesList, setValidDiseasesList] = useState([]);
    const [selectDiseasesName, setSelectDiseasesName] = useState('');

    useEffect(() => {
        var dummyalidList = [
            { name: "End Stage Renal Disease On Peritoneal Dialysis" },
        ]
        var dummyInvalidList = [
            { name: "Type  1 DM on CGM" },
        ]

        setValidDiseasesList(dummyalidList);
        setInvalidDiseasesList(dummyInvalidList)

    }, []);


    const options = [
        { value: '1', label: 'Novant Health' },
        { value: '2', label: 'Enabled' },
        { value: '3', label: 'Disabled' },
    ];
    const options2 = [
        { value: '1', label: 'Home Health' },
        { value: '2', label: 'Enabled' },
        { value: '3', label: 'Disabled' },
    ];
    const options3 = [
        { value: '1', label: 'Show Original' },
        { value: '2', label: 'Enabled' },
        { value: '3', label: 'Disabled' },
    ];

    const confirmvalid = () =>
        new Promise((resolve) => {
            validMoveConfirm();
            setTimeout(() => resolve(null), 1000);
        });
    const confirmInvalid = () =>
        new Promise((resolve) => {
            invalidMoveConfirm();
            setTimeout(() => resolve(null), 1000);
        });

    const onchangeValid = (data) => {
        setSelectDiseasesName(data);

    }
    const validMoveConfirm = () => {
        const result = validDiseasesList.filter(res => res.name != selectDiseasesName);
        setValidDiseasesList(result);
        var namePush = [];
        namePush.push({ name: selectDiseasesName })
        var newArray = [];
        newArray = [...invalidDiseasesList, ...namePush]
        setInvalidDiseasesList(newArray);
    }
    const invalidMoveConfirm = () => {
        const result = invalidDiseasesList.filter(res => res.name != selectDiseasesName);
        setInvalidDiseasesList(result);
        var namePush = [];
        namePush.push({ name: selectDiseasesName })
        var newArray = [];
        newArray = [...validDiseasesList, ...namePush]
        setValidDiseasesList(newArray);
    }
    const tabList = [
        {
            title: 'Demographics', type: 'Demographics', text:
                "Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.",
            bg: "primary",
        },
        {
            title: 'Encounters', type: 'Encounters', text:
                "Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.",
            bg: "primary",
        },
        {
            title: 'Diagnosis', type: 'Diagnosis', text:
                "Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.",
            bg: "primary"
        },
        {
            title: 'Procedure', type: 'Procedure', text:
                "Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.",
            bg: "primary"
        },
        {
            title: 'Medications', type: 'Medications', text:
                "Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.",
            bg: "primary"
        },
        { title: 'Notes', type: 'Notes' },
        {
            title: 'HCC assessments', type: 'HCC assessments', text:
                "Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.",
            bg: "primary"
        },
    ];



    return (
        <>
         <div className={`show ${ sideMenu ? "menu-toggle" : ""}`}> 
         <NavBar />
          <div class="content-body">
            <div className="container-fluid">
                {/* <div className="page-titles">
				<ol className="breadcrumb">
					<li><h5 className="bc-title">Patient</h5></li>
					<li className="breadcrumb-item">Document
					</li>
					<li className="breadcrumb-item active">View</li>
				</ol>
				
			</div> */}
                <div className="row">

                    <div className='col-xl-6 col-sm-12'>
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className='col-xl-4 col-sm-12'>
                                        <div className="author-profile">
                                            <div className="author-media">
                                                <img src={IMAGES.profileImage} alt="" />
                                            </div>
                                            <div className='user-details'>
                                                <h6>Arun</h6>
                                                <span className='completed-dot'></span><span className='ageDtails'>Completed</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-xl-2 col-sm-12'>
                                        <i>{SVGICON.AgeIcon}</i> <span>Age</span>
                                        <h6 className='ageDtails'>45</h6>
                                    </div>
                                    <div className='col-xl-3 col-sm-12'>
                                        <i>{SVGICON.GenerIcon}</i><span>Gender</span>
                                        <h6 className='ageDtails'>Male</h6>
                                    </div>
                                    <div className='col-xl-3 col-sm-12'>
                                        <i>{SVGICON.DatebirthIcon}</i> <span>Date of birth</span>
                                        <h6 className='ageDtails'>21/09/2025</h6>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-xl-6 col-sm-12'>
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className='col-xl-4 col-sm-12'>
                                        <label className="form-label">Provider</label>
                                        <Select options={options} className="custom-react-select"
                                            defaultValue={options[0]}
                                            isSearchable={false}
                                        />
                                    </div>
                                    <div className='col-xl-4 col-sm-12'>
                                        <label className="form-label">Encounter Type</label>
                                        <Select options={options2} className="custom-react-select"
                                            defaultValue={options2[0]}
                                            isSearchable={false}
                                        />
                                    </div>
                                    <div className='col-xl-4 col-sm-12'>
                                        <label className="form-label">Document Preference</label>
                                        <Select options={options3} className="custom-react-select"
                                            defaultValue={options3[0]}
                                            isSearchable={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='col-xl-12 col-sm-12'>
                        <div className="row">
                            <div className='col-xl-12 col-sm-12 searchDoc'>
                                <div className="card searchCard">
                                    <div className="card-body d-flex">
                                        <input type='text' className='form-control search-doc' placeholder='Search in Docments' />
                                        <DatePicker className="form-control search-date" />
                                    </div>
                                </div>
                            </div>
                            {/* <div className='col-xl-4 col-sm-12 searchDoc'>
<input  className='form-control' type='date' />
</div>								 */}
                        </div>
                    </div>
                    <div className='col-xl-12 col-sm-12'>
                        <div className="card">
                            <Tab.Container defaultActiveKey={'Demographics'}>
                                <div className="card-header flex-wrap">
                                    <Nav as="ul" className="nav nav-pills mix-chart-tab">
                                        {tabList.map((item, index) => (
                                            <Nav.Item as="li" className="nav-item" key={index}>
                                                <Nav.Link eventKey={item.title}

                                                >{item.title}</Nav.Link>
                                            </Nav.Item>
                                        ))}
                                    </Nav>
                                </div>
                            </Tab.Container>
                        </div>
                    </div>
                    <div className="col-xl-12">
                        <div className="row">
                            <div className='col-xl-2'>
                                <div className="card">
                                    <div className="card-body p-10">
                                        <Accordion className="accordion accordion-primary-solid" defaultActiveKey="0">
                                            {tabList.map((data, i) => (
                                                <Accordion.Item key={i} eventKey={`${i}`}>
                                                    <Accordion.Header className="accordion-header">
                                                        {" "}
                                                        {data.title}
                                                    </Accordion.Header>
                                                    <Accordion.Collapse eventKey={`${i}`} className="accordion__body">
                                                        <div className="accordion-body">{data.text}</div>
                                                    </Accordion.Collapse>
                                                </Accordion.Item >
                                            ))}
                                        </Accordion>
                                    </div></div>
                            </div>
                            <div className='col-xl-6'>
                                <div className="card documet-viewcard">
                                    <div className="card-body p-0">
                                        {/* <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
                                            <div
                                                style={{
                                                    height: "600px",
                                                    maxWidth: "1300px",
                                                    marginLeft: "auto",
                                                    marginRight: "auto"
                                                }}
                                            >                          <Viewer
                                                    fileUrl={selectFileURL}
                                                    plugins={[defaultLayoutPluginInstance]}
                                                />
                                            </div>
                                        </Worker> */}
                                        <p className='p-3 '>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                                        <p className='p-3 '>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                                        <p className='p-3 '>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                                    </div>
                                </div>
                            </div>
                            <div className='col-xl-4'>
                                <div className="card height470">
                                    <div className="card-body">
                                        <div className="profile-tab">
                                            <div className="custom-tab-1">
                                                <Tab.Container defaultActiveKey='validDiseases'>
                                                    <Nav as='ul' className="nav nav-tabs">
                                                        <Nav.Item as='li' className="nav-item">
                                                            <Nav.Link to="#my-posts" eventKey='validDiseases'>Diseases

                                                            </Nav.Link>
                                                        </Nav.Item>
                                                        <Nav.Item as='li' className="nav-item">
                                                            <Nav.Link to="#my-posts" eventKey='comboDiseases'>Combo Diseases</Nav.Link>
                                                        </Nav.Item>
                                                    </Nav>
                                                    <Tab.Content>
                                                        <Tab.Pane id="my-posts" eventKey='validDiseases'>
                                                            <div className="my-post-content pt-3">
                                                                <div className="widget-media hegiht330  ps--active-y" >
                                                                    <div className="row">

                                                                        <div className='col-xl-12'>
                                                                            <ul className="timeline">
                                                                                <span className={`dang d-block mb-2 valid-text-document`}>
                                                                                    {" "}Valid  <Badge as="a" href="" bg="secondary badge-circle">
                                                                                        {validDiseasesList.length}
                                                                                    </Badge>
                                                                                </span>
                                                                                {validDiseasesList.map((data, i) => (
                                                                                    <li className='valid-disease-document'>
                                                                                        <div className="valid-card">
                                                                                            <div className="media-body">
                                                                                                <h5 className="mb-1">{data.name}</h5>
                                                                                            </div>
                                                                                            <Popconfirm
                                                                                                title='You want move to invalid?'
                                                                                                description={data.name}
                                                                                                onConfirm={confirmvalid}
                                                                                                placement="leftTop"
                                                                                                okText="Yes"
                                                                                                cancelText="No"
                                                                                                onOpenChange={() => onchangeValid(data.name)}
                                                                                            >
                                                                                                <div className="icon-box sm-box-valid  bg-danger-light me-1">
                                                                                                    <FontAwesomeIcon icon={faClose} style={{ color: "white" }} />
                                                                                                </div>
                                                                                            </Popconfirm>
                                                                                        </div>
                                                                                        <div>
                                                                                            <div>
                                                                                                <Badge bg="danger badge-circle mt-2">
                                                                                                    N18.6 & Z99.2
                                                                                                </Badge>
                                                                                                <Badge bg="danger badge-circle mt-2 ml-5">
                                                                                                    CMS_HCC 59
                                                                                                </Badge>
                                                                                            </div>
                                                                                            <div>
                                                                                                <Badge bg=" badge-rounded" className='badge-outline-info  mt-2'>Hyperlinks {" "}
                                                                                                    ({validDiseasesList.length})
                                                                                                </Badge>
                                                                                                <Badge bg=" badge-rounded" className='badge-outline-info mt-2 ml-5'>Warning {" "}
                                                                                                    ({validDiseasesList.length})
                                                                                                </Badge>
                                                                                            </div>

                                                                                        </div>


                                                                                    </li>
                                                                                ))}
                                                                            </ul>
                                                                        </div>
                                                                        <div className='col-xl-12'>
                                                                            <ul className="timeline">
                                                                                <span className={`dang d-block mb-2  invalid-text-document`}>
                                                                                    {" "}Invalid {" "}
                                                                                    <Badge as="a" href="" bg="badge-circle invalid-bange">
                                                                                        {invalidDiseasesList.length}
                                                                                    </Badge>
                                                                                </span>
                                                                                {invalidDiseasesList.map((data, i) => (
                                                                                    <li className='invalid-disease-document'>


                                                                                        <div className="valid-card">
                                                                                            <div className="media-body">
                                                                                                <h5 className="mb-1">{data.name}</h5>
                                                                                            </div>
                                                                                            <Popconfirm
                                                                                                title='You want move to valid?'
                                                                                                description={data.name}
                                                                                                onConfirm={confirmInvalid}
                                                                                                placement="leftTop"
                                                                                                okText="Yes"
                                                                                                cancelText="No"
                                                                                                onOpenChange={() => onchangeValid(data.name)}
                                                                                            >

                                                                                                <div className="icon-box sm-box-invalid bg-danger-light me-1">
                                                                                                    <FontAwesomeIcon icon={faCheck} style={{ color: "white" }} />
                                                                                                </div>
                                                                                            </Popconfirm>

                                                                                        </div>
                                                                                        <div>
                                                                                            <div>
                                                                                                <Badge bg="danger badge-circle mt-2">
                                                                                                    E10.9
                                                                                                </Badge>
                                                                                            </div>
                                                                                            <div>
                                                                                                <Badge bg=" badge-rounded" className='badge-outline-info  mt-2'>Hyperlinks {" "}
                                                                                                    ({validDiseasesList.length})
                                                                                                </Badge>
                                                                                            </div>

                                                                                        </div>
                                                                                        <div>
                                                                                            <div className='d-flex'>
                                                                                                <h6 className='pt-2'>Rejection reason : </h6>
                                                                                                <input type='text' className='form-control reject-form' placeholder='Search in Docments' />
                                                                                            </div>

                                                                                        </div>

                                                                                    </li>
                                                                                ))}
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </div>


                                                            </div>
                                                        </Tab.Pane>
                                                        <Tab.Pane id="my-posts" eventKey='invalidDiseases'>
                                                            <div className="my-post-content pt-3">
                                                                <div className="widget-media  hegiht300 ps--active-y" >
                                                                    <ul className="timeline">
                                                                        {invalidDiseasesList.map((data, i) => (
                                                                            <li>
                                                                                <div className="timeline-panel">
                                                                                    <div className="media-body">
                                                                                        <h5 className="mb-1">{data.name}</h5>
                                                                                    </div>
                                                                                    <div className="icon-box icon-box-sm bg-danger-light me-1">
                                                                                        <FontAwesomeIcon icon={faCheck} style={{ color: "orange" }} />
                                                                                    </div>
                                                                                </div>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>


                                                            </div>
                                                        </Tab.Pane>
                                                        <Tab.Pane id="my-posts" eventKey='comboDiseases'>
                                                            <div className="my-post-content pt-3">
                                                                <div className="widget-media  hegiht300 ps--active-y" >
                                                                    <ul className="timeline">
                                                                        <li>
                                                                            <div className="timeline-panel">
                                                                                <div className="media-body">
                                                                                    <h5 className="mb-1 combodiseaseText">{comboDiseaseCodesList}</h5>
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

export default PatientDocumentView;