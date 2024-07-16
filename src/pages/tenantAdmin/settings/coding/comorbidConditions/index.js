import React, { useEffect, useState } from "react";
import Style from "../../style.module.css";
import RegularButton from "../../../../../components/button";
import { Button, Checkbox, Divider, Form, Modal, Switch, message } from "antd";
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
import EditSettings from "../../components/edit";
import { getResponePopup } from "../../../../../utils/reusable";
import axios from "../../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../../utility/enpoints";

const ComorbidConditions = ({
  updateSettings,
  updateComorbidCondition,
  getCodingDetails,
  editComoridConditions,
  deleteComoridConditions,
  list,
}) => {
  const [form] = Form.useForm();
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState(null);
  const [isGuidelines, setIsGuidelines] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editRowValue, setEditRowValue] = useState(null);
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
  const onChange = (checked) => {
    console.log(`switch to ${checked}`);
  };

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
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
  ];
  useEffect(() => {
    getCodingDetailsDetails();
  }, []);

  const getCodingDetailsDetails = async () => {
    try {
      const res = await getCodingDetails({ type: "COMORBID_CONDITIONS" });
      if (res?.status == "SUCCESS") {
        setIsGuidelines(res?.response?.includeGeneralGuidelineCodes);
      }
    } catch (error) {}
  };

  const submitPatientFile = async () => {
    const formData = new FormData();
    formData.append("file", selectFile.originFileObj);
    formData.append("target", "COMORBID_CONDITIONS");
    formData.append("isDefaultYear", false);
    const headers = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    // setSelectFile(formData);
    try {
      const res = await axios.post(
        ENDPOINTS.apiEndoint +
          `management/tenantAdmin/codes/upload
      `,
        formData,
        headers
      );
      setSelectFile("");
      if (res.data.status == "SUCCESS") {
        getResponePopup(res);
      } else if (res.data.status == "USER_DEFINED_ERROR") {
        getResponePopup(res);
      }
    } catch (error) {
      if (error.response.status == 513) {
        getResponePopup({ status: "USER_DEFINED_ERROR" });
      }
    }
  };

  useEffect(() => {
    if (selectFile) {
      submitPatientFile();
    }
  }, [selectFile]);

  const handleGuidelines = async (value) => {
    try {
      const res = await updateComorbidCondition({
        includeGeneralGuidelineCodes: value,
      });
      if (res.status == "SUCCESS") {
        getResponePopup(res);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteRow = async (value) => {
    console.log(value, "testing");
    try {
      const res = await deleteComoridConditions({
        id: value.id,
        target: "COMORBID_CONDITIONS",
      });
      if (res.status == "SUCCESS") {
        getResponePopup(res);
        setIsEdit(false);
        setEditRowValue(null);
        getCodingDetailsDetails();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleEditRow = async (value) => {
    try {
      const res = await editComoridConditions({
        ...editRowValue,
        ...form.getFieldsValue(),
        target: "COMORBID_CONDITIONS",
      });
      if (res.status == "SUCCESS") {
        getResponePopup(res);
        setIsEdit(false);
        setEditRowValue(null);
        getCodingDetailsDetails();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="p-3">
        <div className="d-flex justify-content-between">
          <div className={Style.title}>Comorbid Conditions</div>
        </div>
        <div>
          <div className="d-flex justify-content-between">
            <div className="d-flex justify-content-start gap-2 mt-4">
              <div>Year</div>
              <div>
                <Checkbox />
              </div>
              <div>Can We calculate for all Processing Year</div>
            </div>

            <div className="d-flex justify-content-start gap-2">
              <div>
                <FileUpload
                  allowedFormat={"File must be in xlsx or CSV"}
                  onChange={(e) => setSelectFile(e.file)}
                  fileList={[]}
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
            <div className="d-flex">
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
              data={list?.response?.comorbidConditionsPage?.content}
              handleEdit={(e) => {
                setEditRowValue(e);
                setIsEdit(e);
                form.setFieldsValue({ ...e });
              }}
              handleDelete={handleDeleteRow}
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
        <RegularButton
          name={"Save Changes"}
          onClick={() => console.log("Save Changes")}
        />
      </div>
      <ModalPop
        openModal={openModal}
        content={<CommonModalContent tags={tags} setTags={setTags} />}
        setOpenModal={setOpenModal}
      />
      <Modal
        title="Edit Comorbid Conditions"
        onCancel={() => setIsEdit(false)}
        footer={false}
        open={isEdit}
      >
        <EditSettings form={form} handleEditRow={handleEditRow} />
      </Modal>
    </>
  );
};
const enhancer = connect(
  (state) => ({
    list: state?.tenantAdmin?.settings?.codingGuidelines?.data,
  }),
  {
    updateSettings: settingActions.updateSettingsAction,
    updateComorbidCondition: settingActions.updateComorbidCondition,
    editComoridConditions: settingActions.editComoridConditions,
    deleteComoridConditions: settingActions.deleteComoridConditions,
    getCodingDetails: settingActions.codingGuidelinesAction,
  }
);
export default enhancer(ComorbidConditions);
