import { Button, Col, Form, Input, Row } from "antd";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const EditForm = ({
  setOpenEdit,
  initialValues,
  setInitialValues,
  setOpenContent,
  selectedData,
}) => {
  const [form] = Form.useForm();
  const patientDetailsResult = useSelector(
    (state) => state?.ReviewerReducers?.patientDetails
  );

  const handleChange = (field, value) => {
    setInitialValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };
  console.log(patientDetailsResult);
  const handleForm = (values) => {
    console.log(initialValues);
    setInitialValues({
      diagnosisCode: selectedData?.diagnosisCode,
      header: "",
      searchString: "",
      pagenumber: "",
      actualDescription: selectedData?.actualDescription,
    });
  };
  useEffect(() => {
    setOpenContent(null);
  });
  return (
    <Form form={form} onFinish={handleForm} labelCol={{ span: 6 }}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Diagnosis Code"
            name="diagnosisCode"
            wrapperCol={{ span: 18 }}
          >
            <div>
              <Input value={initialValues?.diagnosisCode} disabled={true} />
            </div>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Actual Description" name="actualDescription">
            <div>
              <Input value={initialValues?.actualDescription} disabled={true} />
            </div>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Header"
            name="header"
            rules={[
              {
                required: true,
                message: "Please enter header!",
              },
            ]}
          >
            <div>
              <Input
                placeholder="Enter header"
                value={initialValues.header}
                onChange={(e) => handleChange("header", e.target.value)}
              />
            </div>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Search String"
            name="searchString"
            rules={[
              {
                required: true,
                message: "Please enter search string!",
              },
            ]}
          >
            <div>
              <Input
                placeholder="Enter diagnosis search string"
                value={initialValues.searchString}
                onChange={(e) => handleChange("searchString", e.target.value)}
              />
            </div>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Page Number"
            name="pagenumber"
            rules={[
              {
                required: true,
                message: "Please enter pagenumber!",
              },
              {
                pattern: /^[0-9]{1,2}$/,
                message: "Please enter a valid page number (2 digits only).",
              },
            ]}
          >
            <div>
              <Input
                placeholder="Enter page number"
                value={initialValues.pagenumber}
                onChange={(e) => handleChange("pagenumber", e.target.value)}
              />
            </div>
          </Form.Item>
        </Col>
      </Row>

      <div style={{ display: "flex", gap: "8px" }}>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
        <Form.Item>
          <Button
            style={{
              backgroundColor: "#ffdede",
              color: "#ff5e5e",
              borderColor: "#ffdede",
            }}
            onClick={() => {
              setOpenEdit(false);
              setInitialValues({
                diagnosisCode: "",
                header: "",
                searchString: "",
                pagenumber: "",
              });
            }}
          >
            Cancel
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
};

export default EditForm;
