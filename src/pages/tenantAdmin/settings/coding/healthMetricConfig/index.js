import React, { useState } from "react";
import Style from "../../style.module.css";
import RegularButton from "../../../../../components/button";
import { Input, Select} from "antd";
import FileUploader from "../../components/fileUploader";
import ModalPop from "../../components/modal";

const HealthMetricConfig = () => {
  const [openModal, setOpenModal] = useState(false);
  const [inputStrValue, setInputStrValue] = useState();
  const handleInputChange = (e) => {
    setInputStrValue(e.target.value);
  };
  const content = (
    <>
      <div className="p-3">
        <div className={Style.title}>File Processing Configuration</div>
        <div className="d-flex justify-content-between mt-4">
          <div>
            <div className={Style.heading}>Health Metric Type</div>
          </div>
          <div>
            <Select
              placeholder="Health Metric Type"
              options={[]}
              className={Style.selector2}
            />
          </div>
        </div>
        <div className="d-flex justify-content-between mt-4">
          <div>
            <div className={Style.heading}>Gender</div>
          </div>
          <div>
            <Select
              placeholder="Gender"
              options={[]}
              className={Style.selector2}
             
            />
          </div>
        </div>
        <div className="d-flex justify-content-between mt-4">
          <div>
            <div className={Style.heading}>health Metric Limit</div>
          </div>
          <div>
            <Input
              placeholder={"Limit"}
              onChange={(e) => handleInputChange(e, "code")}
              value={inputStrValue}
              style={{ padding: "22px" }}
            />
          </div>
        </div>
      </div>
      <div className="text-center">
        <RegularButton
        
          name={"Submit"}
          onClick={() => console.log("Restore Changes")}
        />
      </div>
    </>
  );
  return (
    <>
      <div className="p-3" style={{ height: "80vh" }}>
        <div className="d-flex justify-content-between">
          <div className={Style.title}>Health Metric Config</div>
        </div>
        <div>
          <FileUploader setOpenModal={setOpenModal} />
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
        content={content}
        setOpenModal={setOpenModal}
      />
    </>
  );
};

export default HealthMetricConfig;
