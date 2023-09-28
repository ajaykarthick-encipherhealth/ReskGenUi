import React, {useState, useRef, useEffect} from 'react';
import {Link} from 'react-router-dom';
import { Button } from 'react-bootstrap';
import axios from '../../../utility/axiosConfig';
import { Offcanvas } from 'react-bootstrap';



const PatientList = () => {	
	const [patientList, setPatientList] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isDataLoading, setIsDataLoading] = useState(true);
    const [currentPage , setCurrentPage] = useState(1);
	const [addPatient , setAddPatient] = useState(false);

    const recordsPage = 13;
    const lastIndex = currentPage * recordsPage;
    const firstIndex = lastIndex - recordsPage; 
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');

	 const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  

    function prePage (){
        if(currentPage !== 1){
            setCurrentPage(currentPage - 1)
        }
    }
    function changeCPage (id){
        setCurrentPage(id);
    }
    function nextPage (){
        // if(currentPage !== npage){
        //     setCurrentPage(currentPage + 1)
        // }
    }


	useEffect(() => {
		getAllList();
	  }, []);
   


	const getAllList = async () => {
		const response = await axios.get("/patient/getall");
		console.log(response.data);
		if (response.data) {
		  setPatientList(response.data);
		  setIsDataLoading(false);
		}
	  }

	  const addPatientForm = () => {
		setAddPatient(true);
		
	
	  }

	  const onFormChange = (e) => {
		const { firstName, value } = e.target;
		setFormData({
		  ...formData,
		  [firstName]: value,
		});
	  };

	  const handleSubmit=async (e)=>{
		e.preventDefault();
		var data = {
			email:email,
			firstName:firstName,
			lastName:lastName
		}
		if(data.email != null && data.email != ''){

		const response = await axios.post(`/patient`, data)
		if (response?.status == 200) {
			setAddPatient(false);
		  getAllList();
		} else {
	
		}
	}

		console.log(data)
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
												{patientList.map((item, index)=>(
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
						onClick={()=>setAddPatient(false)}
					>
						<i className="fa-solid fa-xmark"></i>
					</button>
				</div>
				<div className="offcanvas-body">
                    <div className="container-fluid">
                        <form onSubmit={(e)=>handleSubmit(e)}>
                            <div className="row">
                                <div className="col-xl-12 mb-3">
                                    <label htmlFor="exampleFormControlInput1" className="form-label">First Name <span className="text-danger">*</span></label>
                                    <input type="text" className="form-control" id="exampleFormControlInput1" placeholder=""  onChange={(e) => setFirstName(e.target.value)} />
                                </div>	
                                <div className="col-xl-12 mb-3">
                                    <label htmlFor="exampleFormControlInput2" className="form-label">Last Name <span className="text-danger">*</span></label>
                                    <input type="text" className="form-control" id="exampleFormControlInput2" placeholder=""  onChange={(e) => setLastName(e.target.value)} />
                                </div>	
                                <div className="col-xl-12 mb-3">
                                    <label htmlFor="exampleFormControlInput3" className="form-label">Email <span className="text-danger">*</span></label>
                                    <input type="email" className="form-control" id="exampleFormControlInput3" placeholder=""  onChange={(e) => setEmail(e.target.value)} />
                                </div>
                             	
                            </div>
                            <div>
                                <Button type='submit'  className="btn btn-primary btn-sm me-1">Submit</Button>
                                <Button onClick={()=>setAddPatient(false)} className="btn btn-danger btn-sm light ms-1">Cancel</Button>
                            </div>
                        </form>
                    </div>
				</div>
			</Offcanvas>  		
		</>
	);
};

export default PatientList;