import React, { useState, useEffect } from "react";
import { Button, Offcanvas } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import axios from "../../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../../utility/enpoints";
import visitStyles from "../../../../../styles/visitdata.module.css";
import { Popover, Avatar, Tooltip, notification } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faClock } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { SVGICON } from "../../../../../jsx/constant/theme";
import { connect } from "react-redux";

const Notes = ({ setOpen, open, patientDetailsResult }) => {
  const [inputValue, setInputValue] = useState({
    patientId: "",
    comments: "",
  });
  const [notesList, setNotesList] = useState([]);
  const [filterDataLoading, setFilterDataLoading] = useState(true);
  const [commentsTrigger, setCommentsTrigger] = useState(false);
  const [validated, setValidated] = useState(false);
  const [userDetails, setUserDetails] = useState();
  const [localPatientId, setLocalPatientId] = useState("");

  const handleSubmitNotes = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    const yearData = patientDetailsResult?.data?.response;
    if (form.checkValidity() === true) {
      setCommentsTrigger(true);
      const orgId = localStorage.getItem("orgId");
      var dataFormatSuggested = {
        patientId: yearData?.patientId,
        // orgId: orgId,
        note: inputValue.comments,
        processedYear: yearData?.processedYear
          ? yearData?.processedYear
          : yearData?.dateOfService
          ? yearData?.dateOfService
          : "",
        // dateOfService: yearData?.dateOfService ? yearData?.dateOfService : ""
      };
      const response = await axios.post(
        ENDPOINTS.apiEndoint + `dbservice/notes`,
        dataFormatSuggested
      );
      var result = response.data;
      if (result.status == "SUCCESS") {
        inputValue.comments = "";
        notification.success({
          message: result.message,
          placement: "top",
          duration: 1,
        });
        getNotesList();
        setCommentsTrigger(false);
      } else {
      }
    }
    setValidated(true);
  };

  const handleEnterTextNotes = async (event) => {
    if (event.charCode == 13) {
      if (inputValue.comments.trim() != "") {
        const orgId = localStorage.getItem("orgId");
        var dataFormatSuggested = {
          patientId: patientDetailsResult?.data?.response?.patientId,
          orgId: orgId,
          notes: inputValue.comments,
          year: patientDetailsResult?.data?.response?.processedYear,
        };
        const response = await axios.post(
          ENDPOINTS.apiEndoint + `dbservice/notes`,
          [dataFormatSuggested]
        );
        var result = response.data;
        if (result.status == "SUCCESS") {
          inputValue.comments = "";
          notification.success({
            message: result.message,
            placement: "top",
            duration: 1,
          });
          getNotesList();
        } else {
        }
      }
    }
  };

  const getNotesList = async () => {
    const yearData = patientDetailsResult?.data?.response;
    const response = await axios.get(
      ENDPOINTS.apiEndoint +
        `dbservice/notes?patientId=${
          patientDetailsResult?.data?.response?.patientId
        }&processedYear=${
          yearData?.processedYear ? yearData?.processedYear : ""
        }&dateOfService=${
          yearData?.dateOfService ? yearData?.dateOfService : ""
        }`
    );
    setNotesList(response.data.response);
    setFilterDataLoading(false);
  };

  const splitUserName = (name) => {
    if (name) {
      return name[0];
    }
  };

  const renderUserDetails = async (userId) => {
    var result = "";
    var data = "";

    data = (
      <div className={visitStyles.userDetailsCard}>
        <div className="bouncing-loader">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );

    setTimeout(async () => {
      const response = await axios.get(
        ENDPOINTS.apiEndoint + `dbservice/user/get?userName=${userId}`
      );

      if (response.data) {
        result = response.data.response;
        data = (
          <div className={visitStyles.userDetailsCard}>
            <div className={visitStyles.avatarStyle}>
              <Avatar size={60}>{splitUserName(result?.userName)}</Avatar>
              <span className={visitStyles.userRole}>{result?.role[0]}</span>
            </div>
            <div className={visitStyles.userNameDetails}>
              <FontAwesomeIcon icon={faUserCircle} />
              <span>{result.userName}</span>
            </div>
            <div className={visitStyles.usertimeDetails}>
              <FontAwesomeIcon icon={faClock} />
              {/* <span>{currentTime}</span> */}
              <span>{result.actionCreatedDate}</span>
            </div>
          </div>
        );
      }
      setUserDetails(data);
    }, 1000);

    setUserDetails(data);
  };

  const handleChange = async (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setInputValue({ ...inputValue, [key]: value });
  };

  useEffect(() => {
    const patientId = localStorage.getItem("patientId");
    setLocalPatientId(patientId);
    getNotesList();
  }, []);

  return (
    <Offcanvas
      onHide={setOpen}
      show={open}
      placement="end"
      className={`offcanvas-end ${visitStyles.commentDrawer}`}
      style={{
        width: "370px",
      }}
    >
      <div className="offcanvas-header">
        <h5 className="modal-title" id="#gridSystemModal">
          Notes
        </h5>
        <button
          type="button"
          className="btn-close"
          onClick={() => setOpen(false)}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div className="offcanvas-body">
        <div className="container-fluid">
          <Form noValidate validated={validated} onSubmit={handleSubmitNotes}>
            <div className="row">
              <div className={`col-xl-12 ${visitStyles.textareaContainer}`}>
                <textarea
                  className={visitStyles.commentsFormControl}
                  rows="5"
                  required
                  id="comments"
                  name="comments"
                  placeholder="Add Notes"
                  onChange={handleChange}
                  onKeyPress={handleEnterTextNotes}
                  type="submit"
                  value={inputValue.comments}
                ></textarea>
                <Button
                  type="submit"
                  disabled={commentsTrigger}
                  className={visitStyles.commentSendIcon}
                >
                  {SVGICON.sentMessageIcon}
                </Button>
              </div>
            </div>
          </Form>
          {notesList?.map((data, index) => (
            <div className={visitStyles.comments_card}>
              <div className={`${visitStyles.commentNameHead}`}>
                <span className={visitStyles.commentsName}>{data?.note}</span>
                <Tooltip placement="bottom" title={data?.createdBy}>
                  <Popover
                    placement="bottom"
                    content={userDetails}
                    onOpenChange={() => renderUserDetails(createdBy)}
                  >
                    <Avatar
                      className={
                        !data?.createdByDetails?.profileImageUrl &&
                        visitStyles.timeLineUsername
                      }
                      src={data?.createdByDetails?.profileImageUrl}
                    >
                      {!data?.createdByDetails?.profileImageUrl &&
                        splitUserName(
                          data?.createdByDetails?.firstName ||
                            data?.createdByDetails?.lastName
                        )}
                    </Avatar>
                  </Popover>
                </Tooltip>
              </div>
              <span className={visitStyles.commentsTime}>
                {moment(data?.createdDate).format("MM-DD-YYYY hh:mm:A")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Offcanvas>
  );
};

const enhancer = connect((state) => ({
  patientDetailsResult: state?.patientDetails?.details?.patientResult,
}));
export default enhancer(Notes);
