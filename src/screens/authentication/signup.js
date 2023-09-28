import React,{useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import { connect, useDispatch } from 'react-redux';
import {
    loadingToggleAction,
    signupAction,
} from '../../store/actions/AuthActions';
// image
import LoginBack from '../../images/logo/login-back.jpg';



function Signup(props) {
	const [heartActive, setHeartActive] = useState(true);

    const [email, setEmail] = useState('');
    let errorsObj = { email: '', password: '' };
    const [errors, setErrors] = useState(errorsObj);
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
	const navigate = useNavigate();

    function onSignUp(e) {
        e.preventDefault();
        let error = false;
        const errorObj = { ...errorsObj };
        if (email === '') {
            errorObj.email = 'Email is Required';
            error = true;
        }
        if (password === '') {
            errorObj.password = 'Password is Required';
            error = true;
        }
        setErrors(errorObj);
        if (error) return;
        dispatch(loadingToggleAction(true));
        dispatch(signupAction(email, password, navigate));
    }
	
	return (
		<>			
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
								<h3 className="title">Signup your details</h3>
								</div>
								<h6 className="login-title"><span>Signup</span></h6>
								<div className="row mb-5">
									<div className="col-xl-12 col-sm-12">
										<Link to={"#"} className="btn btn-outline-danger d-block social-btn">
											<svg width="16" height="16" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M27.9851 14.2618C27.9851 13.1146 27.8899 12.2775 27.6837 11.4094H14.2788V16.5871H22.1472C21.9886 17.8738 21.132 19.8116 19.2283 21.1137L19.2016 21.287L23.44 24.4956L23.7336 24.5242C26.4304 22.0904 27.9851 18.5093 27.9851 14.2618Z" fill="#4285F4"></path>
												<path d="M14.279 27.904C18.1338 27.904 21.37 26.6637 23.7338 24.5245L19.2285 21.114C18.0228 21.9356 16.4047 22.5092 14.279 22.5092C10.5034 22.5092 7.29894 20.0754 6.15663 16.7114L5.9892 16.7253L1.58205 20.0583L1.52441 20.2149C3.87224 24.7725 8.69486 27.904 14.279 27.904Z" fill="#34A853"></path>
												<path d="M6.15656 16.7113C5.85516 15.8432 5.68072 14.913 5.68072 13.9519C5.68072 12.9907 5.85516 12.0606 6.14071 11.1925L6.13272 11.0076L1.67035 7.62109L1.52435 7.68896C0.556704 9.58024 0.00146484 11.7041 0.00146484 13.9519C0.00146484 16.1997 0.556704 18.3234 1.52435 20.2147L6.15656 16.7113Z" fill="#FBBC05"></path>
												<path d="M14.279 5.3947C16.9599 5.3947 18.7683 6.52635 19.7995 7.47204L23.8289 3.6275C21.3542 1.37969 18.1338 0 14.279 0C8.69485 0 3.87223 3.1314 1.52441 7.68899L6.14077 11.1925C7.29893 7.82856 10.5034 5.3947 14.279 5.3947Z" fill="#EB4335"></path>
											</svg>
											<span className="ms-1 font-w600 label-color">Sign in with Google</span>
										</Link>
									</div>
								</div>		
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
								
									<form onSubmit={onSignUp}>																	
										
										<div className="mt-4">
											<label className="mb-1 text-dark">Username</label>											
											<input name="dzName2" required="" className="form-control" placeholder="User Name" type="text" />
										</div>
										<div className="mt-4">
											<label className="mb-1 text-dark">Email</label>
											<input value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" placeholder="hello@example.com"/>
											{errors.email && <div className="text-danger fs-12">{errors.email}</div>}
										</div>															
										<div className="mt-4">																	
											<label className="mb-1 text-dark">Password</label>
											<input
												value={password}
												onChange={(e) =>
													setPassword(e.target.value)
												}
												className="form-control"
												placeholder="passowrd"
											/>
											{errors.password && <div className="text-danger fs-12">{errors.password}</div>}
										</div>
										<div className="form-row d-flex justify-content-between mt-4 mb-2">
											<div className="mb-4">
												<div className="form-check custom-checkbox mb-3">
													<input type="checkbox" className="form-check-input" id="customCheckBox1" required="" />
													<label className="form-check-label" htmlFor="customCheckBox1">Already have an account?</label>
												</div>
											</div>
											<div className="mb-4">
												<Link to="/login" className="btn-link text-primary">Login</Link>
											</div>
										</div>
										<div className="text-center mb-4">
											<button type="submit" className="btn btn-primary btn-block">SIGNUP</button>
										</div>																	
									</form>	
								
							</div>
							
						</div>
					</div>
				</div>
			</div> 
		</>
	);
};

const mapStateToProps = (state) => {
    return {
        errorMessage: state.auth.errorMessage,
        successMessage: state.auth.successMessage,
        showLoading: state.auth.showLoading,
    };
};

export default connect(mapStateToProps)(Signup);

