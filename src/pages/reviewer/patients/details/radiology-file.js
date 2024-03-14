import React, { useState, useRef, useEffect } from "react";
import Header from "../../../../jsx/layouts/nav/Header";
import { useSelector } from "react-redux";
import axios from "../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../utility/enpoints";
import LoadingSpinner from "../../../../jsx/components/spinner/spinner";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";


export default function PatientDetails() {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const [isLoading, setIsLoading] = useState(true);    
    const [selectFileURL, setSelectFileURL] = useState([]);
    const [isDocumentLoaded, setDocumentLoaded] = React.useState(false);
    const handleDocumentLoad = () => {
        setDocumentLoaded(true);

    }







    useEffect(() => {
        var orgId = localStorage.getItem("orgId");
        var tenId = localStorage.getItem("tenantId");
        getPatientDetailsRadiology(orgId, tenId);
    }, []);


    const getPatientDetailsRadiology = async (orgId, tenId) => {
        var patientId = localStorage.getItem("patientId");
        const response = await axios.get(ENDPOINTS.apiEndoint + `dbservice/radiology/compute/get/radiology?patientid=${patientId}&orgid=${orgId}`);
        if (response.data) {
            var result = response.data;
            if (result.radiologyFileDetail != null) {
                getPatientPdfFileRadiology(result.radiologyFileDetail.azureBlobPath, tenId);
            }
          }
    }
 



    const getPatientPdfFileRadiology = async (fileId, tenId) => {
        const response = await axios.get(ENDPOINTS.apiEndoint + `aiservice/ai/getfile?fileId=${fileId}&tenantId=${tenId}`);
        if (response.data) {
            setSelectFileURL(response.data);
            setIsLoading(false);

        }
    }



    return (
        <>
            <div>
                <Header />
                <div class="content-body show menu-toggle no-sidebar">
                    {isLoading ? <LoadingSpinner /> :
                        <div className="container-fluid fileview-fluid">
                            <div className="row patient-file-container">
                                <div className="col-xl-12">
                                    <div className="card">
                                        <div className="card-body p-0">
                                            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
                                                <div
                                                    style={{
                                                        height: "100vh",
                                                        maxWidth: "1000px",
                                                        marginLeft: "auto",
                                                        marginRight: "auto",
                                                    }}
                                                >
                                                    {" "}
                                                    <Viewer
                                                        fileUrl={selectFileURL}
                                                        plugins={[defaultLayoutPluginInstance]}
                                                        onDocumentLoad={handleDocumentLoad}
                                                    />
                                                </div>
                                            </Worker>
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>
                    }
                </div>
            </div>
        </>
    );
};

