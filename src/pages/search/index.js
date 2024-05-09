import React, { useEffect, useState } from "react";
import axios from "../../utility/axiosConfig";
import { Modal, Select } from "antd";
import AppTable from "../../components/tables";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import { actions as searchActions } from "../../stores/search";
import { getResponePopup } from "../../utils/reusable";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { getCurrentUser } from "../../stores/authflow/actions";

const Searches = ({
  getAllICDCodes,
  createICDCode,
  deleteICDCodes,
  getSimpleSearch,
  getSemanticSearch,
  updateSemantic,
  getAllICDCodesData,
  getICDStatus,
  getdeleteICDStatus,
  getSimpleSearchData,
  getSemanticData,
  getUpdateSemanticStatus,
  getSuggestedCodes,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const size = 15;
  const [search, serSearch] = useState("");
  const [list, setList] = useState([]);
  const [modalOpen, setModalOpen] = useState("");
  const [updateDetails, setUpdateDetails] = useState();
  const [searchType, setSearchType] = useState("Rule-engine-search");
  const totalElements = getAllICDCodesData?.data?.response?.totalElements
    ? getAllICDCodesData?.data?.response?.totalElements
    : 0;
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [page, setPage] = useState(0);
  const [action, setAction] = useState("");
  const [years, setYears] = useState(null);
  const [keyword, setKeyword] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [ruleSelect, setRuleSelect] = useState({
    billable: "",
    source: "",
  });
  const [suggestedCode, setSuggestedCodes] = useState([]);
  const [selectBillable, setSelectBillable] = useState(null);

  const getYear = () => {
    let years = [];
    for (let year = 2016; year <= new Date().getFullYear(); year++) {
      years.push({ value: year, label: year });
    }
    return years;
  };

  const column = [
    { name: "code", value: "code" },
    { name: "description", value: "description" },
    { name: "years", value: "years", isarray: true },
    { name: "billable", value: "billable" },
    {
      name: "active",
      value: {
        action: [
          { icon: faEdit, type: "edit" },
          { icon: faTrash, type: "delete" },
        ],
      },
      isAction: true,
    },
  ];

  const semaniticColumn = [
    { name: "id", value: "id" },
    { name: "code", value: "code" },
    { name: "disease name", value: "diseaseName" },
    { name: "keywords", value: "keywords", isarray: true },
    {
      name: "active",
      value: {
        action: [
          { icon: faEdit, type: "edit" },
          // { icon: faTrash, type: "delete" },
        ],
      },
      isAction: true,
    },
  ];

  const simpleColumn = [
    { name: "id", value: "id" },
    { name: "code", value: "code" },
    { name: "disease name", value: "diseaseName" },

    // {
    //   name: "active",
    //   value: {
    //     action: [
    //       { icon: faEdit, type: "edit" },
    //       { icon: faTrash, type: "delete" },
    //     ],
    //   },
    //   isAction: true,
    // },
  ];

  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPage(e.page);
  };

  const handleChange = (e) => {
    setUpdateDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const createdICDCodes = async (type) => {
    if (type == "edit") {
      const res = await createICDCode({
        id: action.id,
        code: updateDetails.codes,
        description: updateDetails.description,
        years: years.map((date) => date.value),
        billable: selectBillable.value ? selectBillable.value : selectBillable,
      });
      if (res.status == "SUCCESS") {
        getResponePopup(getICDStatus);
        setModalOpen("");
        setSelectBillable(null);
        getAllICDCodes(
          search,
          page,
          size,
          ruleSelect.billable,
          ruleSelect.source
        );
      }
      setUpdateDetails({});
      setYears(null);
    } else {
      createICDCode({
        code: updateDetails.codes,
        description: updateDetails.description,
        years: years.map((date) => date.value),
      });
      if (getICDStatus?.data?.status == "SUCCESS") {
        getResponePopup(getICDStatus);
        setModalOpen("");
        setPaginationFirst(0);
        setPage(0);
      }
      setUpdateDetails({});
      setYears(null);
    }
  };
  const editSemantic = () => {
    updateSemantic({
      id: action.id,
      years: keyword.map((date) => date.value),
    });
    if (getUpdateSemanticStatus) {
      getResponePopup({ data: { status: "Success" } });
      setModalOpen("");
      setKeyword(null);
    }
    setUpdateDetails({});
    setYears(null);
  };

  const handleDelete = () => {
    deleteICDCodes(action.id);
    if (getdeleteICDStatus?.data?.status == "SUCCESS") {
      getResponePopup(getdeleteICDStatus);
      setDeleteModal(false);
      setPaginationFirst(0);
      setPage(0);
    } else if (getdeleteICDStatus?.data?.status == "FAILED") {
      getResponePopup(getdeleteICDStatus);
      setDeleteModal(false);
    }
  };

  const getCallSuggested = async (code) => {
    try {
      const res = await getSuggestedCodes(code);
      if (res.response) {
        setSuggestedCodes([...res.response]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (searchType == "Rule-engine-search") {
      if (action.type == "edit") {
        setModalOpen(action.type);
        const editData = getAllICDCodesData?.data?.response.content.find(
          (item) => item.id == action.id
        );

        const year = editData?.years?.map((item) => ({
          label: item,
          value: item,
        }));
        getCallSuggested(editData.code);
        setUpdateDetails({
          ...updateDetails,
          codes: editData.code,
          description: editData.description,
          matchCode: editData.code + " - " + editData.description,
        });
        setYears(year);
        setSelectBillable({
          label: editData?.billable,
          value: editData?.billable,
        });
      } else if (action.type == "delete") {
        setDeleteModal(true);
      }
    } else if (searchType == "SemanticHybridSearch") {
      setModalOpen(action.type);
      const editData = getSemanticData?.data?.response.find(
        (item) => item.id == action.id
      );
      const keyWord = editData?.keywords?.map((item) => ({
        label: item,
        value: item,
      }));
      setKeyword(keyWord);
    }
  }, [action]);
  useEffect(() => {
    if (searchType == "Rule-engine-search") {
      getAllICDCodes(
        search,
        page,
        size,
        ruleSelect.billable,
        ruleSelect.source
      );
    } else if (searchType == "SimpleHybridSearch") {
      getSimpleSearch(search);
    } else if (searchType == "SemanticHybridSearch") {
      getSemanticSearch(search);
    }
  }, [search, searchType, page, ruleSelect]);

  const selectTab = (e) => {
    const userId = localStorage.getItem("userId");
    setSearchType(e.target.name);
    serSearch("");
    dispatch(getCurrentUser(userId, router));
  };
  return (
    <>
      <div className="d-flex justify-content-center align-item-center">
        <div style={{ width: "600px" }}>
          <div className="d-flex justify-content-center mt-5">
            <div class="form-check mx-2">
              <input
                class="form-check-input"
                type="radio"
                name="Rule-engine-search"
                id="flexRadioDefault1"
                onClick={selectTab}
                checked={searchType == "Rule-engine-search"}
              />
              <label class="form-check-label" for="flexRadioDefault1">
                Rule Engine Search
              </label>
            </div>
            <div class="form-check mx-2">
              <input
                class="form-check-input"
                type="radio"
                name="SimpleHybridSearch"
                id="flexRadioDefault2"
                checked={searchType == "SimpleHybridSearch"}
                onClick={selectTab}
              />
              <label class="form-check-label" for="flexRadioDefault2">
                Simple Hybrid Search
              </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="SemanticHybridSearch"
                id="flexRadioDefault2"
                checked={searchType == "SemanticHybridSearch"}
                onClick={selectTab}
              />
              <label class="form-check-label" for="flexRadioDefault2">
                Semantic Hybrid Search
              </label>
            </div>
          </div>
          <div class="d-flex my-5">
            <input
              type="text"
              class="form-control"
              placeholder="Search..."
              value={search}
              onChange={(e) => serSearch(e.target.value)}
            />
            {searchType == "Rule-engine-search" && (
              <>
                <div style={{ width: "450px" }} className="px-2">
                  <Select
                    onChange={(selectedOption) =>
                      setRuleSelect((prev) => ({
                        ...prev,
                        billable: selectedOption,
                      }))
                    }
                    options={[
                      { label: "ALL", value: "" },
                      { label: "BILLABLE", value: "BILLABLE" },
                      { label: "NON_BILLABLE", value: "NON_BILLABLE" },
                      { label: "NULL", value: "NULL" },
                    ]}
                    className="custom-react-select"
                    isSearchable={false}
                    placeholder={"Select Billable"}
                  />
                </div>
                <div style={{ width: "450px" }}>
                  <Select
                    onChange={(selectedOption) =>
                      setRuleSelect((prev) => ({
                        ...prev,
                        source: selectedOption,
                      }))
                    }
                    options={[
                      { label: "BOTH", value: "" },
                      { label: "XML", value: "XML" },
                      { label: "CMS_EXCEL", value: "CMS_EXCEL" },
                    ]}
                    className="custom-react-select"
                    isSearchable={false}
                    placeholder={"Select Source"}
                    style={{ width: "100px" }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center">
        <div style={{ width: "90%" }}>
          <div className="d-flex justify-content-end">
            {searchType == "Rule-engine-search" && (
              <button
                class="btns-primary btn-app-primary mx-3 px-4"
                type="button"
                id="button-addon2"
                onClick={() => setModalOpen("Add")}
              >
                Add
              </button>
            )}

            {/* <button
              class="btns-primary btn-app-primary mx-2"
              type="button"
              id="button-addon2"
              onClick={() => setModalOpen("Edit")}
            >
              Edit
            </button> */}
          </div>
          {searchType == "Rule-engine-search" ? (
            <AppTable
              data={
                getAllICDCodesData?.data?.response?.content
                  ? getAllICDCodesData?.data?.response?.content
                  : []
              }
              column={column}
              // status={getButtonStatus}
              onPageChange={onPageChange}
              totalElements={totalElements}
              paginationFirst={paginationFirst}
              setAction={setAction}
              count={1000}
            />
          ) : searchType == "SemanticHybridSearch" ? (
            <AppTable
              data={
                getSemanticData.data?.response
                  ? getSemanticData?.data?.response
                  : []
              }
              column={semaniticColumn}
              // status={getButtonStatus}
              onPageChange={onPageChange}
              totalElements={totalElements}
              paginationFirst={paginationFirst}
              setAction={setAction}
              count={1000}
              isPagination={false}
            />
          ) : (
            <AppTable
              data={
                getSimpleSearchData?.data?.response
                  ? getSimpleSearchData?.data?.response
                  : []
              }
              column={simpleColumn}
              // status={getButtonStatus}
              onPageChange={onPageChange}
              totalElements={totalElements}
              paginationFirst={paginationFirst}
              setAction={setAction}
              count={1000}
              isPagination={false}
            />
          )}
        </div>
      </div>
      <Modal
        title=""
        open={modalOpen}
        onCancel={() => {
          setModalOpen("");
          setUpdateDetails({});
          setKeyword(null);
          setYears(null);
        }}
        footer={null}
      >
        <div>
          {searchType != "Rule-engine-search" &&
            modalOpen.toLowerCase() == "add" && (
              <div className="p-4 text-center">
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
                  placeholder="Description..."
                  value={
                    updateDetails?.description ? updateDetails?.description : ""
                  }
                  name="description"
                  onChange={handleChange}
                />
                <div className="mb-3">
                  <Select
                    mode="tags"
                    style={{ width: "100%", textAlign: "left" }}
                    onChange={(string) => setKeyword(string)}
                    tokenSeparators={[","]}
                    value={keyword}
                    options={null}
                    placeholder="Please search and select"
                  />
                </div>
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
          {searchType != "Rule-engine-search" &&
            modalOpen.toLowerCase() == "edit" && (
              <div className="p-4 text-center">
                <div className="mb-3">
                  <Select
                    mode="tags"
                    style={{ width: "100%", textAlign: "left" }}
                    onChange={(string) => setKeyword(string)}
                    tokenSeparators={[","]}
                    value={keyword}
                    options={null}
                    placeholder="Please search and select"
                  />
                </div>
                <button
                  class="btns-primary btn-app-primary"
                  type="button"
                  id="button-addon2"
                  onClick={editSemantic}
                  style={{ width: "100px" }}
                >
                  Edit
                </button>
              </div>
            )}

          {searchType == "Rule-engine-search" &&
            modalOpen.toLowerCase() == "add" && (
              <>
                <div className="p-4 text-center">
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
                    placeholder="Description..."
                    value={
                      updateDetails?.description
                        ? updateDetails?.description
                        : ""
                    }
                    name="description"
                    onChange={handleChange}
                  />
                  <div className="mb-3">
                    <Select
                      mode="multiple"
                      allowClear
                      style={{ width: "100%", textAlign: "left" }}
                      value={years}
                      placeholder="Please select"
                      onChange={(e, select) => setYears(select)}
                      options={getYear()}
                    />
                  </div>
                  <button
                    class="btns-primary btn-app-primary"
                    type="button"
                    id="button-addon2"
                    style={{ width: "100px" }}
                    onClick={createdICDCodes}
                  >
                    Add
                  </button>
                </div>
              </>
            )}
          {searchType == "Rule-engine-search" &&
            modalOpen.toLowerCase() == "edit" && (
              <>
                <div className="p-4 text-center">
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
                    placeholder="Description..."
                    value={
                      updateDetails?.description
                        ? updateDetails?.description
                        : ""
                    }
                    name="description"
                    onChange={handleChange}
                  />
                  <div className="mb-2">
                    <Select
                      mode="multiple"
                      allowClear
                      style={{ width: "100%", textAlign: "left" }}
                      value={years}
                      placeholder="Please select"
                      onChange={(e, select) => setYears(select)}
                      options={getYear()}
                    />
                  </div>
                  <div className="mb-3">
                    <Select
                      onChange={(selectedOption) =>
                        setSelectBillable(selectedOption)
                      }
                      value={selectBillable}
                      style={{ width: "100%", textAlign: "left" }}
                      options={[
                        { label: "BILLABLE", value: "BILLABLE" },
                        { label: "NON_BILLABLE", value: "NON_BILLABLE" },
                      ]}
                      className="custom-react-select"
                      isSearchable={false}
                      placeholder={"Select Billable"}
                    />
                  </div>
                  <div
                    className="card py-2"
                    style={{
                      maxHeight: "200px",
                      overflowY: "scroll",
                      background: "#ebebeb",
                    }}
                  >
                    {suggestedCode?.map((item) => (
                      <div class="form-check mx-2 text-start">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="selectCodes"
                          id="selectCodes"
                          checked={
                            updateDetails?.matchCode == item
                          }
                          onClick={() =>
                            setUpdateDetails((prev) => {
                              return {
                                ...prev,
                                codes: item.split(" ")[0],
                                matchCode: item,
                              };
                            })
                          }
                        ></input>
                        <label class="form-check-label" for="selectCodes">
                          {item}
                        </label>
                      </div>
                    ))}
                  </div>
                  <button
                    class="btns-primary btn-app-primary"
                    type="button"
                    id="button-addon2"
                    style={{ width: "100px" }}
                    onClick={() => createdICDCodes("edit")}
                  >
                    Edit
                  </button>
                </div>
              </>
            )}
        </div>
      </Modal>

      <Modal
        title="Are you sure, you want to delete this ICD Code"
        open={deleteModal}
        onOk={() => handleDelete()}
        // confirmLoading={confirmLoading}
        onCancel={() => setDeleteModal(false)}
      ></Modal>
    </>
  );
};

const enhancer = connect(
  (state) => ({
    getAllICDCodesData: state.search.icdCodes,
    getICDStatus: state.search.createIcdCode,
    getdeleteICDStatus: state.search.deleteICDCodes,
    getSimpleSearchData: state.search.getSimpleSearch,
    getSemanticData: state.search.getSemanticSearch,
    getUpdateSemanticStatus: state.search.updateSemantic,
  }),
  {
    getAllICDCodes: searchActions.getAllICDCodes,
    createICDCode: searchActions.createICDCodes,
    deleteICDCodes: searchActions.deleteICDCodes,
    getSimpleSearch: searchActions.getSimpleSearch,
    getSemanticSearch: searchActions.getSemanticSearch,
    updateSemantic: searchActions.updateSemantic,
    getSuggestedCodes: searchActions.getSuggestedCodes,
  }
);
export default enhancer(Searches);
