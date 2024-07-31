import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import axios from "../../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../../utility/enpoints";
import visitStyles from "../../../../../styles/visitdata.module.css";
import { Modal, Tooltip, notification, Dropdown, Menu } from "antd";
import { connect } from "react-redux";
import { DownOutlined } from "@ant-design/icons";
import AddLabForm from "../addLabForm";
import AddRadiologyForm from "../addRadiologyForm";
import AllocateModal from "../../../../../pages/admin/allocateduser/allocate";
import { actions as detailsActions } from "../../../../../stores/patient/details";

const StatusAction = ({
  patientDetailsResult,
  patientIdDetailsData,
  getPatientIdData,
}) => {
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
  const [inputValue, setInputValue] = useState({
    notes: "",
  });

  const renderAuditMenu = (value) => {
    var value = (
      <Menu>
        <>
          {patienIdDetails?.auditedStatus != "AUDITED" && (
            <Menu.Item key="1" onClick={() => auditPatient(1)}>
              <div className="patient-status">
                <span className={`badge ${visitStyles.audit_text}`}>AUDIT</span>
              </div>
            </Menu.Item>
          )}
          {patienIdDetails?.auditedStatus != "REAUDIT" && (
            <Menu.Item key="2" onClick={() => auditPatient(2)}>
              <div className="patient-status">
                <span className={`badge ${visitStyles.reaudit_text}`}>
                  RE AUDIT
                </span>
              </div>
            </Menu.Item>
          )}
          {patienIdDetails?.auditedStatus != "AUDIT_PENDING" && (
            <Menu.Item key="3" onClick={() => auditPatient(3)}>
              <div className="patient-status">
                <span className={`badge ${visitStyles.auditpending_text}`}>
                  AUDIT PENDING
                </span>
              </div>
            </Menu.Item>
          )}
          {patienIdDetails?.auditedStatus != "AUDITHOLD" && (
            <Menu.Item key="4" onClick={() => auditPatient(4)}>
              <div className="patient-status">
                <span className={`badge ${visitStyles.audithold_text}`}>
                  AUDIT HOLD
                </span>
              </div>
            </Menu.Item>
          )}
          {patienIdDetails?.auditedStatus != "AUDIT_DECLINED" && (
            <Menu.Item key="5" onClick={() => auditPatient(5)}>
              <div className="patient-status">
                <span className={`badge ${visitStyles.auditdecline_text}`}>
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
        break;
      case 3:
        setIsValidAction("auditPendingFunction");
        setConfirmNotesModal(true);
        break;
      case 4:
        setIsValidAction("auditHoldFunction");
        setConfirmNotesModal(true);
        break;
      case 5:
        setIsValidAction("auditDeclineFunction");
        setConfirmNotesModal(true);
        break;
      default:
        null;
    }
  };

  const getPatientIdDetails = async (result) => {
    var data = [
      {
        id: result?.patientId,
        name: result?.patientName,
      },
    ];
    setSelectedRowsId(data);
    const menu = (
      <Menu>
        {result?.processedStatus != "HOLD" ? (
          <Menu.Item
            key="1"
            onClick={() => {
              handleActionClick("HOLD");
              setMenuIsOpen(false);
            }}
          >
            <div className="patient-status">
              <span className={`badge hold-text`}>HOLD</span>
            </div>
          </Menu.Item>
        ) : null}
        {result?.processedStatus != "PENDING" &&
        result?.processedStatus != "COMPUTED" ? (
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
        {result?.processedStatus != "DECLINED" ? (
          <Menu.Item
            key="3"
            // disabled={flagFirstData?.flag !== undefined ? false : true}
            onClick={() => {
              handleActionClick("DECLINE");
              setMenuIsOpen(false);
            }}
          >
            <Tooltip
            // title={
            //   flagFirstData?.flag === undefined &&
            //   "Add flag to disable Decline"
            // }
            >
              <div className="patient-status">
                <span className={`badge failed-text`} style={{ color: "red" }}>
                  DECLINE
                </span>
              </div>
            </Tooltip>
          </Menu.Item>
        ) : null}

        {result?.processedStatus != "COMPLETED" ? (
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
      </Menu>
    );

    const menu2 = (
      <Menu>
        {result?.processedStatus != "HOLD" ? (
          <Menu.Item
            key="1"
            onClick={() => {
              handleActionClick("HOLD");
              setMenuIsOpen(false);
            }}
          >
            <div className="patient-status">
              <span className={`badge hold-text`}>HOLD</span>
            </div>
          </Menu.Item>
        ) : null}
        {result?.processedStatus != "PENDING" ? (
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
        {result?.processedStatus != "DECLINE" ? (
          <Menu.Item
            key="3"
            onClick={() => {
              handleActionClick("DECLINE");
              setMenuIsOpen(false);
            }}
            disabled={flagFirstData?.flag !== undefined ? false : true}
          >
            <Tooltip
              title={
                flagFirstData?.flag === undefined &&
                "Add flag to disable Decline"
              }
            >
              <div className="patient-status">
                <span className={`badge failed-text`} style={{ color: "red" }}>
                  DECLINED
                </span>
              </div>
            </Tooltip>
          </Menu.Item>
        ) : null}

        {result?.processedStatus != "COMPLETE" ? (
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
        {result?.processedStatus != "HOLD" ? (
          <Menu.Item
            key="1"
            onClick={() => {
              handleActionClick("HOLD");
              setMenuIsOpen(false);
            }}
          >
            <div className="patient-status">
              <span className={`badge hold-text`}>HOLD</span>
            </div>
          </Menu.Item>
        ) : null}
        {result?.processedStatus != "PENDING" ? (
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
        {result?.processedStatus != "DECLINE" ? (
          <Menu.Item
            key="3"
            onClick={() => {
              handleActionClick("DECLINE");
              setMenuIsOpen(false);
            }}
            disabled={flagFirstData?.flag !== undefined ? false : true}
          >
            <Tooltip
              title={
                flagFirstData?.flag === undefined &&
                "Add flag to disable Decline"
              }
            >
              <div className="patient-status">
                <span className={`badge failed-text`} style={{ color: "red" }}>
                  DECLINE
                </span>
              </div>
            </Tooltip>
          </Menu.Item>
        ) : null}

        {result?.processedStatus != "COMPLETE" ? (
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
    if (value == "HOLD") {
      setConfirmNotesModal(true);
      setIsValidAction("holdFunction");
    }
    if (value == "DECLINE") {
      setConfirmNotesModal(true);
      setIsValidAction("declineFunction");
    }
    if (value == "PENDING") {
      setConfirmNotesModal(true);
      setIsValidAction("pendingFunction");
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
  };

  const handleSubmitValidNotes = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === true) {
      setConfirmNotesModal(false);
      updateStatus(isValidAction);
    }
    setValidated(true);
  };

  const handleSubmitHccComplete = async () => {
    var userData = {
      userId: localUserId,
    };
    var resultData = patientDetailsResult?.data?.response;
    var postData = { ...userData, ...resultData };
    try {
      const response = await axios.post(
        ENDPOINTS.apiEndoint + `dbservice/patient/status/complete`,
        postData
      );
      var result = response.data;
      if (result.status == "SUCCESS") {
        notification.success({
          message: result.message,
          placement: "top",
          duration: 1,
        });
        setConfirmCompleteModal(false);
        getPatientIdData(localPatientId);
      } else {
      }
    } catch (e) {}
  };

  const updateAudit = async () => {
    var userData = {
      userId: localUserId,
      orgId: patientDocumentResult.orgId,
      tenantId: patientDocumentResult.tenantId,
    };
    var resultData = patientDetailsResult?.data?.response;
    var postData = { ...userData, ...resultData };
    try {
      const response = await axios.post(
        ENDPOINTS.apiEndoint + `dbservice/patient/status/audit`,
        postData
      );
      var result = response.data;
      if (result.status == "SUCCESS") {
        notification.success({
          message: result.message,
          placement: "top",
          duration: 1,
        });
        setConfirmCompleteModal(false);
        getPatientIdData(localPatientId);
      } else {
      }
    } catch (e) {}
  };

  const statusCheck = (value) => {
    switch (value) {
      case "declineFunction":
        return "DECLINED";
      case "holdFunction":
        return "HOLD";
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
    var postData = {
      // orgId: localOrgId,
      patientId: localPatientId,
      notes: inputValue.notes,
      processedStatus: statusCheck(action),
      // dos: patientDetailsResult?.data?.response?.processedYear,
    };

    // var apiURL = "";
    // if (action == "declineFunction") {
    //   apiURL = "dbservice/patient/status/decline";
    // }
    // if (action == "holdFunction") {
    //   apiURL = "dbservice/patient/status/hold";
    // }
    // if (action == "pendingFunction") {
    //   apiURL = "dbservice/patient/status/pending";
    // }
    // if (action == "reAuditFunction") {
    //   apiURL = "dbservice/patient/status/reaudit";
    // }
    // if (action == "auditPendingFunction") {
    //   apiURL = "dbservice/patient/status/auditPending";
    // }
    // if (action == "auditHoldFunction") {
    //   apiURL = "dbservice/patient/status/auditHold";
    // }
    // if (action == "auditDeclineFunction") {
    //   apiURL = "dbservice/patient/status/auditDecline";
    // }
    try {
      const response = await axios.post(
        ENDPOINTS.apiEndoint + `dbservice/patient/status/overallstatus`,
        postData
      );
      var result = response.data;
      if (result.status == "SUCCESS") {
        notification.success({
          message: result.message,
          placement: "top",
          duration: 1,
        });
      }
      setConfirmNotesModal(false);
      setConfirmCompleteModal(false);
      setConfirmAuditModal(false);
      getPatientIdData(localPatientId);
      setInputValue({
        notes: "",
      });
    } catch (e) {}
  };

  const handleChange = async (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setInputValue({ ...inputValue, [key]: value });
  };

  useEffect(() => {
    const userRoleLocal = localStorage.getItem("userRole");
    const uId = localStorage.getItem("userId");
    const orgId = localStorage.getItem("orgId");
    setUserRole(userRoleLocal);
    setLocalOrgId(orgId);
    setLocalUserId(uId);
    setLocalPatientId(patientIdDetailsData?.data?.response?.id);
    getPatientIdDetails(patientIdDetailsData?.data?.response);
    setPatienIdDetails(patientIdDetailsData?.data?.response);
  }, [patientIdDetailsData?.data?.response]);

  return (
    <>
      {patientIdDetailsData?.data?.response && (
        <>
          {userRole == "admin" || userRole === "tenant_admin" ? (
            <div className={`${visitStyles.actionbtnContainer}`}>
              {/* <Dropdown
                overlay={adminActionItems}
                onVisibleChange={(v) => setMenuIsOpen(v)}
                visible={menuIsOpen}
                className={`completedBtnHcc ${visitStyles.completedBtnHcc}`}
              >
                <Button
                  type="primary"
                  className={`completedBtnHcc ${visitStyles.completedBtnHcc}`}
                >
                  <span>
                    {patienIdDetails?.allocatedOn ? "ALLOCATED" : "ALLOCATE"}
                  </span>
                  <span style={{ marginLeft: "10px" }}>
                    <DownOutlined />
                  </span>
                </Button>
              </Dropdown> */}
              <Button
                type="primary"
                className={`completedBtnHcc ${visitStyles.completedBtnHcc}`}
              >
                <span>
                  {patienIdDetails?.allocatedOn ? "ALLOCATED" : "ALLOCATE"}
                </span>
              </Button>
            </div>
          ) : userRole == "supervisor" ? (
            <div className={`${visitStyles.actionbtnContainer}`}>
              <Dropdown
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
                      ? patienIdDetails?.auditedStatus
                      : "AUDIT"}
                  </span>
                  <span style={{ marginLeft: "10px" }}>
                    <DownOutlined />
                  </span>
                </Button>
              </Dropdown>
            </div>
          ) : (
            <div className={`${visitStyles.actionbtnContainer}`}>
              {patienIdDetails?.processedStatus == "COMPLETED" ? (
                <Dropdown
                  overlay={
                    activeTab == 3
                      ? actionItems2
                      : activeTab == 4
                      ? actionItems3
                      : actionItems
                  }
                  onVisibleChange={(v) => setMenuIsOpen(v)}
                  visible={menuIsOpen}
                  className={`completedBtnHcc ${visitStyles.completedBtnHcc}`}
                >
                  <Button
                    type="primary"
                    className={`completedBtnHcc ${visitStyles.completedBtnHcc}`}
                  >
                    <span>COMPLETED</span>
                    <span style={{ marginLeft: "10px" }}>
                      <DownOutlined />
                    </span>
                  </Button>
                </Dropdown>
              ) : patienIdDetails?.processedStatus == "DECLINED" ? (
                <div className={`col-xl-12`}>
                  <Dropdown
                    overlay={
                      activeTab == 3
                        ? actionItems2
                        : activeTab == 4
                        ? actionItems3
                        : actionItems
                    }
                    onVisibleChange={(v) => setMenuIsOpen(v)}
                    visible={menuIsOpen}
                    className={`declinedBtnHcc ${visitStyles.declinedBtnHcc}`}
                  >
                    <Button
                      type="primary"
                      className={`declinedBtnHcc ${visitStyles.declinedBtnHcc}`}
                    >
                      <span>DECLINED</span>
                      <span style={{ marginLeft: "10px" }}>
                        <DownOutlined />
                      </span>
                    </Button>
                  </Dropdown>
                </div>
              ) : patienIdDetails?.processedStatus == "HOLD" ? (
                <Dropdown
                  overlay={
                    activeTab == 3
                      ? actionItems2
                      : activeTab == 4
                      ? actionItems3
                      : actionItems
                  }
                  onVisibleChange={(v) => setMenuIsOpen(v)}
                  visible={menuIsOpen}
                  className={`holdBtnHcc ${visitStyles.holdBtnHccs}`}
                >
                  <Button
                    type="primary"
                    className={`holdBtnHcc ${visitStyles.holdBtnHccs}`}
                  >
                    <span>HOLD</span>
                    <span style={{ marginLeft: "10px" }}>
                      <DownOutlined />
                    </span>
                  </Button>
                </Dropdown>
              ) : patienIdDetails?.processedStatus == "PENDING" ||
                patienIdDetails?.processedStatus == "COMPUTED" ? (
                <Dropdown
                  overlay={
                    activeTab == 3
                      ? actionItems2
                      : activeTab == 4
                      ? actionItems3
                      : actionItems
                  }
                  onVisibleChange={(v) => setMenuIsOpen(v)}
                  visible={menuIsOpen}
                  className={`pendingBtn ${visitStyles.pendingBtn}`}
                >
                  <Button
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
                  {isLoading ? "Loding..." : "Submit"}
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
      {confirmCompleteModal ? (
        <div className={visitStyles.completedModal}>
          <Modal
            title="Are you sure to complete this task?"
            open={true}
            onOk={() => updateStatus("complete")}
            onCancel={handleCloseModal}
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
      <AllocateModal
        open={allocateModal}
        setOpen={setAllocateModal}
        selectedRowsId={selectedRowsId}
        setAllocateClicked={setAllocateClicked}
        setSelectedRowsId={setSelectedRowsId}
        setSelectedChart={setSelectedChart}
        selectedChart={selectedChart}
      />
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
  }
);
export default enhancer(StatusAction);
