import React, { useState, useRef, useEffect } from 'react';
import Select from 'react-select';
import { IMAGES, SVGICON } from "../../../jsx/constant/theme";
import './patient.css'






const PatientDocumentView = () => {
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
	return (
		<>
			<div className="container-fluid">
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
									<input type='date' className='form-control search-date' placeholder='Search in Docments' />
									</div>
									</div>
									</div>
									{/* <div className='col-xl-4 col-sm-12 searchDoc'>
									<input  className='form-control' type='date' />
									</div>								 */}
								</div>
					</div>
					
				</div>
			</div>

		</>
	);
};

export default PatientDocumentView;