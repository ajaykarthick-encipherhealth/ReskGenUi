import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import loadable from "@loadable/component";
import pMinDelay from "p-min-delay";
import Nav from "../jsx/layouts/nav";


//Import Components
import { SVGICON } from '../jsx/constant/theme';



export default function Dashboard(props) {


    return (
        <>
            <Nav />
            <div class="content-body">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xl-9 col-xxl-12">
                        <div className="row">
                            <div className="col-xl-12">
                                <div className="row">
                                    <div className="col-xl-3 col-sm-6">
                                        <div className="card">
                                            <div className="card-body depostit-card">
                                                <div className="depostit-card-media d-flex justify-content-between style-1">
                                                    <div>
                                                        <h6>Tasks Not Finisheds</h6>
                                                        <h3>20</h3>
                                                    </div>
                                                    <div className="icon-box bg-secondary">
                                                        {SVGICON.Shiled}
                                                    </div>
                                                </div>
                                                <div className="progress-box mt-0">
                                                    <div className="d-flex justify-content-between">
                                                        <p className="mb-0">Complete Task</p>
                                                        <p className="mb-0">20/28</p>
                                                    </div>
                                                    <div className="progress">
                                                        <div className="progress-bar bg-secondary" style={{ width: "50%", height: "5px", borderRadius: "4px" }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-3 col-sm-6">
                            <div className="card">
                                <div className="card-body">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className={`icon-box icon-box-lg rounded-circle bg-success-light`} >
                                        {SVGICON.Shiled}             
                                        </div>
                                        <div className="total-projects ms-3">
                                            <h3 className={`count text-success`}>200</h3> 
                                            <span>Completed</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                                    <div className="col-xl-3 col-sm-6">
                                        <div className="card">
                                            <div className="card-body depostit-card">
                                                <div className="depostit-card-media d-flex justify-content-between style-1">
                                                    <div>
                                                        <h6>Tasks Not Finisheds</h6>
                                                        <h3>20</h3>
                                                    </div>
                                                    <div className="icon-box bg-secondary">
                                                        {SVGICON.Shiled}
                                                    </div>
                                                </div>
                                                <div className="progress-box mt-0">
                                                    <div className="d-flex justify-content-between">
                                                        <p className="mb-0">Complete Task</p>
                                                        <p className="mb-0">20/28</p>
                                                    </div>
                                                    <div className="progress">
                                                        <div className="progress-bar bg-secondary" style={{ width: "50%", height: "5px", borderRadius: "4px" }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-3 col-sm-6">
                                        <div className="card">
                                            <div className="card-body depostit-card">
                                                <div className="depostit-card-media d-flex justify-content-between style-1">
                                                    <div>
                                                        <h6>Tasks Not Finisheds</h6>
                                                        <h3>20</h3>
                                                    </div>
                                                    <div className="icon-box bg-secondary">
                                                        {SVGICON.Shiled}
                                                    </div>
                                                </div>
                                                <div className="progress-box mt-0">
                                                    <div className="d-flex justify-content-between">
                                                        <p className="mb-0">Complete Task</p>
                                                        <p className="mb-0">20/28</p>
                                                    </div>
                                                    <div className="progress">
                                                        <div className="progress-bar bg-secondary" style={{ width: "50%", height: "5px", borderRadius: "4px" }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-3 col-sm-6">
                                        <div className="card">
                                            <div className="card-body depostit-card">
                                                <div className="depostit-card-media d-flex justify-content-between style-1">
                                                    <div>
                                                        <h6>Tasks Not Finisheds</h6>
                                                        <h3>20</h3>
                                                    </div>
                                                    <div className="icon-box bg-secondary">
                                                        {SVGICON.Shiled}
                                                    </div>
                                                </div>
                                                <div className="progress-box mt-0">
                                                    <div className="d-flex justify-content-between">
                                                        <p className="mb-0">Complete Task</p>
                                                        <p className="mb-0">20/28</p>
                                                    </div>
                                                    <div className="progress">
                                                        <div className="progress-bar bg-secondary" style={{ width: "50%", height: "5px", borderRadius: "4px" }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        
        </>
    )
}
