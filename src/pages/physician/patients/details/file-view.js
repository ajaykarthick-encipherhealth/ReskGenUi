import React, { useState, useRef, useEffect } from "react";
import { Tab, Nav, Badge } from "react-bootstrap";
import NavBar from "../../../../jsx/layouts/nav";
import Header from "../../../../jsx/layouts/nav/Header";
import { useSelector } from "react-redux";
import axios from "../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../utility/enpoints";
import LoadingSpinner from "../../../../jsx/components/spinner/spinner";

import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faCheck, faAdd, faInfo, faIdBadge } from "@fortawesome/free-solid-svg-icons";
import { Popconfirm, Divider, Popover, } from "antd";
import { IMAGES, SVGICON } from "../../../../jsx/constant/theme";
import Select from 'react-select';
import { Modal } from "antd";
import { Button } from 'react-bootstrap';
import { Space, Spin } from 'antd';
// import { searchPlugin ,NextIcon, PreviousIcon, RenderSearchProps,} from '@react-pdf-viewer/search';
import { Icon, MinimalButton, Position, Tooltip } from '@react-pdf-viewer/core';
import { NextIcon, PreviousIcon, RenderSearchProps, searchPlugin } from '@react-pdf-viewer/search';
import Form from 'react-bootstrap/Form';
import { Offcanvas } from "react-bootstrap";
import {
    InfoCircleOutlined, EyeInvisibleOutlined
} from '@ant-design/icons';
import Link from 'next/link';







