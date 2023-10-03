import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Offcanvas } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { Nav, Tab } from 'react-bootstrap';
import './file-management.css';
import FileProcessing from './file-processing';
import DataValidation from './data-validation';






const FileManagement = () => {
	const [validated, setValidated] = useState(false);
	const [addPatient, setAddPatient] = useState(false);
	const [selectFile, setSelectFile] = useState([]);
	const [selectFileName, setSelectFileName] = useState('Upload File');
	const [activeComponent, setActiveComponent] = useState(<FileProcessing/>);
  
  
	const navigetPage = (pageTitle) => {
		console.log(pageTitle)
	 if(pageTitle == 'File Processing'){
		setActiveComponent(<FileProcessing />);
	 }
	 if(pageTitle == 'Data Validation'){
		setActiveComponent(<DataValidation />);
	 }
	
	};



	useEffect(() => {
	}, []);





	const addPatientForm = () => {
		setValidated(false);
		setAddPatient(true);
	}

	const onChangeFile = (e) => {
		console.log(e[0])
		setSelectFile(e[0]);
		var splitString = e[0].name.split(".");
		setSelectFileName(splitString[0]);
	}




	const handleSubmit = (event) => {
		const form = event.currentTarget;
		console.log(form)
		event.preventDefault();
		if (form.checkValidity() === true) {
			event.preventDefault();
			event.stopPropagation();
		}

		setValidated(true);
	};

	const tabList = [
		{ title: 'File Processing', type: 'File Processing' },
		{ title: 'Data Validation', type: 'Data Validation' },
	];


	return (
		<>
			<div className="container-fluid">
				<div className="row">
					<div className='col-xl-12'>
						<div className="card height80">
							<div className="card-body p-0">
								<Tab.Container defaultActiveKey={'File Processing'}>
									<div className="card-header border-0 flex-wrap">
										<Nav as="ul" className="nav nav-pills mix-chart-tab">
											{tabList.map((item, index) => (
												<Nav.Item as="li" className="nav-item" key={index}>
													<Nav.Link  onClick={()=>navigetPage(item.type)} eventKey={item.title} >{item.title}</Nav.Link>
												</Nav.Item>
											))}
										</Nav>
									</div>
								</Tab.Container>
							</div>
						</div>
						<div className="card">
							<div className="card-body p-0">
							{activeComponent}
							</div>
							</div>

					</div>
				</div>
			</div>

		</>
	);
};

export default FileManagement;