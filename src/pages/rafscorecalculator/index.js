import React from "react";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Input, Select } from "antd";
import RegularButton from "../../components/button";
import Style from "./style.module.css";

const { TextArea } = Input;

const RafScoreCalculator = () => {
  const data = {
    demographic: [
      {
        category: "Demographic",
        description: "Demographic test",
        cmsHcc: "",
        raf: "0.308",
        payment: "2884.57",
      },
    ],
    diagnosis: [
      {
        category: "I5020",
        description: "Unspecified systolic (congestive) heart failure",
        cmsHcc: "HCC 85",
        raf: "0.301",
        payment: "3099.98",
      },
      {
        category: "E1122",
        description:
          "Type 2 diabetes mellitus with diabetic chronic kidney disease",
        cmsHcc: "HCC 18",
        raf: "0.302",
        payment: "2828.38",
      },
      {
        category: "J449",
        description: "Chronic obstructive pulmonary disease, unspecified",
        cmsHcc: "HCC 111",
        raf: "0.335",
        payment: "3137.44",
      },
    ],
    diseaseInteractions: [
      {
        category: "CHF_COPD",
        description: "Unspecified systolic (congestive) heart failure",
        cmsHcc: "",
        raf: "0.155",
        payment: "1451.65",
      },
      {
        category: "DIABETES_CHF",
        description:
          "Type 2 diabetes mellitus with diabetic chronic kidney disease",
        cmsHcc: "",
        raf: "0.121",
        payment: "1133.23",
      },
    ],
  };

  return (
    <div className="m-5">
      <div className="card p-5 py-3">
        <div className="d-flex justify-content-between">
          <div></div>
          <div className="mr-5 app-text fs-3">Try Our RAF Score Calculator</div>
          <div className="border border-primary rounded p-2 px-4">
            Available hits for today: 9
          </div>
        </div>
        <div className="my-5">
          <Form
            //   form={form}
            name="basic"
            layout="vertical"
            autoComplete="off"
            // initialValues={formInitialValues}
            onFinish={(form) => {
              handledSave(form);
              console.log(form);
            }}
            onFinishFailed={() => {}}
          >
            <div className="row">
              <div className="col-4">
                <Form.Item
                  label={
                    <label>
                      Risk Model <span style={{ color: "red" }}>*</span>
                    </label>
                  }
                  name="Risk-Model"
                  rules={[
                    {
                      required: true,
                      message: "Please select risk model",
                    },
                  ]}
                >
                  <Select
                    name="Risk-Model"
                    size="large"
                    options={[]}
                    onChange={(val) => setSection(val)}
                  />
                </Form.Item>
              </div>
              <div className="col-4">
                <Form.Item
                  label={
                    <label>
                      Risk Factor <span style={{ color: "red" }}>*</span>
                    </label>
                  }
                  name="Risk-Factor"
                  rules={[
                    {
                      required: true,
                      message: "Please select risk factor",
                    },
                  ]}
                >
                  <Select
                    name="Risk-Factor"
                    size="large"
                    options={[]}
                    onChange={(val) => setSection(val)}
                  />
                </Form.Item>
              </div>
              <div className="col-2">
                <Form.Item
                  label={
                    <label>
                      Gender <span style={{ color: "red" }}>*</span>
                    </label>
                  }
                  name="Gender"
                  rules={[
                    {
                      required: true,
                      message: "Please select gender",
                    },
                  ]}
                >
                  <Select
                    name="Gender"
                    size="large"
                    options={[]}
                    onChange={(val) => setSection(val)}
                  />
                </Form.Item>
              </div>
              <div className="col-2">
                <Form.Item
                  label={
                    <label>
                      Age <span style={{ color: "red" }}>*</span>
                    </label>
                  }
                  name="age"
                  rules={[
                    {
                      required: true,
                      message: "Please enter age",
                    },
                  ]}
                >
                  <Input name="age" type="number" />
                </Form.Item>
              </div>
              <div className="col-3">
                <div>
                  <label>Diagnosis codes</label>
                  <div className="border fs-4 rounded p-3">
                    <FontAwesomeIcon icon={faInfoCircle} />{" "}
                    <label className="fs-4">Sample Data : </label>
                    <label className="fs-4">&nbsp; I5020,E1122,J449</label>
                    <div className="mx-3" style={{ marginBottom: "5px" }}>
                      <RegularButton name="Use this!" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-7">
                <div style={{ marginTop: "30px" }}>
                  <Form.Item
                    label={""}
                    name="diagnosi-code"
                    rules={[
                      {
                        required: true,
                        message: "Please enter diagnosis codes",
                      },
                    ]}
                  >
                    <TextArea
                      placeholder="Enter Diagnosis codes"
                      autoSize={{ minRows: 5, maxRows: 5 }}
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="col-2">
                <div style={{ marginTop: "100px" }}>
                  <RegularButton name="Get RAF Score" />
                </div>
              </div>
            </div>
          </Form>
        </div>
        <div className={Style.rafTable}>
          <table border={1} width={"100%"}>
            <thead>
              <tr style={{ background: "#043069", color: "#fff" }}>
                <th>Category/ICD10</th>
                <th>Diagnosis Description</th>
                <th>CMS-HCC-V24</th>
                <th>RAF Score</th>
                <th>MA Payment</th>
              </tr>
            </thead>
            <tbody>
              {data.demographic?.map((item) => (
                <tr>
                  <td>{item.category}</td>
                  <td>{item.description}</td>
                  <td>{item.cmsHcc}</td>
                  <td>{item.raf}</td>
                  <td>$ {item.payment}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="5">Diagnosis</td>
              </tr>
              {data.diagnosis?.map((item) => (
                <tr>
                  <td>{item.category}</td>
                  <td>{item.description}</td>
                  <td>{item.cmsHcc}</td>
                  <td>{item.raf}</td>
                  <td>$ {item.payment}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="5" className="fs-4 fw-bolder">
                  Disease Interactions
                </td>
              </tr>
              {data.diseaseInteractions?.map((item) => (
                <tr>
                  <td>{item.category}</td>
                  <td>{item.description}</td>
                  <td>{item.cmsHcc}</td>
                  <td>{item.raf}</td>
                  <td>$ {item.payment}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: "#043069", color: "#fff" }}>
                <td colSpan="3">Grand Total</td>
                <td>1.552</td>
                <td>$ 14535.25</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="text-end my-4">
          <RegularButton name="Download" width={"200px"} />
        </div>
      </div>
    </div>
  );
};

export default RafScoreCalculator;