export default function PatientDetails() {

    let searchKeywords = [];

    // const searchPluginInstance = searchPlugin({
    //   // keyword: [
    //   //   'document',
    //   //   {
    //         keyword: 'Assessment',
    //         matchCase: true,
    //     // },
    // // ],
    // })



    const searchPluginInstance = searchPlugin({
        // keyword: 'Plan / Discussion',
        matchCase: true,
        wholeWords: true
    });
    const { highlight, Search } = searchPluginInstance;
    const { ShowSearchPopoverButton } = searchPluginInstance;
    const [searchPluginInstanceLocal, setSearchPluginInstanceLocal] = useState(searchPluginInstance);

    const sideMenu = useSelector(state => state.sideMenu);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isModalOpenValid, setIsModalOpenValid] = useState(false);
    const [confirmNotesModalValid, setConfirmNotesModalValid] = useState(false);
    const [confirmNotesModalInValid, setConfirmNotesModalInValid] = useState(false);

    const storePatientDetails = useSelector(state => state.patientDetails.patientDetails);
    const storeDetails = useSelector(state => state);

    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingSection, setIsLoadingSection] = useState(true);
    const [invalidDiseasesList, setInvalidDiseasesList] = useState([]);
    const [invalidMoveDiseasesList, setInvalidMoveDiseasesList] = useState([]);
    const [comboDiseaseCodesList, setComboDiseaseCodesList] = useState([]);
    const [invalidComboDiseaseCodesList, setInvalidComboDiseaseCodesList] = useState([]);

    const [validDiseasesList, setValidDiseasesList] = useState([]);
    const [selectDiseasesName, setSelectDiseasesName] = useState("");
    const [meatCriteriaList, setMeatCriteriaList] = useState([]);
    const [invalidMeatCriteriaList, setInvalidMeatCriteriaList] = useState([]);
    const [selectCode, setSelectCode] = useState('');
    const [dosYear, setDosYear] = useState('');
    const [dosYearDefalutSelect, setDosYearDefalutSelect] = useState('');
    const [localOrgId, setLocalOrgId] = useState('');
    const [localTenantId, setLocalTenantId] = useState('');
    const [selectMeatFileId, setSelectMeatFileId] = useState('');
    const [selectMeatName, setSelectMeatName] = useState('');
    const [sectionList, setSectionList] = useState([]);
    const [patientDocumentResult, setPatientDocumentResult] = useState([]);
    const [selectFileURL, setSelectFileURL] = useState([]);
    const [validated, setValidated] = useState(false);
    const [rafScore, setRAFScore] = useState([]);
    const [patientDetails, setPatientDetails] = useState([]);
    const [rafHccList, setRafScoreHccList] = useState([]);
    const [isMatchBtn, setIsMatchBtn] = useState(false);
    const [matchHccList, setMatchHccList] = useState([]);
    const [newValidDiseaseList, setNewValidDiseaseList] = useState([]);
    const [newInValidDiseaseList, setInNewValidDiseaseList] = useState([]);
    const [unMatchResList, setNewUnMatchHccList] = useState([]);
    const [meatColorCodeList, setMeatColorCodeList] = useState([]);

    const [dbDescriptionRes, setDbDescriptionRes] = useState([]);

    const [openPopover, setOpenPopover] = useState(false);

    const [activeTab, setActiveTab] = useState(1);
    const [activeTabHead, setActiveTabHead] = useState("file");



    const [unmatchHccListRadiology, setUnMatchHccListRadiology] = useState([]);
    const [newValidDiseaseListRadiology, setNewValidDiseaseListRadiology] = useState([]);
    const [newInValidDiseaseListRadiology, setInNewValidDiseaseListRadiology] = useState([]);
    const [comboDiseaseCodesListRadiology, setComboDiseaseCodesListRadiology] = useState([]);
    const [meatCriteriaListRadiology, setMeatCriteriaListRadiology] = useState([]);
    const [selectFileURLRadiology, setSelectFileURLRadiology] = useState([]);
    const [isModalOpenRadiology, setIsModalOpenRadiology] = useState(false);
    const [radiologyResCheck, setRadiologyResCheck] = useState(false);
    const [radiologyFileProcessing, setRadiologyFileProcessing] = useState("Please wait file processing...");


    const [isLoadingBtn, setIsLoadingBtn] = useState(false);
    const [addPatient, setAddPatient] = useState(false);
    const [inputValue, setInputValue] = useState({
        year: "",
        name: "",
        patientId: "",
    });

    const [selectFileRadiology, setSelectFileRadiology] = useState(null);
    const [localUserId, setLocalUserId] = useState('');





    const handleChange = async (e) => {
        const key = e.target.name;
        const value = e.target.value;
        setInputValue({ ...inputValue, [key]: value });
    };



    const hidePopover = () => {
        setOpenPopover(false);
    };

    const handleOpenChangePopover = (newOpen) => {
        setOpenPopover(newOpen);
    };


    //   highlight([
    //     'document',
    //     {
    //         keyword: 'PDF',
    //         matchCase: true,
    //     },
    // ]);

    const [isDocumentLoaded, setDocumentLoaded] = React.useState(false);
    const handleDocumentLoad = () => {
        setDocumentLoaded(true);
        // setTimeout(() => {
        //   highlight({
        //     keyword: selectDiseasesName,
        //     matchCase: true,
        //   });
        // }, 6000);

    }

    const changeSearch = () => {
        //   searchPlugin({
        //     keyword: 'BMP',
        //     matchCase: true,
        // });
        setDocumentLoaded(true);
        setTimeout(() => {
            highlight({
                keyword: 'BMP',
                matchCase: true,
            });
        }, 1000);

    }







    useEffect(() => {

        var orgId = localStorage.getItem("orgId");
        var tenId = localStorage.getItem("tenantId");
        setLocalOrgId(orgId);
        getPatientDetails(orgId, tenId);
        // getPatientDetailsRadiology(orgId, tenId);
        setLocalTenantId(tenId);

        var uId = localStorage.getItem("userId");
        setLocalUserId(uId);

        //   if (isDocumentLoaded) {
        //     enableShortcuts({
        //         keyword: 'Coverage for Jeffrey She',
        //         matchCase: true,
        //     });
        // }
    }, []);

    const getPatientDetails = async (orgId, tenId) => {
        var patientId = localStorage.getItem("patientId");
        // const response = await axios.get(ENDPOINTS.apiEndoint + "dbservice/patient/compute/get?patientid=ambal&orgid=ambal");
        const response = await axios.get(ENDPOINTS.apiEndoint + `dbservice/patient/compute/get?patientid=${patientId}&orgid=${orgId}`);
        if (response.data) {
            var result = response.data;
            setPatientDetails(result);
            if (result.validDisease != null) {
                console.log(result)
                var validDis = '';
                var invalidDis = '';
                var comboDis = '';
                var meatCri = '';
                var dosYearArr = [];
                var rafScore = null;
                var validDiseaseNewRes = [];
                var invalidDiseaseNewRes = [];
                var unMatchRes = [];
                var meatCriColorTagList = [];
                getPatientPdfFile(result.fileDetailDTO.azureBlobPath, tenId)
                setSelectMeatFileId(response.data.fileId)
                setPatientDocumentResult(result);

                for (var key in response.data.validDisease) {
                    dosYearArr.push({ value: key, label: key });
                }

                const highestDOS = Math.max(...dosYearArr.map(res => res.value));

                const highestDosValue = dosYearArr.filter((i) => parseInt(i.value) === highestDOS);
                setDosYearDefalutSelect(highestDosValue);



                var validDiseaseNew = {
                    "2019": [
                        {
                            "diagnosisCode": "I6523",
                            "actualDescription": "Occlusion and stenosis of bilateral carotid arteries",
                            "dbDescription": "Occlusion and stenosis of bilateral carotid arteries - DB"
                        },
                        {
                            "diagnosisCode": "I70209",
                            "actualDescription": "Unspecified atherosclerosis of native arteries of extremities, unspecified extremity",
                            "dbDescription": "Unspecified atherosclerosis of native arteries of extremities, unspecified extremity- DB"
                        },
                        {
                            "diagnosisCode": "I712",
                            "actualDescription": "Thoracic aortic aneurysm, without rupture",
                            "dbDescription": "Thoracic aortic aneurysm, without rupture- DB"
                        },
                        {
                            "diagnosisCode": "I119",
                            "actualDescription": "Hypertensive heart disease without heart failure",
                            "dbDescription": 'Hypertensive heart disease without heart failure -DB'
                        }
                    ]
                }




                if (result.rafScore != null) {
                    rafScore = result.rafScore[highestDOS]
                }

                validDis = result.validDisease[highestDOS];
                validDiseaseNewRes = result.validDisease[highestDOS];
                invalidDiseaseNewRes = result.invalidDisease[highestDOS];
                if (result.unmatchedDisease != null) {
                    var unMatchResCheck = result.unmatchedDisease[highestDOS]

                    if (unMatchResCheck != null) {
                        unMatchRes = result.unmatchedDisease[highestDOS]

                    }
                }


                invalidDis = result.invalidDisease[highestDOS];
                comboDis = result.comboDisease[highestDOS];
                meatCri = result.meatCriteria[highestDOS];

                // validDiseaseNewRes = validDiseaseNew[2019]

                var invalidDiseasesArray = [];
                var validDiseasesArray = [];

                for (var key in invalidDis) {
                    invalidDiseasesArray.push({ name: invalidDis[key] });
                }
                for (var key in validDis) {
                    validDiseasesArray.push({ name: validDis[key] });
                }







                // for (var key in result.validDisease) {
                //   validDis = result.validDisease[key];
                //   if (result.rafScore != null) {
                //     rafScore = result.rafScore[key]
                //   }
                // }
                // for (var key in result.invalidDisease) {
                //   invalidDis = result.invalidDisease[key];
                // }
                // for (var key in result.comboDisease) {
                //   comboDis = result.comboDisease[key];
                // }
                // for (var key in result.meatCriteria) {
                //   meatCri = result.meatCriteria[key];
                // }

                // var invalidDiseasesArray = [];
                // var validDiseasesArray = [];

                // for (var key in invalidDis) {
                //   invalidDiseasesArray.push({ name: invalidDis[key] });
                // }
                // for (var key in validDis) {
                //   validDiseasesArray.push({ name: validDis[key] });
                // }



                setNewValidDiseaseList(validDiseaseNewRes);
                setInNewValidDiseaseList(invalidDiseaseNewRes);
                setNewUnMatchHccList(unMatchRes)
                setValidDiseasesList(validDiseasesArray);
                setInvalidDiseasesList(invalidDiseasesArray);
                setComboDiseaseCodesList(comboDis);
                // setMeatCriteriaList(meatCri);
                setDosYear(dosYearArr);
                setRAFScore(rafScore)

                const COLORS = ['bg-bg-seven', 'bg-third', 'bg-bg-four', 'bg-bg-five', 'bg-bg-six', 'bg-bg-eight', 'bg-bg-nine', 'bg-bg-ten', 'bg-bg-leven'];

                var meatListArr = [];
                var meatMoniterHead = [];
                var meatEvaluteHead = [];
                var meatAssesmentHead = [];
                var meatTreatMentHead = [];
                var allMeatHead = [];
                var allMeatHeadColorArr = [];
                var allMeatHeadColor = [];
                var dublicateRemoveSecondArr = [];



                meatCri.map((res, index) => {
                    if (res.monitorCapturedFromHeader != "") {
                        meatMoniterHead.push({
                            header: res.monitorCapturedFromHeader,
                        })
                    }
                    if (res.evaluateCapturedFromHeader != "") {
                        meatEvaluteHead.push({
                            header: res.evaluateCapturedFromHeader
                        })
                    }
                    if (res.assessmentCapturedFromHeader != "") {
                        meatAssesmentHead.push({
                            header: res.assessmentCapturedFromHeader
                        })
                    }
                    if (res.treatmentCapturedFromHeader != "") {
                        meatTreatMentHead.push({
                            header: res.treatmentCapturedFromHeader
                        });
                    }
                    var newArray = [];
                    newArray = [...allMeatHead, ...meatMoniterHead, ...meatEvaluteHead, ...meatAssesmentHead, ...meatTreatMentHead];
                    var dublicateRemoveArr = getUniqueListBy(newArray, 'header');
                    dublicateRemoveArr.map((res3, index) => {

                        allMeatHeadColor.push({
                            header: res3.header,
                            color: COLORS[index]
                        })
                    })
                    allMeatHeadColorArr = allMeatHeadColor;

                    dublicateRemoveSecondArr = getUniqueListBy(allMeatHeadColor, 'header');
                    setMeatColorCodeList(dublicateRemoveSecondArr)
                })


                meatCri.map((res, index) => {
                    meatListArr.push({
                        diagnosisCode: res.diagnosisCode,
                        diseaseName: res.diseaseName,
                        monitorCapturedFromHeader: res.monitorCapturedFromHeader,
                        assessmentCapturedFromHeader: res.assessmentCapturedFromHeader,
                        evaluateCapturedFromHeader: res.evaluateCapturedFromHeader,
                        treatmentCapturedFromHeader: res.treatmentCapturedFromHeader,
                        monitorCapturedFromHeaderColor: colorCodeMatch(dublicateRemoveSecondArr, res.monitorCapturedFromHeader),
                        assessmentCapturedFromHeaderColor: colorCodeMatch(dublicateRemoveSecondArr, res.assessmentCapturedFromHeader),
                        evaluateCapturedFromHeaderColor: colorCodeMatch(dublicateRemoveSecondArr, res.evaluateCapturedFromHeader),
                        treatmentCapturedFromHeaderColor: colorCodeMatch(dublicateRemoveSecondArr, res.treatmentCapturedFromHeader),
                        monitorColor: COLORS[index],
                        meatColor: COLORS[index],
                        assessment: res.assessment,
                        monitor: res.monitor,
                        evaluate: res.evaluate,
                        treatment: res.treatment,
                        isMeatCriteriaPresent: res.isMeatCriteriaPresent,
                    })
                })
                setMeatCriteriaList(meatListArr);
                // setIsLoading(false);

            } else {
                setIsLoading(false);
            }

        }
    }

    const getPatientDetailsRadiology = async (orgId, tenId) => {
        var patientId = localStorage.getItem("patientId");
        const response = await axios.get(ENDPOINTS.apiEndoint + `dbservice/radiology/compute/get/radiology?patientid=${patientId}&orgid=${orgId}`);
        if (response.data) {
            setRadiologyResCheck(true);
            var result = response.data;
            console.log(result.validDisease)
            if (result.radiologyFileDetail != null) {
                getPatientPdfFileRadiology(result.radiologyFileDetail.azureBlobPath, tenId);
            }
            if (result.validDisease != null) {
                setNewValidDiseaseListRadiology(result.validDisease);
            }
            if (result.invalidDisease != null) {
                setInNewValidDiseaseListRadiology(result.invalidDisease);
            }

            if (result.comboDisease != null) {
                setComboDiseaseCodesListRadiology(result.comboDisease)
            }
            if (result.meatCriteria != null) {
                var meatCri = result.meatCriteria;

                const COLORS = ['bg-bg-seven', 'bg-third', 'bg-bg-four', 'bg-bg-five', 'bg-bg-six', 'bg-bg-eight', 'bg-bg-nine', 'bg-bg-ten', 'bg-bg-leven'];

                var meatListArr = [];
                var meatMoniterHead = [];
                var meatEvaluteHead = [];
                var meatAssesmentHead = [];
                var meatTreatMentHead = [];
                var allMeatHead = [];
                var allMeatHeadColorArr = [];
                var allMeatHeadColor = [];
                var dublicateRemoveSecondArr = [];



                meatCri.map((res, index) => {
                    if (res.monitorCapturedFromHeader != "") {
                        meatMoniterHead.push({
                            header: res.monitorCapturedFromHeader,
                        })
                    }
                    if (res.evaluateCapturedFromHeader != "") {
                        meatEvaluteHead.push({
                            header: res.evaluateCapturedFromHeader
                        })
                    }
                    if (res.assessmentCapturedFromHeader != "") {
                        meatAssesmentHead.push({
                            header: res.assessmentCapturedFromHeader
                        })
                    }
                    if (res.treatmentCapturedFromHeader != "") {
                        meatTreatMentHead.push({
                            header: res.treatmentCapturedFromHeader
                        });
                    }
                    var newArray = [];
                    newArray = [...allMeatHead, ...meatMoniterHead, ...meatEvaluteHead, ...meatAssesmentHead, ...meatTreatMentHead];
                    var dublicateRemoveArr = getUniqueListBy(newArray, 'header');
                    dublicateRemoveArr.map((res3, index) => {

                        allMeatHeadColor.push({
                            header: res3.header,
                            color: COLORS[index]
                        })
                    })
                    allMeatHeadColorArr = allMeatHeadColor;

                    dublicateRemoveSecondArr = getUniqueListBy(allMeatHeadColor, 'header');
                    setMeatColorCodeList(dublicateRemoveSecondArr)
                });

                meatCri.map((res, index) => {
                    meatListArr.push({
                        diagnosisCode: res.diagnosisCode,
                        diseaseName: res.diseaseName,
                        monitorCapturedFromHeader: res.monitorCapturedFromHeader,
                        assessmentCapturedFromHeader: res.assessmentCapturedFromHeader,
                        evaluateCapturedFromHeader: res.evaluateCapturedFromHeader,
                        treatmentCapturedFromHeader: res.treatmentCapturedFromHeader,
                        monitorCapturedFromHeaderColor: colorCodeMatch(dublicateRemoveSecondArr, res.monitorCapturedFromHeader),
                        assessmentCapturedFromHeaderColor: colorCodeMatch(dublicateRemoveSecondArr, res.assessmentCapturedFromHeader),
                        evaluateCapturedFromHeaderColor: colorCodeMatch(dublicateRemoveSecondArr, res.evaluateCapturedFromHeader),
                        treatmentCapturedFromHeaderColor: colorCodeMatch(dublicateRemoveSecondArr, res.treatmentCapturedFromHeader),
                        monitorColor: COLORS[index],
                        meatColor: COLORS[index],
                        assessment: res.assessment,
                        monitor: res.monitor,
                        evaluate: res.evaluate,
                        treatment: res.treatment,
                        isMeatCriteriaPresent: res.isMeatCriteriaPresent,
                    })
                })
                setMeatCriteriaListRadiology(meatListArr);

                // setMeatCriteriaListRadiology(result.meatCriteria)
            }
            if (result.unmatchedDisease != null) {
                setUnMatchHccListRadiology(result.unmatchedDisease)
            }
            // setPatientDetails(result);


        }
    }
    function getUniqueListBy(arr, key) {
        return [...new Map(arr.map(item => [item[key], item])).values()]
    }

    function colorCodeMatch(arrList, key) {
        var colorReturnValue = null;
        const result = arrList.filter(
            (res) => res.header == key
        );
        if (result[0] != undefined) {
            colorReturnValue = result[0].color
        }


        return colorReturnValue;
    }

    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];

        }
        console.log(color)
        return color;
    }


    const getPatientPdfFile = async (fileId, tenId) => {
        const response = await axios.get(ENDPOINTS.apiEndoint + `aiservice/ai/getfile?fileId=${fileId}&tenantId=${tenId}`);
        if (response.data) {
            var result = response.data;
            setSelectFileURL(response.data);
            setIsLoading(false);

        }
    }

    const getPatientPdfFileRadiology = async (fileId, tenId) => {
        const response = await axios.get(ENDPOINTS.apiEndoint + `aiservice/ai/getfile?fileId=${fileId}&tenantId=${tenId}`);
        if (response.data) {
            var result = response.data;
            setSelectFileURLRadiology(response.data);
            setIsLoading(false);

        }
    }

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




    const confirmvalid = () =>
        new Promise((resolve) => {
            // validMoveConfirm();

            setTimeout(() => resolve(
                setConfirmNotesModalValid(true)
            ),
                1000);
        });
    const confirmInvalid = () =>
        new Promise((resolve) => {
            // invalidMoveConfirm();
            setTimeout(() => resolve(setConfirmNotesModalInValid(true)), 1000);
        });

    const confirmInvalidMoveDis = () =>
        new Promise((resolve) => {
            validMoveConfirmDis();
            setTimeout(() => resolve(null), 1000);
        });

    const confirmCombo = () =>
        new Promise((resolve) => {
            comboMoveConfirm();
            setTimeout(() => resolve(null), 1000);
        });

    const confirmComboInvalid = () =>
        new Promise((resolve) => {
            comboMoveInvalidConfirm();
            setTimeout(() => resolve(null), 1000);
        });

    const confirmComboValid = () =>
        new Promise((resolve) => {
            comboMoveValidConfirm();
            setTimeout(() => resolve(null), 1000);
        });


    const confirmInvalidMeat = () =>
        new Promise((resolve) => {
            meatMoveInvalidConfirm();
            setTimeout(() => resolve(null), 1000);
        });

    const confirmValidMeat = () =>
        new Promise((resolve) => {
            meatMoveValidConfirm();
            setTimeout(() => resolve(null), 1000);
        });



    const confirmMeat = () =>
        new Promise((resolve) => {
            meatMoveConfirm();
            setTimeout(() => resolve(null), 1000);
        });

    const onchangeValid = (data) => {
        setSelectDiseasesName(data);
    };

    const onchangeCombo = (data, code) => {
        setSelectDiseasesName(data);
        setSelectCode(code);
    };
    const onchangeMeat = (data, code) => {
        setSelectDiseasesName(data);
        setSelectCode(code);
    };

    const validMoveConfirm = () => {

        const result = newValidDiseaseList.filter(
            (res) => res.diagnosisCode != selectDiseasesName
        );
        setNewValidDiseaseList(result);
        const result2 = newValidDiseaseList.filter(
            (res2) => res2.diagnosisCode == selectDiseasesName
        );


        // var namePush = [];
        // namePush.push({ name: selectDiseasesName });
        var newArray = [];
        newArray = [...invalidMoveDiseasesList, ...result2];
        setInvalidMoveDiseasesList(newArray);


        // const result = validDiseasesList.filter(
        //   (res) => res.name != selectDiseasesName
        // );
        // setValidDiseasesList(result);
        // var namePush = [];
        // namePush.push({ name: selectDiseasesName });
        // var newArray = [];
        // newArray = [...invalidDiseasesList, ...namePush];
        // setInvalidDiseasesList(newArray);
    };


    const invalidMoveConfirm = () => {
        const result = newInValidDiseaseList.filter(
            (res) => res.diagnosisCode != selectDiseasesName
        );
        setInNewValidDiseaseList(result);

        const result2 = newInValidDiseaseList.filter(
            (res2) => res2.diagnosisCode == selectDiseasesName
        );
        var namePush = [];
        namePush.push({ name: selectDiseasesName });
        var newArray = [];
        newArray = [...newValidDiseaseList, ...result2];
        setNewValidDiseaseList(newArray);
    };

    const validMoveConfirmDis = () => {
        const result = invalidMoveDiseasesList.filter(
            (res) => res.diagnosisCode != selectDiseasesName
        );
        setInvalidMoveDiseasesList(result);
        const result2 = invalidMoveDiseasesList.filter(
            (res2) => res2.diagnosisCode == selectDiseasesName
        );
        // var namePush = [];
        // namePush.push({ name: selectDiseasesName });
        var newArray = [];
        newArray = [...newValidDiseaseList, ...result2];
        setNewValidDiseaseList(newArray);
    };

    const comboMoveInvalidConfirm = () => {
        const result = comboDiseaseCodesList.filter(
            (res) => res.diseaseName != selectDiseasesName
        );
        const result2 = comboDiseaseCodesList.filter(
            (res) => res.diseaseName == selectDiseasesName
        );
        setComboDiseaseCodesList(result);
        var namePush = [];
        namePush.push({ name: selectCode + " - " + selectDiseasesName });
        var newArray = [];
        newArray = [...invalidComboDiseaseCodesList, ...result2];
        setInvalidComboDiseaseCodesList(newArray);
    };


    const comboMoveValidConfirm = () => {
        const result = invalidComboDiseaseCodesList.filter(
            (res) => res.diseaseName != selectDiseasesName
        );
        setInvalidComboDiseaseCodesList(result);
        const result2 = invalidComboDiseaseCodesList.filter(
            (res) => res.diseaseName == selectDiseasesName
        );
        var newArray = [];
        newArray = [...comboDiseaseCodesList, ...result2];
        setComboDiseaseCodesList(newArray);
    };



    const meatMoveInvalidConfirm = () => {
        const result = meatCriteriaList.filter(
            (res) => res.diseaseName != selectDiseasesName
        );
        const result2 = meatCriteriaList.filter(
            (res) => res.diseaseName == selectDiseasesName
        );
        setMeatCriteriaList(result);
        var newArray = [];
        newArray = [...invalidMeatCriteriaList, ...result2];
        setInvalidMeatCriteriaList(newArray);
    };


    const meatMoveValidConfirm = () => {
        const result = invalidMeatCriteriaList.filter(
            (res) => res.diseaseName != selectDiseasesName
        );
        setInvalidMeatCriteriaList(result);
        const result2 = invalidMeatCriteriaList.filter(
            (res) => res.diseaseName == selectDiseasesName
        );
        var newArray = [];
        newArray = [...meatCriteriaList, ...result2];
        setMeatCriteriaList(newArray);
    };



    const meatMoveConfirm = () => {
        const result = meatCriteriaList.filter(
            (res) => res.diseaseName != selectDiseasesName
        );
        setMeatCriteriaList(result);
        var namePush = [];
        namePush.push({ name: selectCode + " - " + selectDiseasesName });
        var newArray = [];
        newArray = [...invalidDiseasesList, ...namePush];
        setInvalidMeatCriteriaList(newArray);

    };


    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsModalOpenValid(false);
        setConfirmNotesModalValid(false);
        setConfirmNotesModalInValid(false);
        setIsModalOpenRadiology(false);
    };
    const handleOpenModal = (value, disDescription) => {
        var splitPoint = disDescription.substring(' ', 40);
        setTimeout(() => {
            highlight({
                keyword: splitPoint,
                matchCase: true,
                // wholeWords:true
            });
            var dataset = value + " - (" + disDescription + ")"
            setSelectMeatName(dataset);
        }, 2000);
        setDocumentLoaded(true);
        var dataset = value + " - (" + disDescription + ")"
        // setSelectMeatName(dataset);
        setSelectMeatName(dataset + " -  " + "Loading...");
        setIsLoadingSection(true);
        setIsModalOpen(true);
        // setIsModalOpenValid(true)
        // getSectionResult(value.toLowerCase());
    };
    const handleOpenModalRadiology = (value, disDescription) => {
        var splitPoint = disDescription.substring(' ', 40);
        setTimeout(() => {
            highlight({
                keyword: splitPoint,
                matchCase: true,
                // wholeWords:true
            });
            var dataset = value + " - (" + disDescription + ")"
            setSelectMeatName(dataset);
        }, 2000);
        setDocumentLoaded(true);
        var dataset = value + " - (" + disDescription + ")"
        // setSelectMeatName(dataset);
        setSelectMeatName(dataset + " -  " + "Loading...");
        setIsLoadingSection(true);
        setIsModalOpenRadiology(true);
        // setIsModalOpenValid(true)
        // getSectionResult(value.toLowerCase());
    };

    const getSectionResult = async (value) => {
        var apiUrl = `dbservice/patient/compute/getsection?fileid=cbd48813-3f9c-4cc9-9882-1db87fdd1ffb&section=${value}`;
        const response = await axios.get(ENDPOINTS.apiEndoint + apiUrl);
        var result = response.data;
        if (response.data) {
            setSectionList(response.data);
            setIsLoadingSection(false);
        }
    }

    const onChangeFile = (e) => {
        let value = URL.createObjectURL(e[0]);

        setSelectFileURL(value);
    };

    const addValidDiseases = () => {
        setIsModalOpenValid(true)
    };

    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === true) {

        }
        setValidated(true)
    }

    const handleSubmitValidNotes = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === true) {
            setConfirmNotesModalValid(false);
            validMoveConfirm();

        }
        setValidated(true)
    }

    const handleSubmitValiInValiddNotes = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === true) {
            setConfirmNotesModalInValid(false);
            invalidMoveConfirm();

        }
        setValidated(true)
    }






    const dosOnChange = async (e) => {
        var dosKeyValue = e.value;
        var validDis = '';
        var invalidDis = '';
        var comboDis = '';
        var meatCri = '';
        var rafScore = null;
        var validDiseaseNewRes = [];
        var invalidDiseaseNewRes = [];

        var result = patientDetails;




        if (result.rafScore != null) {
            rafScore = result.rafScore[dosKeyValue]
        }

        validDis = result.validDisease[dosKeyValue];
        validDiseaseNewRes = result.validDisease[dosKeyValue];
        invalidDiseaseNewRes = result.invalidDisease[dosKeyValue];

        invalidDis = result.invalidDisease[dosKeyValue];
        comboDis = result.comboDisease[dosKeyValue];
        meatCri = result.meatCriteria[dosKeyValue];

        var invalidDiseasesArray = [];
        var validDiseasesArray = [];

        for (var key in invalidDis) {
            invalidDiseasesArray.push({ name: invalidDis[key] });
        }
        for (var key in validDis) {
            validDiseasesArray.push({ name: validDis[key] });
        }

        setNewValidDiseaseList(validDiseaseNewRes);
        setInNewValidDiseaseList(invalidDiseaseNewRes);
        setValidDiseasesList(validDiseasesArray);
        setInvalidDiseasesList(invalidDiseasesArray);
        setComboDiseaseCodesList(comboDis);
        // setMeatCriteriaList(meatCri);
        setRAFScore(rafScore)

        const COLORS = ['bg-bg-seven', 'bg-third', 'bg-bg-four', 'bg-bg-five', 'bg-bg-six', 'bg-bg-eight', 'bg-bg-nine'];

        var meatListArr = [];
        var meatMoniterHead = [];
        var meatEvaluteHead = [];
        var meatAssesmentHead = [];
        var meatTreatMentHead = [];
        var allMeatHead = [];
        var allMeatHeadColorArr = [];
        var allMeatHeadColor = [];
        var dublicateRemoveSecondArr = [];



        meatCri.map((res, index) => {
            if (res.monitorCapturedFromHeader != "") {
                meatMoniterHead.push({
                    header: res.monitorCapturedFromHeader,
                })
            }
            if (res.evaluateCapturedFromHeader != "") {
                meatEvaluteHead.push({
                    header: res.evaluateCapturedFromHeader
                })
            }
            if (res.assessmentCapturedFromHeader != "") {
                meatAssesmentHead.push({
                    header: res.assessmentCapturedFromHeader
                })
            }
            if (res.treatmentCapturedFromHeader != "") {
                meatTreatMentHead.push({
                    header: res.treatmentCapturedFromHeader
                });
            }
            var newArray = [];
            newArray = [...allMeatHead, ...meatMoniterHead, ...meatEvaluteHead, ...meatAssesmentHead, ...meatTreatMentHead];
            var dublicateRemoveArr = getUniqueListBy(newArray, 'header');
            dublicateRemoveArr.map((res3, index) => {
                allMeatHeadColor.push({
                    header: res3.header,
                    color: COLORS[index]
                })
            })
            allMeatHeadColorArr = allMeatHeadColor;

            dublicateRemoveSecondArr = getUniqueListBy(allMeatHeadColor, 'header');
            setMeatColorCodeList(dublicateRemoveSecondArr)
        })


        meatCri.map((res, index) => {
            meatListArr.push({
                diagnosisCode: res.diagnosisCode,
                diseaseName: res.diseaseName,
                monitorCapturedFromHeader: res.monitorCapturedFromHeader,
                assessmentCapturedFromHeader: res.assessmentCapturedFromHeader,
                evaluateCapturedFromHeader: res.evaluateCapturedFromHeader,
                treatmentCapturedFromHeader: res.treatmentCapturedFromHeader,
                monitorCapturedFromHeaderColor: colorCodeMatch(dublicateRemoveSecondArr, res.monitorCapturedFromHeader),
                assessmentCapturedFromHeaderColor: colorCodeMatch(dublicateRemoveSecondArr, res.assessmentCapturedFromHeader),
                evaluateCapturedFromHeaderColor: colorCodeMatch(dublicateRemoveSecondArr, res.evaluateCapturedFromHeader),
                treatmentCapturedFromHeaderColor: colorCodeMatch(dublicateRemoveSecondArr, res.treatmentCapturedFromHeader),
                monitorColor: COLORS[index],
                meatColor: COLORS[index],
                assessment: res.assessment,
                monitor: res.monitor,
                evaluate: res.evaluate,
                treatment: res.treatment,
                isMeatCriteriaPresent: res.isMeatCriteriaPresent,
            })
        })
        setMeatCriteriaList(meatListArr);
        setIsLoading(false);

    }

    const handleMatchHcc = (event, value) => {
        var checked = event.target.checked;
        if (checked == true) {
            var newArray = [];
            var namePush = [];
            namePush.push({ name: value });
            newArray = [...matchHccList, ...namePush];
            setMatchHccList(newArray);
        } else {
            const removeArr = matchHccList.filter((i) => i.name != value);
            setMatchHccList(removeArr);
        }
        if (newArray.length != 0) {
            setIsMatchBtn(true);
        }
    }

    const handleSubmitMatchHcc = () => {

        console.log(matchHccList)
    }


    const openModelDbDescription = () => {

    };


    const tabList = [
        { title: "Patient Data", type: "Patient Data" },
        { title: "Radiology", type: "Radiology" },
    ];

    const navigetPageDetails = (pageTitle) => {
        setActiveTabHead("file")
        setIsLoading(true);
        if (pageTitle == "Patient Data") {
            setActiveTab(1)
        }
        if (pageTitle == "Radiology") {
            setActiveTab(2)
            if (radiologyResCheck == false) {
                getPatientDetailsRadiology(localOrgId, localTenantId);
            }

        }
        setIsLoading(false);
    };

    const handleSubmitPatientFile = async (event) => {
        console.log(inputValue);
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === true) {
            setIsLoadingBtn(true);
            event.preventDefault();
            event.stopPropagation();

            submitRadiology();

        }

        setValidated(true);
    };

    const addPatientFile = (data) => {
        inputValue.patientId = patientDocumentResult.patientId;
        inputValue.name = patientDocumentResult.patientName;
        setValidated(false);
        setAddPatient(true);
        setIsLoadingBtn(false);
    };

    const onChangeFileRadiology = (e) => {
        setSelectFileRadiology(e[0]);
    };

    const submitRadiology = async () => {
        const formData = new FormData();
        formData.append("file", selectFileRadiology);
        formData.append("orgid", localOrgId);
        formData.append("tenantid", localTenantId);
        formData.append("userid", localUserId);
        formData.append("patientid", inputValue.patientId);
        formData.append("patientname", inputValue.name);
        const headers = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        };
        const response = await axios.post(
            ENDPOINTS.apiEndointFileUploadHcc + `aiservice/ai/upload/radiology
      `,
            formData,
            headers
        );
        if (response?.status == 202) {
            setAddPatient(false);
            setIsLoadingBtn(false);
            getPatientDetailsRadiology(localOrgId, localTenantId);
        } else {
            setIsLoadingBtn(false);
        }
        setAddPatient(false);


    };

    const openNewTabDownloadPdf = async () => {
        //    fetch(selectFileURL).then(resp => resp.arrayBuffer()).then(resp => {

        //     // set the blog type to final pdf
        //     const file = new Blob([resp], {type: 'application/pdf'});

        //     // process to auto download it
        //     const fileURL = URL.createObjectURL(file);

        //     // Open new Tab
        //     window.open(fileURL)

        // });   
        // window.open("pdfview",'_blank', 'toolbar=0') 
        window.open('pdfview', "_blank", "width=3000, height=3000");
    }

    const openNewTabDownloadPdfradiology = async () => {
        fetch(selectFileURLRadiology).then(resp => resp.arrayBuffer()).then(resp => {

            // set the blog type to final pdf
            const file = new Blob([resp], { type: 'application/pdf' });

            // process to auto download it
            const fileURL = URL.createObjectURL(file);

            // Open new Tab
            window.open(fileURL)

        });
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
                                                        maxWidth: "1100px",
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

