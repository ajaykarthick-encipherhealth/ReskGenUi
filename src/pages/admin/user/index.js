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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight, faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import moment from 'moment';
import Swal from 'sweetalert2';
import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';





const UserList = () => {

	// const { sidebariconHover} = useContext(ThemeContext);

	const sideMenu = useSelector(state => state.sideMenu);

	const [localUserId, setLocalUserId] = useState('');
	const [localOrgId, setLocalOrgId] = useState('');
	const [localTenantId, setLocalTenantId] = useState('');
	const [pageDataCount, setPageDataCount] = useState(0);
	const [pageLimitCount, setPageLimitCount] = useState(1000);


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
	const [roleValue, setRoleValue] = useState(false);

	const [formData, setFormData] = useState({
		name: '',
		emailId: '',
		password: '',
		// role: '',
		userName: '',
		mobileNumber: ''
	});


	const [pageCount, setPageCount] = useState(0);
	const [pageIndex, setPageIndex] = useState(0);
	const [pageOptions, setPageOptions] = useState(0);
	const [canPreviousPage, setCanPreviousPage] = useState(false);
	const [canNextPage, setCanNextPage] = useState(true);
	const [canMaxPage, setCanMaxPage] = useState(10);

	const [filters, setFilters] = useState({
		global: { value: null, matchMode: FilterMatchMode.CONTAINS },
		patientId: { value: null, matchMode: FilterMatchMode.CONTAINS },
		patientName: { value: null, matchMode: FilterMatchMode.CONTAINS },
	});



	useEffect(() => {
		var tenId = localStorage.getItem("tenantId");
		var uId = localStorage.getItem("userId");
		var orgId = localStorage.getItem("orgId");
		setLocalTenantId(tenId);
		setLocalUserId(uId);
		setLocalOrgId(orgId);
		getAllList(tenId, orgId, pageDataCount, pageLimitCount, '');
	}, []);



	const getAllList = async (tenId, orgId, page, limit, status) => {
		var apiUrl = `management/admin/getusers?orgId=${orgId}&tenantId=${tenId}&status=${status}&page=${page}&limit=${limit}`;
		const response = await axios.get(ENDPOINTS.apiEndoint + apiUrl);
		var result = response.data;
		if (response.data) {
			setUserList(result.record != null ? result.record : []);
			setIsDataLoading(false);
			setIsLoading(false);
		}
	}
	const createUser = async (data) => {
		setIsLoading(true);
		const response = await axios.post(ENDPOINTS.apiEndoint + `securityservice/admin/getusers/createuser`, data);
		console.log(response)
		var result = response.data;
		if (response?.status == 201) {
			setAddUser(false);
			getAllList(localTenantId, localOrgId, pageDataCount, pageLimitCount, '');
		} else {

		}
	}
	const deletUser = async (userId) => {
		var apiUrl = `management/admin/user?userId=${userId}&orgId=${localOrgId}&tenantId=${localTenantId}`;
		const response = await axios.delete(ENDPOINTS.apiEndoint + apiUrl);
		var result = response.data;
		if (response.data) {
			setUserList(result.record != null ? result.record : []);
			setIsDataLoading(false);
			setIsLoading(false);
			getAllList(tenId, orgId, pageDataCount, pageLimitCount, '');
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
		if (key == 'role') {
			setRoleValue([value]);
		}
	}

	const handleSubmit = (event) => {
		const form = event.currentTarget;
		event.preventDefault();
		if (form.checkValidity() === true) {
			formData.tenantId = localTenantId;
			formData.orgId = localOrgId;
			formData.role = roleValue;
			console.log(formData)
			createUser(formData);
		}
		setValidated(true);

	};

	const roleUpdate = async (data) => {
		setIsLoading(true);
		const response = await axios.post(ENDPOINTS.apiEndoint + `patient`, data)
		if (response?.status == 200) {
			setAddUser(false);
			getAllList(tenId, orgId, pageDataCount, pageLimitCount, '');
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

		getAllList(localTenantId, localTenantId, number, pageLimitCount, '');


	}
	function nextPage(number) {
		if (canMaxPage > number) {
			setPageCount(number);
			setPageIndex(number);
			setCanPreviousPage(true);
		} else {
			setCanNextPage(false);
		}
		getAllList(localTenantId, localTenantId, number, pageLimitCount, '');

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
		getAllList(localTenantId, localTenantId, number, pageLimitCount, '');
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

	const userEdit = (data) => {
		setAddUser(true)

	}
	const userDelete = (data) => {
		Swal.fire({
			title: 'Do you want delete!',
			text: data.name,
			icon: 'warning',
			confirmButtonText: 'Logout',
			showCancelButton: true,
			confirmButtonText: 'Yes',
			confirmButtonColor: "#DD6B55",
			closeOnConfirm: false
		}).then((result) => {
			if (result.isConfirmed) {
				deletUser(data.userId)
			}
		})

	}

	function validate_password(password) {
		let check = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
		if (password.match(check)) {
			console.log("Your password is strong.");
		} else {
			console.log("Meh, not so much.");
		}
	}

	const statusBodyTemplate = (rowData) => {
	
		switch (rowData.accountStatus) {
		  case true:
			return <span key={rowData.userId}> <Switch id={rowData.userId} onChange={event => switchHandler(event, rowData.userId)} checked checkedChildren="Enabled" unCheckedChildren="Disabled" /></span>
			  ;
	
		  case false:
			return<span key={rowData.userId}> <Switch id={rowData.userId} onChange={event => switchHandler(event, rowData.userId)} checked={false} checkedChildren="Enabled" unCheckedChildren="Disabled" /></span>;
	
		}
	  };

	const actionBodyTemplate = (rowData) => {
		return <div className="d-flex">
			<button onClick={() => userEdit(rowData)} className="btn hegiht10 btn-primary shadow  sharp me-1 action-btn">
				<FontAwesomeIcon icon={faPencilAlt} fontSize={11} />
			</button>
			<button onClick={() => userDelete(rowData)} className="btn hegiht10 btn-danger shadow  sharp me-1 action-btn">
				<FontAwesomeIcon icon={faTrash} fontSize={11} />
			</button>

		</div>
	};





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
												<DataTable value={userList} paginator rows={10} rowsPerPageOptions={[10, 25, 50, 100]} dataKey="id" filters={filters} filterDisplay="menu">
													<Column header="SI.NO" headerStyle={{ width: '3rem' }} body={(data, options) => options.rowIndex + 1}></Column>
													<Column field="name" header="Name" />
													<Column field="userName" header="User Name" />
													<Column field="email" header="Email" />
													<Column field="role" header="Role" />
													<Column field="status" body={statusBodyTemplate} header="Status" />
													<Column field="createdDate" header="Created Date" />
													<Column field="action" body={actionBodyTemplate} header="Action" />
												</DataTable>
												{/* <table id="empoloyeestbl2" className="table ItemsCheckboxSec dataTable no-footer mb-2 mb-sm-0">
													<thead>
														<tr>
															<th>SI.NO</th>
															<th>First Name</th>
															<th>Last Name</th>
															<th>User Name</th>
															<th>Email</th>
															<th>Role</th>
															<th>Status</th>
															<th>Date Created</th>
															<th>Action</th>
														</tr>
													</thead>
													<tbody>
														{userList.map((item, index) => (
															<tr key={index}>
																<td><span>{index + 1}</span></td>
																<td><span>{item.firstName}</span></td>
																<td><span>{item.lastName}</span></td>
																<td><span>{item.userName}</span></td>
																<td><span>{item.email}</span></td>
																<td><span>
																	{item.role[0]}
																	
																</span></td>
																<td>
																<span key={index}> <Switch id={index} onChange={event => switchHandler(event, index)} checked={isStatus[index]} checkedChildren="Enabled" unCheckedChildren="Disabled" /></span
																></td>
																<td><span>{moment(item.createdDate).format('DD/MM/YYYY hh:mm A')}</span></td>
																<td>
																	<div className="d-flex">
																		<button onClick={() => userEdit(item)} className="btn hegiht10 btn-primary shadow  sharp me-1 action-btn">
																			<FontAwesomeIcon icon={faPencilAlt} fontSize={11} />
																		</button>
																		<button onClick={() => userDelete(item)} className="btn hegiht10 btn-danger shadow  sharp me-1 action-btn">
																			<FontAwesomeIcon icon={faTrash} fontSize={11} />
																		</button>
																	</div>
																</td>

															</tr>
														))}
													</tbody>
												</table>
												<div className="d-flex justify-content-between mrt-15">
													<span>
														Page{' '}
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
												</div> */}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Offcanvas show={addUser} onHide={setAddUser} className="offcanvas-end  offcanvas-md-size" placement='end'>
				<div className="offcanvas-header">
					<h5 className="modal-title" id="#gridSystemModal">Add User</h5>
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
								{/* <div className="col-xl-6 mb-3">
									<Form.Label>First name  <span className="text-danger">*</span> </Form.Label>
									<Form.Control name='firstName' required type="text" onChange={handleChange} />
								</div>
								<div className="col-xl-6 mb-3">
									<Form.Label>Last Name  <span className="text-danger">*</span> </Form.Label>
									<Form.Control name='lastName' required type="text" onChange={handleChange} />
								</div> */}
								<div className="col-xl-6 mb-3">
									<Form.Label>Name  <span className="text-danger">*</span> </Form.Label>
									<Form.Control name='name' required type="text" onChange={handleChange} />
								</div>
								<div className="col-xl-6 mb-3">
									<Form.Label>Email  <span className="text-danger">*</span> </Form.Label>
									<Form.Control name='emailId' required type="email" onChange={handleChange} />
								</div>
								<div className="col-xl-6 mb-3">
									<Form.Label>User Name  <span className="text-danger">*</span> </Form.Label>
									<div className="input-group mb-3">
										<Form.Control name='userName' required type="text" onChange={handleChange} />
										{/* <span className="input-group-text">@encipherhealth.com</span> */}
									</div>
								</div>
								<div className="col-xl-6 mb-3">
									<Form.Label>Mobile Number  <span className="text-danger">*</span> </Form.Label>
									<Form.Control name='mobileNumber' required type="number" onChange={handleChange} />
								</div>
								<div className="col-xl-6 mb-3">
									<Form.Label>Role  <span className="text-danger">*</span> </Form.Label>
									<Form.Control name='role' as="select" required onChange={handleChange} >
										<option value="ADMIN">ADMIN</option>
										<option value="CODER">CODER</option>
									</Form.Control>
								</div>
								<div className="col-xl-6 mb-3">
									<Form.Label>Password  <span className="text-danger">*</span> </Form.Label>
									<Form.Control name='password' required type="text" onChange={handleChange} />
									<small id="emailHelp" class="form-text text-muted">Please enter an numeric, number with both lowercase and uppercase characters.</small>
								</div>
								<div className="col-xl-6 mb-3">
									<Form.Label>Confirm Password  <span className="text-danger">*</span> </Form.Label>
									<Form.Control name='password' required type="text" onChange={handleChange} />
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