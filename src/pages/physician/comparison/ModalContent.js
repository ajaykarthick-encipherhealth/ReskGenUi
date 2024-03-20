import React from "react";
import { Button, Form, Offcanvas } from "react-bootstrap";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import styles from "./styles.module.css";
import { priorityStatus } from "../table/PatientList/patientList";
import { renderUserPrfoileAvatar } from "../../../components/headerFilters/functions";

const ModalContent = ({
  fileUploadModal,
  closeModal,
  handleSubmit,
  validated,
  setFileUploadModal,
  setSelectedPatient
}) => {
  const patientsList = useSelector((state) => state.PhyicianReducer.patients);
  return (
    <Offcanvas
      show={fileUploadModal}
      className="offcanvas-end"
      placement="end"
      style={{ padding: "0px" }}
    >
      <div className={styles.closeIcon}>
        <div>
          {" "}
          <span>Patients</span>
        </div>
        <button
          type="button"
          className="btn-close"
          onClick={() => {
            setFileUploadModal(false);
          }}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div className="offcanvas-body">
        <div className="container-fluid">
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <div className="row">
              {patientsList?.data?.response?.map((info) => (
                <div className={styles.patientListContainer} onClick={()=>{setSelectedPatient(info?.id)}}>
                  <div style={{ marginBottom: "10px" }}>
                    {info.patientName || info?.profilePictureUrl ? (
                      <div className={styles.patientsDisply}>
                        <span style={{ margin: "10px" }}>
                          {renderUserPrfoileAvatar(
                            info.patientName,
                            "",
                            info?.profilePictureUrl
                          )}
                        </span>
                        <div>
                          <span>{info?.patientName}</span>
                          <div> {dayjs(info?.date).format("MM-DD-YYYY")}</div>
                        </div>
                      </div>
                    ) : (
                      <span>---</span>
                    )}
                  </div>
                  <div style={{ marginTop: "10px" }}>
                    {priorityStatus(info?.priority, true)}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "20px" }}>
              <Button type="submit" className="btn btn-primary btn-sm me-1">
                Submit
              </Button>
              <Button
                onClick={() => closeModal()}
                className="btn btn-danger btn-sm light ms-1"
              >
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </Offcanvas>
  );
};

export default ModalContent;
