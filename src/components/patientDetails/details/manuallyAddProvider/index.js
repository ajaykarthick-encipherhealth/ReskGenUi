import React, { use, useEffect, useState } from "react";
import PdfViewer from "../PdfViewerComponent";
import { connect } from "react-redux";
import style from "./styles.module.css";
import { EditOutlined, DeleteOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Empty, Form, Popover } from "antd";
import { stringToColour } from "../components/function/ReusableFunctions";
import AddForm from "./AddForm";
import { actions as allActions } from "../../../../stores/patient/details";
import dayjs from "dayjs";
import TableSkeleton from "../../../skeleton/table";
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
  dosYearDefalutSelect
}) => {
  const [form] = Form.useForm();
  const [selectFileURL, setSelectFileURL] = useState([]);
  const [providersList, setProvidersList] = useState(null);
  const handleEdit = (e, data) => {
    e.stopPropagation();
    form.setFieldsValue({
      dos: data?.dateOfService ? dayjs(data?.dateOfService) : null,
      dosSubstring: data?.dosSubstring || "",
      dosStartPageNumber: data?.dosStartPageNumber || "",
      dosEndPageNumber: data?.dosEndPageNumber || "",
      providerName: data?.providerName || "",
      providerPageNumber: data?.hyperlinks[0]?.pageNumber || "",
      providerCredentials: data?.providerCredentials || "",
      providerReference: data?.hyperlinks[0]?.substring || "",
      isProviderSigned: !data?.noCredential ? true : false || false,
      fileType: data?.fileType || "",
    });
    setProvidersList(data);
  };
  useEffect(() => {
    if (hccFileDetails?.data?.response) {
      setSelectFileURL(hccFileDetails?.data?.response?.azureBlobPath);
    }
    if (dosYearDefalutSelect) {
      getAddProviderAndDOSList(dosYearDefalutSelect?.value?dosYearDefalutSelect?.value : dosYearDefalutSelect);
    }
  }, [hccFileDetails, dosYearDefalutSelect]);

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
          selectedDosValue={selectedDosValue}
          dosYearDefalutSelect={dosYearDefalutSelect}
        />
      </div>
      <div style={{ width: "20%" }}>
        {providersList && (
          <div className="d-flex justify-content-end align-items-center">
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
        <div
          className="w-100 h-100 overflow-scroll"
          id="dosAndProvidersList"
          name="dosAndProvidersList"
        >
          {loader ? (
            <TableSkeleton />
          ) : Array.isArray(dosAndProvidersList) ? (
            dosAndProvidersList?.map((item, index) => (
              <button
                id={`dosAndProvidersList${index}`}
                name={`dosAndProvidersList${index}`}
                className={`ant-badge ${style.providerButton} my-2`}
                key={item?.id}
              >
                <span className={style.dateField}>{item?.dateOfService}</span>
                <span
                  id="dosAndProvider-name"
                  name="dosAndProvider-name"
                  className={style.providerText}
                >
                  Provider
                </span>
                <Popover
                  id={`dosAndProvider-name-pop-${index}`}
                  name={`dosAndProvider-name-pop-${index}`}
                  content={viewProvidersList({ list: item })}
                >
                  <span
                    id={`dosAndProvider-name-pop-content-${index}`}
                    name={`dosAndProvider-name-pop-content-${index}`}
                    className={style.count}
                  >
                    {item?.hyperlinks?.length < 10
                      ? `0${item?.hyperlinks?.length}`
                      : item?.hyperlinks?.length}
                  </span>
                </Popover>
                <span
                  onClick={(e) => handleEdit(e, item)}
                  id={`dosAndProvidersEdit-${index}`}
                  name={`dosAndProvidersEdit-${index}`}
                >
                  <EditOutlined
                    style={{ color: "#06439D", fontSize: "16px" }}
                  />
                </span>
              </button>
            ))
          ) : (
            <Empty />
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
  }
);

  export default enhancer(ManuallyAddProvider);
