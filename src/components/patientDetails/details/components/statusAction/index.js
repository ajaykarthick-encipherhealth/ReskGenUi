import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import visitStyles from "../../../../../styles/visitdata.module.css";
import { Modal, Tooltip, notification, Dropdown, Menu } from "antd";
import { connect } from "react-redux";
import { DownOutlined } from "@ant-design/icons";
import AddLabForm from "../addLabForm";
import AddRadiologyForm from "../addRadiologyForm";
// import AllocateModal from "../../../../../pages/admin/allocateduser/allocate";
import { actions as detailsActions } from "../../../../../stores/patient/details";
import { getLocalStored, getStorage } from "../../../../../utils/storages";
import { getResponePopup } from "../../../../../utils/reusable";
import { overallStatusUpdate } from "../../../../../stores/patient/details/network";
import QueryModal from "./queryModal";
import styles from "../../hcc/styles.module.css";
import { useRouter } from "next/router";
const StatusAction = ({
  patientDetailsResult,
  patientIdDetailsData,
  getPatientIdData,
  getPatientDosList,
  dosYearDefalutSelect,
}) => {
  const router = useRouter();
  const isOnReviewerPatients = router.pathname === "/reviewer/patients/details";
  const shouldDisable = isOnReviewerPatients;
  const [localOrgId, setLocalOrgId] = useState("");
  const [localUserId, setLocalUserId] = useState("");
  const [localPatientId, setLocalPatientId] = useState("");
  const [userRole, setUserRole] = useState("");
  const [actionItems, setActionItems] = useState([]);
  const [actionItems2, setActionItems2] = useState([]);
  const [actionItems3, setActionItems3] = useState([]);
  const [adminActionItems, setAdminActionItems] = useState([]);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [patienIdDetails, setPatienIdDetails] = useState("");
  const [confirmAuditModal, setConfirmAuditModal] = useState(false);
  const [isValidAction, setIsValidAction] = useState("");
  const [addPatient, setAddPatient] = useState(false);
  const [labReportSlider, setLapReportSlider] = useState(false);
  const [flagFirstData, setFlagFirstData] = useState([]);
  const [allocateModal, setAllocateModal] = useState(false);
  const [selectedRowsId, setSelectedRowsId] = useState([]);
  const [allocateClicked, setAllocateClicked] = useState(false);
  const [selectedChart, setSelectedChart] = useState([]);
  const [confirmCompleteModal, setConfirmCompleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [confirmNotesModal, setConfirmNotesModal] = useState(false);
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [inputValue, setInputValue] = useState({
    notes: "",
  });
  const [isQueried, setIsQueried] = useState(false);
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);
  const proxyRole = getStorage("proxyRole");
  const path = router.pathname;
  const isTinPage = path.includes("/tenantadmin/tin/details");
  const isProjectPage = path.includes("/tenantadmin/project/details");
  const isBatchPage = path.includes("/tenantadmin/patientsync/batchfilesview");
  const isStatusHidden = isTinPage || isProjectPage || isBatchPage;

  const showQueryModal = () => {
    setIsQueryModalOpen(true);
  };

  const handleQueryCancel = () => {
    setIsQueryModalOpen(false);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);
  const renderAuditMenu = (value) => {
    var value = (
      <Menu id="auditbtn">
        <>
          {patienIdDetails?.auditedStatus != "AUDITED" && (
            <Menu.Item key="1" onClick={() => auditPatient(1)}>
              <div id="auditbtn" className="patient-status">
                <span
                  id="auditbtn"
                  className={`badge ${visitStyles.audit_text}`}
                >
                  AUDITED
                </span>
              </div>
            </Menu.Item>
          )}
          {patienIdDetails?.auditedStatus != "REAUDIT" && (
            <Menu.Item key="2" onClick={() => auditPatient(2)}>
              <div id="auditbtn" className="patient-status">
                <span
                  id="auditbtn"
                  className={`badge ${visitStyles.reaudit_text}`}
                >
                  RE AUDIT
                </span>
              </div>
            </Menu.Item>
          )}
          {patienIdDetails?.auditedStatus != "AUDIT_PENDING" && (
            <Menu.Item key="3" onClick={() => auditPatient(3)}>
              <div id="auditbtn" className="patient-status">
                <span
                  id="auditbtn"
                  className={`badge ${visitStyles.auditpending_text}`}
                >
                  AUDIT PENDING
                </span>
              </div>
            </Menu.Item>
          )}
          {patienIdDetails?.auditedStatus != "AUDITHOLD" && (
            <Menu.Item key="4" onClick={() => auditPatient(4)}>
              <div id="auditbtn" className="patient-status">
                <span
                  id="auditbtn"
                  className={`badge ${visitStyles.audithold_text}`}
                >
                  AUDIT HOLD
                </span>
              </div>
            </Menu.Item>
          )}
          {patienIdDetails?.auditedStatus != "AUDIT_DECLINED" && (
            <Menu.Item key="5" onClick={() => auditPatient(5)}>
              <div id="auditbtn" className="patient-status">
                <span
                  id="auditbtn"
                  className={`badge ${visitStyles.auditdecline_text}`}
                >
                  AUDIT DECLINE
                </span>
              </div>
            </Menu.Item>
          )}
        </>
      </Menu>
    );

    return value;
  };

  const auditPatient = (number) => {
    switch (number) {
      case 1:
        setConfirmAuditModal(true);
        break;
      case 2:
        setIsValidAction("reAuditFunction");
        setConfirmNotesModal(true);
        setInputValue({ notes: "" });
        setValidated(false);
        break;
      case 3:
        setIsValidAction("auditPendingFunction");
        setConfirmNotesModal(true);
        setInputValue({ notes: "" });
        setValidated(false);
        break;
      case 4:
        setIsValidAction("auditHoldFunction");
        setConfirmNotesModal(true);
        setInputValue({ notes: "" });
        setValidated(false);
        break;
      case 5:
        setIsValidAction("auditDeclineFunction");
        setConfirmNotesModal(true);
        setInputValue({ notes: "" });
        setValidated(false);
        break;

      default:
        null;
    }
  };

  const getPatientIdDetails = async (result) => {
    const userRoleLocal = getStorage("userRole");
    var data = [
      {
        id: result?.patientId,
        name: result?.patientName,
      },
    ];
    setSelectedRowsId(data);
    const workflowData = path.endsWith("/tindetails/masteraudit")
      ? result?.masterAudit
      : result?.workflow?.[0];

    const menu = (
      <Menu id="auditbtn">
        {workflowData?.status != "PENDING" &&
        workflowData?.status != "COMPUTED" ? (
          <Menu.Item
            key="2"
            onClick={() => {
              handleActionClick("PENDING");
              setMenuIsOpen(false);
            }}
          >
            <div id="auditbtn" className="patient-status">
              <span id="auditbtn" className={`badge processing-text`}>
                PENDING
              </span>
            </div>
          </Menu.Item>
        ) : null}

        {workflowData?.status != "COMPLETED" ? (
          <Menu.Item
            key="4"
            onClick={() => {
              handleActionClick("COMPLETE");
              setMenuIsOpen(false);
            }}
          >
            <div id="auditbtn" className="patient-status">
              <span id="auditbtn" className={`badge processed-text`}>
                COMPLETED
              </span>
            </div>
          </Menu.Item>
        ) : null}
        {userRoleLocal == "tenant_admin" && (
          <>
            <Menu.Item
              key="5"
              onClick={() => {
                handleActionClick("ADD RADIOLOGY");
                setMenuIsOpen(false);
              }}
            >
              <div className="patient-status">
                <span className={`badge  ${visitStyles.add_text}`}>
                  + ADD RADIOLOGY
                </span>
              </div>
            </Menu.Item>
            <Menu.Item
              key="6"
              onClick={() => {
                handleActionClick("ADD LAB");
                setMenuIsOpen(false);
              }}
            >
              <div className="patient-status">
                <span className={`badge  ${visitStyles.add_text}`}>
                  + ADD LAB
                </span>
              </div>
            </Menu.Item>
          </>
        )}
        {workflowData?.status != "QUERIED" ? (
          <Menu.Item key="7">
            {["CODER_1", "CODER_2", "QA", "OWNER", "QA_LEAD"].includes(
              proxyRole
            ) &&
              !(
                ["OWNER", "QA_LEAD"].includes(proxyRole) &&
                router.pathname.endsWith("/tindetails/masteraudit")
              ) && (
                <Button
                  disabled={isQueried}
                  onClick={() => {
                    showQueryModal();
                    setMenuIsOpen(false);
                  }}
                  className={`px-3 py-1 rounded-md ${styles.queryBtn}`}
                >
                  Query
                </Button>
              )}
          </Menu.Item>
        ) : null}
      </Menu>
    );

    const menu2 = (
      <Menu>
        {workflowData?.status != "PENDING" ? (
          <Menu.Item
            key="2"
            onClick={() => {
              handleActionClick("PENDING");
              setMenuIsOpen(false);
            }}
          >
            <div className="patient-status">
              <span className={`badge processing-text`}>PENDING</span>
            </div>
          </Menu.Item>
        ) : null}

        {workflowData?.status != "COMPLETE" ? (
          <Menu.Item
            key="4"
            onClick={() => {
              handleActionClick("COMPLETE");
              setMenuIsOpen(false);
            }}
          >
            <div className="patient-status">
              <span className={`badge processed-text`}>COMPLETED</span>
            </div>
          </Menu.Item>
        ) : null}
        <Menu.Item
          key="5"
          onClick={() => {
            handleActionClick("ADD RADIOLOGY");
            setMenuIsOpen(false);
          }}
        >
          <div className="patient-status">
            <span className={`badge  ${visitStyles.add_text}`}>
              + ADD RADIOLOGY
            </span>
          </div>
        </Menu.Item>
      </Menu>
    );
    const menu3 = (
      <Menu>
        {workflowData?.status != "PENDING" ? (
          <Menu.Item
            key="2"
            onClick={() => {
              handleActionClick("PENDING");
              setMenuIsOpen(false);
            }}
          >
            <div className="patient-status">
              <span className={`badge processing-text`}>PENDING</span>
            </div>
          </Menu.Item>
        ) : null}

        {workflowData?.status != "COMPLETE" ? (
          <Menu.Item
            key="4"
            onClick={() => {
              handleActionClick("COMPLETE");
              setMenuIsOpen(false);
            }}
          >
            <div className="patient-status">
              <span className={`badge processed-text`}>COMPLETED</span>
            </div>
          </Menu.Item>
        ) : null}
        <Menu.Item
          key="5"
          onClick={() => {
            handleActionClick("ADD LAB");
            setMenuIsOpen(false);
          }}
        >
          <div className="patient-status">
            <span className={`badge  ${visitStyles.add_text}`}>+ ADD LAB</span>
          </div>
        </Menu.Item>
      </Menu>
    );
    const menu4 = (
      <Menu>
        {result?.allocatedOn == null && (
          <Menu.Item
            key="4"
            onClick={() => {
              allocatePatient();
              setMenuIsOpen(false);
            }}
          >
            <div className="patient-status">
              <span className={`badge processed-text`}>ALLOCATE</span>
            </div>
          </Menu.Item>
        )}
        <Menu.Item
          key="5"
          onClick={() => {
            handleActionClick("ADD RADIOLOGY");
            setMenuIsOpen(false);
          }}
        >
          <div className="patient-status">
            <span className={`badge  ${visitStyles.add_text}`}>
              + ADD RADIOLOGY
            </span>
          </div>
        </Menu.Item>
        <Menu.Item
          key="6"
          onClick={() => {
            handleActionClick("ADD LAB");
            setMenuIsOpen(false);
          }}
        >
          <div className="patient-status">
            <span className={`badge processing-text`}>+ ADD LAB</span>
          </div>
        </Menu.Item>
      </Menu>
    );
    setActionItems(menu);
    setActionItems2(menu2);
    setActionItems3(menu3);
    setAdminActionItems(menu4);
  };
  const handleActionClick = (value) => {
    // if (value == "QUERY") {
    //   setConfirmNotesModal(true);
    //   setIsValidAction("queryFunction");
    //   setInputValue({ notes: "" });
    //   setValidated(false);
    // }
    if (value === "QUERY") {
      setIsQueryModalOpen(true);
    }
    if (value == "PENDING") {
      setConfirmNotesModal(true);
      setIsValidAction("pendingFunction");
      setValidated(false);
    }
    if (value == "COMPLETE") {
      setConfirmCompleteModal(true);
    }
    if (value == "ADD RADIOLOGY") {
      addPatientFile();
    }
    if (value == "ADD LAB") {
      addLabReport();
    }
  };

  const addPatientFile = (data) => {
    setAddPatient(true);
  };
  const addLabReport = (data) => {
    setLapReportSlider(true);
  };

  const allocatePatient = () => {
    setAllocateModal(true);
  };

  const handleCloseModal = () => {
    setConfirmCompleteModal(false);
    setConfirmNotesModal(false);
    setInputValue({ notes: "" });
    setValidated(false);
  };

  const handleSubmitValidNotes = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === true) {
      setConfirmNotesModal(false);
      updateStatus(isValidAction);
      setInputValue({ notes: "" });
      setValidated(true);
    }
  };

  const statusCheck = (value) => {
    switch (value) {
      case "pendingFunction":
        return "PENDING";
      case "complete":
        return "COMPLETED";
      case "reAuditFunction":
        return "REAUDIT";
      case "auditPendingFunction":
        return "AUDIT_PENDING";
      case "auditHoldFunction":
        return "AUDITHOLD";
      case "auditDeclineFunction":
        return "AUDIT_DECLINED";
      case "audited":
        return "AUDITED";

      default:
        break;
    }
  };
  const updateStatus = async (action) => {
    const isTinDetailsPage = path.endsWith("/tindetails/masteraudit");
    const masterAudit = isTinDetailsPage ? true : false;
    var postData = {
      // orgId: localOrgId,
      patientId: localPatientId,
      notes: inputValue.notes,
      roleId: getStorage("roleId"),
      processedStatus: statusCheck(action),
      masterAudit,
      // dos: patientDetailsResult?.data?.response?.processedYear,
    };
    try {
      setStatusLoading(true);
      const response = await overallStatusUpdate(postData);
      if (response?.status == "SUCCESS") {
        setStatusLoading(false);
        notification.success({
          message: response?.message,
          duration: 1,
        });
      } else {
        getResponePopup(response);
      }
      setConfirmNotesModal(false);
      setConfirmCompleteModal(false);
      setConfirmAuditModal(false);
      getPatientIdData(localPatientId, path);
      getPatientDosList(
        localPatientId,
        dosYearDefalutSelect?.value
          ? dosYearDefalutSelect?.value
          : dosYearDefalutSelect,
        "",
        "",
        "",
        "",
        path
      );
      setInputValue({
        notes: "",
      });
    } catch (e) {
      if (e?.status !== "SUCCESS") {
        notification.warning({
          message: e?.message,
          duration: 4,
        });
        setStatusLoading(false);
        setConfirmCompleteModal(false);
      }
    }
  };

  const handleChange = async (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setInputValue({ ...inputValue, [key]: value });
  };

  useEffect(() => {
    const userRoleLocal = getStorage("userRole");
    const uId = getStorage("userId");
    const orgId = getStorage("orgId");
    setUserRole(userRoleLocal);
    setLocalOrgId(orgId);
    setLocalUserId(uId);
    setLocalPatientId(patientIdDetailsData?.data?.response?.id);
    getPatientIdDetails(patientIdDetailsData?.data?.response);
    setPatienIdDetails(patientIdDetailsData?.data?.response);
  }, [patientIdDetailsData?.data?.response]);

  const workflowDatas = path.endsWith("/tindetails/masteraudit")
    ? patienIdDetails?.masterAudit
    : patienIdDetails?.workflow?.[0];

  return (
    <>
      {patientIdDetailsData?.data?.response && (
        <>
          {(userRole && userRole?.toLowerCase() == "admin") ||
          (userRole && userRole === "TENANT_ADMIN") ||
          isStatusHidden ||
          userRole === "DOWNLOADER" ? (
            <div
              id="allocate-action"
              name="allocate-action"
              className={`${visitStyles.actionbtnContainer} text-truncate`}
            >
              <Button
                type="primary"
                className={`completedBtnHcc ${visitStyles.completedBtnHcc}`}
              >
                <span>
                  {patienIdDetails?.allocatedOn ? "ALLOCATED" : "ALLOCATE"}
                </span>
              </Button>
            </div>
          ) : userRole && userRole?.toLowerCase() == "supervisor" ? (
            <div
              className={`ant-badge ${visitStyles.actionbtnContainer} text-truncate`}
              id="auditbtnContainer"
            >
              <Dropdown
                id="auditbtn"
                overlay={renderAuditMenu()}
                onVisibleChange={(v) => setMenuIsOpen(v)}
                visible={menuIsOpen}
                className={
                  patienIdDetails?.auditedStatus == "AUDITHOLD"
                    ? `auditHoldBtnHcc`
                    : patienIdDetails?.auditedStatus == "AUDIT_PENDING"
                    ? `auditPendingBtnHcc`
                    : patienIdDetails?.auditedStatus == "AUDITED"
                    ? `auditBtnHcc`
                    : patienIdDetails?.auditedStatus == "REAUDIT"
                    ? `reauditBtnHcc`
                    : patienIdDetails?.auditedStatus == "AUDIT_DECLINED"
                    ? `declineBtnHcc`
                    : `auditBtnHcc`
                }
              >
                <Button
                  id="auditbtn"
                  type="primary"
                  className={
                    patienIdDetails?.auditedStatus == "AUDITHOLD"
                      ? `auditHoldBtnHcc`
                      : patienIdDetails?.auditedStatus == "AUDIT_PENDING"
                      ? `auditPendingBtnHcc`
                      : patienIdDetails?.auditedStatus == "AUDITED"
                      ? `auditBtnHcc`
                      : patienIdDetails?.auditedStatus == "REAUDIT"
                      ? `reauditBtnHcc`
                      : patienIdDetails?.auditedStatus == "AUDIT_DECLINED"
                      ? `declineBtnHcc`
                      : `auditBtnHcc`
                  }
                >
                  <span>
                    {patienIdDetails?.auditedStatus != null
                      ? patienIdDetails?.auditedStatus.replaceAll("_", " ")
                      : "AUDIT"}
                  </span>
                  <span style={{ marginLeft: "10px" }}>
                    <DownOutlined />
                  </span>
                </Button>
              </Dropdown>
            </div>
          ) : (
            <div
              className={`${visitStyles.actionbtnContainer} ant-badge text-truncate`}
              id="auditbtnContainer"
              name="auditbtnContainer"
            >
              {workflowDatas?.status == "COMPLETED" ? (
                <Dropdown
                  id="auditbtn"
                  overlay={
                    activeTab === 3
                      ? actionItems2
                      : activeTab === 4
                      ? actionItems3
                      : actionItems
                  }
                  trigger={["click"]}
                  onVisibleChange={(v) => setMenuIsOpen(v)}
                  visible={menuIsOpen}
                  className={`completedBtnHcc ant-badge ${visitStyles.completedBtnHcc}`}
                  disabled={workflowDatas?.status === "COMPLETED"}
                >
                  <button
                    id="auditbtn"
                    type="primary"
                    className={`completedBtnHcc ant-badge ${visitStyles.completedBtnHcc}`}
                    style={{
                      cursor:
                        workflowDatas?.status === "COMPLETED"
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    <span>COMPLETED</span>
                    <span style={{ marginLeft: "10px" }}>
                      <DownOutlined />
                    </span>
                  </button>
                </Dropdown>
              ) : workflowDatas?.status == "QUERIED" ? (
                <Dropdown
                  overlay={
                    activeTab == 3
                      ? actionItems2
                      : activeTab == 4
                      ? actionItems3
                      : actionItems
                  }
                  trigger={["click"]}
                  onVisibleChange={(v) => setMenuIsOpen(v)}
                  visible={menuIsOpen}
                  className={`queryBtnHcc ${visitStyles.queryBtnHcc}`}
                  disabled={workflowDatas?.status === "QUERIED"}
                >
                  <button
                    disabled={shouldDisable}
                    style={{
                      cursor:
                        workflowDatas?.status === "QUERIED"
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    Queried
                  </button>
                </Dropdown>
              ) : workflowDatas?.status == "PENDING" ||
                workflowDatas?.status == "COMPUTED" ? (
                <Dropdown
                  overlay={
                    activeTab == 3
                      ? actionItems2
                      : activeTab == 4
                      ? actionItems3
                      : actionItems
                  }
                  trigger={["click"]}
                  onVisibleChange={(v) => setMenuIsOpen(v)}
                  visible={menuIsOpen}
                  className={`pendingBtn ${visitStyles.pendingBtn}`}
                >
                  <Button
                    id="auditbtnPending"
                    type="primary"
                    className={`pendingBtn ${visitStyles.pendingBtn}`}
                  >
                    <span>PENDING</span>
                    <span style={{ marginLeft: "10px" }}>
                      <DownOutlined />
                    </span>
                  </Button>
                </Dropdown>
              ) : null}
            </div>
          )}
        </>
      )}
      <Modal
        title=""
        centered
        open={confirmNotesModal}
        onOk={handleCloseModal}
        onCancel={handleCloseModal}
        footer={null}
      >
        <div className="offcanvas-body">
          <div className="container-fluid">
            <Form
              noValidate
              validated={validated}
              onSubmit={handleSubmitValidNotes}
            >
              <div className="row">
                <div className="col-xl-12 mb-3">
                  <Form.Label>
                    Reason <span className="text-danger">*</span>
                  </Form.Label>
                  <textarea
                    className="form-control"
                    id="notes"
                    name="notes"
                    onChange={handleChange}
                    rows="5"
                    value={inputValue.notes}
                  ></textarea>
                </div>
              </div>

              <div>
                <Button type="submit" className="btn btn-primary btn-sm me-1">
                  {isLoading ? "Loading..." : "Submit"}
                </Button>
                <Button
                  onClick={() => handleCloseModal()}
                  className="btn btn-danger btn-sm light ms-1"
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </Modal>
      <QueryModal
        isOpen={isQueryModalOpen}
        onCancel={handleQueryCancel}
        setIsQueried={setIsQueried}
        setIsOpen={handleQueryCancel}
        getStatus={getPatientIdData}
        localPatientId={localPatientId}
        isQueried={isQueried}
        getPatientDosList={getPatientDosList}
      />

      {confirmCompleteModal ? (
        <div className={visitStyles.completedModal}>
          <Modal
            title="Are you sure to complete this task?"
            open={true}
            onOk={() => updateStatus("complete")}
            onCancel={handleCloseModal}
            confirmLoading={statusLoading}
          ></Modal>
        </div>
      ) : null}
      {confirmAuditModal ? (
        <div className={visitStyles.completedModal}>
          <Modal
            title="Are you sure to audit this task?"
            open={true}
            centered
            onOk={() => updateStatus("audited")}
            onCancel={() => setConfirmAuditModal(false)}
          ></Modal>
        </div>
      ) : null}
      {/* <AllocateModal
        open={allocateModal}
        setOpen={setAllocateModal}
        selectedRowsId={selectedRowsId}
        setAllocateClicked={setAllocateClicked}
        setSelectedRowsId={setSelectedRowsId}
        setSelectedChart={setSelectedChart}
        selectedChart={selectedChart}
      /> */}
      <AddLabForm setOpen={setLapReportSlider} open={labReportSlider} />
      <AddRadiologyForm setOpen={setAddPatient} open={addPatient} />
    </>
  );
};

const enhancer = connect(
  (state) => ({
    getFlagsData: state?.reviewer?.workQueue?.flags?.data,
    patientDetailsResult: state?.patientDetails?.details?.patientResult,
    patientIdDetailsData: state?.patientDetails.details?.patientIdResult,
  }),
  {
    getPatientIdData: detailsActions.patientIdDetailsAction,
    getPatientDosList: detailsActions.dosDeatilsAction,
  }
);
export default enhancer(StatusAction);
