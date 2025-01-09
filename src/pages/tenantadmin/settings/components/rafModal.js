import { Form, Input, Popconfirm, Select } from "antd";
import React, { useEffect, useState } from "react";
import { getResponePopup, getYears } from "../../../../utils/reusable";
import RegularButton from "../../../../components/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { actions as settingActions } from "../../../../stores/tenantAdmin/settings";
import { connect } from "react-redux";

const RafModal = ({
  manuallyAddedRaf,
  setIsEdit,
  reRenderPage,
  isEdit,
  updateDetails,
  year,
  handleEditRow,
}) => {
  const [form] = Form.useForm();
  const [isEditModal, setIsEditModal] = useState("");
  const [modalValues, setModalValues] = useState([]);
  const hnadleSave = () => {
    const formData = form.getFieldsValue();
    const id = modalValues.length + 1;
    if (isEditModal) {
      const update = modalValues.map((item) =>
        item.id == isEditModal
          ? {
              id: form.getFieldsValue().id,
              rafCategory: formData.rafCategory,
              rafVersion: formData.rafVersion,
              rafPercentage: formData.rafPercentage,
              rafScoreBaseRate: formData.rafScoreBaseRate,
            }
          : item
      );
      setModalValues(update);
      setIsEditModal("");
    } else if (formData.rafCategory && id) {
      setModalValues((prev) => [
        ...prev,
        ...[
          {
            id: id,
            rafCategory: formData.rafCategory,
            rafVersion: formData.rafVersion,
            rafPercentage: formData.rafPercentage,
            rafScoreBaseRate: formData.rafScoreBaseRate,
          },
        ],
      ]);
    }
    form.setFieldsValue({
      year: form.getFieldsValue().year,
      rafCategory: "",
      rafVersion: "",
      rafPercentage: "",
      rafScoreBaseRate: "",
    });
  };
  const handleSubmit = async () => {
    try {
      const res = await manuallyAddedRaf({
        year: form.getFieldsValue().year,
        baseRateList: modalValues,
      });

      if (res.status == "SUCCESS") {
        getResponePopup(res);
        setIsEdit(false);
        reRenderPage();
        setModalValues([]);
        form.resetFields();
      } else if (res.status == "USER_DEFINED_ERROR") {
        getResponePopup(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isEdit && updateDetails) {
      form.setFieldsValue({
        year: year,
        rafCategory: updateDetails.rafCategory,
        rafVersion: updateDetails.rafVersion,
        rafPercentage: updateDetails.rafPercentage,
        rafScoreBaseRate: updateDetails.rafScoreBaseRate,
      });
    } else if (!isEdit) {
        form.resetFields()
    }
  }, [isEdit, updateDetails]);
  return (
    <div>
      <Form form={form} onFinish={(e) => console.log(e)} layout="vertical">
        <div>
          <Form.Item label={"Years"} name={"year"}>
            <Select
              allowClear
              options={getYears()}
              size="large"
              disabled={isEdit}
            />
          </Form.Item>
        </div>
        <div className="border rounded p-2">
          <div className="font-bold fs-5">Modal</div>
          <div className="row">
            <div className="col-6">
              <Form.Item label={"Category"} name="rafCategory">
                <Select
                  allowClear
                  options={[
                    { label: "RX HCC", value: "RX_HCC" },
                    { label: "CMS HCC", value: "CMS_HCC" },
                    { label: "CMS ESRD", value: "CMS_ESRD" },
                  ]}
                  size="large"
                />
              </Form.Item>
            </div>
            <div className="col-6">
              <Form.Item label={"Version"} name="rafVersion">
                <Input />
              </Form.Item>
            </div>
            <div className="col-6">
              <Form.Item label={"Percentage"} name="rafPercentage">
                <Input />
              </Form.Item>
            </div>
            <div className="col-6">
              <Form.Item label={"Score Base Rate"} name="rafScoreBaseRate">
                <Input />
              </Form.Item>
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <Form.Item>
                {isEdit ? <RegularButton
                name={"Update"}
                onClick={() => handleEditRow(form.getFieldsValue())}
              /> : 
              <RegularButton
                name={isEditModal ? "Update" : "Save"}
                onClick={hnadleSave}
              /> }
            </Form.Item>
          </div>
        </div>
      </Form>
      <div>
        {modalValues.length > 0 &&
          modalValues.map((item, index) => (
            <div className="d-inline-block mt-4 me-4">
              <div className="d-flex justify-content-between px-2">
                <div className="text-bold">Modal {index + 1}</div>
                <div>
                  <span className="px-2 cr-pointer">
                    {
                      <FontAwesomeIcon
                        icon={faPen}
                        style={{
                          fontSize: "15px",
                          color: "#6464ff",
                        }}
                        onClick={() => {
                          setIsEditModal(item.id);
                          form.setFieldsValue({
                            id: item.id,
                            rafCategory: item.rafCategory,
                            rafVersion: item.rafVersion,
                            rafPercentage: item.rafPercentage,
                            rafScoreBaseRate: item.rafScoreBaseRate,
                          });
                        }}
                      />
                    }
                  </span>
                  <span className=" cr-pointer">
                    {
                      <Popconfirm
                        title="Are you sure you want to delete?"
                        onConfirm={() => {
                          const del = modalValues.filter(
                            (value) => value.id != item.id
                          );
                          setModalValues(del);
                        }}
                        okText="Yes"
                        cancelText="No"
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          style={{
                            fontSize: "15px",
                            color: "#dc4848",
                          }}
                        />
                      </Popconfirm>
                    }
                  </span>
                </div>
              </div>
              <div className="border p-2 d-flex rounded">
                <div className="me-3">
                  <div>Category</div>
                  <div>Version</div>
                  <div>Percentage</div>
                  <div>Score Base Rate</div>
                </div>
                <div>
                  <div>{item?.rafCategory}</div>
                  <div>{item?.rafVersion}</div>
                  <div>{item?.rafPercentage}</div>
                  <div>{item?.rafScoreBaseRate}</div>
                </div>
              </div>
            </div>
          ))}
        {modalValues.length > 0 && (
          <div className="text-center mt-4">
            <RegularButton name="Submit" onClick={handleSubmit} />
          </div>
        )}
      </div>
    </div>
  );
};
const enhancer = connect((state) => ({}), {
  manuallyAddedRaf: settingActions.manuallyAddedRaf,
  getCodingDetails: settingActions.codingGuidelinesAction,
});

export default enhancer(RafModal);
