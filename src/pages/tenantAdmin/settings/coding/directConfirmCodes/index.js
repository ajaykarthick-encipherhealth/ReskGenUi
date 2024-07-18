import React, { useEffect, useState } from "react";
import Style from "../../style.module.css";
import RegularButton from "../../../../../components/button";
import { Button, Checkbox, Divider, Form, Modal, Switch } from "antd";
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
import EditSettings from "../../components/edit";

const DirectConfirmCodes = ({
  updateSettings,
  updateDirectCode,
  getCodingDetails,
  list,
  uploadfile,
  deleteComoridConditions,
  editComoridConditions,
}) => {
  const [form] = Form.useForm();
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState(null);
  const [isGuidelines, setIsGuidelines] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [selectFile, setSelectFile] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [page, setPage] = useState(0);
  const [editRowValue, setEditRowValue] = useState(null);
  const [tags, setTags] = useState([]);
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
    getDirectConfirmDetails();
  }, [paginationFirst]);

  const getDirectConfirmDetails = async () => {
    try {
      const res = await getCodingDetails({
        type: "DIRECT_CONFIRM_CODES",
        page: page,
      });
      if (res?.status == "SUCCESS") {
        setIsGuidelines(res?.response?.includeGeneralGuidelineCodes);
      }
    } catch (error) {}
  };

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
    formData.append("target", "DIRECT_CONFIRM_CODES");
    formData.append("isDefaultYear", isChecked);
    const headers = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const res = await axios.post(
      ENDPOINTS.apiEndoint +
        `management/tenantAdmin/codes/upload
      `,
      formData,
      headers
    );
    setSelectFile("");
    if (res.status == "SUCCESS") {
      getResponePopup(res);
    } else if (res.status == "USER_DEFINED_ERROR") {
      getResponePopup(res);
    }
  };

  const handleDeleteRow = async (value) => {
    try {
      const res = await deleteComoridConditions({
        id: value.id,
        target: "DIRECT_CONFIRM_CODES",
      });
      if (res.status == "SUCCESS") {
        getResponePopup(res);
        setIsEdit(false);
        setEditRowValue(null);
        getDirectConfirmDetails();
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
        target: "DIRECT_CONFIRM_CODES",
      });
      if (res.status == "SUCCESS") {
        getResponePopup(res);
        setIsEdit(false);
        setEditRowValue(null);
        getDirectConfirmDetails();
      } else if (res.status == "USER_DEFINED_ERROR") {
        getResponePopup(res);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPage(e.page);
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
                  <Switch
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e)}
                  />
                </div>
                <div>Can We calculate for all Processing Year</div>
              </div>
            </div>

            <div className="d-flex justify-content-start">
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
                    height: "44px",
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
              <Search setSearch={setSearch} value={search} />
            </div>
          </div>
          <div>
            <TenantSettingsTable
              columns={columns}
              data={list?.response?.directConfirmCodesPage?.content}
              handleEdit={(e) => {
                setEditRowValue(e);
                setIsEdit(e);
                form.setFieldsValue({ ...e });
              }}
              // isNoDelete={false}
              handleDelete={handleDeleteRow}
              paginationFirst={paginationFirst}
              totalElements={
                list?.response?.directConfirmCodesPage?.totalElements
              }
              onPageChange={onPageChange}
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
        {/* <RegularButton name={"Save Changes"} onClick={submitPatientFile} /> */}
      </div>
      <ModalPop
        openModal={openModal}
        content={
          <CommonModalContent
            tags={tags}
            setTags={setTags}
            isChecked={isChecked}
            target={"DIRECT_CONFIRM_CODES"}
            setOpenModal={() => setOpenModal(false)}
          />
        }
        setOpenModal={() => setOpenModal(false)}
      />
      <Modal
        title="Edit Direct Confirm Codes"
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
    updateDirectCode: settingActions.updateDirectCode,
    uploadfile: settingActions.uploadFiles,
    editComoridConditions: settingActions.editComoridConditions,
    deleteComoridConditions: settingActions.deleteComoridConditions,
    getCodingDetails: settingActions.codingGuidelinesAction,
  }
);
export default enhancer(DirectConfirmCodes);
