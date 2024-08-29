import React, { useState, useEffect } from "react";
import { useSelector, connect } from "react-redux";
import visitStyles from "../../../../../styles/visitdata.module.css";
import moment, { months } from "moment";
import { SVGICON } from "../../../../../jsx/constant/theme";
import { Modal } from "antd";
import styles from "../styles.module.css";
import AddMeatQuery from "../../components/addMeatQuery";

const MeatQuery = ({patientDetailsResult,meatQueryDetails}) => {
  const [isMeatQueryModal, setIsMeatQueryModal] = useState(false);
  const [meatQueriedDetailsModal, setMeatQueriedDetailsModal] = useState(false);
  const [selectPreviousCode, setSelectPreviousCode] = useState(null);
  const [meatQueryList, setMeatQueryList] = useState([]);
  const [meatQueryListPrevious, setMeatQueryListPrevious] = useState([]);
  const [meatQueryResult, setMeatQueryResult] = useState([]);
  const [queryFormValues, setQueryFormValues] = useState(false);

  const handleCloseModal = () => {
    setIsMeatQueryModal(false);
    setMeatQueriedDetailsModal(false);
  };

  const addMeatQuery = (value, condition) => {
    setQueryFormValues(value);
    setIsMeatQueryModal(true);
  };

  const meatQueriedComments = (value) => {
    setMeatQueryResult(value);
    setMeatQueriedDetailsModal(true);
  }; 

  const getPreviousData = (code, action) => {
    const result = meatQueryDetails?.data?.response.filter(
      (res) => res.diagnosisCode == code && res.currentQuery != true
    );
    setSelectPreviousCode(code);
    var querySort = result;
    querySort.sort(function (a, b) {
      return b.queryVersion - a.queryVersion;
    });
    setMeatQueryListPrevious(querySort);
  };
  // const confirmMeatQuery = async (code) => {
  //   var result = await deleteMeatQuery(localPatientId, code);
  //   if (result.status == "SUCCESS") {
  //     var result = await getMeatQueryList(selectedDosValue, localPatientId);
  //     setMeatQueryList(result.response);
  //     notification.success({
  //       message: result.message,
  //       placement: "top",
  //       duration: 1,
  //     });
  //   } else {
  //   }
  // };

  return (
    <>
      <div className="my-post-content pt-3">
        <div className={visitStyles.meat_head_card}>
          <div className="row">
            <div className="col-xl-1">
              <label>Codes</label>
            </div>
            <div className="col-xl-2">
              <label>Description</label>
            </div>
            <div className="col-xl-2">
              <label>Published By</label>
            </div>
            <div className="col-xl-2">
              <label>Date & Time</label>
            </div>
            <div className="col-xl-2">
              <label>Message</label>
            </div>
            <div className="col-xl-2">
              <label>Reason</label>
            </div>
            <div className="col-xl-1">
              <label></label>
            </div>
          </div>
        </div>
        {meatQueryDetails?.data?.response?.length != 0 ? (
          <div className={visitStyles.container}>
            <div className={visitStyles.hccStickey_head}>
              {meatQueryDetails?.data?.response?.map((item) => (
                <>
                  {item.isShow ? (
                    <div className={`${visitStyles.meat_details_card}`}>
                      <>
                        {item.diagnosisCode == selectPreviousCode ? (
                          <div className="d-flex justify-content-between">
                            <span className={styles.currentBadge}>Current</span>
                            <span
                              className={styles.moreBtn}
                              onClick={() => setSelectPreviousCode(null)}
                            >
                              Less
                            </span>
                          </div>
                        ) : (
                          <div className="text-end">
                            <span
                              className={styles.moreBtn}
                              onClick={() =>
                                getPreviousData(item.diagnosisCode)
                              }
                            >
                              More
                            </span>
                          </div>
                        )}
                      </>
                      <div className="row">
                        <div className="col-xl-1 d-grid">
                          <span className="meat-name-details font-bold">
                            {item.diagnosisCode}
                          </span>
                        </div>
                        <div className="col-xl-2">
                          <span className="meat-name-details">
                            {item.description}
                          </span>
                        </div>
                        <div className="col-xl-2 d-grid">
                          <span className="meat-name-details">
                            {item.createdBy}
                          </span>
                          {/* <span className={styles.l1auditorBadge}>
                                        L1 Auditor
                                      </span> */}
                        </div>
                        <div className="col-xl-2 d-grid">
                          <span className="meat-name-details">
                            {moment(item.createdAt).format(
                              "MM-DD-YYYY & HH:MM"
                            )}
                          </span>
                        </div>
                        <div className="col-xl-2 d-grid">
                          <span
                            onClick={() => meatQueriedComments(item)}
                            className="cr-pointer meat-name-details"
                          >
                            {SVGICON.comment}
                          </span>
                        </div>
                        <div className="col-xl-2 d-grid">
                          <span className="meat-name-details">
                            {item.queryReason}
                          </span>
                        </div>
                        <div className="col-xl-1">
                          <div className="d-flex">
                            <div
                              onClick={() => addMeatQuery(item, "Update")}
                              className={styles.edit_meat_query}
                            >
                              {SVGICON.meatQueryEdit}
                            </div>
                            {/* <Popconfirm
                                          title="Are you sure to delete this query?"
                                          okText="Yes"
                                          cancelText="No"
                                          onConfirm={() =>
                                            confirmMeatQuery(item.diagnosisCode)
                                          }
                                        >
                                          <div
                                            className={styles.delete_meat_query}
                                          >
                                            <FontAwesomeIcon
                                              icon={faTrash}
                                              style={{
                                                size: 8,
                                                color: "#fff",
                                              }}
                                            />
                                          </div>
                                        </Popconfirm> */}
                          </div>
                        </div>
                      </div>
                      {item.diagnosisCode == selectPreviousCode ? (
                        <>
                          <span className={styles.previousBadge}>Previous</span>
                          {meatQueryListPrevious?.map((item) => (
                            <div>
                              <div className="row">
                                <div className="col-xl-1 d-grid">
                                  <span className="meat-name-details font-bold">
                                    {item.diagnosisCode}
                                  </span>
                                </div>
                                <div className="col-xl-2">
                                  <span className="meat-name-details">
                                    {item.description}
                                  </span>
                                </div>
                                <div className="col-xl-2 d-grid">
                                  <span className="meat-name-details">
                                    {item.createdBy}
                                  </span>
                                </div>
                                <div className="col-xl-2 d-grid">
                                  <span className="meat-name-details">
                                    {moment(item.createdAt).format(
                                      "MM-DD-YYYY & HH:MM:SS"
                                    )}
                                  </span>
                                </div>
                                <div className="col-xl-2 d-grid">
                                  <span
                                    onClick={() => meatQueriedComments(item)}
                                    className="cr-pointer meat-name-details"
                                  >
                                    {SVGICON.comment}
                                  </span>
                                </div>
                                <div className="col-xl-2 d-grid">
                                  <span className="meat-name-details">
                                    {item.queryReason}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </>
                      ) : null}
                    </div>
                  ) : null}
                </>
              ))}
            </div>
          </div>
        ) : null}
      </div>  
    <AddMeatQuery queryFormValues={queryFormValues} handleCloseModal={handleCloseModal} isMeatQueryModal={isMeatQueryModal} setIsMeatQueryModal={setIsMeatQueryModal}/>

      <Modal
        title="Meat Queried Details"
        centered
        open={meatQueriedDetailsModal}
        onOk={handleCloseModal}
        onCancel={handleCloseModal}
        footer={null}
        className="meat-queriedmodal visitdata-modalCentent"
       
      >
        <div className="offcanvas-body"  style={{width:"auto"}}>
          <div className="container-fluid">
            <div className={styles.meatCommentCard}>
              <div className={styles.meatCommentCard2}>
                {/* <div>
                  <span className={styles.meatQueried_head}>Subject</span>
                  <p className={styles.meatQueried_details}>
                    We've identified the following details that may pertain to
                    records associated with
                    <b>{patientDetailsResult?.result?.response?.patientName}</b>
                    .
                  </p>
                </div> */}
                <div>
                  <span className={styles.meatQueried_head}>
                    Dear,
                  </span>
                  <p className={`${styles.meatQueried_details} m-0 mb-1`}>
                      <span className="fw-semibold">Providers : </span>{meatQueryResult?.providerNames?.map(item => <span>{item}, </span>)}
                    </p>  
                    <p className={`${styles.meatQueried_details} m-0 mb-1`}>
                    <span className="fw-semibold">DOS : </span>{meatQueryResult?.dateOfServices?.map(item => <span>{item}, </span>)}
                    </p>  
                    <p className={`${styles.meatQueried_details} m-0 mb-1`}>
                    <span className="fw-semibold">Query Comment : </span>{meatQueryResult.queryComment}
                    </p>                 
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

const enhancer = connect(
  (state) => ({
    patientDetailsResult :state?.patientDetails?.details?.result,
    meatQueryDetails :state?.patientDetails?.details?.meatQueryResult,
  })
);
export default enhancer(MeatQuery);