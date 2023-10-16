import React, { Fragment, useState } from "react";
import { Stepper, Step } from 'react-form-stepper';
import Link from 'next/link';
import ENDPOINTS from '../utility/enpoints';
import axios from '../utility/axiosConfig';
import { useRouter } from 'next/router';
import LoginBack from '../images/logo/login-back.jpg';
import { notification } from 'antd';
import Select from 'react-select';
import { Result } from 'antd';






export default function OnBoarding() {
    const router = useRouter();
    const [email, setEmail] = useState('testuser@encipherhealth.onmicrosoft.com');
    let errorsObj = { email: '', password: '' };
    const [errors, setErrors] = useState(errorsObj);
    const [password, setPassword] = useState('Zoon6363');
    // const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [goSteps, setGoSteps] = useState(0);
    const [success, setSuccess] = useState(false);




    const FinalStepSubmit = async (e) => {
         setSuccess(true);
    }
    const gotoLogin = async () => {
        router.push("/login");
   }

    const options3 = [
        { value: 'Provider 1', label: '' },
        { value: 'Provider 1', label: 'Provider 1' },
        { value: 'Provider 2', label: 'Provider 2' },
        { value: 'Provider 3', label: 'Provider 3' },
    ]

    return (
        <div className="page-wraper">
            <div className="login-account">
                <div className="row h-100">
                    <div className="col-lg-6 align-self-start">
                        <div className="account-info-area" style={{ backgroundImage: "url(" + LoginBack + ")" }}>
                            <div className="login-content">
                                <p className="sub-title"></p>
                                <h1 className="title">OnBoarding</h1>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-7 col-sm-12 mx-auto align-self-center">
                        <div className="org-form">
                            <h6 className="login-title"><span>Welcome</span></h6>
                            {success ?
                            <div className="card success-card">
                                <Result
                                    status="success"
                                    title="Successfully Organization Created!"
                                    extra={[
                                        <button onClick={gotoLogin} className="btn btn-primary sw-btn-next ms-1" key="buy">Goto Login</button>,
                                    ]}
                                />
                            </div> : 

                            <div className="form-wizard ">
                                <Stepper className="nav-wizard" activeStep={goSteps}>
                                    <Step className="nav-link" onClick={() => setGoSteps(0)} />
                                    <Step className="nav-link" onClick={() => setGoSteps(1)} />
                                </Stepper>
                                {goSteps === 0 && (
                                    <>
                                        <section>
                                            <div className="row">
                                                <div className="col-lg-6 mb-2">
                                                    <div className="form-group mb-3">
                                                        <label className="text-label">Organization Name*</label>
                                                        <input
                                                            type="text"
                                                            name="firstName"
                                                            className="form-control"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 mb-2">
                                                    <div className="form-group mb-3">
                                                        <label className="text-label">Organization Email*</label>
                                                        <input
                                                            type="text"
                                                            name="lastName"
                                                            className="form-control"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 mb-2">
                                                    <div className="form-group mb-3">
                                                        <label className="text-label">Provider*</label>
                                                        <Select options={options3} className="custom-react-select"
                                                            defaultValue={options3[0]}
                                                            isSearchable={false}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 mb-2">
                                                    <div className="form-group mb-3">
                                                        <label className="text-label">GST*</label>
                                                        <input
                                                            type="text"
                                                            name="phoneNumber"
                                                            className="form-control"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-12 mb-3">
                                                    <div className="form-group mb-3">
                                                        <label className="text-label">Address*</label>
                                                        <textarea
                                                            className="form-control"
                                                            id="val-suggestions"
                                                            name="val-suggestions"
                                                            rows="5"
                                                        ></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                        <div className="text-end toolbar toolbar-bottom p-2">
                                            <button className="btn btn-primary sw-btn-next" onClick={() => setGoSteps(1)}>Next</button>
                                        </div>
                                    </>
                                )}
                                {goSteps === 1 && (
                                    <>
                                        <section>
                                            <div className="row">
                                                <div className="col-lg-6 mb-2">
                                                    <div className="form-group mb-3">
                                                        <label className="text-label">Admin Name*</label>
                                                        <input
                                                            type="text"
                                                            name="firstName"
                                                            className="form-control"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 mb-2">
                                                    <div className="form-group mb-3">
                                                        <label className="text-label">Phone Number*</label>
                                                        <input
                                                            type="text"
                                                            name="lastName"
                                                            className="form-control"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 mb-2">
                                                    <div className="form-group mb-3">
                                                        <label className="text-label">Password*</label>
                                                        <input
                                                            type="text"
                                                            name="phoneNumber"
                                                            className="form-control"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 mb-2">
                                                    <div className="form-group mb-3">
                                                        <label className="text-label">Confirm Password*</label>
                                                        <input
                                                            type="text"
                                                            name="phoneNumber"
                                                            className="form-control"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                        <div className="text-end toolbar toolbar-bottom p-2">
                                            <button className="btn btn-secondary sw-btn-prev me-1" onClick={() => setGoSteps(0)}>Prev</button>
                                            <button className="btn btn-primary sw-btn-next ms-1" onClick={() => FinalStepSubmit(4)}>Submit</button>
                                        </div>
                                    </>
                                )}

                            </div>
                            }


                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}