import React, { useState } from 'react';
import Link from 'next/link';
import ENDPOINTS from '../utility/enpoints';
import axios from '../utility/axiosConfig';
import { useRouter } from 'next/router';
import LoginBack from '../images/logo/login-back.jpg';
import { notification } from 'antd';
import Image from 'next/image';
import { IMAGES } from "../jsx/constant/theme";





export default function UserLogin() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    let errorsObj = { email: '', password: '' };
    const [errors, setErrors] = useState(errorsObj);
    const [password, setPassword] = useState('');
    // const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);


    const onLogin = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        let emailSplit = email.split("@");

        // if (email == "physician@gmail.com") {
        //     localStorage.setItem("userRole", 'physician')
        //     router.push("/physician/home");
        //     notification.success({
        //         message: "Login Successful",
        //     });

        // }
            try {
                const postData = {
                username: email,
                    password: password,
                };
                const response = await axios.post(ENDPOINTS.apiEndoint + `securityservice/auth/login`, postData);
                var result = response.data;
                if (result.access_token != null) {
                    if(emailSplit[0] === "ajgith01"){
                        localStorage.setItem("userRole", 'Coder-L2')

                    }else{
                        localStorage.setItem("userRole", 'physician')

                    }
                    localStorage.setItem("token", result.access_token);
                    localStorage.setItem("tenantId", result.tenantId);
                    localStorage.setItem("userId", result.userEmail);
                    localStorage.setItem("orgId", result.organizationId);
                    localStorage.setItem("userName", emailSplit[0]);
                    localStorage.setItem("loginCheck", true);

                    router.push("/physician/dashboard");
                    notification.success({
                        message: "Login Success",
                        duration: 1
                    });
                } else {
                    setIsLoading(false);
                    notification.error({
                        message: "Login Failed",
                        duration: 1
                    });
                }
            } catch (e) {
                setIsLoading(false);
                // notification.error({
                //     message: "Login Failed"
                // });
            }
    }

    return (
        <div className="page-wraper">
            <div className="login-account">
                <div className="row h-100">
                    <div className="col-lg-6 align-self-start">
                        <div className="account-info-area"  style={{backgroundImage: "url("+ LoginBack +")"}}>
                            <div className="login-content">
                                <p className="sub-title"></p>
                                <Image className='login-logo' src={IMAGES.hccLogo}/>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-7 col-sm-12 mx-auto align-self-center">
                        <div className="login-form">
                            <div className="login-head">
                                <h5 className="title">Log in to your account</h5>
                                {/* <p>Login page allows users to enter login credentials for authentication and access to secure content.</p> */}
                            </div>
                            <h6 className="login-title"><span>Login</span></h6>

                            {/* {props.errorMessage && (
                            <div className='bg-red-300 text-red-900 border border-red-900 p-1 my-2'>
                                {props.errorMessage}
                            </div>
                        )}
                        {props.successMessage && (
                            <div className='bg-green-300 text-green-900 border border-green-900 p-1 my-2'>
                                {props.successMessage}
                            </div>
                        )}					 */}
                            <form onSubmit={onLogin}>
                                <div className="mb-4">
                                    <label className="mb-1 text-dark">Email</label>
                                    <input type="email" className="form-control form-control-lg" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    {errors.email && <div className="text-danger fs-12">{errors.email}</div>}
                                </div>
                                <div className="mb-4">
                                    <label className="mb-1 text-dark">Password</label>
                                    <input type="password" className="form-control form-control-lg" value={password} onChange={(e) => setPassword(e.target.value)} />
                                    {errors.password && <div className="text-danger fs-12">{errors.password}</div>}
                                </div>
                                <div className="text-center mb-4">
                                    <button type="submit" className="btn btn-primary btn-block">
                                        {isLoading ? 'Loading...' : 'LOGIN'}
                                    </button>
                                </div>
                                {/* <p className="text-center">Not registered ?  
                                <Link to={"/signup"} className="btn-link text-primary"> Signup</Link>
                            </p>								 */}
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}