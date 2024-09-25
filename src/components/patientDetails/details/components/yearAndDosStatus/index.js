import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import axios from "../../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../../utility/enpoints";
import visitStyles from "../../../../../styles/visitdata.module.css";
import { Modal, Tooltip, notification, Dropdown, Menu } from "antd";
import { connect } from "react-redux";
import { DownOutlined } from "@ant-design/icons";
import { actions as detailsActions } from "../../../../../stores/patient/details";
import { getStorage } from "../../../../../utils/storages";

const YearAndDosStatus = ({
  patientDetailsResult,
  patientIdDetailsData,
  getPatientIdData,
  getpatientDetailsData,
  setIsLoading,
  getPatientDosList,
}) => {
  const [localOrgId, setLocalOrgId] = useState("");
  const [localUserId, setLocalUserId] = useState("");
  const [localPatientId, setLocalPatientId] = useState("");
  const [userRole, setUserRole] = useState("");
  const [actionItems, setActionItems] = useState([]);
  const [actionItems2, setActionItems2] = useState([]);
  const [actionItems3, setActionItems3] = useState([]);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [patienIdDetails, setPatienIdDetails] = useState("");
  const [confirmAuditModal, setConfirmAuditModal] = useState(false);
  const [isValidAction, setIsValidAction] = useState("");
  const [flagFirstData, setFlagFirstData] = useState([]);
  const [confirmCompleteModal, setConfirmCompleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [confirmNotesModal, setConfirmNotesModal] = useState(false);
  const [validated, setValidated] = useState(false);
  const [inputValue, setInputValue] = useState({
    notes: "",
  });

  const renderAuditMenu = (value) => {
    var value = (
      <Menu>
        <>
          {patientDetailsResult?.data?.response?.processedStatus !=
            "AUDITED" && (
            <Menu.Item key="1" onClick={() => auditPatient(1)}>
              <div className="patient-status">
                <span className={`badge ${visitStyles.audit_text}`}>AUDIT</span>
              </div>
            </Menu.Item>
          )}
          {patientDetailsResult?.data?.response?.processedStatus !=
            "REAUDIT" && (
            <Menu.Item key="2" onClick={() => auditPatient(2)}>
              <div className="patient-status">
                <span className={`badge ${visitStyles.reaudit_text}`}>
                  RE AUDIT
                </span>
              </div>
            </Menu.Item>
          )}
          {patientDetailsResult?.data?.response?.processedStatus !=
            "AUDIT_PENDING" && (
            <Menu.Item key="3" onClick={() => auditPatient(3)}>
              <div className="patient-status">
                <span className={`badge ${visitStyles.auditpending_text}`}>
                  AUDIT PENDING
                </span>
              </div>
            </Menu.Item>
          )}
          {patientDetailsResult?.data?.response?.processedStatus !=
            "AUDITHOLD" && (
            <Menu.Item key="4" onClick={() => auditPatient(4)}>
              <div className="patient-status">
                <span className={`badge ${visitStyles.audithold_text}`}>
                  AUDIT HOLD
                </span>
              </div>
            </Menu.Item>
          )}
          {patientDetailsResult?.data?.response?.processedStatus !=
            "AUDIT_DECLINED" && (
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
            onClick={() => {
              handleActionClick("DECLINE");
              setMenuIsOpen(false);
            }}
          >
            <div className="patient-status">
              <span className={`badge failed-text`} style={{ color: "red" }}>
                DECLINE
              </span>
            </div>
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
          >
            <div className="patient-status">
              <span className={`badge failed-text`} style={{ color: "red" }}>
                DECLINED
              </span>
            </div>
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
    setActionItems(menu);
    setActionItems2(menu2);
    setActionItems3(menu3);
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
    updateStatus("completedFuntion");
  };

  const updateAudit = async () => {
    updateStatus("auditFunction");
  };

  const updateStatus = async (action) => {
    setIsLoading(true);
    setConfirmNotesModal(false);
    setConfirmCompleteModal(false);
    setConfirmAuditModal(false);
    var postData = {
      patientId: localPatientId,
      notes: inputValue.notes,
      processedYear: patientDetailsResult?.data?.response?.processedYear,
      dateOfService: patientDetailsResult?.data?.response?.dateOfService,
    };
    var apiURL = "";
    if (action == "declineFunction") {
      apiURL = "dbservice/patient/status/decline";
    }
    if (action == "holdFunction") {
      apiURL = "dbservice/patient/status/hold";
    }
    if (action == "pendingFunction") {
      apiURL = "dbservice/patient/status/pending";
    }
    if (action == "reAuditFunction") {
      apiURL = "dbservice/patient/status/reaudit";
    }
    if (action == "auditPendingFunction") {
      apiURL = "dbservice/patient/status/auditPending";
    }
    if (action == "auditHoldFunction") {
      apiURL = "dbservice/patient/status/auditHold";
    }
    if (action == "auditDeclineFunction") {
      apiURL = "dbservice/patient/status/auditDecline";
    }
    if (action == "completedFuntion") {
      apiURL = "dbservice/patient/status/complete";
    }
    if (action == "auditFunction") {
      apiURL = "dbservice/patient/status/audit";
    }
    try {
      const response = await axios.post(
        ENDPOINTS.apiEndoint + apiURL,
        postData
      );
      var result = response.data;
      if (result.status == "SUCCESS") {
        notification.success({
          message: result.message,
          placement: "top",
          duration: 1,
        });
        getpatientDetailsData(
          localPatientId,
          patientDetailsResult?.data?.response?.processedYear,
          patientDetailsResult?.data?.response?.dateOfService
        );
        getPatientDosList(
          localPatientId,
          patientDetailsResult?.data?.response?.processedYear
        );
      } else {
        setIsLoading(false);
      }
    } catch (e) {}
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
    getPatientIdDetails(patientDetailsResult?.data?.response);
    setPatienIdDetails(patientDetailsResult?.data?.response);
  }, [patientDetailsResult?.data?.response]);

  return (
    <>
      {patientDetailsResult?.data?.response && (
        <>
          {userRole == "supervisor" ? (
            <div className={`${visitStyles.yearactionbtnContainer}`}>
              <Dropdown
                overlay={renderAuditMenu()}
                onVisibleChange={(v) => setMenuIsOpen(v)}
                visible={menuIsOpen}
                className={
                  patienIdDetails?.processedStatus == "AUDITHOLD"
                    ? `auditHoldBtnHcc`
                    : patienIdDetails?.processedStatus == "AUDIT_PENDING"
                    ? `auditPendingBtnHcc`
                    : patienIdDetails?.processedStatus == "AUDITED"
                    ? `auditBtnHcc`
                    : patienIdDetails?.processedStatus == "REAUDIT"
                    ? `reauditBtnHcc`
                    : patienIdDetails?.processedStatus == "AUDIT_DECLINED"
                    ? `declineBtnHcc`
                    : `auditBtnHcc`
                }
              >
                <Button
                  type="primary"
                  className={
                    patienIdDetails?.processedStatus == "AUDITHOLD"
                      ? `auditHoldBtnHcc`
                      : patienIdDetails?.processedStatus == "AUDIT_PENDING"
                      ? `auditPendingBtnHcc`
                      : patienIdDetails?.processedStatus == "AUDITED"
                      ? `auditBtnHcc`
                      : patienIdDetails?.processedStatus == "REAUDIT"
                      ? `reauditBtnHcc`
                      : patienIdDetails?.processedStatus == "AUDIT_DECLINED"
                      ? `declineBtnHcc`
                      : `auditBtnHcc`
                  }
                >
                  <span>
                    {patienIdDetails?.processedStatus != null
                      ? patienIdDetails?.processedStatus
                      : "AUDIT"}
                  </span>
                  <span style={{ marginLeft: "10px" }}>
                    <DownOutlined />
                  </span>
                </Button>
              </Dropdown>
            </div>
          ) : userRole == "reviewer" || userRole == "admin" ? (
            <div className={`${visitStyles.yearactionbtnContainer}`}>
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
                patienIdDetails?.processedStatus == "COMPUTED" ||  patienIdDetails?.processedStatus == null ? (
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
          ) : null}
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
                  ></textarea>
                </div>
              </div>

              <div>
                <Button type="submit" className="btn btn-primary btn-sm me-1">
                  Submit
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
            onOk={handleSubmitHccComplete}
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
            onOk={updateAudit}
            onCancel={() => setConfirmAuditModal(false)}
          ></Modal>
        </div>
      ) : null}
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
    getpatientDetailsData: detailsActions.patientDetailsAction,
    getPatientDosList: detailsActions.dosDeatilsAction,
  }
);
export default enhancer(YearAndDosStatus);
