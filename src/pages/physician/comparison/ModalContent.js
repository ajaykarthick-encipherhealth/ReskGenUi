import React from 'react'
import { Button, Form } from "react-bootstrap";
import {  Modal } from 'antd'
import styles from './styles.module.css'



const ModalContent = ({fileUploadModal,closeModal,handleSubmit,validated}) => {
  return (
    <Modal
    title="Choose Patient"
    open={fileUploadModal}
    centered
    onCancel={() => closeModal()}
    footer={false}
  >
    <div className="offcanvas-body">
      <div className="container-fluid">
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <div className="row">
            <div className={styles.patientListContainer}>
              <div>
                <h6 className={styles.patientName}>
                  EH_1234 / Mary E Stone
                </h6>
              </div>
              <div>
                <h6 className={styles.patientName}>
                  EH_1235 / Snyder, Earl A
                </h6>
              </div>
              <div>
                <h6 className={styles.patientName}>
                  EH_1234 / VAIN, Rosemary
                </h6>
              </div>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="btn btn-primary btn-sm me-1"
            >
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
  </Modal>
  )
}

export default ModalContent