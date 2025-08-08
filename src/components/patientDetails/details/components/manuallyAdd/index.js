import React, { useEffect, useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import style from "../../../../../components/button/style.module.css";
import { Checkbox, Form, Input, Select, Spin, Switch } from "antd";
import { getSectionNameManually } from "../function/ReusableFunctions";
import { getLocalStored } from "../../../../../utils/storages";
import { generateUUID, getResponePopup } from "../../../../../utils/reusable";
import { actions as patientDetailsAction } from "../../../../../stores/patient/details";
import { actions as detailsActions } from "../../../../../stores/patient/details";
import { connect } from "react-redux";
import AddSection from "./AddSection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import CustomSelect from "../../../../customSelect";
import RegularButton from "../../../../button";
import SelectButton from "../../../../btnSelect";

const defaultCapturedSections = [
  { label: "Chief Complaint", value: "Chief Complaint" },
  { label: "History of Present Illness", value: "History of Present Illness" },
  { label: "Vitals", value: "Vitals" },
  { label: "Medication", value: "Medication" },
  { label: "PMH/Problem List", value: "PMH/Problem List" },
  { label: "Assessment", value: "Assessment" },
  { label: "Plan", value: "Plan" },
];

export const checkMeatType = (e) => {
  switch (e) {
    case "M":
      return "Monitor";
    case "E":
      return "Evaluation";
    case "A":
      return "Assessment";
    case "T":
      return "Treatment";
    default:
      break;
  }
};

const ManuallyAdd = ({
  // isEditPage,
  // meatFormDisplay,
  // isEditMeat,
  // getValidate,
  // isDosSelected,
  // patientDosResult,
  // getSelectedDos,
  // patientDetailsResult,
  // year,
  // getProviderSection,
  // getValideCodeLoader,
  // isEditMeatValue
  handleCloseModal,
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
  reset,
  isDosSelected,
  meatFormDisplay = false,
  setSuggestedMeatForm,
  suggestedToValidMove,
  selectDisDetails,
  selectCardTitle,
  setOpens,
  open,
  getPatientIdData,
  activeLabels,
  getPatientDosList,
  educationalError,
  setEducationalError,
  getValideCodeLoader,
}) => {
  const { patientId = "", userRole = "" } = getLocalStored();
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [options, setOptions] = useState([]);
  const [sectionCount, setSectionCount] = useState([1]);
  const [section, setSection] = useState("");
  const [listOfSection, setListOfSection] = useState([]);
  const [capturedSections, setCapturedSections] = useState([]);
  const [diagnosisForm, setDiagnosisForm] = useState({});
  const [editSection, setEditSection] = useState();
  const [showSection, setShowSection] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isMeat, setIsMeat] = useState(true);
  const [selectMeat, setSelectMeat] = useState("M");
  const [isFilled, setIsFilled] = useState([]);
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const [code, setCode] = useState("");
  const [validCode, setValidCode] = useState("");
  const [dbDescription, setDbDescription] = useState("");
  const [meatDisplay, setMeatDisplay] = useState(false);
  const [providerDetails, setProviderDetails] = useState([]);

  const [sectionCountM, setSectionCountM] = useState([2]);
  const [sectionM, setSectionM] = useState("");
  const [listOfSectionM, setListOfSectionM] = useState([]);
  const [showSectionM, setShowSectionM] = useState(false);
  const [capturedSectionsM, setCapturedSectionsM] = useState([]);

  const [sectionCountE, setSectionCountE] = useState([3]);
  const [sectionE, setSectionE] = useState("");
  const [listOfSectionE, setListOfSectionE] = useState([]);
  const [showSectionE, setShowSectionE] = useState(false);
  const [capturedSectionsE, setCapturedSectionsE] = useState([]);

  const [sectionCountA, setSectionCountA] = useState([4]);
  const [sectionA, setSectionA] = useState("");
  const [listOfSectionA, setListOfSectionA] = useState([]);
  const [showSectionA, setShowSectionA] = useState(false);
  const [capturedSectionsA, setCapturedSectionsA] = useState([]);

  const [sectionCountT, setSectionCountT] = useState([5]);
  const [sectionT, setSectionT] = useState("");
  const [listOfSectionT, setListOfSectionT] = useState([]);
  const [showSectionT, setShowSectionT] = useState(false);
  const [capturedSectionsT, setCapturedSectionsT] = useState([]);

  const getPageNumbers = () => {
    const getFilter = patientDosResult?.data?.response
      ?.find((item) => item?.dateOfService == getSelectedDos)
      ?.fileDetailDTO?.dosSummaries?.find(
        (item) => item?.dos == getSelectedDos
      );

    let pageNumber = [];
    for (
      let index = getFilter?.startPageNumber;
      index <= getFilter?.endPagNumber;
      index++
    ) {
      pageNumber.push({
        label: index,
        value: index,
      });
    }
    return pageNumber;
  };

  const sectionDelete = (item) => {
    const getFormData = form.getFieldsValue();
    const res = listOfSection.filter((list) => item.section != list.section);
    setListOfSection(res);
    const sec = capturedSections.map((item) => {
      return {
        label: item.label,
        value: item.value,
        disabled: res?.map((ls) => ls.section).includes(item.value),
      };
    });
    form.resetFields();
    setCapturedSections(sec);
    form.setFieldsValue(getFormData);
  };

  const sectionEdit = (item, index) => {
    setEditSection({ id: index, ...item });
    item.hyperlinks?.map((list, i) => {
      form.setFieldsValue({
        section: [{ lable: list.header, value: list.header }],
        [`encounterDate_${item?.section?.replaceAll(" ", "-")}_${
          item?.count[i]
        }`]: list.dateOfService,
        [`referance_${item?.section?.replaceAll(" ", "-")}_${item?.count[i]}`]:
          list.substring,
        [`pageNumber_${item?.section?.replaceAll(" ", "-")}_${item?.count[i]}`]:
          list.pageNumber,
      });
      setSectionCount(item.count);
      setSection(list.header);
    });
    setIsEdit(true);
    setShowSection(false);
  };

  const getVerify = async (value, res) => {
    setValidCode("Valid Code");
    const isCodeCheck = await isCodeAlready({
      code: value,
      patientId: patientId,
      dos: year?.value ? year?.value : year,
      date: getSelectedDos,
    });
    if (isCodeCheck?.response) {
      setValidCode("Code Already Exist");
    } else if (isCodeCheck?.response == false) {
      setValidCode("Valid Code");
    }
  };

  const handleChange = async (value) => {
    const code = value?.toUpperCase().trim();

    if (!code || code.length <= 2) return;

    try {
      const res = await getValidate(code, isDosSelected);
      const { autoCompleteDTOList = [], icdDiseaseDTOList = [] } =
        res?.response || {};

      let displayCodeOptions = [];

      if (res?.status === "SUCCESS") {
        const listToMap =
          autoCompleteDTOList?.length > 0
            ? autoCompleteDTOList
            : icdDiseaseDTOList;

        displayCodeOptions = listToMap.map((item) => {
          const disease = item?.icdDiseaseDTO || item;

          return {
            value: disease?.code,
            description: disease?.description,
            oldHcc: item?.oldValue?.toString() || 0,
            newHcc: item?.newValue?.toString() || 0,
            label: (
              <div className="d-flex gap-1">
                <span>{`${disease?.code} - ${disease?.description}`}</span>
              </div>
            ),
          };
        });

        setOptions(displayCodeOptions);
        // getVerify(code, res);
      } else {
        // Handle invalid code, if needed
        // setValidCode("Invalid Code");
      }
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  const handleSelectChange = async (val, field) => {
    try {
      const res = await getProviderSection({
        processedYear: year?.value ? year?.value : year,
        patientId: patientId,
        dateOfService: [getSelectedDos],
        fileId: patientDetailsResult?.data?.response?.fileId
          ? patientDetailsResult?.data?.response?.fileId
          : "",
      });
      if (res.status == "SUCCESS") {
        const section = res?.response?.capturedSections.map((item) => ({
          label: item,
          value: item,
        }));
        setProviderDetails([...res?.response?.providerInfoList]);
        setCapturedSections(
          res?.response?.capturedSections?.length > 0
            ? section
            : defaultCapturedSections
        );
        setCapturedSectionsM(
          res?.response?.capturedSections?.length > 0
            ? section
            : defaultCapturedSections
        );
        setCapturedSectionsE(
          res?.response?.capturedSections?.length > 0
            ? section
            : defaultCapturedSections
        );
        setCapturedSectionsA(
          res?.response?.capturedSections?.length > 0
            ? section
            : defaultCapturedSections
        );
        setCapturedSectionsT(
          res?.response?.capturedSections?.length > 0
            ? section
            : defaultCapturedSections
        );
      }
    } catch (error) {}
  };

  const handledSave = async (e, type) => {
    const forms = form.getFieldValue();
    if (type === "partial") {
      const maps = sectionCount
        .map((item, i) => [
          `referance_${section?.replaceAll(" ", "-")}_${item}`,
          `pageNumber_${section?.replaceAll(" ", "-")}_${item}`,
        ])
        .flat(2);
      await form.validateFields(["section", ...maps]);
      const res = sectionCount.map((item, i) => ({
        header: section,
        dateOfService: getSelectedDos ? getSelectedDos : "",
        substring: forms[`referance_${section?.replaceAll(" ", "-")}_${item}`],
        pageNumber:
          forms[`pageNumber_${section?.replaceAll(" ", "-")}_${item}`],
        educationalError: forms.educationalError || false,
      }));
      setDiagnosisForm(forms);
      setListOfSection((prev) => {
        return [
          ...prev,
          ...[{ section: section, hyperlinks: res, count: sectionCount }],
        ];
      });
    }
  };

  const handleReset = () => {
    listOfSection?.map((item, i) => {
      form.resetFields([
        `section`,
        `encounterDate_${section?.replaceAll(" ", "-")}_${item}`,
        `referance_${section?.replaceAll(" ", "-")}_${item}`,
        `pageNumber_${section?.replaceAll(" ", "-")}_${item}`,
      ]);
    });

    setSectionCount([1]);
    setSection("");
    setShowSection(true);
  };

  const disableOption = () => {
    const sec = capturedSections.map((item) => {
      return {
        label: item?.label,
        value: item?.value,
        disabled: listOfSection?.map((ls) => ls.section).includes(item?.value),
      };
    });
    setCapturedSections(sec);
    handleReset();
  };

  const disableOptionMeat = (
    capturedSections,
    listOfSection,
    setCapturedSections
  ) => {
    const sec = capturedSections?.map((item) => {
      return {
        label: item?.label,
        value: item?.value,
        disabled: listOfSection?.map((ls) => ls?.section).includes(item?.value),
      };
    });
    setCapturedSections(sec);
    handleResetMeat();
  };

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
          setCapturedSections: setCapturedSectionsM,
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
          setCapturedSections: setCapturedSectionsE,
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
          setCapturedSections: setCapturedSectionsA,
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
          setCapturedSections: setCapturedSectionsT,
        };
      default:
        break;
    }
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
        )}_${selectMeat}_${item}`
      ]
        ? moment(
            forms[
              `encounterDate_${selectedSection?.replaceAll(
                " ",
                "-"
              )}_${selectMeat}_${item}`
            ]
          ).format("YYYY-MM-DD")
        : "",
      substring:
        forms[
          `referance_${selectedSection?.replaceAll(
            " ",
            "-"
          )}_${selectMeat}_${item}`
        ],
      pageNumber:
        forms[
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

  const handledMeatSave = async () => {
    const values = await form.validateFields();
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
      A: sectionCountA,
      T: sectionCountT,
    };

    const selectedSection = sections[selectMeat];
    const selectedCount = counts[selectMeat];

    const res = selectedCount?.map((item, i) => ({
      header: selectedSection,
      dateOfService: getSelectedDos ? getSelectedDos : "",
      substring:
        forms[
          `referance_${selectedSection?.replaceAll(
            " ",
            "-"
          )}_${selectMeat}_${item}`
        ],
      pageNumber:
        forms[
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
      ...[
        {
          section: selectedSection,
          hyperlinks: res,
          count: selectedCount,
          monitorAspect: forms?.MonitorAspect,
          evaluateAspect: forms?.EvaluationAspect,
          assessmentAspect: forms?.AssessmentAspect,
          treatmentAspect: forms?.TreatmentAspect,
        },
      ],
    ]);
  };

  const handledEdit = () => {
    const forms = form.getFieldsValue();
    const res = sectionCount.map((item, i) => ({
      header: section,
      dateOfService: getSelectedDos ? getSelectedDos : "",
      substring: forms[`referance_${section?.replaceAll(" ", "-")}_${item}`],
      pageNumber: forms[`pageNumber_${section?.replaceAll(" ", "-")}_${item}`],
      educationalError: form.educationalError || false,
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
      listOfSectionT.length > 0 ? "T" : "",
    ]);
  }, [
    selectMeat,
    listOfSectionM,
    listOfSectionE,
    listOfSectionA,
    listOfSectionT,
  ]);
  const sectionDeleteMeat = (item) => {
    const getFormData = form.getFieldsValue();
    if (selectMeat == "M") {
      const res = listOfSectionM.filter((list) => item.section != list.section);
      setListOfSectionM(res);
      const sec = capturedSectionsM.map((item) => {
        return {
          label: item.label,
          value: item.value,
          disabled: res?.map((ls) => ls.section).includes(item.value),
        };
      });
      form.resetFields();
      setCapturedSectionsM(sec);
      form.setFieldsValue(getFormData);
    } else if (selectMeat == "E") {
      const res = listOfSectionE.filter((list) => item.section != list.section);
      setListOfSectionE(res);
      const sec = capturedSectionsE.map((item) => {
        return {
          label: item.label,
          value: item.value,
          disabled: res?.map((ls) => ls.section).includes(item.value),
        };
      });
      form.resetFields();
      setCapturedSectionsE(sec);
      form.setFieldsValue(getFormData);
    } else if (selectMeat == "A") {
      const res = listOfSectionA.filter((list) => item.section != list.section);
      setListOfSectionA(res);
      const sec = capturedSectionsA.map((item) => {
        return {
          label: item.label,
          value: item.value,
          disabled: res?.map((ls) => ls.section).includes(item.value),
        };
      });
      form.resetFields();
      setCapturedSectionsA(sec);
      form.setFieldsValue(getFormData);
    } else if (selectMeat == "T") {
      const res = listOfSectionT.filter((list) => item.section != list.section);
      setListOfSectionT(res);
      const sec = capturedSectionsT.map((item) => {
        return {
          label: item.label,
          value: item.value,
          disabled: res?.map((ls) => ls.section).includes(item.value),
        };
      });
      form.resetFields();
      setCapturedSectionsT(sec);
      form.setFieldsValue(getFormData);
    }
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
        [`encounterDate_${item?.section?.replaceAll(" ", "-")}_${selectMeat}_${
          item?.count[i]
        }`]: list.dateOfService,
        [`referance_${item?.section?.replaceAll(" ", "-")}_${selectMeat}_${
          item?.count[i]
        }`]: list.substring,
        [`pageNumber_${item?.section?.replaceAll(" ", "-")}_${selectMeat}_${
          item?.count[i]
        }`]: list.pageNumber,
      });
      countSetter(item.count);
      headerSetter(list.header);
    });
    showSectionSetter(false);
  };

  const handleMeatSubmit = async () => {
    const forms = form.getFieldsValue();
    const chartProcessType = getSelectedDos ? "DATE_OF_SERVICE" : "YEAR";
    const dateOfServiceIfDosWiseCompute = getSelectedDos || null;

    const flatLinks = (list) =>
      list?.map((item) => item?.hyperlinks).flat() || null;
    const getAspect = (list) => list?.[0]?.aspect || null;

    const commonData = {
      patientId,
      chartProcessType,
      processedYear: year?.value ? year?.value : year,
      activeHeader: !isMeat,
    };

    let data;
    if (isEditPage) {
      setIsBtnLoading(true);
      data = {
        ...commonData,
        oldDiagnosisCode: isEditValue?.diagnosisCode,
        diagnosisCode: selectDisDetails?.diagnosisCode,
        dateOfServiceIfDosWiseCompute: dateOfServiceIfDosWiseCompute,
        newDiagnosisCode: code,
        description: forms?.description || dbDescription,
        // oldHcc: forms?.oldHcc || 34,
        // newHcc: forms?.oldHcc || 24,
        dateOfServices: forms.dos,
        providerNames: providerDetails?.map((item) => item.providerName),
        hyperlinks: flatLinks(listOfSection),
        monitorAspect: getAspect(listOfSectionM),
        evaluateAspect: getAspect(listOfSectionE),
        assessmentAspect: getAspect(listOfSectionA),
        treatmentAspect: getAspect(listOfSectionT),
        monitorHyperLink: !isMeat ? [] : flatLinks(listOfSectionM),
        evaluateHyperLink: !isMeat ? [] : flatLinks(listOfSectionE),
        assessmentHyperLink: !isMeat ? [] : flatLinks(listOfSectionA),
        treatmentHyperLink: !isMeat ? [] : flatLinks(listOfSectionT),
        educationalError: forms?.educationalError,
      };
    } else if (isEditMeat) {
      data = {
        ...commonData,
        dateOfServiceIfDosWiseCompute: dateOfServiceIfDosWiseCompute,
        diagnosisCode: isEditMeatValue?.diagnosisCode,
        monitorHyperLink: flatLinks(listOfSectionM),
        evaluateHyperLink: flatLinks(listOfSectionE),
        assessmentHyperLink: flatLinks(listOfSectionA),
        treatmentHyperLink: flatLinks(listOfSectionT),
        educationalError: forms?.educationalError,
      };
    } else {
      data = {
        ...commonData,
        diagnosisCode: code.trim(),
        description: diagnosisForm.description,
        dbDescription: dbDescription,
        // oldHcc: diagnosisForm.oldHcc,
        // newHcc: diagnosisForm.newHcc,
        dateOfServices: [dateOfServiceIfDosWiseCompute],
        hyperlinks: flatLinks(listOfSection),
        // monitorHyperLink: flatLinks(listOfSectionM),
        // evaluateHyperLink: flatLinks(listOfSectionE),
        // assessmentHyperLink: flatLinks(listOfSectionA),
        // treatmentHyperLink: flatLinks(listOfSectionT),
        monitorHyperLink: !isMeat ? [] : flatLinks(listOfSectionM),
        evaluateHyperLink: !isMeat ? [] : flatLinks(listOfSectionE),
        assessmentHyperLink: !isMeat ? [] : flatLinks(listOfSectionA),
        treatmentHyperLink: !isMeat ? [] : flatLinks(listOfSectionT),
        educationalError: diagnosisForm?.educationalError,
      };
    }

    const handleSuccess = (res) => {
      handleCloseModal(false);
      getResponePopup(res);
      resetForms({ reload: true });
      setIsBtnLoading(false);
      setOpens(false);
      setEducationalError && setEducationalError(false);
    };

    const handleFailure = (res) => {
      getResponePopup(res);
      setIsBtnLoading(false);
    };

    const isSuccess = (res) =>
      res?.status === "SUCCESS" ||
      res?.status === "CUSTOM_EXCEPTION" ||
      res?.status === "FAILED" ||
      res?.status === "USER_DEFINED_ERROR";

    try {
      setIsBtnLoading(true);
      let res = {};

      if (validCode.toLowerCase() === "valid code") {
        if (isEditPage) {
          res = meatFormDisplay
            ? await suggestedToValidMove(data, selectCardTitle)
            : await diseaseEdit(data);
        } else if (isEditMeat) {
          res = await diseaseEditMeat(data);
        } else {
          res = await manuallyAdd(data);
        }
        if (res?.status === "SUCCESS") {
          activeLabels({
            patientId: patientId,
            year: year?.value ? year?.value : year,
            dos: isDosSelected,
          });
          getPatientDosList(patientId, year?.value ? year?.value : year);
          handleSuccess(res);
        } else {
          handleFailure(res);
        }
      } else if (meatFormDisplay) {
        const movementData = {
          ...commonData,
          diagnosisCode: selectDisDetails?.diagnosisCode,
          dateOfServices: selectDisDetails?.dateOfServices,
          monitorAspect: data.monitorAspect,
          monitorHyperLink: data.monitorHyperLink,
          evaluateAspect: data.evaluateAspect,
          evaluateHyperLink: data.evaluateHyperLink,
          assessmentAspect: data.assessmentAspect,
          assessmentHyperLink: data.assessmentHyperLink,
          treatmentAspect: data.treatmentAspect,
          treatmentHyperLink: data.treatmentHyperLink,
          educationalError,
        };

        res = await suggestedToValidMove(movementData, selectCardTitle);
        activeLabels({
          patientId: patientId,
          year: year?.value ? year?.value : year,
          dos: isDosSelected,
        });
        getPatientDosList(patientId, year?.value ? year?.value : year);
        isSuccess(res) ? handleSuccess(res) : handleFailure(res);
      }
    } catch (error) {
      setIsBtnLoading(false);
      console.error("Submission error:", error);
    }
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
          aspect: item?.aspect,
        });
      }

      const sectionData = sectionsMap.get(section);
      sectionData.hyperlinks.push(hyperlink);
      sectionData.count.push(sectionData.hyperlinks.length);
    });

    return Array.from(sectionsMap.values());
  };
  useEffect(() => {
    if (isEditMeat) {
      setMeatDisplay(true);
      setCode(isEditMeatValue.diagnosisCode);
      setValidCode("Valid Code");
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
      setEducationalError(isEditMeatValue?.educationalError);
    }
    form.setFieldsValue({
      dos: [isDosSelected],
    });
  }, [isEditMeat, isEditMeatValue]);

  useEffect(() => {
    if (isEditPage && !meatFormDisplay) {
      const meatObj = [
        ...patientDetailsResult?.data?.response?.meatCriteria,
        ...patientDetailsResult?.data?.response?.deletedMeatCriteria,
      ];
      const filterData = meatObj?.find(
        (item) => item.diagnosisCode == isEditValue.diagnosisCode
      );

      setCode(isEditValue.diagnosisCode);
      setValidCode("Valid Code");
      const dos = isEditValue?.dateOfServices?.map((item) => ({
        lable: item,
        value: item,
      }));
      const sectionList = isEditValue?.hyperlinks?.map((item) => ({
        section: item.header,
        hyperlinks: item,
      }));
      form.setFieldsValue({
        diagnosisCode: isEditValue.diagnosisCode,
        description: isEditValue.dbDescription
          ? isEditValue.dbDescription
          : isEditValue.actualDescription,
        newHcc: isEditValue?.newValue ? isEditValue?.newValue : "",
        oldHcc: isEditValue?.oldValue ? isEditValue?.oldValue : "",
        educationalError: isEditValue?.educationalError
          ? isEditValue?.educationalError
          : "",
        dos: dos,
        educationalError: isEditValue.educationalError || false,
      });
      const sectionListM = filterData?.monitorHyperLink?.map((item) => ({
        section: item.header,
        hyperlinks: item,
        aspect: filterData?.monitorAspect,
      }));
      const sectionListE = filterData?.evaluateHyperLink?.map((item) => ({
        section: item.header,
        hyperlinks: item,
        aspect: filterData?.evaluateAspect,
      }));
      const sectionListA = filterData?.assessmentHyperLink?.map((item) => ({
        section: item.header,
        hyperlinks: item,
        aspect: filterData?.assessmentAspect,
      }));
      const sectionListT = filterData?.treatmentHyperLink?.map((item) => ({
        section: item.header,
        hyperlinks: item,
        aspect: filterData?.treatmentAspect,
      }));
      handleSelectChange(
        isEditValue?.dateOfServices || year?.value ? year?.value : year,
        "dos"
      );
      setListOfSection(transformData(sectionList));
      setListOfSectionM(transformData(sectionListM));
      setListOfSectionE(transformData(sectionListE));
      setListOfSectionA(transformData(sectionListA));
      setListOfSectionT(transformData(sectionListT));
    }
    handleSelectChange(isEditValue?.dateOfServices, "dos");
  }, [isEditPage, isEditValue, reset, meatFormDisplay]);

  useEffect(() => {
    if (listOfSection?.length > 0) {
      disableOption();
    }
  }, [listOfSection]);

  useEffect(() => {
    handleSelectChange();
  }, []);
  const getPatient = async (reload) => {
    // if (reload) {
    const res = await getpatientDetailsData(
      patientDetailsResult?.data?.response?.patientId,
      patientDetailsResult?.data?.response?.processedYear,
      patientDetailsResult?.data?.response?.dateOfService,
      "",
      userRole
    );
    // }
  };
  const resetForms = ({ reload = false }) => {
    handleCloseModal(false);

    form.resetFields();
    getPatient(reload);
    // getPatientId(reload);

    setValidCode("");
    // setProviderDetails([]);
    setCode("");
    setIsMeat(true);
    setCapturedSections([]);
    setDiagnosisForm({});
    setSectionCount([1]);
    setSection("");
    setMeatDisplay(false);
    setListOfSection([]);
    setShowSection(false);
    setSelectMeat("M");
    setIsFilled([]);

    setSectionCountM([2]);
    setSectionM("");
    setListOfSectionM([]);
    setShowSectionM(false);
    setCapturedSectionsM([]);

    setSectionCountE([3]);
    setSectionE("");
    setListOfSectionE([]);
    setShowSectionE(false);
    setCapturedSectionsE([]);

    setSectionCountA([4]);
    setSectionA("");
    setListOfSectionA([]);
    setShowSectionA(false);
    setCapturedSectionsA([]);

    setSectionCountT([5]);
    setSectionT("");
    setListOfSectionT([]);
    setShowSectionT(false);
    setCapturedSectionsT([]);
    setSuggestedMeatForm && setSuggestedMeatForm(false);
  };

  useEffect(() => {
    if (!open) {
      setIsBtnLoading(false);
      resetForms({ reload: false });
    }
  }, [open]);

  return (
    <div>
      <Form
        form={form}
        name="basic"
        layout="vertical"
        autoComplete="off"
        initialValues={{
          educationalError: false,
        }}
        // initialValues={formInitialValues}
        onFinish={(form) => {
          // handledSave(form);
          handleMeatSubmit(form);
        }}
        onFinishFailed={() => {}}
        onChange={(e) => {
          // console.log(e);
        }}
      >
        <div className="d-flex mb-1 border-bottom">
          <div className="w-75">
            <div className="d-flex">
              <span className="font-bold text-[16px]">
                {isEditPage
                  ? meatFormDisplay
                    ? "Suggested Meat Add"
                    : "Edit Valid Code"
                  : isEditMeat
                  ? "Meat Edit"
                  : "Add Valid Code"}{" "}
              </span>
              {(userRole === "CODER_2" || userRole === "QA") && (
                <div style={{ marginTop: "-3px" }} className="mx-2">
                  <Form.Item
                    name="educationalError"
                    valuePropName="checked"
                    style={{ marginBottom: "0" }}
                  >
                    <Checkbox className="ant-badge">
                      Mark as Educational Error
                    </Checkbox>
                  </Form.Item>
                </div>
              )}
            </div>
          </div>
          <div
            className="w-25 cr-pointer text-end"
            onClick={() => {
              handleCloseModal(false);
              setMeatDisplay(false);
              resetForms({ reload: false });
              form.resetFields();
              setProviderDetails([]);
              setSuggestedMeatForm && setSuggestedMeatForm(false);
            }}
          >
            <CloseOutlined />
          </div>
        </div>

        <div className="row">
          {!meatDisplay && !meatFormDisplay && (
            <>
              <div className="col-6">
                <Form.Item
                  label={
                    <label className="mb-0">
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
                  style={{ marginBottom: 10 }}
                  onChange={(e) => {
                    if (e.target.name === "") {
                      const code = e.target.value.trim();
                      if (!code.includes(".")) {
                        handleChange(code);
                      }
                    }
                  }}
                >
                  <Select
                    name="diagnosisCode"
                    allowClear
                    showSearch
                    labelInValue
                    optionLabelProp="codeOnly"
                    notFoundContent={
                      getValideCodeLoader ? <Spin size="small" /> : "No data"
                    }
                    onClear={() => setOptions([])}
                    onBlur={() => {
                      const selected = form.getFieldValue("diagnosisCode");
                      if (!selected) {
                        setOptions([]);
                      }
                    }}
                    onChange={(e, value) => {
                      form.setFieldsValue({
                        oldHcc: value?.oldHcc,
                        description: value?.description,
                        newHcc: value?.newHcc,
                      });
                      setCode(value?.value);
                      getVerify(value?.value);
                      setDbDescription(value?.description);
                    }}
                    options={
                      !getValideCodeLoader &&
                      options?.map((opt) => ({
                        label: `${opt.value} - ${opt.description}`,
                        value: opt.value,
                        codeOnly: opt.value,
                        description: opt.description,
                        oldHcc: opt.oldHcc,
                        newHcc: opt.newHcc,
                      }))
                    }
                  />
                </Form.Item>
                {code?.length > 0 &&
                validCode.length > 0 &&
                validCode == "Valid Code" ? (
                  <label className="text-success">Valid Code</label>
                ) : (
                  validCode != "Valid Code" && (
                    <label className="text-danger">{validCode}</label>
                  )
                )}
              </div>
              <div className="col-6">
                <Form.Item
                  label={
                    <label className="mb-0">
                      Description <span style={{ color: "red" }}>*</span>
                    </label>
                  }
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: "Please enter description",
                    },
                    {
                      validator: (_, value) => {
                        if (!value || value.trim() === "") {
                          return Promise.reject(
                            new Error(
                              "Description cannot be empty or just spaces"
                            )
                          );
                        }
                        if (/^\s/.test(value)) {
                          return Promise.reject(
                            new Error("Description cannot start with a space")
                          );
                        }
                        if (/^[^a-zA-Z0-9]/.test(value)) {
                          return Promise.reject(
                            new Error(
                              "Description cannot start with a special character"
                            )
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                  style={{ marginBottom: 10 }}
                >
                  <Input name="description" className="manually" />
                </Form.Item>
              </div>
              <div className="col-6">
                <Form.Item
                  label={
                    <label className="mb-0">
                      Old Hcc <span style={{ color: "red" }}>*</span>
                    </label>
                  }
                  name="oldHcc"
                  rules={[
                    {
                      required: true,
                      message: "Please enter Old Hcc code",
                    },
                  ]}
                  style={{ marginBottom: 10 }}
                >
                  <Input name="oldHcc" disabled className="manually" />
                </Form.Item>
              </div>
              <div className="col-6">
                <Form.Item
                  label={
                    <label className="mb-0">
                      New Hcc <span style={{ color: "red" }}>*</span>
                    </label>
                  }
                  name="newHcc"
                  rules={[
                    {
                      required: true,
                      message: "Please enter New Hcc code",
                    },
                  ]}
                  style={{ marginBottom: 10 }}
                >
                  <Input name="newHcc" disabled className="manually" />
                </Form.Item>
              </div>
              <div className="col-12">
                <Form.Item
                  label={<label className="mb-0">Comments</label>}
                  name="commants"
                  style={{ marginBottom: 10 }}
                  rules={[
                    {
                      validator: (_, value) => {
                        if (/^\s/.test(value)) {
                          return Promise.reject(
                            new Error("Comments cannot start with a space")
                          );
                        }
                        if (/^[^a-zA-Z0-9]/.test(value)) {
                          return Promise.reject(
                            new Error(
                              "Comments cannot start with a special character"
                            )
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <TextArea rows={3} className="manually" />
                </Form.Item>
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
                            setSection("");
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
                <div className="col-12">
                  <div className="border rounded p-2">
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
                      <CustomSelect
                        options={capturedSections}
                        onChange={(val) => setSection(val)}
                        setOptions={setCapturedSections}
                        value={section}
                        disabled={false}
                      />
                    </Form.Item>

                    {sectionCount?.map((item, index) => (
                      <div className="pt-0">
                        <div className="d-flex justify-content-between px-3">
                          <b>Section - {index + 1}</b>
                          <label>
                            {index == 0 && (
                              <label
                                className="cr-pointer px-2"
                                onClick={() =>
                                  setSectionCount([
                                    ...sectionCount,
                                    generateUUID(),
                                  ])
                                }
                              >
                                <FontAwesomeIcon
                                  icon={faPlus}
                                  color="#04306f"
                                />
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
                          isEditPage={isEditPage}
                          pageNumbers={getPageNumbers()}
                        />
                      </div>
                    ))}
                    <div className="d-flex justify-content-center mt-4">
                      {!isEdit ? (
                        <RegularButton
                          type=""
                          name={isBtnLoading ? "Loading..." : "Save"}
                          width="100px"
                          disabled={isBtnLoading}
                          method={"button"}
                          onClick={(e) => handledSave(e, "partial")}
                        />
                      ) : (
                        <RegularButton
                          type=""
                          method={"button"}
                          name={isBtnLoading ? "Loading..." : "Save"}
                          width="100px"
                          onClick={handledEdit}
                          disabled={isBtnLoading}
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
                            setSection("");
                            form.setFieldValue("section", "");
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <>
            {/* MEAT Part */}
            <div className={style.subHeader}>Meat</div>
            {!isEditMeat && (
              <div className="d-flex">
                <label htmlFor="">Active Header</label>
                <div className="mx-2">
                  <Switch
                    onChange={() => setIsMeat(!isMeat)}
                    checked={!isMeat}
                  />
                </div>
              </div>
            )}
            {isMeat && (
              <>
                <div className="d-flex justify-content-center mb-2">
                  {" "}
                  <SelectButton
                    select={selectMeat}
                    setSelect={setSelectMeat}
                    completed={isFilled}
                  />
                </div>
                <div className="col-12">
                  {checkMeat(selectMeat)?.listOfSection?.length > 0 && (
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
                            onClick={() =>
                              checkMeat(selectMeat)?.setShowSection(false)
                            }
                          />
                        </div>
                      </div>
                      <div className="mt-2">
                        {getSectionNameManually({
                          data: checkMeat(selectMeat)?.listOfSection,
                          sectionDelete: sectionDeleteMeat,
                          sectionEdit: sectionEditMeat,
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <>
                  {(checkMeat(selectMeat)?.listOfSection?.length <= 0 ||
                    !checkMeat(selectMeat)?.showSection) && (
                    <div className="col-12">
                      <div className="border rounded p-2">
                        <Form.Item
                          label={
                            <label>
                              Section <span style={{ color: "red" }}>*</span>
                            </label>
                          }
                          name={`${checkMeatType(selectMeat)}section`}
                          rules={[
                            {
                              required: true,
                              message: "Please enter section",
                            },
                          ]}
                        >
                          <CustomSelect
                            options={checkMeat(selectMeat)?.capturedSections}
                            onChange={(val) =>
                              checkMeat(selectMeat)?.setSection(val)
                            }
                            setOptions={
                              checkMeat(selectMeat)?.setCapturedSections
                            }
                            value={checkMeat(selectMeat)?.section}
                            disabled={false}
                          />
                        </Form.Item>

                        {checkMeat(selectMeat)?.sectionCount?.map(
                          (item, index) => (
                            <div className="pt-0">
                              <div className="d-flex justify-content-between px-3">
                                <b>Section - {index + 1}</b>
                                <label>
                                  {index == 0 && (
                                    <label
                                      className="cr-pointer px-2"
                                      onClick={() =>
                                        checkMeat(selectMeat)?.setSectionCount([
                                          ...checkMeat(selectMeat)
                                            ?.sectionCount,
                                          generateUUID(),
                                        ])
                                      }
                                    >
                                      <FontAwesomeIcon
                                        icon={faPlus}
                                        color="#04306f"
                                      />
                                    </label>
                                  )}
                                  {sectionCount?.length > 1 && (
                                    <label
                                      className="cr-pointer"
                                      onClick={() => {
                                        const remove = sectionCount.filter(
                                          (val) => val != item
                                        );
                                        checkMeat(selectMeat)?.setSectionCount(
                                          remove
                                        );
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
                                section={checkMeat(selectMeat)?.section}
                                isEditPage={isEditPage}
                                selectMeat={selectMeat}
                                pageNumbers={getPageNumbers()}
                              />
                            </div>
                          )
                        )}
                        <div className="d-flex justify-content-center mt-4">
                          {!isEdit ? (
                            <RegularButton
                              type=""
                              method={"button"}
                              name={isBtnLoading ? "Loading..." : "Save"}
                              width="100px"
                              disabled={isBtnLoading}
                              onClick={handledMeatSave}
                            />
                          ) : (
                            <RegularButton
                              type=""
                              method={"button"}
                              name={isBtnLoading ? "Loading..." : "Save"}
                              width="100px"
                              onClick={handledEditMeat}
                              disabled={isBtnLoading}
                            />
                          )}
                          {checkMeat(selectMeat)?.listOfSection?.length > 0 && (
                            <RegularButton
                              type="outline"
                              name="Cancel"
                              width="100px"
                              method={"button"}
                              onClick={() => {
                                checkMeat(selectMeat).setShowSection(true);
                                checkMeat(selectMeat).setSectionCount([1]);
                                checkMeat(selectMeat).setSection("");
                                form.setFieldValue(
                                  `${checkMeatType(selectMeat)}section`,
                                  ""
                                );
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              </>
            )}
            <div className="text-center mt-2">
              <RegularButton
                type=""
                name={isBtnLoading ? "Loading..." : "Submit"}
                width="140px"
                method={"submit"}
                // onClick={handleMeatSubmit}
                disabled={
                  isMeat
                    ? !(
                        isMeat &&
                        (listOfSectionA.length > 0 ||
                          listOfSectionE.length > 0 ||
                          listOfSectionM.length > 0 ||
                          listOfSectionT.length > 0)
                      )
                    : isMeat
                }
                loading={isBtnLoading}
              />
            </div>
          </>
        </div>
      </Form>
    </div>
  );
};

const enhancer = connect(
  (state) => ({
    patientDosResult: state?.patientDetails?.details?.dosResult,
    patientDetailsResult: state?.patientDetails?.details?.patientResult,
    getSelectedDos: state?.patientDetails?.details?.getSelectedDosDetails,
    isDosSelected: state.patientDetails.details?.getSelectedDosDetails,
    getValideCodeLoader: state.patientDetails.details?.getValideCodeLoader,
  }),
  {
    getProviderSection: patientDetailsAction.getProviderSection,
    getValidate: patientDetailsAction.getValideCode,
    isCodeAlready: patientDetailsAction.isCodeAlready,
    manuallyAdd: patientDetailsAction.manuallyAdd,
    diseaseEdit: patientDetailsAction.diseaseEdit,
    diseaseEditMeat: patientDetailsAction.diseaseEditMeat,
    getpatientDetailsData: patientDetailsAction.patientDetailsAction,
    suggestedToValidMove: patientDetailsAction.suggestedToValidMove,
    getPatientIdData: detailsActions.patientIdDetailsAction,
    activeLabels: detailsActions.activeLabels,
    getPatientDosList: detailsActions.dosDeatilsAction,
  }
);

export default enhancer(ManuallyAdd);
