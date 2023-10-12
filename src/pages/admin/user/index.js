import React, { useState, useRef, useEffect, useContext } from 'react';
import { Button } from 'react-bootstrap';
import axios from '../../../utility/axiosConfig';
import ENDPOINTS from '../../../utility/enpoints';
import { Offcanvas } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';
import NavBar from "../../../jsx/layouts/nav";
import { useSelector } from "react-redux";
import { ThemeContext } from "../../../context/ThemeContext";
import { Switch } from 'antd';






const UserList = () => {

	// const { sidebariconHover} = useContext(ThemeContext);

	const sideMenu = useSelector(state => state.sideMenu);


	const [validated, setValidated] = useState(false);
	const [userList, setUserList] = useState([]);
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
		console.log(sideMenu)
		getAllList();
	}, []);



	const getAllList = async () => {
		const response = await axios.get(ENDPOINTS.apiEndoint + "/patient/getall");
		console.log(response.data);
		if (response.data) {
			const records = response.data.slice(firstIndex, lastIndex);
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
			postPatient(formData);
		}
		setValidated(true);

	};
	const postPatient = async (data) => {
		setAddUser(false);
		setIsLoading(true);
		const response = await axios.post(`/patient`, data)
		if (response?.status == 200) {
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
		{ value: '1', label: 'Coder(Level 1)' },
		{ value: '2', label: 'Coder(Level 2)' },
		{ value: '3', label: 'Auditor' },
		{ value: '4', label: 'Team Lead' },
	]




	return (
		<>
			<div className={`show ${sideMenu ? "menu-toggle" : ""}`}>
				<NavBar />
				<div className="content-body show menu-toggle">
					<div className="container-fluid">
						<div className="row">
							<div className='col-xl-12'>
								<div className="card">
									<div className="card-body p-0">
										<div className="table-responsive active-projects task-table">
											<div className="tbl-caption  align-items-center">
												<div className="row">
													<div className='col-xl-2'>
														<input type="text" className="form-control" placeholder="Name" />
													</div>
													<div className='col-xl-2'>
														<input type="date" className="form-control" placeholder="Date" />
													</div>
													<div className='col-xl-2'>
														<Select options={RoleList} className="custom-react-select"
															defaultValue={RoleList[0]}
															isSearchable={false}
														/>
													</div>
													<div className='col-xl-2'>
														<Select options={options3} className="custom-react-select"
															defaultValue={options3[0]}
															isSearchable={false}
														/>
													</div>
													<div className='col-xl-4'>
														<Button onClick={addUserForm} className="btn btn-primary btn-sm ms-2 flr">+ Add User</Button>
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
															<th>Password</th>
															<th>Roles</th>
															<th>Status</th>
															<th>Date Created</th>
															{/* <th>Action</th> */}
														</tr>
													</thead>
													<tbody>
														{userList.map((item, index) => (
															<tr key={index}>
																<td><span>{index + 1}</span></td>
																{/* <td><span>{item.id}</span></td> */}
																<td><span>{item.firstName}</span></td>
																<td><span>{item.lastName}</span></td>
																<td><span>{item.email}</span></td>
																<td><span>*****</span></td>
																<td><span><Select options={RoleList} className="custom-react-select"
																	defaultValue={RoleList[0]}
																	isSearchable={false}
																/></span></td>
																<td><span>    <Switch checkedChildren="Enabled" unCheckedChildren="Disabled" defaultChecked /></span></td>
																<td><span>22/06/2022</span></td>

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
				</div>
			</div>
			<Offcanvas show={addUser} onHide={setAddUser} className="offcanvas-end" placement='end'>
				<div className="offcanvas-header">
					<h5 className="modal-title" id="#gridSystemModal">Add File</h5>
					<button type="button" className="btn-close"
						onClick={() => setAddUser(false)}
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
								<div className="col-xl-12 mb-3">
									<Form.Label>Role  <span className="text-danger">*</span> </Form.Label>
									{/* <Form.Control name='email' required type="email" onChange={handleChange} /> */}
									<Select options={RoleList} className="custom-react-select"
										defaultValue={RoleList[0]}
										isSearchable={false}
									/>
								</div>
							</div>
							<div>
								<Button type='submit' className="btn btn-primary btn-sm me-1">Submit</Button>
								<Button onClick={() => setAddUser(false)} className="btn btn-danger btn-sm light ms-1">Cancel</Button>
							</div>
						</Form>
					</div>
				</div>
			</Offcanvas>
		</>
	);
};

export default UserList;