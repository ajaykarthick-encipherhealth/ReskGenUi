import { Form, Modal } from "antd";
import React from "react";
import { getResponePopup } from "../../../../utils/reusable";
import { connect } from "react-redux";
import { actions as allActions } from "../../../../stores/tenantAdmin/patientSync";
import UploadFile from ".";

const uploadModal = ({
  openUpload,
  setOpenUpload,
  getAllBatches,
  setUploadAction,
  setFileLoading,
  fileList,
  setFileList,
  fileLoading,
  uploadAction,
  uploadFilesLoader,
  pageNo,
  uploadFiles,
  singleUpload,
  currentId,
}) => {
  const [form] = Form.useForm();
  const handleUpload = async () => {
    if (fileList && fileList?.length > 0) {
      const uploadPromises = fileList?.map((item) => {
        const formData = new FormData();
        formData.append("file", item);
        formData.append("batchId", openUpload?.data?.id);
        formData.append("yearOfServices", openUpload?.data?.yearOfService);
        // for single upload
        const formData2 = new FormData();
        formData2.append("file", item);
        formData2.append("batchId", currentId?.id);
        formData2.append("batchUploadDetailsId", openUpload?.data?.id);
        return uploadFiles({ obj: singleUpload ? formData2 : formData });
      });
      const responses = await Promise.all(uploadPromises);
      const lastData = responses[responses?.length - 1];
      if (lastData?.status === "SUCCESS") {
        getResponePopup(lastData);
        setOpenUpload({ status: false, data: null });
        getAllBatches({ page: pageNo });
        form.resetFields();
        setFileList([]);
        setFileLoading(false);
        setUploadAction(null);
      }
    }
  };

  return (
    <Modal
      open={openUpload?.status}
      onCancel={() => {
        setOpenUpload({ status: false, data: null });
        setFileList([]);
        setUploadAction(null);
        setFileLoading(false);
      }}
      footer={false}
    >
      <Form form={form} onFinish={handleUpload} layout="vertical">
        <Form.Item
          label={
            <label>
              Upload <span className="text-danger">*</span>
            </label>
          }
          name="upload"
        >
          <UploadFile
            filesList={fileList}
            setFilesList={setFileList}
            setIsLoading={setFileLoading}
            isLoading={fileLoading}
            uploadFolder={true}
            openUpload={openUpload}
            setUploadAction={setUploadAction}
            uploadAction={uploadAction}
            singleUpload={singleUpload}
          />
        </Form.Item>
        {uploadAction && (
          <Form.Item>
            <div className="col-xl-12 mb-3 d-flex justify-content-center">
              <button
                type="submit"
                style={{ backgroundColor: "#04306f" }}
                className="border-0 px-4 py-2 text-white rounded-1"
                disabled={
                  fileList?.length > 0 && !fileLoading && !uploadFilesLoader
                    ? false
                    : true
                }
              >
                {uploadFilesLoader ? "Loading..." : "Submit"}
              </button>
              {/* <button
            type="submit"
            style={{ backgroundColor: "#04306f" }}
            className="border-0 px-4 py-2 text-white rounded-1 mx-2"
            onClick={()=>{setUploadAction(null)
              setFileList([])
            }}
          >
            Select Upload Type
          </button> */}
            </div>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};
const connector = connect(
  (state) => ({
    pdfTableData: state.tenantAdmin?.patientSync?.allBatches?.data?.response,
    pdfLoader: state.tenantAdmin?.patientSync?.batchLoader,
    reportActiveTab: state.admin?.report?.activeTab,
    uploadFilesLoader: state?.tenantAdmin?.patientSync?.uploadFilesLoader,
  }),
  {
    getAllBatches: allActions.getAllBatches,
    uploadFiles: allActions.upoloadFiles,
  }
);
export default connector(uploadModal);
