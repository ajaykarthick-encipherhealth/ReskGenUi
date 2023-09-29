import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Offcanvas } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';




const FileManagement = () => {
	const [validated, setValidated] = useState(false);
	const [addPatient, setAddPatient] = useState(false);
    const [selectFile, setSelectFile] = useState([]);
    const [selectFileName, setSelectFileName] = useState('Upload File');


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


	return (
		<>
			<div className="container-fluid">
				<div className="row">
					<div className='col-xl-12'>
						<div className="card">
							<div className="card-body p-0">
								<div className="table-responsive active-projects task-table">
									<div className="tbl-caption d-flex justify-content-between align-items-center">
										<h4 className="heading mb-0">File Management</h4>
										<div>
											<Button onClick={addPatientForm} className="btn btn-primary btn-sm ms-2">+ Add File</Button>
										</div>
									</div>
							
								</div>
							</div>
						</div>
					</div>
                    <div className="col-xl-12 col-sm-12">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">{selectFileName}</h5>
                            </div>
                            <div className="card-body">                             
                                <p className="my-2">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.</p>
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
								<div className="col-xl-12 mb-4">
									<Form.Label>File  <span className="text-danger">*</span> </Form.Label>
									<Form.Control required type="file" accept="application/pdf,text/plain" onChange={(e) => onChangeFile(e.target.files)}/>
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

export default FileManagement;