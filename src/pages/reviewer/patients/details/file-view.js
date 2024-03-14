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
        getPatientDetails(orgId, tenId);
    }, []);


    const getPatientDetails = async (orgId, tenId) => {
        var patientId = localStorage.getItem("patientId");
        // const response = await axios.get(ENDPOINTS.apiEndoint + "dbservice/patient/compute/get?patientid=ambal&orgid=ambal");
        const response = await axios.get(ENDPOINTS.apiEndoint + `dbservice/patient/compute/get?patientid=${patientId}&orgid=${orgId}`);
        if (response.data) {
            var result = response.data;
            getPatientPdfFile(result.fileDetailDTO.azureBlobPath, tenId)

           
    
          } else {
            setIsLoading(false);
          }
    
        
      }


      const getPatientPdfFile = async (fileId, tenId) => {
        const response = await axios.get(ENDPOINTS.apiEndoint + `aiservice/ai/getfile?fileId=${fileId}&tenantId=${tenId}`);
        if (response.data) {
          var result = response.data;
          setSelectFileURL(response.data);
          setIsLoading(false);
    
        }
      }



    return (
        <>
            <div>
                <Header />
                <div class="content-body show menu-toggle no-sidebar">
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
                </div>
            </div>
        </>
    );
};

