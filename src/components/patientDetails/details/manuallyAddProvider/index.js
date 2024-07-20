import React, { useEffect, useState } from "react";
import PdfViewer from "../PdfViewerComponent";
import { connect } from "react-redux";
import style from "./styles.module.css";
import { EditOutlined, DeleteOutlined, CloseOutlined } from "@ant-design/icons";
import { Form, Popover } from "antd";
import { stringToColour } from "../components/function/ReusableFunctions";
import AddForm from "./AddForm";

export const viewProvidersList = ({ list, isDeletable, handleDelete }) => (
  <div
    className={`row`}
    style={{
      width: !isDeletable && "350px",
      margin: !isDeletable && "0px 2px",
    }}
  >
    {list?.map((item) => (
      <div className={`col-lg-6 my-2`}>
        <div
          className={`${style.listShow}`}
          style={{
            backgroundColor: stringToColour(item?.name) + 33,
            color: stringToColour(item?.name),
          }}
        >
          <div style={{ textAlign: !isDeletable && "center", width: "100%" }}>
            {item?.name}
          </div>
          {isDeletable && (
            <div onClick={() => handleDelete(item?.id)}>
              <CloseOutlined
                style={{
                  fontSize: "12px",
                  color: stringToColour(item?.name),
                  cursor: "pointer",
                }}
              />
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
);
const ManuallyAddProvider = ({ hccFileDetails }) => {
  const [form] = Form.useForm();
  const [selectFileURL, setSelectFileURL] = useState([]);
  const [showAddForm, setShowAddForm] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [providersList, setProvidersList] = useState([]);
  const [DOSList, setDOSList] = useState([
    {
      id: 1,
      date: "05-20-2024",
      providersList: [
        {
          id: 1,
          name: "Nancy Cristoforo, MD",
        },
      ],
    },
  ]);
  const handleDelete = (e, id) => {
    e.stopPropagation();
    setDOSList((prev) => prev?.filter((item) => item?.id !== id));
  };
  const handleEdit = (e, id) => {
    e.stopPropagation();
    const data = DOSList?.find((item) => item?.id === id);
    setSelectedDate(data?.date);
    setProvidersList(data?.providersList);
  };

  useEffect(() => {
    if (hccFileDetails?.data?.response) {
      setSelectFileURL(hccFileDetails?.data?.response);
    }
  }, [hccFileDetails]);

  return (
    <div className="d-flex p-2">
      <div style={{ width: "60%" }}>
        <PdfViewer
          src={selectFileURL}
          searchQuery={""}
          pageNumber={1}
          headers={""}
          height="100vh"
          // heightFrame='100vh'
        />
      </div>
      <div style={{ width: "40%", margin: "20px 20px 0px 20px" }}>
        <div>
          <AddForm
            form={form}
            setDOSList={setDOSList}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            providersList={providersList}
            setProvidersList={setProvidersList}
            showAddForm={showAddForm}
            setShowAddForm={setShowAddForm}
          />
        </div>

        {DOSList?.map((item) => (
          <button className={style.providerButton}>
            <span className={style.dateField}>{item?.date}</span>
            <span className={style.providerText}>Provider</span>
            <Popover content={viewProvidersList({ list: item?.providersList })}>
              <span className={style.count}>
                {item?.providersList?.length < 10
                  ? `0${item?.providersList?.length}`
                  : item?.providersList?.length}
              </span>
            </Popover>
            <span onClick={(e) => handleEdit(e, item?.id)}>
              <EditOutlined style={{ color: "#06439D", fontSize: "16px" }} />
            </span>
            <span onClick={(e) => handleDelete(e, item?.id)}>
              <DeleteOutlined style={{ color: "#06439D", fontSize: "16px" }} />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
const enhancer = connect((state) => ({
  hccFileDetails: state?.patientDetails?.details?.hccFileResult,
}));

export default enhancer(ManuallyAddProvider);
