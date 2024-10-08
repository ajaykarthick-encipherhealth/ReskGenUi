import React, { useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import Header from "../../../jsx/layouts/nav/Header";
import InputField from "../../../components/input";
import AppTable from "../../../components/tables";
import Data from "./data.json";
import { getButtonStatus } from "../../../components/commonFunctions";
import FeedBackModalContent from "../../admin/feedback/feedBackModal";
import { Modal, Drawer, Form, Input, Select, Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import styles from "../../admin/feedback/styles.module.css";

const FeedBack = () => {
  const totalElements = 100;
  const [form] = Form.useForm();
  const [search, setSearch] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [page, setPage] = useState(0);
  const [activeTab, setActiveTab] = useState("myfeedback");
  const [open, setOpen] = useState(false);

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
 
  const handleSubmit = (values) => {
    console.log(values); 
    form.resetFields();
    onClose();
  };
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  return (
    <div style={{ backgroundColor: "#F0F6FE" }}>
    <Header />
    <div style={{ marginTop: "65px" }}>
      <div className="row mx-3">
        <div className="col-2">
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
        <div className="col-2">
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
        <div className="col-2">
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
        <div className="col-6 d-flex justify-content-end mt-5">
          <div>
            <button
              type="button"
              className={styles.createBtn}
              onClick={showDrawer}
            >
              <PlusCircleOutlined className={styles.icon} /> Create
            </button>
          </div>

          <div className="customDrawer">
            <Drawer
              title="Create Feedback"
              destroyOnClose={true}
              onClose={onClose}
              open={open}
            >
              <div className="mt-3 mx-4">
                <Form
                  form={form}
                  className="customInput"
                  onFinish={handleSubmit}
                  layout="vertical"
                  autoComplete="off"
                >
                  <Form.Item
                    label="Feedback ID"
                    name="feedbackId"
                    rules={[
                      {
                        required: true,
                        message: "Please enter Feedback ID",
                      },
                    ]}
                  >
                    <Input placeholder="Feedback ID" />
                  </Form.Item>
                  <Form.Item
                    label="Patient Name"
                    name="patientName"
                    rules={[
                      {
                        required: true,
                        message: "Please enter Patient Name",
                      },
                    ]}
                  >
                    <Input placeholder="Patient Name" />
                  </Form.Item>
                  <Form.Item
                    label="Diagnosis Code"
                    name="diagnosiscode"
                    rules={[
                      {
                        required: true,
                        message: "Please enter Diagnosis Code",
                      },
                    ]}
                  >
                    <Input placeholder="Diagnosis Code" />
                  </Form.Item>
                  <Form.Item
                    label="Description"
                    name="description"
                    rules={[
                      {
                        required: true,
                        message: "Please enter Description",
                      },
                    ]}
                  >
                    <Input placeholder="Description" />
                  </Form.Item>
                  <Form.Item
                    label="Reason"
                    name="reason"
                    rules={[
                      {
                        required: true,
                        message: "Please Enter Reason",
                      },
                    ]}
                  >
                    <Input.TextArea
                      placeholder="Reason"
                      style={{ resize: "none" }}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Manager"
                    name="manager"
                    rules={[
                      {
                        required: true,
                        message: "Please Enter Manager Name",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Manager"
                      options={[
                        {
                          value: "jack",
                          label: "Jack",
                        },
                        {
                          value: "lucy",
                          label: "Lucy",
                        },
                        {
                          value: "tom",
                          label: "Tom",
                        },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item>
                    <div className="d-flex justify-content-center align-items-center">
                      <Button
                        type="primary"
                        htmlType="submit"
                        className={styles.btn}
                      >
                        Proceed
                      </Button>
                    </div>
                  </Form.Item>
                </Form>
              </div>
            </Drawer>
          </div>
        </div>
      </div>

      <div id="task-tbl_wrapper" className="dataTables_wrapper no-footer">
        <div className="profile-tab " style={{ marginTop: "20px" }}>
          <div className="custom-tab-1">
            <Tab.Container defaultActiveKey={activeTab}>
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
                      data={Data}
                      column={column}
                      onRowClick={handleRowClick}
                      status={getButtonStatus}
                      onPageChange={onPageChange}
                      totalElements={totalElements}
                      paginationFirst={paginationFirst}
                    />
                  </div>
                  <Modal
                    footer={null}
                    destroyOnClose={true}
                    open={isModalOpen}
                    onCancel={handleModalCancel}
                    onOk={handleModalOk}
                    width={900}
                  >
                    <FeedBackModalContent modalData={modalData} />
                  </Modal>
                </Tab.Pane>
                <Tab.Pane id="my-posts" eventKey="approvalrequest">
                  <AppTable
                    data={Data}
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
