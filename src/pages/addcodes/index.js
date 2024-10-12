import React, { useEffect, useState } from "react";
import { getResponePopup } from "../../utils/reusable";
import { actions as dashbaordActions } from "../../stores/codify/dashboard";
import { connect } from "react-redux";

const AddCode = ({ addCodesData }) => {
  const [first, setFirst] = useState("");
  const [sec, setSec] = useState("");

  const setCodes = async () => {
    if (first && sec) {
      try {
        const res = await addCodesData({
          diagnosisCode: first,
          description: sec,
        });
        if (res?.status !== "SUCCESS") {
          getResponePopup(res);
        }
      } catch (error) {
        console.error(error, "error");
      }
    }
  };

  return (
    <div className="d-flex align-item-center justify-content-center my-5">
      <div
        style={{ width: "700px", background: "#f5f5f5" }}
        className="border p-3 py-5"
      >
        <form>
          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">
              Diagnosis Code
            </label>
            <input
              type="text"
              class="form-control"
              id="exampleInputEmail1"
              value={first}
              onChange={(e) => setFirst(e.target.value)}
            />
          </div>
          <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">
              Description
            </label>
            <input
              type="text"
              class="form-control"
              id="exampleInputPassword1"
              value={sec}
              onChange={(e) => setSec(e.target.value)}
            />
          </div>
          <button type="button" class="btn btn-primary" onClick={setCodes}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};
const enhancer = connect((state) => ({}), {
  addCodesData: dashbaordActions.addCodesAction,
});
export default enhancer(AddCode);
