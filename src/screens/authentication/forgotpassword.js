import React, { useState } from 'react'
import { connect, useDispatch } from 'react-redux';
import { Link,  useNavigate } from 'react-router-dom'
import { loadingToggleAction,loginAction,
} from '../../store/actions/AuthActions';

import LoginBack from '../../images/logo/login-back.jpg';




function ForgotPassword (props) {
	const [heartActive, setHeartActive] = useState(true);
	
	const navigate = useNavigate();
    const [email, setEmail] = useState('testuser@encipherhealth.onmicrosoft.com');
    let errorsObj = { email: '', password: '' };
    const [errors, setErrors] = useState(errorsObj);
    const [password, setPassword] = useState('Zoon6363');
    const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);


    function onLogin(e) {
		setIsLoading(true);
		
        e.preventDefault();
        let error = false;
        const errorObj = { ...errorsObj };
        if (email === '') {
            errorObj.email = 'Email is Required';
            error = true;
        }
       
    }
  	return (        
		<div className="page-wraper">			
			<div className="login-account">
				<div className="row h-100">
					<div className="col-lg-6 align-self-start">
						<div className="account-info-area" style={{backgroundImage: "url("+ LoginBack +")"}}>
							<div className="login-content">
								<p className="sub-title"></p>
								<h1 className="title">Logo</h1>
							</div>
						</div>
					</div>
					<div className="col-lg-6 col-md-7 col-sm-12 mx-auto align-self-center">
						<div className="login-form">
							<div className="login-head">
								{/* <h5 className="title">Log in to your account</h5> */}
								<p>Enter the email send you instructions to reset your password.</p>
							</div>
							<h6 className="login-title"><span>Forgot Password</span></h6>								
							{props.errorMessage && (
								<div className='bg-red-300 text-red-900 border border-red-900 p-1 my-2'>
									{props.errorMessage}
								</div>
							)}
							{props.successMessage && (
								<div className='bg-green-300 text-green-900 border border-green-900 p-1 my-2'>
									{props.successMessage}
								</div>
							)}					
							<form  onSubmit={onLogin}>								
								<div className="mb-4">																
									<label className="mb-1 text-dark">Email</label>
									<input type="email" className="form-control form-control-lg" value={email} onChange={(e) => setEmail(e.target.value)} />
									{errors.email && <div className="text-danger fs-12">{errors.email}</div>}
								</div>						
								<div className="form-row d-flex justify-content-between mt-4 mb-2">
									<div className="mb-4">
										<div className="form-check custom-checkbox mb-3">
											{/* <input type="checkbox" className="form-check-input" id="customCheckBox1" required="" />
											<label className="form-check-label" htmlFor="customCheckBox1">Remember my preference</label> */}
										</div>
									</div>	
									<div className="mb-4">
												<Link to="/login" className="btn-link text-primary">Login</Link>
											</div>								
								</div>
								<div className="text-center mb-4">
									<button type="submit" className="btn btn-primary btn-block">
									{isLoading ? 'Loading...' : 'SUBMIT'}
										</button>
								</div>							
							</form>
							
						</div>
					</div>
				</div>
			</div>
		</div>            
    )
}


export default ForgotPassword;