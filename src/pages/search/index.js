import React, { useEffect, useState } from "react";
import axios from "../../utility/axiosConfig";
import { Modal } from "antd";

const Searches = () => {
  const [search, serSearch] = useState("");
  const [list, setList] = useState([]);
  const [modalOpen, setModalOpen] = useState("");
  const [updateDetails, setUpdateDetails] = useState();
  const getSearch = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://13.68.177.51:8090/res?q=${search}`
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // }
      );
      setList(response.data);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setUpdateDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  console.log(updateDetails, "updateDetails");
  return (
    <>
      <div className="d-flex justify-content-center align-item-center">
        <div style={{ width: "600px" }}>
          <div className="d-flex justify-content-center mt-5">
            <button
              class="btns-primary btn-app-primary mx-2"
              type="button"
              id="button-addon2"
              onClick={() => setModalOpen("Add")}
            >
              Add
            </button>
            <button
              class="btns-primary btn-app-primary mx-2"
              type="button"
              id="button-addon2"
              onClick={() => setModalOpen("Edit")}
            >
              Edit
            </button>
          </div>
          <div class="d-flex my-5">
            <input
              type="text"
              class="form-control"
              placeholder="Search..."
              // value={search}
              onChange={(e) => serSearch(e.target.value)}
            />
            <button
              class="btns-primary btn-app-primary"
              type="button"
              id="button-addon2"
              onClick={getSearch}
            >
              search
            </button>
          </div>
        </div>
      </div>
      <div>
        <>{list}</>
        <ul>
          {list.map((item) => (
            <li>{item}</li>
          ))}
        </ul>
      </div>
      <Modal
        title=''
        open={modalOpen}
        onCancel={() => {
          setModalOpen("")
          setUpdateDetails({})
        }}
        footer={null}
      >
        <div>
          {modalOpen.toLowerCase() == "add" && (
            <div className="p-4 text-center">
              <input
                type="text"
                class="form-control mb-2"
                placeholder="Description..."
                value={updateDetails?.description ? updateDetails?.description : ""}
                name="description"
                onChange={handleChange}
              />
              <input
                type="text"
                class="form-control mb-2"
                placeholder="Code..."
                value={updateDetails?.codes ? updateDetails?.codes : ""}
                name="codes"
                onChange={handleChange}
              />
              <input
                type="text"
                class="form-control mb-2"
                placeholder="Keywords..."
                value={updateDetails?.keywords ? updateDetails?.keywords :""}
                name="keywords"
                onChange={handleChange}
              />
              <button
                class="btns-primary btn-app-primary"
                type="button"
                id="button-addon2"
                // onClick={getSearch}
                style={{ width: "100px" }}
              >
                Add
              </button>
            </div>
          )}
          {modalOpen.toLowerCase() == "edit" && (
            <div className="p-4 text-center">
              <input
                type="text"
                class="form-control mb-2"
                placeholder="Code..."
                value={updateDetails?.editcode ? updateDetails?.editcode : ""}
                name="editcode"
                onChange={handleChange}
              />
              <input
                type="text"
                class="form-control mb-2"
                placeholder="Keywords..."
                value={updateDetails?.editkeywords ? updateDetails?.editkeywords : ""}
                name="editkeywords"
                onChange={handleChange}
              />
              <button
                class="btns-primary btn-app-primary"
                type="button"
                id="button-addon2"
                // onClick={getSearch}
                style={{ width: "100px" }}
              >
                Edit
              </button>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default Searches;
