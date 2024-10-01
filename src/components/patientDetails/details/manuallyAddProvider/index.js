import React, { use, useEffect, useState } from "react";
import PdfViewer from "../PdfViewerComponent";
import { connect } from "react-redux";
import style from "./styles.module.css";
import { EditOutlined, DeleteOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Form, Popover } from "antd";
import { stringToColour } from "../components/function/ReusableFunctions";
import AddForm from "./AddForm";
import { actions as allActions } from "../../../../stores/patient/details";
import dayjs from 'dayjs'
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
}) => {
  const [form] = Form.useForm();
  const [selectFileURL, setSelectFileURL] = useState([]);
  const [providersList, setProvidersList] = useState(null);
  const handleEdit = (e, data) => {
    e.stopPropagation();
    form.setFieldsValue({
      dos:dayjs(data?.dateOfService)||"",
      dosSubstring: data?.dosSubstring || "",
      dosStartPageNumber: data?.dosStartPageNumber || "",
      dosEndPageNumber: data?.dosEndPageNumber || "",
      providerName: data?.providerName || "",
      providerPageNumber: data?.hyperlinks[0]?.pageNumber || "",
      providerCredentials: data?.providerCredentials || "",
      providerReference: data?.hyperlinks[0]?.substring || "",
      isProviderSigned: data?.unSigned || false,
      fileType: data?.fileType || "",
    });
    setProvidersList(data);
  };

  useEffect(() => {
    if (hccFileDetails?.data?.response) {
      setSelectFileURL(hccFileDetails?.data?.response);
    }
    if (dosYear) {
      getAddProviderAndDOSList(dosYear?.length > 0 ? dosYear[0]?.value : "");
    }
  }, [hccFileDetails, dosYear]);

  return (
    <div className="d-flex p-2 h-100">
      <div style={{ width: "50%" }}>
        <PdfViewer
          src={selectFileURL}
          searchQuery={""}
          pageNumber={1}
          headers={""}
        />
      </div>

      <div style={{ width: "30%" }} className="mx-2 h-100 overflow-scroll">
        <AddForm
          form={form}
          selectDosValue={selectDosValue}
          providersList={providersList}
          dosYear={dosYear}
        />
      </div>
      <div style={{ width: "20%" }}>
        {providersList && (
          <div className="d-flex justify-content-end align-items-center">
            {" "}
            <Button
              className={style.cancelBtn}
              onClick={(e) => {
                handleEdit(e, null);
                setProvidersList(null);
              }}
            >
              cancel
            </Button>
          </div>
        )}
        <div className="w-100 h-100 overflow-scroll">
          {dosAndProvidersList?.map((item) => (
            <button className={`${style.providerButton} my-2`}>
              <span className={style.dateField}>{item?.dateOfService}</span>
              <span className={style.providerText}>Provider</span>
              <Popover content={viewProvidersList({ list: item })}>
                <span className={style.count}>
                  {item?.hyperlinks?.length < 10
                    ? `0${item?.hyperlinks?.length}`
                    : item?.hyperlinks?.length}
                </span>
              </Popover>
              <span onClick={(e) => handleEdit(e, item)}>
                <EditOutlined style={{ color: "#06439D", fontSize: "16px" }} />
              </span>
            </button>
          ))}
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
  }),
  {
    getAddProviderAndDOSList: allActions.getAddProviderAndDOSList,
  }
);

export default enhancer(ManuallyAddProvider);
