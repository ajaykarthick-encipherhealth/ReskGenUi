import React, { useEffect, useState } from "react";
import Style from "../../style.module.css";
import RegularButton from "../../../../../components/button";
import { Button, Checkbox, Divider, Form, Modal, Switch } from "antd";
import ModalPop from "../../components/modal";
import CommonModalContent from "../../components/commonModalContent";
import { connect } from "react-redux";
import { actions as settingActions } from "../../../../../stores/tenantAdmin/settings";
import { useSelector } from "react-redux";
import FileUpload from "../../../../../components/table/tenantSettingsTable/fileUpload";
import { PlusOutlined } from "@ant-design/icons";
import FilterButton from "../../../../../components/table/tenantSettingsTable/filterButton";
import Search from "../../../../../components/table/tenantSettingsTable/search";
import TenantSettingsTable from "../../../../../components/table/tenantSettingsTable/tenantSettingsTable";
import ENDPOINTS from "../../../../../utility/enpoints";
import axios from "../../../../../utility/axiosConfig";
import { getResponePopup } from "../../../../../utils/reusable";
import EditSettings from "../../components/edit";

const CriticalConditions = ({
  updateSettings,
  updateCriticalCondition,
  getCodingDetails,
  editComoridConditions,
  deleteComoridConditions,
  list,
}) => {
  const [form] = Form.useForm();
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState(null);
  const [isChecked, setIsChecked] = useState({
    captureCriticalConditionsForOutpatient: false,
    includeGeneralGuidelineCodes: false,
  });
  const [isEdit, setIsEdit] = useState(false);
  const [editRowValue, setEditRowValue] = useState(null);
  const [selectFile, setSelectFile] = useState("");
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [page, setPage] = useState(0);
  const [tags, setTags] = useState([]);
  const [isCheckeds, setIsCheckeds] = useState(false);

  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    { title: "Description", dataIndex: "description", key: "description" },
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
  }, [search, page]);

  const handleGuidelines = async (value, name) => {
    try {
      const res = await updateCriticalCondition({ [name]: value });
      if (res.status == "SUCCESS") {
        getResponePopup(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCodingDetailsDetails = async () => {
    try {
      const res = await getCodingDetails({
        type: "CRITICAL_CONDITIONS",
        page: page,
        search: search,
      });
      if (res?.status == "SUCCESS") {
        setIsChecked({
          includeGeneralGuidelineCodes:
            res?.response?.includeGeneralGuidelineCodes,
          captureCriticalConditionsForOutpatient:
            res?.response?.captureCriticalConditionsForOutpatient,
        });
      }
    } catch (error) {}
  };
  const handleDeleteRow = async (value) => {
    try {
      const res = await deleteComoridConditions({
        id: value.id,
        target: "CRITICAL_CONDITIONS",
      });
      if (res.status == "SUCCESS") {
        getResponePopup(res);
        setIsEdit(false);
        setEditRowValue(null);
        getCodingDetailsDetails();
      } else if (res.status == "USER_DEFINED_ERROR") {
        getResponePopup(res);
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
        target: "CRITICAL_CONDITIONS",
      });
      if (res.status == "SUCCESS") {
        getResponePopup(res);
        setIsEdit(false);
        setEditRowValue(null);
        getCodingDetailsDetails();
      } else if (res.status == "USER_DEFINED_ERROR") {
        getResponePopup(res);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const submitPatientFile = async () => {
    const formData = new FormData();
    formData.append("file", selectFile.originFileObj);
    formData.append("target", "CRITICAL_CONDITIONS");
    formData.append("isDefaultYear", isCheckeds);
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

  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPage(e.page);
  };

  return (
    <>
      <div className="p-3">
        <div className="d-flex justify-content-between">
          <div className={Style.title}>Critical Conditions</div>
        </div>
        <div className="d-flex justify-content-between">
          <div className="d-flex justify-content-start gap-2 mt-4">
            <div>Year</div>
            <div>
              <Switch checked={isCheckeds} onChange={(e) => setIsCheckeds(e)} />
            </div>
            <div>Can We calculate for all Processing Year</div>
          </div>

          <div className="d-flex justify-content-start gap-2">
            <div className="d-flex">
              <FileUpload
                allowedFormat={"File must be in xlsx or CSV"}
                onChange={(e) => setSelectFile(e.file)}
                fileList={[]}
                accept={".xlsx, .csv"}
              />
              <RegularButton
                name="Upload"
                type={selectFile}
                disabled={!selectFile}
                onClick={submitPatientFile}
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
              checked={isChecked.includeGeneralGuidelineCodes}
              onChange={(e) => {
                setIsChecked((prev) => ({
                  ...prev,
                  includeGeneralGuidelineCodes: e,
                }));
                handleGuidelines(e, "includeGeneralGuidelineCodes");
              }}
            />
            <div className={`mx-2`}>
              {isChecked.includeGeneralGuidelineCodes ? "Yes" : "No"}
            </div>
          </div>
          <div className="">
            {"Do you need to capture critical condition for patients"}
          </div>
          <div className="d-flex">
            <Switch
              checked={isChecked.captureCriticalConditionsForOutpatient}
              onChange={(e) => {
                setIsChecked((prev) => ({
                  ...prev,
                  captureCriticalConditionsForOutpatient: e,
                }));
                handleGuidelines(e, "captureCriticalConditionsForOutpatient");
              }}
            />
            <div className={`mx-2`}>
              {isChecked.captureCriticalConditionsForOutpatient ? "Yes" : "No"}
            </div>
          </div>
          <div className="ms-auto mx-4">
            <Search setSearch={setSearch} value={search} />
          </div>
        </div>
        <div>
          <TenantSettingsTable
            columns={columns}
            data={list?.response?.criticalConditionsPage?.content}
            handleEdit={(e) => {
              setEditRowValue(e);
              setIsEdit(e);
              form.setFieldsValue({ ...e });
            }}
            handleDelete={handleDeleteRow}
            paginationFirst={paginationFirst}
            totalElements={
              list?.response?.criticalConditionsPage?.totalElements
            }
            onPageChange={onPageChange}
          />
        </div>
      </div>
      {/* <div className="text-end p-3">
        <RegularButton
          type={"outline"}
          name={"Restore Changes"}
          onClick={() => console.log("Restore Changes")}
        />
        <RegularButton
          name={"Save Changes"}
          onClick={() => handleSettingsUpdate()}
        />
      </div> */}
      <ModalPop
        openModal={openModal}
        content={
          <CommonModalContent
            tags={tags}
            setTags={setTags}
            isChecked={isCheckeds}
            target={"CRITICAL_CONDITIONS"}
            setOpenModal={() => setOpenModal(false)}
          />
        }
        setOpenModal={() => setOpenModal(false)}
      />
      <Modal
        title="Edit Critical Conditions"
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
    updateCriticalCondition: settingActions.updateCriticalCondition,
    editComoridConditions: settingActions.editComoridConditions,
    deleteComoridConditions: settingActions.deleteComoridConditions,
    getCodingDetails: settingActions.codingGuidelinesAction,
  }
);

export default enhancer(CriticalConditions);
