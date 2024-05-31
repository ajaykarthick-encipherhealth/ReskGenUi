import React from "react";
import Style from "../../style.module.css";
import RegularButton from "../../../../../components/button";
import { Switch } from "antd";
import FileUploader from "../../components/fileUploader";
import ModalPop from "../../components/modal";

const ComorbidConditions = () => {
    const [openModal,setOpenModal]=useState(false)
    const onChange = (checked) => {
      console.log(`switch to ${checked}`);
    };
    const content=(
      <>
      conetnt</>
    )
  return (
    <>
      <div className="p-3" style={{ height: "80vh" }}>
        <div className="d-flex justify-content-between">
          <div className={Style.title}>Comorbid Conditions</div>
        </div>
        <div>
          <div className="d-flex justify-content-between mt-4">
            <div>Do You Have Direct Codes</div>
            <div className="d-flex justify-content-between">
              <Switch
                defaultChecked={true}
                className="directCodeSwitch"
                onChange={onChange}
              />
              <div className={`mx-2 text-${"info"}`}>Yes</div>
            </div>
          </div>
         <FileUploader setOpenModal={setOpenModal}/>
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
      <ModalPop openModal={openModal} content={content} setOpenModal={setOpenModal}/>
    </>
  );
};

export default ComorbidConditions;
