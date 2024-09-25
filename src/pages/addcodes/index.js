import React, { useState } from "react";
import axios from "../../utility/axiosConfig";
import ENDPOINTS from "../../utility/enpoints";
import { getResponePopup } from "../../utils/reusable";
import { getStorage } from "../../utils/storages";

const AddCode = () => {
  const [first, setFirst] = useState("");
  const [sec, setSec] = useState("");

  const setCode = async () => {
    if (first && sec) {
        const token = getStorage("token");
        try {
          const response = await axios.post(
            `${ENDPOINTS?.apiEndoint}dbservice/disease/addicdcode`,
            { diagnosisCode: first, description: sec },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response?.data?.status == "SUCCESS") {
            getResponePopup(response);
            setFirst("");
            setSec("");
          }
          return response.data;
        } catch (err) {
          console.log(err);
        }
    } else {
        getResponePopup({data: {status: "FAILED", message: "Enter the values"}})
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
          <button type="button" class="btn btn-primary" onClick={setCode}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCode;
