import React, { useEffect, useState } from "react";
import Style from "../../style.module.css";
import RegularButton from "../../../../../components/button";
import { Button, Checkbox, Divider, Switch } from "antd";
import FileUploader from "../../components/fileUploader";
import ModalPop from "../../components/modal";
import CommonModalContent from "../../components/commonModalContent";
import { actions as settingActions } from "../../../../../stores/tenantAdmin/settings";
import { connect, useSelector } from "react-redux";
import FileUpload from "../../../../../components/table/tenantSettingsTable/fileUpload";
import { PlusOutlined } from "@ant-design/icons";
import FilterButton from "../../../../../components/table/tenantSettingsTable/filterButton";
import Search from "../../../../../components/table/tenantSettingsTable/search";
import TenantSettingsTable from "../../../../../components/table/tenantSettingsTable/tenantSettingsTable";
import { getResponePopup } from "../../../../../utils/reusable";
import ENDPOINTS from "../../../../../utility/enpoints";
import axios from "../../../../../utility/axiosConfig";

const DirectConfirmCodes = ({
  updateSettings,
  updateDirectCode,
  getCodingDetails,
  list,
  uploadfile,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState(null);
  const [isGuidelines, setIsGuidelines] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [isEditValue, setIsEditValue] = useState(false);
  const [selectFile, setSelectFile] = useState("");
  const [tags, setTags] = useState([
    "plan",
    "assessment/plan",
    "Current Medication",
    "impression/plan",
    "Impression and Plan",
    "treatment",
    "treatments",
    "hpi",
    "assessment",
    "problem",
    "judgment and insight",
    "recommendations",
    "examinations",
    "examination",
    "diagnoses",
    "cognitive assessment",
    "Todays Treatments",
    "impression",
    "problems",
    "history of present illness",
    "Todays Diagnoses Include",
    "today diagnoses include",
    "mental status exam",
    "medications",
    "HPI Summary",
    "Problem List",
    "Assessment/Plan Summary",
    "Assessment/Plan",
    "Ambulatory Assessment/Plan",
    "New Medications",
    "Renewed Medications",
    "a/p",
  ]);

  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Year",
      dataIndex: "years",
      key: "year",
    },
  ];
  useEffect(() => {
    getDirectConfirmDetails();
  }, []);

  const getDirectConfirmDetails = async () => {
    try {
      const res = await getCodingDetails({ type: "DIRECT_CONFIRM_CODES" });
      if (res?.status == "SUCCESS") {
        setIsGuidelines(res?.response?.includeGeneralGuidelineCodes);
      }
    } catch (error) {}
  };

  const handleDelete = (value) => {
    const del = tags.map((item) => item != value);
    setTags(del);
  };

  const handleEdit = (value) => {
    setIsEditValue(true);
    setEditValue(value);
  };

  const handleUpdate = () => {};
  const handleGuidelines = async (value) => {
    try {
      const res = await updateDirectCode({
        includeGeneralGuidelineCodes: value,
      });
      if (res.status == "SUCCESS") {
        getResponePopup(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const submitPatientFile = async () => {
    const formData = new FormData();
    formData.append("file", selectFile.originFileObj);
    formData.append("target", "INSULIN_MEDICATIONS");
    formData.append("isDefaultYear", isChecked);
    const headers = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    console.log(formData);
    setSelectFile(formData);
    const res = await axios.post(
      ENDPOINTS.apiEndoint +
        `management/tenantAdmin/codes/upload
      `,
      formData,
      headers
    );
    if (res.status == "SUCCESS") {
      getResponePopup(res);
    } else if (res.status == "USER_DEFINED_ERROR") {
      getResponePopup(res);
    }
    // try {
    //   const res = await uploadfile(formData);
      // if (res.status == "SUCCESS") {
      //   getResponePopup(res);
      // } else if (res.status == "USER_DEFINED_ERROR") {
      //   getResponePopup(res);
      // }
    // } catch (error) {}
  };

  return (
    <>
      <div className="p-3">
        <div>
          <div className="d-flex justify-content-between my-4">
            <div>
              <div className={Style.title}>Direct Confirm Codes</div>
              <div className="d-flex justify-content-start gap-2 mt-4">
                <div>Year</div>
                <div>
                  <Checkbox
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                  />
                </div>
                <div>Can We calculate for all Processing Year</div>
              </div>
            </div>

            <div className="d-flex justify-content-start gap-2 ">
              <div>
                <FileUpload
                  allowedFormat={"File must be in xlsx or CSV"}
                  onChange={(e) => setSelectFile(e.file)}
                  accept={".xlsx, .csv"}
                />
              </div>
              <div>
                <Button
                  icon={<PlusOutlined />}
                  style={{
                    height: "47px",
                  }}
                  onClick={() => {
                    setOpenModal(true);
                  }}
                >
                  Add Manually
                </Button>
              </div>
            </div>
          </div>
          <Divider />
          <div className="d-flex justify-content-start  gap-4 mt-4">
            <div className="mx-3">{"Do you need general guidelines codes"}</div>
            <div className="d-flex justify-content-between">
              <Switch
                checked={isGuidelines}
                onChange={(e) => {
                  setIsGuidelines(e);
                  handleGuidelines(e);
                }}
              />
              <div className={`mx-2`}>{isGuidelines ? "Yes" : "No"}</div>
            </div>
            <div className="ms-auto mx-4">
              <Search setSearch={setSearch} />
            </div>
          </div>
          <div>
            <TenantSettingsTable
              columns={columns}
              data={list?.response?.directConfirmCodesPage?.content}
            />
          </div>
        </div>
      </div>
      <div className="text-end p-3">
        <RegularButton
          type={"outline"}
          name={"Restore Changes"}
          onClick={() => console.log("Restore Changes")}
        />
        <RegularButton name={"Save Changes"} onClick={submitPatientFile} />
      </div>
      <ModalPop
        openModal={openModal}
        content={
          <CommonModalContent
            tags={tags}
            setTags={setTags}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            isEdit={isEditValue}
            handleUpdate={handleUpdate}
          />
        }
        setOpenModal={setOpenModal}
      />
    </>
  );
};
const enhancer = connect(
  (state) => ({
    list: state?.tenantAdmin?.settings?.codingGuidelines?.data,
  }),
  {
    updateSettings: settingActions.updateSettingsAction,
    updateDirectCode: settingActions.updateDirectCode,
    uploadfile: settingActions.uploadFiles,
    getCodingDetails: settingActions.codingGuidelinesAction,
  }
);
export default enhancer(DirectConfirmCodes);
