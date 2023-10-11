import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import axios from '../../../utility/axiosConfig';
import ENDPOINTS from '../../../utility/enpoints';
import { Offcanvas } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { Link } from 'next/link';
import Select from 'react-select';
import { useRouter } from 'next/navigation'
import NavBar from "../../../jsx/layouts/nav";
import { useSelector } from "react-redux";




const PatientList = () => {
	const sideMenu = useSelector(state => state.sideMenu);
	const navigate = useRouter();
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
		if (currentPage !== npage) {
			setCurrentPage(currentPage + 1)
		}
	}


	useEffect(() => {
		getAllList();
	}, []);



	const getAllList = async () => {
		const response = await axios.get(ENDPOINTS.apiEndoint+"/patient/getall");
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

	const options3 = [
		{ value: '1', label: 'ALL' },
		{ value: '2', label: 'Enabled' },
		{ value: '3', label: 'Disabled' },
	];


	const gotoSummaryDetails = (data) => {
		navigate.push('/physician/patient/summary-details');	

	};

	const gotoDocumentView = (data) => {	
		navigate.push('/physician/patient/document-view');	
	};




	return (
		<>
		 <div className={`show ${ sideMenu ? "menu-toggle" : ""}`}> 
         <NavBar />
          <div class="content-body">
			<div className="container-fluid">
				<div className="row">
					<div className='col-xl-12'>
						<div className="card">
							<div className="card-body p-0">
								<div className="table-responsive active-projects task-table">
									{/* <div className="tbl-caption d-flex justify-content-between align-items-center">
										<h4 className="heading mb-0">Patient List</h4>
										<div>
											<Button onClick={addPatientForm} className="btn btn-primary btn-sm ms-2">+ Add Patient</Button>
										</div>
									</div> */}
									<div className="tbl-caption  align-items-center">
										<div className="row">
											<div className='col-xl-3'>
												<input type="name" className="form-control" placeholder="Name" />
											</div>
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
													{/* <th>Id</th> */}
													<th>First Name</th>
													<th>Last Name</th>
													<th>Email</th>
													<th>Status</th>
													<th>Duration Status</th>
												</tr>
											</thead>
											<tbody>
												{patientList.map((item, index) => (
													<tr key={index}>
														<td  onClick={() => {gotoDocumentView(item)}}><span>{index + 1}</span></td>
														{/* <td onClick={() => {gotoDocumentView(item)}}><span>{item.id}</span></td> */}
														<td className='cr-pointer' onClick={() => {gotoDocumentView(item)}}><span>{item.firstName}</span></td>
														<td onClick={() => {gotoDocumentView(item)}}><span>{item.lastName}</span></td>
														<td onClick={() => {gotoDocumentView(item)}}><span>{item.email}</span></td>
														<td className='td-backcolor'>
															<div className='d-flex'>
																<span
																	className={
																		item.status !== "Completed"
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
																	Completed

																</span>
																<i className='eye-icon' onClick={() => {gotoSummaryDetails(item)}}>
																	<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
																		<g id="view-alt-svgrepo-com 12">
																			<path id="Vector" d="M10.0001 10.8333C10.4603 10.8333 10.8334 10.4602 10.8334 9.99996C10.8334 9.53972 10.4603 9.16663 10.0001 9.16663C9.53984 9.16663 9.16675 9.53972 9.16675 9.99996C9.16675 10.4602 9.53984 10.8333 10.0001 10.8333Z" stroke="black" />
																			<path id="Vector_2" d="M15.1887 9.48375C15.296 9.695 15.3496 9.80058 15.3496 10C15.3496 10.1994 15.296 10.305 15.1887 10.5163C14.6667 11.5444 13.1767 13.75 9.99999 13.75C6.82332 13.75 5.33326 11.5444 4.81122 10.5163C4.704 10.305 4.65039 10.1994 4.65039 10C4.65039 9.80058 4.704 9.695 4.81122 9.48375C5.33326 8.45558 6.82332 6.25 9.99999 6.25C13.1767 6.25 14.6667 8.45558 15.1887 9.48375Z" stroke="black" />
																			<path id="Vector_3" d="M14.1667 3.33337H14.3333C15.8261 3.33337 16.5725 3.33337 17.0363 3.79712C17.5 4.26087 17.5 5.00726 17.5 6.50004V6.66671M14.1667 16.6667H14.3333C15.8261 16.6667 16.5725 16.6667 17.0363 16.203C17.5 15.7392 17.5 14.9928 17.5 13.5V13.3334M5.83333 3.33337H5.66667C4.17388 3.33337 3.42749 3.33337 2.96375 3.79712C2.5 4.26087 2.5 5.00726 2.5 6.50004V6.66671M5.83333 16.6667H5.66667C4.17388 16.6667 3.42749 16.6667 2.96375 16.203C2.5 15.7392 2.5 14.9928 2.5 13.5V13.3334" stroke="black" stroke-linecap="round" />
																		</g>
																	</svg>
																</i>
															</div>

														</td>
														<td onClick={() => {gotoDocumentView(item)}}>10 Days / 10 days</td>
													</tr>
												))}
											</tbody>
										</table>
									
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
            </div>
			</div>
		</>
	);
};

export default PatientList;