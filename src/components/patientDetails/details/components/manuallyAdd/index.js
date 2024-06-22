import React, { useEffect, useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Switch,
  notification,
} from "antd";
import Provider from "./Provider";
import AddSection from "./AddSection";
import MeatSection from "./MeatSection";
import SelectButton from "../../../../btnSelect";
import style from "../../../../../components/button/style.module.css";
import ENDPOINTS from "../../../../../utility/enpoints";
import axios from "../../../../../utility/axiosConfig";
import { connect } from "react-redux";
import { actions as patientDetailsAction } from "../../../../../stores/patient/details";
import { getStorage } from "../../../../../utils/storages";
import {
  getProviderNameList,
  getProviderNameManually,
  getSectionNameManually,
} from "../function/ReusableFunctions";
import RegularButton from "../../../../button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import Meat, { checkMeatType } from "./Meat";
import { getResponePopup } from "../../../../../utils/reusable";
import { diseaseEditMeat } from "../../../../../stores/patient/details/network";
const { Option } = Select;

const ManuallyAdd = ({
  handleCloseModal,
  setIsFileFormShow,
  patientDosResult,
  getValidate,
  isCodeAlready,
  year,
  getSelectedDos,
  getProviderSection,
  manuallyAdd,
  getpatientDetailsData,
  patientDetailsResult,
  isEditPage,
  isEditValue,
  diseaseEdit,
  isEditMeatValue,
  isEditMeat,
  diseaseEditMeat,
}) => {
  const [form] = Form.useForm();
  const [isMeat, setIsMeat] = useState(false);
  const [validCode, setValidCode] = useState("");
  const [code, setCode] = useState("");
  const [providerDetails, setProviderDetails] = useState([]);
  const [capturedSections, setCapturedSections] = useState([]);
  const [capturedSectionsM, setCapturedSectionsM] = useState([]);
  const [diagnosisForm, setDiagnosisForm] = useState({});
  const [sectionCount, setSectionCount] = useState([1]);
  const [section, setSection] = useState("");
  const [meatDisplay, setMeatDisplay] = useState(false);
  const [listOfSection, setListOfSection] = useState([]);
  const [showSection, setShowSection] = useState(false);
  const [description, setDescription] = useState('')

  const [selectMeat, setSelectMeat] = useState("M");
  const [isFilled, setIsFilled] = useState([]);

  const [sectionCountM, setSectionCountM] = useState([1]);
  const [sectionM, setSectionM] = useState("");
  const [listOfSectionM, setListOfSectionM] = useState([]);
  const [showSectionM, setShowSectionM] = useState(false);

  const [sectionCountE, setSectionCountE] = useState([1]);
  const [sectionE, setSectionE] = useState("");
  const [listOfSectionE, setListOfSectionE] = useState([]);
  const [showSectionE, setShowSectionE] = useState(false);
  const [capturedSectionsE, setCapturedSectionsE] = useState([]);

  const [sectionCountA, setSectionCountA] = useState([1]);
  const [sectionA, setSectionA] = useState("");
  const [listOfSectionA, setListOfSectionA] = useState([]);
  const [showSectionA, setShowSectionA] = useState(false);
  const [capturedSectionsA, setCapturedSectionsA] = useState([]);

  const [sectionCountT, setSectionCountT] = useState([1]);
  const [sectionT, setSectionT] = useState("");
  const [listOfSectionT, setListOfSectionT] = useState([]);
  const [showSectionT, setShowSectionT] = useState(false);
  const [capturedSectionsT, setCapturedSectionsT] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editSection, setEditSection] = useState();

  const dosList = patientDosResult?.data?.response?.map(
    (item) =>
      ({
        label: item.dateOfService,
        value: item?.dateOfService,
      } || [])
  );

  const checkMeat = (e) => {
    switch (e) {
      case "M":
        return {
          sectionCount: sectionCountM,
          section: sectionM,
          listOfSection: listOfSectionM,
          showSection: showSectionM,
          capturedSections: capturedSectionsM,
          setSection: setSectionM,
          setShowSection: setShowSectionM,
          setSectionCount: setSectionCountM,
        };
      case "E":
        return {
          sectionCount: sectionCountE,
          section: sectionE,
          listOfSection: listOfSectionE,
          showSection: showSectionE,
          capturedSections: capturedSectionsE,
          setSection: setSectionE,
          setShowSection: setShowSectionE,
          setSectionCount: setSectionCountE,
        };
      case "A":
        return {
          sectionCount: sectionCountA,
          section: sectionA,
          listOfSection: listOfSectionA,
          showSection: showSectionA,
          capturedSections: capturedSectionsA,
          setSection: setSectionA,
          setShowSection: setShowSectionA,
          setSectionCount: setSectionCountA,
        };
      case "T":
        return {
          sectionCount: sectionCountT,
          section: sectionT,
          listOfSection: listOfSectionT,
          showSection: showSectionT,
          capturedSections: capturedSectionsT,
          setSection: setSectionT,
          setShowSection: setShowSectionT,
          setSectionCount: setSectionCountT,
        };
      default:
        break;
    }
  };

  const handleSelectChange = async (val, field) => {
    form.setFieldsValue({ [field]: val });
    if (field == "dos") {
      if (val.length <= 0) {
        setCapturedSections([]);
        setProviderDetails([]);
      } else {
        try {
          const res = await getProviderSection({
            processedYear: year.value,
            patientId: await getStorage("patientId"),
            dateOfService: val,
          });
          if (res.status == "SUCCESS") {
            setProviderDetails([...res?.response?.providerInfoList]);
            const section = res?.response?.capturedSections.map((item) => ({
              lable: item,
              value: item,
            }));
            setCapturedSections(section);
            setCapturedSectionsM(section);
            setCapturedSectionsE(section);
            setCapturedSectionsA(section);
            setCapturedSectionsT(section);
          }
        } catch (error) {}
      }
    }
  };

  const handleCodeVaildate = async (e) => {
    const value = e.target.value;
    setCode(value);
    if (value.length > 0) {
      try {
        const res = await getValidate(value);
        if (res.status == "SUCCESS") {
          getVerify(value, res);
        } else {
          setValidCode("Invalid Code");
        }
      } catch (error) {}
    } else {
      setValidCode("");
    }
  };

  const getVerify = async (value, res) => {
    setValidCode("Valid Code");
    const isCodeCheck = await isCodeAlready({
      code: value,
      patientId: await getStorage("patientId"),
      dos: year?.value,
      date: getSelectedDos,
    });
    if (isCodeCheck?.response) {
      setValidCode("Code Already Exist");
    } else if (isCodeCheck?.response == false) {
      setValidCode("Valid Code");
      form.setFieldsValue({ description: res.response?.description });
      setDescription(res.response?.description)
    }
  };

  const handledSave = (form) => {
    const res = sectionCount.map((item, i) => ({
      header: section,
      dateOfService: form[`encounterDate_${section?.replaceAll(" ", "-")}_${item}`]
        ? moment(
            form[`encounterDate_${section?.replaceAll(" ", "-")}_${item}`]
          ).format("YYYY-MM-DD")
        : "",
      substring: form[`referance_${section?.replaceAll(" ", "-")}_${item}`],
      pageNumber: form[`pageNumber_${section?.replaceAll(" ", "-")}_${item}`],
    }));
    setDiagnosisForm(form);
    setListOfSection((prev) => {
      return [
        ...prev,
        ...[{ section: section, hyperlinks: res, count: sectionCount }],
      ];
    });
  };

  const handledEdit = () => {
    const forms = form.getFieldsValue();
    const res = sectionCount.map((item, i) => ({
      header: section,
      dateOfService: forms[
        `encounterDate_${section?.replaceAll(" ", "-")}_${i}`
      ]
        ? moment(
            forms[`encounterDate_${section?.replaceAll(" ", "-")}_${i}`]
          ).format("YYYY-MM-DD")
        : "",
      substring: forms[`referance_${section?.replaceAll(" ", "-")}_${i}`],
      pageNumber: forms[`pageNumber_${section?.replaceAll(" ", "-")}_${i}`],
    }));
    setListOfSection((prev) => {
      const re = prev?.map((check, ind) => {
        if (ind == editSection.id) {
          return { section: section, hyperlinks: res, count: sectionCount };
        } else {
          return check;
        }
      });
      return re;
    });
    setIsEdit(false);
  };

  const handledEditMeat = () => {
    const forms = form.getFieldsValue();
    const sections = {
      M: sectionM,
      E: sectionE,
      A: sectionA,
      T: sectionT,
    };

    const counts = {
      M: sectionCountM,
      E: sectionCountE,
      A: sectionCountE,
      T: sectionCountT,
    };

    const selectedSection = sections[selectMeat];
    const selectedCount = counts[selectMeat];

    const res = selectedCount.map((item, i) => ({
      header: selectedSection,
      dateOfService: forms[
        `encounterDate_${selectedSection?.replaceAll(
          " ",
          "-"
        )}_${selectMeat}_${i}`
      ]
        ? moment(
            forms[
              `encounterDate_${selectedSection?.replaceAll(
                " ",
                "-"
              )}_${selectMeat}_${i}`
            ]
          ).format("YYYY-MM-DD")
        : "",
      substring:
        forms[
          `referance_${selectedSection?.replaceAll(
            " ",
            "-"
          )}_${selectMeat}_${i}`
        ],
      pageNumber:
        forms[
          `pageNumber_${selectedSection?.replaceAll(
            " ",
            "-"
          )}_${selectMeat}_${i}`
        ],
    }));

    const setListOfSection = {
      M: setListOfSectionM,
      E: setListOfSectionE,
      A: setListOfSectionA,
      T: setListOfSectionT,
    };

    // setListOfSection[selectMeat]((prev) => [
    //   ...prev,
    //   ...[{ section: selectedSection, hyperlinks: res, count: selectedCount }],
    // ]);
    // const rese = prev?.map((item) => item.section == selectedSection);
    // const re = rese.map((check, ind) => {
    //   if (check) {
    //     return {
    //       section: selectedSection,
    //       hyperlinks: res,
    //       count: selectedCount,
    //     };
    //   } else {
    //     return prev[ind];
    //   }
    // });
    // console.log(re);
    // return re;

    setListOfSection[selectMeat]((prev) => {
      const re = prev?.map((check, ind) => {
        if (ind == editSection.id) {
          return {
            section: selectedSection,
            hyperlinks: res,
            count: selectedCount,
          };
        } else {
          return check;
        }
      });
      return re;
    });
    setIsEdit(false);
  };

  const handledMeatSave = (form) => {
    const sections = {
      M: sectionM,
      E: sectionE,
      A: sectionA,
      T: sectionT,
    };

    const counts = {
      M: sectionCountM,
      E: sectionCountE,
      A: sectionCountE,
      T: sectionCountT,
    };

    const selectedSection = sections[selectMeat];
    const selectedCount = counts[selectMeat];

    const res = selectedCount.map((item, i) => ({
      header: selectedSection,
      dateOfService: form[
        `encounterDate_${selectedSection?.replaceAll(
          " ",
          "-"
        )}_${selectMeat}_${item}`
      ]
        ? moment(
            form[
              `encounterDate_${selectedSection?.replaceAll(
                " ",
                "-"
              )}_${selectMeat}_${item}`
            ]
          ).format("YYYY-MM-DD")
        : "",
      substring:
        form[
          `referance_${selectedSection?.replaceAll(
            " ",
            "-"
          )}_${selectMeat}_${item}`
        ],
      pageNumber:
        form[
          `pageNumber_${selectedSection?.replaceAll(
            " ",
            "-"
          )}_${selectMeat}_${item}`
        ],
    }));

    const setListOfSection = {
      M: setListOfSectionM,
      E: setListOfSectionE,
      A: setListOfSectionA,
      T: setListOfSectionT,
    };

    setListOfSection[selectMeat]((prev) => [
      ...prev,
      ...[{ section: selectedSection, hyperlinks: res, count: selectedCount }],
    ]);
  };

  const disableOption = () => {
    const sec = capturedSections.map((item) => {
      return {
        lable: item.lable,
        value: item.value,
        disabled: listOfSection?.map((ls) => ls.section).includes(item.value),
      };
    });
    setCapturedSections(sec);
    handleReset();
  };

  useEffect(() => {
    if (listOfSection.length > 0) {
      disableOption();
    }
  }, [listOfSection]);

  const disableOptionMeat = (
    capturedSections,
    listOfSection,
    setCapturedSections
  ) => {
    const sec = capturedSections.map((item) => {
      return {
        lable: item.lable,
        value: item.value,
        disabled: listOfSection?.map((ls) => ls.section).includes(item.value),
      };
    });
    setCapturedSections(sec);
    handleResetMeat();
  };

  useEffect(() => {
    if (selectMeat == "M") {
      if (listOfSectionM.length > 0) {
        disableOptionMeat(
          capturedSectionsM,
          listOfSectionM,
          setCapturedSectionsM
        );
      }
    } else if (selectMeat == "E") {
      if (listOfSectionE.length > 0) {
        disableOptionMeat(
          capturedSectionsE,
          listOfSectionE,
          setCapturedSectionsE
        );
      }
    } else if (selectMeat == "A") {
      if (listOfSectionA.length > 0) {
        disableOptionMeat(
          capturedSectionsA,
          listOfSectionA,
          setCapturedSectionsA
        );
      }
    } else if (selectMeat == "T") {
      if (listOfSectionT.length > 0) {
        disableOptionMeat(
          capturedSectionsT,
          listOfSectionT,
          setCapturedSectionsT
        );
      }
    }
    setIsFilled([
      listOfSectionM.length > 0 ? "M" : "",
      listOfSectionE.length > 0 ? "E" : "",
      listOfSectionA.length > 0 ? "A" : "",
      listOfSectionA.length > 0 ? "T" : "",
    ]);
  }, [
    selectMeat,
    listOfSectionM,
    listOfSectionE,
    listOfSectionA,
    listOfSectionT,
  ]);

  const handleReset = () => {
    listOfSection.map((item, i) => {
      form.resetFields([
        `section`,
        `encounterDate_${section?.replaceAll(" ", "-")}_${i}`,
        `referance_${section?.replaceAll(" ", "-")}_${i}`,
        `pageNumber_${section?.replaceAll(" ", "-")}_${i}`,
      ]);
    });

    setSectionCount([1]);
    setSection("");
    setShowSection(true);
  };

  const handleResetMeat = () => {
    const sections = {
      M: {
        list: listOfSectionM,
        setCount: setSectionCountM,
        setSection: setSectionM,
        setShow: setShowSectionM,
        section: sectionM,
        prefix: "Monitorsection",
      },
      E: {
        list: listOfSectionE,
        setCount: setSectionCountE,
        setSection: setSectionE,
        setShow: setShowSectionE,
        section: sectionE,
        prefix: "Evaluationsection",
      },
      A: {
        list: listOfSectionA,
        setCount: setSectionCountA,
        setSection: setSectionA,
        setShow: setShowSectionA,
        section: sectionA,
        prefix: "Assessmentsection",
      },
      T: {
        list: listOfSectionT,
        setCount: setSectionCountT,
        setSection: setSectionT,
        setShow: setShowSectionT,
        section: sectionT,
        prefix: "Treatmentsection",
      },
    };

    const selected = sections[selectMeat];

    selected.list.forEach((item, i) => {
      form.resetFields([
        selected.prefix,
        `encounterDate_${selected.section?.replaceAll(
          " ",
          "-"
        )}_${selectMeat}_${i}`,
        `referance_${selected.section?.replaceAll(
          " ",
          "-"
        )}_${selectMeat}_${i}`,
        `pageNumber_${selected.section?.replaceAll(
          " ",
          "-"
        )}_${selectMeat}_${i}`,
      ]);
    });

    selected.setCount([1]);
    selected.setSection("");
    selected.setShow(true);
  };

  const handleMeatSubmit = async () => {
    let data = {};
    const forms = form.getFieldsValue();
    if (isEditPage) {
      const filterData =
        patientDetailsResult?.data?.response?.meatCriteria?.find(
          (item) => item.diagnosisCode == isEditValue.diagnosisCode
        );

      data = {
        patientId: await getStorage("patientId"),
        oldDiagnosisCode: isEditValue.diagnosisCode,
        newDiagnosisCode: code,
        description: forms.description ? forms.description : description,
        dateOfServices: forms.dos,
        providerNames: providerDetails.map((item) => item.providerName),
        hyperlinks: listOfSection
          .map((item) => item.hyperlinks)
          .flat(capturedSections.length + 1),
        monitorHyperLink:
          isEditValue.diagnosisCode == code
            ? filterData.monitorHyperLink
            : listOfSectionM.length > 0
            ? listOfSectionM
                .map((item) => item.hyperlinks)
                .flat(capturedSections.length + 1)
            : null,
        evaluateHyperLink:
          isEditValue.diagnosisCode == code
            ? filterData.evaluateHyperLink
            : listOfSectionE.length > 0
            ? listOfSectionE
                .map((item) => item.hyperlinks)
                .flat(capturedSections.length + 1)
            : null,
        assessmentHyperLink:
          isEditValue.diagnosisCode == code
            ? filterData.assessmentHyperLink
            : listOfSectionA.length > 0
            ? listOfSectionA
                .map((item) => item.hyperlinks)
                .flat(capturedSections.length + 1)
            : null,
        treatmentHyperLink:
          isEditValue.diagnosisCode == code
            ? filterData.treatmentHyperLink
            : listOfSectionT.length > 0
            ? listOfSectionT
                .map((item) => item.hyperlinks)
                .flat(capturedSections.length + 1)
            : null,
        chartProcessType: getSelectedDos ? "DATE_OF_SERVICE" : "YEAR",
        dateOfServiceIfDosWiseCompute: getSelectedDos ? getSelectedDos : null,
        processedYear: year.value,
      };
    } else if (isEditMeat) {
      data = {
        patientId: await getStorage("patientId"),
        diagnosisCode: isEditMeatValue.diagnosisCode,
        monitorHyperLink:
          listOfSectionM.length > 0
            ? listOfSectionM
                .map((item) => item.hyperlinks)
                .flat(capturedSections.length + 1)
            : null,
        evaluateHyperLink:
          listOfSectionE.length > 0
            ? listOfSectionE
                .map((item) => item.hyperlinks)
                .flat(capturedSections.length + 1)
            : null,
        assessmentHyperLink:
          listOfSectionA.length > 0
            ? listOfSectionA
                .map((item) => item.hyperlinks)
                .flat(capturedSections.length + 1)
            : null,
        treatmentHyperLink:
          listOfSectionT.length > 0
            ? listOfSectionT
                .map((item) => item.hyperlinks)
                .flat(capturedSections.length + 1)
            : null,
        chartProcessType: getSelectedDos ? "DATE_OF_SERVICE" : "YEAR",
        dateOfServiceIfDosWiseCompute: getSelectedDos ? getSelectedDos : null,
        processedYear: year.value,
      };
    } else {
      data = {
        patientId: await getStorage("patientId"),
        diagnosisCode: code.trim(),
        description: diagnosisForm.description,
        dbDescription: diagnosisForm.description,
        dateOfServices: diagnosisForm.dos,
        hyperlinks: listOfSection
          .map((item) => item.hyperlinks)
          .flat(capturedSections.length + 1),
        monitorHyperLink: listOfSectionM
          .map((item) => item.hyperlinks)
          .flat(capturedSections.length + 1),
        evaluateHyperLink: listOfSectionE
          .map((item) => item.hyperlinks)
          .flat(capturedSections.length + 1),
        assessmentHyperLink: listOfSectionA
          .map((item) => item.hyperlinks)
          .flat(capturedSections.length + 1),
        treatmentHyperLink: listOfSectionT
          .map((item) => item.hyperlinks)
          .flat(capturedSections.length + 1),
        chartProcessType: getSelectedDos ? "DATE_OF_SERVICE" : "YEAR",
        processedYear: year.value,
      };
    }
    if (validCode.toLowerCase() == "valid code") {
      try {
        let res = {};
        if (isEditPage) {
          res = await diseaseEdit(data);
        } else if (isEditMeat) {
          res = await diseaseEditMeat(data);
        } else {
          res = await manuallyAdd(data);
        }

        if (res?.status == "SUCCESS") {
          handleCloseModal(false);
          getResponePopup(res);
          form.resetFields();
          getPatient();

          setValidCode("");
          setProviderDetails([]);
          setCode("");
          setIsMeat(false);
          setCapturedSections([]);
          setDiagnosisForm({});
          setSectionCount([1]);
          setSection("");
          setMeatDisplay(false);
          setListOfSection([]);
          setShowSection(false);
          setSelectMeat("M");
          setIsFilled([]);

          setSectionCountM([1]);
          setSectionM("");
          setListOfSectionM([]);
          setShowSectionM(false);
          setCapturedSectionsM([]);

          setSectionCountE([1]);
          setSectionE("");
          setListOfSectionE([]);
          setShowSectionE(false);
          setCapturedSectionsE([]);

          setSectionCountA([1]);
          setSectionA("");
          setListOfSectionA([]);
          setShowSectionA(false);
          setCapturedSectionsA([]);

          setSectionCountT([1]);
          setSectionT("");
          setListOfSectionT([]);
          setShowSectionT(false);
          setCapturedSectionsT([]);
        }
      } catch (error) {}
    }
  };

  const getPatient = async () => {
    const res = await getpatientDetailsData(
      patientDetailsResult?.data?.response?.patientId,
      patientDetailsResult?.data?.response?.processedYear,
      patientDetailsResult?.data?.response?.dateOfService,
      "",
      await getStorage("role")
    );
  };

  const sectionDelete = (item) => {
    const res = listOfSection.filter((list) => item.section != list.section);
    setListOfSection(res);
  };

  const sectionDeleteMeat = (item) => {
    if (selectMeat == "M") {
      const res = listOfSectionM.filter((list) => item.section != list.section);
      setListOfSectionM(res);
    } else if (selectMeat == "E") {
      const res = listOfSectionE.filter((list) => item.section != list.section);
      setListOfSectionE(res);
    } else if (selectMeat == "A") {
      const res = listOfSectionA.filter((list) => item.section != list.section);
      setListOfSectionA(res);
    } else if (selectMeat == "T") {
      const res = listOfSectionT.filter((list) => item.section != list.section);
      setListOfSectionT(res);
    }
  };

  const sectionEdit = (item, index) => {
    setEditSection({ id: index, ...item });
    item.hyperlinks?.map((list, i) => {
      form.setFieldsValue({
        section: [{ lable: list.header, value: list.header }],
        [`encounterDate_${item?.section?.replaceAll(" ", "-")}_${i}`]:
          list.dateOfService,
        [`referance_${item?.section?.replaceAll(" ", "-")}_${i}`]:
          list.substring,
        [`pageNumber_${item?.section?.replaceAll(" ", "-")}_${i}`]:
          list.pageNumber,
      });
      setSectionCount(item.count);
      setSection(list.header);
    });
    setIsEdit(true);
    setShowSection(false);
  };

  const setFormValues = (
    item,
    selectMeat,
    countSetter,
    headerSetter,
    showSectionSetter
  ) => {
    item.hyperlinks?.map((list, i) => {
      form.setFieldsValue({
        [`${checkMeatType(selectMeat)}section`]: [
          { label: list.header, value: list.header },
        ],
        [`encounterDate_${item?.section?.replaceAll(
          " ",
          "-"
        )}_${selectMeat}_${i}`]: list.dateOfService,
        [`referance_${item?.section?.replaceAll(" ", "-")}_${selectMeat}_${i}`]:
          list.substring,
        [`pageNumber_${item?.section?.replaceAll(
          " ",
          "-"
        )}_${selectMeat}_${i}`]: list.pageNumber,
      });
      countSetter(item.count);
      headerSetter(list.header);
    });
    showSectionSetter(false);
  };

  const sectionEditMeat = (item, index) => {
    setEditSection({ id: index, ...item });
    switch (selectMeat) {
      case "M":
        setFormValues(
          item,
          selectMeat,
          setSectionCountM,
          setSectionM,
          setShowSectionM
        );
        break;
      case "E":
        setFormValues(
          item,
          selectMeat,
          setSectionCountE,
          setSectionE,
          setShowSectionE
        );
        break;
      case "A":
        setFormValues(
          item,
          selectMeat,
          setSectionCountA,
          setSectionA,
          setShowSectionA
        );
        break;
      case "T":
        setFormValues(
          item,
          selectMeat,
          setSectionCountT,
          setSectionT,
          setShowSectionT
        );
        break;
      default:
        break;
    }
    setIsEdit(true);
  };

  const transformData = (data) => {
    const sectionsMap = new Map();

    data?.forEach((item) => {
      const section = item.section;
      const hyperlink = item.hyperlinks;

      if (!sectionsMap.has(section)) {
        sectionsMap.set(section, {
          section,
          hyperlinks: [],
          count: [],
        });
      }

      const sectionData = sectionsMap.get(section);
      sectionData.hyperlinks.push(hyperlink);
      sectionData.count.push(sectionData.hyperlinks.length);
    });

    return Array.from(sectionsMap.values());
  };

  useEffect(() => {
    if (isEditPage) {
      setCode(isEditValue.diagnosisCode);
      setValidCode("Valid Code");
      const dos = isEditValue.dateOfServices.map((item) => ({
        lable: item,
        value: item,
      }));
      const sectionList = isEditValue.hyperlinks.map((item) => ({
        section: item.header,
        hyperlinks: item,
      }));
      form.setFieldsValue({
        diagnosisCode: isEditValue.diagnosisCode,
        description: isEditValue.dbDescription
          ? isEditValue.dbDescription
          : isEditValue.actualDescription,
        dos: dos,
      });
      handleSelectChange(isEditValue.dateOfServices, "dos");
      setListOfSection(transformData(sectionList));
    }
  }, [isEditPage]);

  useEffect(() => {
    if (isEditMeat) {
      setMeatDisplay(true);
      setCode(isEditMeatValue.diagnosisCode);
      setValidCode("Valid Code");
      const dos = isEditMeatValue.dateOfService.map((item) => ({
        lable: item,
        value: item,
      }));
      const sectionList = isEditMeatValue?.monitorHyperLink?.map((item) => ({
        section: item.header,
        hyperlinks: item,
      }));
      const sectionListE = isEditMeatValue?.evaluateHyperLink?.map((item) => ({
        section: item.header,
        hyperlinks: item,
      }));
      const sectionListA = isEditMeatValue?.assessmentHyperLink?.map(
        (item) => ({
          section: item.header,
          hyperlinks: item,
        })
      );
      const sectionListT = isEditMeatValue?.treatmentHyperLink?.map((item) => ({
        section: item.header,
        hyperlinks: item,
      }));
      form.setFieldsValue({
        diagnosisCode: isEditMeatValue.diagnosisCode,
      });
      handleSelectChange(isEditMeatValue.dateOfService, "dos");
      setListOfSectionM(transformData(sectionList));
      setListOfSectionE(transformData(sectionListE));
      setListOfSectionA(transformData(sectionListA));
      setListOfSectionT(transformData(sectionListT));
    }
  }, [isEditMeat]);

  return (
    <>
      <div className="d-flex justify-content-between mb-4">
        <div className="font-bold text-[16px]">
          {isEditPage
            ? "Edit Valid Code"
            : isEditMeat
            ? "Meat Edit"
            : "Add Valid Code"}{" "}
        </div>
        <div
          className="cr-pointer"
          onClick={() => {
            handleCloseModal(false);
          }}
        >
          <CloseOutlined />
        </div>
      </div>

      {!meatDisplay ? (
        <>
          <Form
            form={form}
            name="basic"
            layout="vertical"
            autoComplete="off"
            // initialValues={formInitialValues}
            onFinish={(form) => {
              handledSave(form);
              console.log(form);
            }}
            onFinishFailed={() => {}}
          >
            <div className="row">
              <div className="col-12">
                <Form.Item
                  label={
                    <label>
                      Code <span style={{ color: "red" }}>*</span>
                    </label>
                  }
                  name="diagnosisCode"
                  rules={[
                    {
                      required: true,
                      message: "Please enter diagnosis code",
                    },
                  ]}
                >
                  <Input
                    name="diagnosisCode"
                    onChange={(e) => handleCodeVaildate(e)}
                    value={code}
                    // className={styles.formControl}
                  />
                </Form.Item>
                {validCode.length > 0 &&
                  (validCode == "Valid Code" ? (
                    <label className="text-success">Valid Code</label>
                  ) : (
                    validCode != "" && (
                      <label className="text-danger">{validCode}</label>
                    )
                  ))}
              </div>
              <div className="col-12">
                <Form.Item
                  label={
                    <label>
                      Description <span style={{ color: "red" }}>*</span>
                    </label>
                  }
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: "Please enter description",
                    },
                  ]}
                >
                  <Input name="description" onChange={(e) => e.target.value}/>
                </Form.Item>
              </div>
              <div className="col-12">
                <Form.Item
                  label={
                    <label>
                      DOS <span style={{ color: "red" }}>*</span>
                    </label>
                  }
                  name="dos"
                  rules={[
                    {
                      required: true,
                      message: "Please enter date of service",
                    },
                  ]}
                >
                  <Select
                    mode="multiple"
                    maxTagCount="responsive"
                    className={`ant_select_form hcc_form mb-2`}
                    onChange={(selOption, val) => {
                      handleSelectChange(selOption, "dos");
                    }}
                    options={
                      getSelectedDos
                        ? [{ label: getSelectedDos, value: getSelectedDos }]
                        : dosList
                    }
                  />
                </Form.Item>
              </div>
              <div className="col-12">
                {providerDetails.length > 0 && (
                  <div>
                    <div className={`${style.subHeader} border-bottom`}>
                      Provider
                    </div>
                    <div className="">
                      {getProviderNameManually({
                        data: providerDetails,
                        captureSectionMatching: [],
                      })}
                    </div>
                  </div>
                )}
              </div>
              <div className="col-12">
                {listOfSection?.length > 0 && (
                  <div className="py-4">
                    <div className="d-flex border-bottom align-items-end justify-content-between">
                      <div className={`${style.subHeader} mb-2`}>
                        Section List
                      </div>
                      <div className="mb-1">
                        <RegularButton
                          type=""
                          method={"button"}
                          name="Add"
                          onClick={() => {
                            setShowSection(false);
                            setIsEdit(false);
                          }}
                        />
                      </div>
                    </div>
                    <div className="mt-2">
                      {getSectionNameManually({
                        data: listOfSection,
                        sectionDelete,
                        sectionEdit,
                      })}
                    </div>
                  </div>
                )}
              </div>
              {(listOfSection.length <= 0 || !showSection) && (
                <div className="col-12 mt-2">
                  <Form.Item
                    label={
                      <label>
                        Section <span style={{ color: "red" }}>*</span>
                      </label>
                    }
                    name="section"
                    rules={[
                      {
                        required: true,
                        message: "Please enter section",
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      options={capturedSections}
                      onChange={(val) => setSection(val)}
                    />
                  </Form.Item>
                </div>
              )}
            </div>
            {(listOfSection.length <= 0 || !showSection) && (
              <div className="border rounded">
                {sectionCount?.map((item, index) => (
                  <div className="pt-2">
                    <div className="d-flex justify-content-between px-3">
                      <b>Section - {index + 1}</b>
                      <label>
                        {index == 0 && (
                          <label
                            className="cr-pointer px-2"
                            onClick={() =>
                              setSectionCount([
                                ...sectionCount,
                                ...[Math.max(...sectionCount) + 1],
                              ])
                            }
                          >
                            <FontAwesomeIcon icon={faPlus} color="#04306f" />
                          </label>
                        )}
                        {sectionCount?.length > 1 && (
                          <label
                            className="cr-pointer"
                            onClick={() => {
                              const remove = sectionCount.filter(
                                (val) => val != item
                              );
                              setSectionCount(remove);
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faTrashCan}
                              color="#04306f"
                            />
                          </label>
                        )}
                      </label>
                    </div>
                    <AddSection
                      key={item}
                      id={item}
                      section={section}
                      date={
                        getSelectedDos
                          ? [{ label: getSelectedDos, value: getSelectedDos }]
                          : dosList
                      }
                    />
                  </div>
                ))}
                <Form.Item>
                  <div className="d-flex justify-content-center mt-4">
                    {!isEdit ? (
                      <RegularButton
                        type=""
                        name="Save"
                        width="100px"
                        // onClick={handledSave}
                      />
                    ) : (
                      <RegularButton
                        type=""
                        method={"button"}
                        name="Edit"
                        width="100px"
                        onClick={handledEdit}
                      />
                    )}
                    {listOfSection.length > 0 && (
                      <RegularButton
                        type="outline"
                        name="Cancel"
                        width="100px"
                        method={"button"}
                        onClick={() => {
                          setShowSection(true);
                          setSectionCount([1]);
                        }}
                      />
                    )}
                  </div>
                </Form.Item>
              </div>
            )}
            {showSection && listOfSection.length > 0 && (
              <Form.Item>
                <div className="d-flex justify-content-center mt-5">
                  <RegularButton
                    type=""
                    name={
                      isEditPage && isEditValue.diagnosisCode == code
                        ? "Save"
                        : "Next"
                    }
                    width="150px"
                    method={"button"}
                    disabled={!(validCode == "Valid Code")}
                    onClick={() => {
                      if (isEditPage && isEditValue.diagnosisCode == code) {
                        handleMeatSubmit();
                      } else {
                        setMeatDisplay(true);
                      }
                    }}
                  />
                </div>
              </Form.Item>
            )}
          </Form>
        </>
      ) : (
        <>
          <div className={style.subHeader}>Meat</div>
          {!isEditMeat && (
            <div className="d-flex">
              <label htmlFor="">Active Header</label>
              <div className="mx-2">
                <Switch onChange={(e) => setIsMeat(e)} />
              </div>
            </div>
          )}
          <div className="d-flex justify-content-center mb-2">
            {" "}
            <SelectButton
              select={selectMeat}
              setSelect={setSelectMeat}
              completed={isFilled}
            />
          </div>
          <Form
            form={form}
            name="basic"
            layout="vertical"
            autoComplete="off"
            onFinish={(form) => {
              handledMeatSave(form);
            }}
            onFinishFailed={() => {}}
          >
            <Meat
              selectMeat={selectMeat}
              listOfSection={checkMeat(selectMeat).listOfSection}
              dosList={dosList}
              providerDetails={providerDetails}
              showSection={checkMeat(selectMeat).showSection}
              capturedSections={checkMeat(selectMeat).capturedSections}
              sectionCount={checkMeat(selectMeat).sectionCount}
              section={checkMeat(selectMeat).section}
              setMeatDisplay={setMeatDisplay}
              setShowSection={checkMeat(selectMeat).setShowSection}
              setSection={checkMeat(selectMeat).setSection}
              setSectionCount={checkMeat(selectMeat).setSectionCount}
              handleMeatSubmit={handleMeatSubmit}
              isMeat={isMeat}
              isActive={
                listOfSectionA.length > 0 ||
                listOfSectionE.length > 0 ||
                listOfSectionM.length > 0 ||
                listOfSectionT.length > 0
              }
              sectionDelete={sectionDeleteMeat}
              date={
                getSelectedDos
                  ? [{ label: getSelectedDos, value: getSelectedDos }]
                  : dosList
              }
              isEdit={isEdit}
              sectionEdit={sectionEditMeat}
              handleEdit={handledEditMeat}
              isEditMeat={isEditMeat}
              isEditMeatValue={isEditMeatValue}
            />
          </Form>
        </>
      )}
    </>
  );
};

const enhancer = connect(
  (state) => ({
    patientDosResult: state?.patientDetails?.details?.dosResult,
    patientDetailsResult: state?.patientDetails?.details?.patientResult,
    getSelectedDos: state?.patientDetails?.details?.getSelectedDosDetails,
  }),
  {
    getProviderSection: patientDetailsAction.getProviderSection,
    getValidate: patientDetailsAction.getValideCode,
    isCodeAlready: patientDetailsAction.isCodeAlready,
    manuallyAdd: patientDetailsAction.manuallyAdd,
    diseaseEdit: patientDetailsAction.diseaseEdit,
    diseaseEditMeat: patientDetailsAction.diseaseEditMeat,
    getpatientDetailsData: patientDetailsAction.patientDetailsAction,
  }
);

export default enhancer(ManuallyAdd);
