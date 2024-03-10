import React, { Fragment, useState } from "react";
import { Stepper, Step } from "react-form-stepper";
import Link from "next/link";
import ENDPOINTS from "../utility/enpoints";
import axios from "../utility/axiosConfig";
import { useRouter } from "next/router";
import LoginBack from "../images/logo/login-back.jpg";
import { notification } from "antd";
import Select from "react-select";
import { Result } from "antd";
import { useDispatch, useSelector } from "react-redux";
// import { dataStorage, loginAsync } from "../store/authslice";
import Form from 'react-bootstrap/Form';


export default function OnBoarding() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        address: "",
        gst: "",
        org_size: "",
        providerlist: [],
        password: "",
        confirmPassword: "",
        contact: "",
        userName: "",
        adminName: "",
        lastName: ""
    });

    const [providerList, setProviderList] = useState([]);
    const [errors, setErrors] = useState({ email: "", password: "" });
    const [password, setPassword] = useState("Zoon6363");
    const [isLoading, setIsLoading] = useState(false);
    const [goSteps, setGoSteps] = useState(0);
    const [success, setSuccess] = useState(false);
    const [validatedOrg, setValidatedOrg] = useState(false);
    const [validatedProvider, setValidatedProvider] = useState(false);
    const [validatedAdmin, setValidatedAdmin] = useState(false);


    const gotoLogin = async () => {
        router.push("/login");
    };

    const options3 = [
        { value: "1", label: "Provider 1" },
        { value: "2", label: "Provider 2" },
        { value: "3", label: "Provider 3" },
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        // console.log("Updated Form Data:", formData);
    };

    //org-creation
    const dispatch = useDispatch();



    const orgHandleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === true) {
            console.log(formData)
            setGoSteps(1);
        }
        setValidatedOrg(true);

    };

    const providerHandleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === true) {
            console.log(formData)
            setGoSteps(2);
        }
        setValidatedProvider(true);

    };

    const adminHandleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === true) {
            formData.providerlist = providerList;
            formData.userName = formData.userName;

            createOrganization(formData);
            console.log(formData);
            // setSuccess(true);

        }
        setValidatedAdmin(true);
        // var data = {
        //     "email":"techie12@gmail.com",
        //     "name":"techie12",
        //     "address":"test",
        //     "gst":"34.6",
        //     "org_size":"50",
        //     "providerlist": [1,2,3,7],
        //     "adminName": "admin",
        //     "contact":648384893,
        //     "password":"Test@1234566!2",
        //     "confirmPassword":"Test@1234566!2",
        //     "userName":"techie12",
        //     "lastName":"k v"
        // }
        // console.log(data);

        // createOrganization(data);



    };

    const providerOnChange = async (e) => {
        var providerIdsMap = [];
        e.map((data) => {
            providerIdsMap.push(parseInt(data.value));
        })
        console.log(providerIdsMap);
        setProviderList(providerIdsMap);

        // roleUpdate(data);
    }


    const createOrganization= async (data) => {
		setIsLoading(true);
		const response = await axios.post(ENDPOINTS.apiEndoint + `securityservice/auth/organization/create`, data);
        var result =response.data; 
		if (result.status === "SUCCESS") {
            setSuccess(true);
            notification.success({
                message: result.message
            });
		} else {
            notification.error({
                message: result.message
            });

		}
	}

    return (
        <div className="page-wraper">
            <div className="login-account">
                <div className="row h-100">
                    <div className="col-lg-6 align-self-start">
                        <div
                            className="account-info-area"
                            style={{ backgroundImage: "url(" + LoginBack + ")" }}
                        >
                            <div className="login-content">
                                <p className="sub-title"></p>
                                <h1 className="title">OnBoarding</h1>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-7 col-sm-12 mx-auto align-self-center">
                        <div className="org-form">
                            <h6 className="login-title">
                                <span>Welcome</span>
                            </h6>
                            {success ? (
                                <div className="card success-card">
                                    <Result
                                        status="success"
                                        title="Successfully Organization Created!"
                                        extra={[
                                            <button
                                                onClick={gotoLogin}
                                                className="btn btn-primary sw-btn-next ms-1"
                                                key="buy"
                                            >
                                                Goto Login
                                            </button>,
                                        ]}
                                    />
                                </div>
                            ) : (
                                <div className="form-wizard ">
                                    <Stepper className="nav-wizard" activeStep={goSteps}>
                                        <Step className="nav-link" onClick={() => setGoSteps(0)} />
                                        <Step className="nav-link" onClick={() => setGoSteps(1)} />
                                        <Step className="nav-link" onClick={() => setGoSteps(2)} />
                                    </Stepper>
                                    {goSteps === 0 && (
                                        <>
                                            <Form noValidate validated={validatedOrg} onSubmit={orgHandleSubmit}>
                                                <section>

                                                    <div className="row">
                                                        <div className="col-lg-6 mb-2">
                                                            <div className="form-group mb-3">
                                                                <label className="text-label">
                                                                    Organization Name*
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="name"
                                                                    className="form-control"
                                                                    required
                                                                    value={formData.name}
                                                                    onChange={handleInputChange}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 mb-2">
                                                            <div className="form-group mb-3">
                                                                <label className="text-label">
                                                                    Organization Email*
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="email"
                                                                    className="form-control"
                                                                    required
                                                                    value={formData.email}
                                                                    onChange={handleInputChange}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6 mb-2">
                                                            <div className="form-group mb-3">
                                                                <label className="text-label">
                                                                    Organization Size*
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    name="org_size"
                                                                    className="form-control"
                                                                    required
                                                                    value={formData.org_size}
                                                                    onChange={handleInputChange}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 mb-2">
                                                            <div className="form-group mb-3">
                                                                <label className="text-label">GST*</label>
                                                                <input
                                                                    type="number"
                                                                    name="gst"
                                                                    className="form-control"
                                                                    required
                                                                    value={formData.gst}
                                                                    onChange={handleInputChange}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-12 mb-3">
                                                            <div className="form-group mb-3">
                                                                <label className="text-label">Address*</label>
                                                                <textarea
                                                                    className="form-control"
                                                                    id="val-suggestions"
                                                                    name="address"
                                                                    rows="5"
                                                                    value={formData.address}
                                                                    onChange={handleInputChange}
                                                                    required
                                                                ></textarea>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </section>
                                                <div className="text-end toolbar toolbar-bottom p-2">
                                                    <button type='submit'
                                                        className="btn btn-primary sw-btn-next"

                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                            </Form>

                                        </>
                                    )}
                                    {goSteps === 1 && (
                                        <>
                                            <Form noValidate validated={validatedProvider} onSubmit={providerHandleSubmit}>
                                                <section>
                                                    <div className="col-lg-12 mb-2">
                                                        <div className="form-group mb-3">
                                                            <label className="text-label">Provider*</label>
                                                            <Select
                                                                options={options3}
                                                                className="custom-react-select"
                                                                isSearchable={false}
                                                                isMulti
                                                                onChange={(e) => providerOnChange(e)}
                                                            />
                                                        </div>
                                                    </div>
                                                </section>
                                                <div className="text-end toolbar toolbar-bottom p-2">
                                                    <button
                                                        className="btn btn-secondary sw-btn-prev me-1"
                                                        onClick={() => setGoSteps(0)}
                                                    >
                                                        Prev
                                                    </button>

                                                    <button type="submit"
                                                        className="btn btn-primary sw-btn-next"
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                            </Form>
                                        </>
                                    )}
                                    {goSteps === 2 && (
                                        <>
                                            <Form noValidate validated={validatedAdmin} onSubmit={adminHandleSubmit}>
                                                <section>
                                                    <div className="row">
                                                        <div className="col-lg-6 mb-2">
                                                            <div className="form-group mb-3">
                                                                <label className="text-label">FirstName*</label>
                                                                <input
                                                                    type="text"
                                                                    name="adminName"
                                                                    className="form-control"
                                                                    required
                                                                    value={formData.adminName}
                                                                    onChange={handleInputChange}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 mb-2">
                                                            <div className="form-group mb-3">
                                                                <label className="text-label">LastName*</label>
                                                                <input
                                                                    type="text"
                                                                    name="lastName"
                                                                    className="form-control"
                                                                    required
                                                                    value={formData.lastName}
                                                                    onChange={handleInputChange}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 mb-2">
                                                            <label className="text-label">
                                                                UserName*
                                                            </label>
                                                            <div className="input-group mb-3">

                                                                <input
                                                                    type="text"
                                                                    name="userName"
                                                                    className="form-control"
                                                                    required
                                                                    value={formData.userName}
                                                                    onChange={handleInputChange}
                                                                />
                                                                <span className="input-group-text">@encipherhealth.com</span>
                                                            </div>


                                                        </div>
                                                        <div className="col-lg-6 mb-2">
                                                            <div className="form-group mb-3">
                                                                <label className="text-label">
                                                                    Phone Number*
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    name="contact"
                                                                    className="form-control"
                                                                    required
                                                                    value={formData.contact}
                                                                    onChange={handleInputChange}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6 mb-2">
                                                            <div className="form-group mb-3">
                                                                <label className="text-label">Password*</label>
                                                                <input
                                                                    type="password"
                                                                    name="password"
                                                                    className="form-control"
                                                                    required
                                                                    value={formData.password}
                                                                    onChange={handleInputChange}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 mb-2">
                                                            <div className="form-group mb-3">
                                                                <label className="text-label">
                                                                    Confirm Password*
                                                                </label>
                                                                <input
                                                                    type="password"
                                                                    name="confirmPassword"
                                                                    className="form-control"
                                                                    required
                                                                    value={formData.confirmPassword}
                                                                    onChange={handleInputChange}
                                                                />
                                                                  <Form.Control.Feedback type="invalid">Looks good!</Form.Control.Feedback>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </section>
                                                <div className="text-end toolbar toolbar-bottom p-2">
                                                    <button
                                                        className="btn btn-secondary sw-btn-prev me-1"
                                                        onClick={() => setGoSteps(1)}
                                                    >
                                                        Prev
                                                    </button>
                                                    <button type="submit"
                                                        className="btn btn-primary sw-btn-next ms-1"
                                                    >
                                                        Submit
                                                    </button>
                                                </div>
                                            </Form>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
