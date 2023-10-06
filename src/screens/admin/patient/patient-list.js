import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import axios from '../../../utility/axiosConfig';
import { Offcanvas } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import {Link} from 'react-router-dom';





const PatientList = () => {
	const [validated, setValidated] = useState(false);
	const [patientList, setPatientList] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isDataLoading, setIsDataLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [addPatient, setAddPatient] = useState(false);

	const recordsPage = 10;
	const lastIndex = currentPage * recordsPage;
	const firstIndex = lastIndex - recordsPage;	

	const [npage, setNPage] = useState('');
	const [number, setNumber] = useState([]);
	const [records, setRecords] = useState([]);
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');

	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
	});


	function prePage() {
		if (currentPage !== 1) {
			setCurrentPage(currentPage - 1)
		}
	}
	function changeCPage(id) {
		setCurrentPage(id);
	}
	function nextPage() {
		if(currentPage !== npage){
		    setCurrentPage(currentPage + 1)
		}
	}


	useEffect(() => {
		getAllList();
	}, []);



	const getAllList = async () => {
		const response = await axios.get("/patient/getall");
		console.log(response.data);
		if (response.data) {
			const records = response.data.slice(firstIndex, lastIndex);
			setPatientList(records);
            setRecords(records);
			const npage = Math.ceil(response.data.length / recordsPage)
			const number = [...Array(npage + 1).keys()].slice(1);
			setNPage(npage);
			setNumber(number);
			setIsDataLoading(false);
		}
	}

	const addPatientForm = () => {
		setValidated(false);
		setAddPatient(true);
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
			postPatient(formData);
		}
		setValidated(true);

	};
	const postPatient = async (data) => {
		const response = await axios.post(`/patient`, data)
		if (response?.status == 200) {
			setAddPatient(false);
			getAllList();
		} else {

		}
	}




	return (
		<>
			<div className="container-fluid">
				<div className="row">
					<div className='col-xl-12'>
						<div className="card">
							<div className="card-body p-0">
								<div className="table-responsive active-projects task-table">
									<div className="tbl-caption d-flex justify-content-between align-items-center">
										<h4 className="heading mb-0">Patient List</h4>
										<div>
											<Button onClick={addPatientForm} className="btn btn-primary btn-sm ms-2">+ Add Patient</Button>
										</div>
									</div>
									<div id="task-tbl_wrapper" className="dataTables_wrapper no-footer">
										<table id="empoloyeestbl2" className="table ItemsCheckboxSec dataTable no-footer mb-2 mb-sm-0">
											<thead>
												<tr>
													<th>SI.NO</th>
													<th>Id</th>
													<th>First Name</th>
													<th>Last Name</th>
													<th>Email</th>
												</tr>
											</thead>
											<tbody>
												{patientList.map((item, index) => (
													<tr key={index}>
														<td><span>{index + 1}</span></td>
														<td><span>{item.id}</span></td>
														<td><span>{item.firstName}</span></td>
														<td><span>{item.lastName}</span></td>
														<td><span>{item.email}</span></td>
													</tr>
												))}
											</tbody>
										</table>
										<div className="d-sm-flex text-center justify-content-between align-items-center">
											<div className='dataTables_info'>
												Showing {lastIndex-recordsPage + 1} to{" "}
												{patientList.length < lastIndex ? patientList.length : lastIndex}
												{" "}of {patientList.length} entries
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
													{number.map((n , i )=>(
														<Link className={`paginate_button ${currentPage === n ? 'current' :  '' } `} key={i}                                            
															onClick={()=>changeCPage(n)}
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
							</div>
						</div>
					</div>
				</div>
			</div>
			<Offcanvas show={addPatient} onHide={setAddPatient} className="offcanvas-end" placement='end'>
				<div className="offcanvas-header">
					<h5 className="modal-title" id="#gridSystemModal">Add Patient</h5>
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
								<div className="col-xl-12 mb-3">
									<Form.Label>First name  <span className="text-danger">*</span> </Form.Label>
									<Form.Control name='firstName' required type="text" onChange={handleChange} />
								</div>
								<div className="col-xl-12 mb-3">
									<Form.Label>Last Name  <span className="text-danger">*</span> </Form.Label>
									<Form.Control name='lastName' required type="text" onChange={handleChange} />
								</div>
								<div className="col-xl-12 mb-3">
									<Form.Label>Email  <span className="text-danger">*</span> </Form.Label>
									<Form.Control name='email' required type="email" onChange={handleChange} />
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

export default PatientList;