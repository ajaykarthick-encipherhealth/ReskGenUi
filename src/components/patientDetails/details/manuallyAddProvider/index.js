import React, { useEffect, useState } from "react";
import PdfViewer from "../PdfViewerComponent";
import { connect } from "react-redux";
import style from "./styles.module.css";
import { DeleteOutlined } from "@ant-design/icons";
import { Empty, Form, Popconfirm, Popover, Spin, Tooltip } from "antd";
import { stringToColour } from "../components/function/ReusableFunctions";
import AddForm from "./AddForm";
import { actions as allActions } from "../../../../stores/patient/details";
import dayjs from "dayjs";
import TableSkeleton from "../../../skeleton/table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faRotate,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import RegularButton from "../../../button";
import { getResponePopup, reusableEllipses } from "../../../../utils/reusable";
import RegularButtonWithIcon from "../../../buttonWithIcon";
import { getStorage } from "../../../../utils/storages";

export const viewProvidersList = ({ list }) => (
  <div
    className={`${style.listShow}`}
    style={{
      backgroundColor: stringToColour(list?.providerName) + 33,
      color: stringToColour(list?.providerName),
    }}
  >
    <div className="text-center w-100">{list?.providerName}</div>
  </div>
);

const ManuallyAddProvider = ({
  hccFileDetails,
  selectDosValue,
  dosYear,
  getAddProviderAndDOSList,
  dosAndProvidersList,
  selectedDosValue,
  loader,
  dosYearDefalutSelect,
  setTrashProviderAndCaptured,
  setRestoreProviderAndCaptured,
  getExistingDos,
  year,
  getPatientListToDetails,
}) => {
  const [form] = Form.useForm();
  const [selectFileURL, setSelectFileURL] = useState([]);
  const [providersList, setProvidersList] = useState(null);
  const [showRestore, setShowRestore] = useState(false);
  const [isTrashView, setIsTrashView] = useState(false);
  const [restoringId, setRestoringId] = useState(null);
  const handleEdit = (e, data) => {
    e?.stopPropagation?.();
    if (!data) {
      form.resetFields();
      setProvidersList(null);
      return;
    }
    form.setFieldsValue({
      dateOfService: data?.dateOfService ? dayjs(data?.dateOfService) : null,
      dosSubstring: data?.dosSubstring || "",
      dosStartPageNumber: data?.dosStartPageNumber || "",
      dosEndPageNumber: data?.dosEndPageNumber || "",
      faceToFace:
        data?.faceToFace === true
          ? true
          : data?.faceToFace === false
          ? false
          : undefined,

      visitType: data?.visitType || "",
      reviewerComments: data?.reviewerComments || "",
      physicianInquiry: data?.physicianInquiry || "",
      physicianSignaturePresent: data?.physicianSignaturePresent || "",
      physicianNotPresent: data?.physicianNotPresent || "",
      providerName: data?.providerName || "",
      providerPageNumber: data?.hyperlinks?.[0]?.pageNumber || "",
      providerCredentials: data?.providerCredentials || "",
      providerReference: data?.hyperlinks?.[0]?.substring || "",
      isProviderSigned: !data?.noCredential ? true : false || false,
      fileType: data?.fileType || "",
    });
    setProvidersList(data);
  };

  const handleTrash = () => {
    setIsTrashView(true);
    setShowRestore(true);

    getAddProviderAndDOSList({ trash: true, year });
  };

  // const handleDelete = async (item) => {
  //   form.resetFields();
  //   const isDosSelected = item?.dateOfService;
  //   var patientId = getStorage("patientId");
  //   try {
  //     const res = await setTrashProviderAndCaptured({ isDosSelected });
  //     if (res?.status === "SUCCESS") {
  //       getResponePopup(res);
  //        setProvidersList(null);
  //       getAddProviderAndDOSList({ year });
  //       getPatientListToDetails(patientId);
  //        setProvidersList(null);
  //     } else {
  //       console.log("Trash failed:", res);
  //        const response = {
  //          status: "FAILED",
  //          message: error?.message || "Something went wrong",
  //        };
  //        getResponePopup(response);
  //     }
  //   } catch (error) {
  //     console.log(error, "error");
  // };

  const handleDelete = async (item) => {
    form.resetFields();
    const isDosSelected = item?.dateOfService;
    const patientId = getStorage("patientId");

    try {
      const res = await setTrashProviderAndCaptured({ isDosSelected });
      if (res?.status === "SUCCESS") {
        getResponePopup(res);
        getAddProviderAndDOSList({ year });
        getPatientListToDetails(patientId);
        setProvidersList(null);
      } else {
        console.log("Trash failed:", res);
        const response = {
          status: "FAILED",
          message: res?.data?.message || res?.message || "Something went wrong",
        };
        getResponePopup(response);
      }
    } catch (error) {
      console.log(error, "error");
      getResponePopup({
        status: "EXCEPTION",
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
      });
    }
  };

  const handleRestore = async (item) => {
    const isDosSelected = item?.dateOfService;
    setRestoringId(item?.dateOfService);

    try {
      const res = await setRestoreProviderAndCaptured({ isDosSelected });
      if (res?.status === "SUCCESS") {
        getResponePopup(res);

        getAddProviderAndDOSList({ trash: true, year });
      } else {
        console.warn("Restore failed:", res);
        const response = {
          status: "FAILED",
          message: res?.data?.message || res?.message || "Something went wrong",
        };
        getResponePopup(response);
      }
    } catch (error) {
      getResponePopup(error);
    } finally {
      setRestoringId(null);
    }
  };

  const handleBackFromTrash = () => {
    setIsTrashView(false);
    setShowRestore(false);

    getAddProviderAndDOSList({ year });
  };

  useEffect(() => {
    if (hccFileDetails?.data?.response) {
      setSelectFileURL(hccFileDetails?.data?.response?.azureBlobPath);
    }
    if (dosYearDefalutSelect) {
      getAddProviderAndDOSList({
        dosYear: dosYearDefalutSelect?.value ?? dosYearDefalutSelect,
        year,
      });
    }
    form.resetFields();
  }, [hccFileDetails, dosYearDefalutSelect]);

  useEffect(() => {
    if (Array.isArray(dosAndProvidersList) && dosAndProvidersList.length > 0) {
      handleEdit({ stopPropagation: () => {} }, dosAndProvidersList[0]);
    }
  }, [dosAndProvidersList]);

  return (
    <div className="d-flex p-2 h-100" style={{ height: "100vh" }}>
      <div style={{ width: "50%" }}>
        <PdfViewer
          src={selectFileURL}
          searchQuery={""}
          pageNumber={1}
          headers={""}
        />
      </div>

      <div
        style={{ width: "30%", overflowY: "auto", maxHeight: "100vh" }}
        className="mx-2"
      >
        <AddForm
          form={form}
          selectDosValue={selectDosValue}
          providersList={providersList}
          dosYear={dosYear}
          selectedDosValue={selectedDosValue}
          dosYearDefalutSelect={dosYearDefalutSelect}
          year={year}
        />
      </div>

      <div style={{ width: "20%", display: "flex", flexDirection: "column" }}>
        <div className="d-flex justify-content-end align-items-center mb-2">
          {isTrashView ? (
            <RegularButtonWithIcon
              padding="3px 10px"
              name="Back"
              onClick={handleBackFromTrash}
              icon={<FontAwesomeIcon icon={faArrowLeft} />}
              iconPosition="left"
            />
          ) : (
            <>
              <RegularButtonWithIcon
                padding="3px 10px"
                className={style.addBtn}
                name="Add Dos"
                onClick={() => {
                  form.resetFields();
                  setProvidersList(null);
                }}
                icon={<FontAwesomeIcon icon={faPlus} />}
                iconPosition="left"
              />
              <RegularButtonWithIcon
                padding="3px 10px"
                name="Trash"
                onClick={handleTrash}
                icon={<DeleteOutlined />}
                iconPosition="left"
              />
            </>
          )}
        </div>

        <div
          className="flex-grow-1"
          style={{ overflowY: "auto", maxHeight: "calc(100vh - 60px)" }}
          id="dosAndProvidersList"
          name="dosAndProvidersList"
        >
          {loader ? (
            <TableSkeleton />
          ) : Array.isArray(dosAndProvidersList) &&
            dosAndProvidersList.length > 0 ? (
            dosAndProvidersList.map((item, index) => (
              <div onClick={(e) => handleEdit(e, item)} key={item?.id}>
                <button
                  id={`dosAndProvidersList${index}`}
                  name={`dosAndProvidersList${index}`}
                  className={`ant-badge ${style.providerButton} my-2`}
                >
                  <span className={style.dateField}>{item?.dateOfService}</span>
                  <span className={style.providerText}>Provider</span>

                  <Popover
                    content={viewProvidersList({ list: item })}
                    id={`popover-${index}`}
                  >
                    <span className={style.count}>
                      {item?.hyperlinks?.length < 10
                        ? `0${item?.hyperlinks?.length}`
                        : item?.hyperlinks?.length}
                    </span>
                  </Popover>
                  <span>
                    <div className="d-flex align-items-center gap-3">
                      {!isTrashView && (
                        <Popconfirm
                          title="Are you sure you want to delete this provider?"
                          onConfirm={(e) => {
                            e?.stopPropagation?.();
                            handleDelete(item);
                          }}
                          onCancel={(e) => e.stopPropagation()}
                          okText="Yes"
                          cancelText="No"
                        >
                          <DeleteOutlined
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              color: "red",
                              fontSize: "16px",
                              cursor: "pointer",
                            }}
                          />
                        </Popconfirm>
                      )}

                      {showRestore && (
                        <div>
                          {restoringId === item?.dateOfService ? (
                            <Spin size="small" />
                          ) : (
                            <FontAwesomeIcon
                              icon={faRotate}
                              style={{ cursor: "pointer", color: "black" }}
                              onClick={(e) => {
                                e?.stopPropagation?.();
                                handleRestore(item);
                              }}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </span>
                </button>
              </div>
            ))
          ) : (
            <Empty description="No Data" />
          )}
        </div>
      </div>
    </div>
  );
};

const enhancer = connect(
  (state) => ({
    hccFileDetails: state.patientDetails?.details?.hccFileResult,
    dosAndProvidersList:
      state.patientDetails?.details?.dosAndProvidersList?.data?.response,
    loader: state?.patientDetails?.details?.dosAndProvidersListLoader,
  }),
  {
    getAddProviderAndDOSList: allActions.getAddProviderAndDOSList,
    setTrashProviderAndCaptured: allActions.setTrashProviderAndCaptured,
    setRestoreProviderAndCaptured: allActions.setRestoreProviderAndCaptured,
    getExistingDos: allActions.getDosExist,
  }
);

export default enhancer(ManuallyAddProvider);
