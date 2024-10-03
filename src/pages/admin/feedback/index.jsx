import React, { useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import Header from "../../../jsx/layouts/nav/Header";
import InputField from "../../../components/input";
import AppTable from "../../../components/tables";
import mockdata from "./mockdata.json";
import { getButtonStatus } from "../../../components/commonFunctions";
import FeedBackModalContent from "./feedBackModal";

const FeedBack = () => {
  const totalElements = 100;
  const [search, setSearch] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [page, setPage] = useState(0);
  const [activeTab, setActiveTab] = useState("myfeedback");


  const column = [
    { name: "feedback id", value: "feedBackId" },
    { name: "diagnosis code", value: "diagnosisCode" },
    { name: "Description", value: "description" },
    { name: "reason", value: "reason" },
    {
      name: "patient",
      value: { id: "patientId", name: "patientName" },
      isSingleRow: true,
    },
    {
      name: "managar",
      value: {
        first: "firstName",
        last: "lastName",
        img: "profileImageUrl",
      },
      isImage: true,
    },
    { name: "date created", value: "createdDate", isDate: true },
    { name: "status", value: "status", isStatus: true },
  ];

  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPage(e.page);
  };
  const handleRowClick = (item) => {
    setModalData(item);
    setIsModalOpen(true);
  };
  const handleModalOk = () => {
    setIsModalOpen(false);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div style={{ backgroundColor: "#F0F6FE" }}>
      <Header />
      <div className="m-5">
        <div className="d-flex" style={{ marginTop: "65px" }}>
          <div className="col-lg-2 mx-2">
            <label>Search by Name or ID</label>
            <InputField
              isSearch={true}
              placeholder={"Search"}
              inputValue={search}
              setInputValue={setSearch}
              type={"text"}
              isInputFiled={false}
            />
          </div>
          <div className="col-lg-2 mx-2">
            <label>Search by Name or ID</label>
            <InputField
              isSearch={true}
              placeholder={"Search"}
              inputValue={search}
              setInputValue={setSearch}
              type={"text"}
              isInputFiled={false}
            />
          </div>
          <div className="col-lg-2 mx-2">
            <label>Search by Name or ID</label>
            <InputField
              isSearch={true}
              placeholder={"Search"}
              inputValue={search}
              setInputValue={setSearch}
              type={"text"}
              isInputFiled={false}
            />
          </div>
        </div>

        <div id="task-tbl_wrapper" className="dataTables_wrapper no-footer">
          <div className="profile-tab " style={{ marginTop: "20px" }}>
            <div className="custom-tab-1">
              <Tab.Container
                defaultActiveKey={
                  activeTab
                }
              >
                <Nav as="ul" className="nav nav-tabs">
                  <Nav.Item
                    as="li"
                    className="nav-item"
                    onClick={() => {
                      setActiveTab("myfeedback");
                    }}
                  >
                    <Nav.Link to="#my-posts" eventKey="myfeedback">
                      My Feedback
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item
                    as="li"
                    className="nav-item"
                    onClick={() => {
                      setActiveTab("approvalrequest");
                    }}
                  >
                    <Nav.Link to="#my-posts" eventKey="approvalrequest">
                      Approval Request
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
                <Tab.Content>
                  <Tab.Pane id="my-posts" eventKey="myfeedback">
                    <div>
                      <AppTable
                        data={mockdata}
                        column={column}
                        onRowClick={handleRowClick}
                        status={getButtonStatus}
                        onPageChange={onPageChange}
                        totalElements={totalElements}
                        paginationFirst={paginationFirst}
                      />
                    </div>
                    <FeedBackModalContent
                      isModalOpen={isModalOpen}
                      modalData={modalData}
                      handleOk={handleModalOk}
                      handleCancel={handleModalCancel}
                    />
                  </Tab.Pane>
                  <Tab.Pane id="my-posts" eventKey="approvalrequest">
                    <AppTable
                      data={mockdata}
                      column={column}
                      onRowClick={handleRowClick}
                      status={getButtonStatus}
                      onPageChange={onPageChange}
                      totalElements={totalElements}
                      paginationFirst={paginationFirst}
                    />
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedBack;
