import React, { useState, useEffect } from "react";
import { Button, Offcanvas } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import axios from "../../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../../utility/enpoints";
import visitStyles from "../../../../../styles/visitdata.module.css";
import { Popover, Avatar, Tooltip, notification } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faClock,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { SVGICON } from "../../../../../jsx/constant/theme";
import { connect } from "react-redux";
import { getStorage } from "../../../../../utils/storages";
import { actions as detailsActions } from "../../../../../stores/patient/details";
import { isDeleteNotes } from "../../../../../stores/patient/details/actions";
import { getResponePopup } from "../../../../../utils/reusable";

const Notes = ({ setOpen, open, patientDetailsResult, isDeleteNotes, isAddNotes }) => {
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
    if (inputValue.comments.trim() === "") {
      notification.warning({
        message: "Comment cannot be empty",
        placement: "top",
        duration: 1,
      });
      return;
    }
    const yearData = patientDetailsResult?.data?.response;
    if (form.checkValidity() === true) {
      setCommentsTrigger(true);
      const orgId = getStorage("orgId");

      var dataFormatSuggested = {
        patientId: yearData?.patientId,
        note: inputValue.comments,
        processedYear: yearData?.processedYear
          ? yearData?.processedYear
          : yearData?.dateOfService
          ? yearData?.dateOfService
          : "",
      };
      try {
        const response = await isAddNotes(dataFormatSuggested)
        getResponePopup(response);
        setInputValue({ ...inputValue, comments: "" });
        getNotesList();
        setCommentsTrigger(false);
      } catch (error) {
        getResponePopup(error?.response);

        setCommentsTrigger(false);
      }
    }

    setValidated(true);
  };

  const handleDelete = async () => {
    const payload = {
      patientId: patientDetailsResult?.data?.response?.patientId,
      noteId: notesList?.[0]?.noteId,
      processedYear: patientDetailsResult?.data?.response?.processedYear,
      dateOfService: patientDetailsResult?.data?.response?.dateOfService,
    };

    try {
      const response = await isDeleteNotes(dataFormatSuggested);
      getResponePopup(response);
      getNotesList();
    } catch (error) {
      getResponePopup(error?.response);
      console.error(error);
    }
  };

  const handleEnterTextNotes = async (event) => {
    const yearData = patientDetailsResult?.data?.response;
    if (event.charCode === 13) {
      if (inputValue.comments.trim() === "") {
        notification.warning({
          message: "Comment cannot be empty",
          placement: "top",
          duration: 1,
        });
        return;
      }

      if (inputValue.comments.trim() !== "") {
        const orgId = getStorage("orgId");

        var dataFormatSuggested = {
          patientId: yearData?.patientId,
          note: inputValue.comments,
          processedYear: yearData?.processedYear
            ? yearData?.processedYear
            : yearData?.dateOfService
            ? yearData?.dateOfService
            : "",
        };

        try {
          const response = await isAddNotes(dataFormatSuggested)
          getResponePopup(response);
          setInputValue({ ...inputValue, comments: "" });
          getNotesList();
        } catch (error) {
          getResponePopup(error?.response);
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
    setNotesList(response?.data?.response);
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
        result = response?.response;
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
    const patientId = getStorage("patientId");
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
            <div
              className={`${visitStyles.comments_card} position-relative`}
              key={index}
            >
              <div
                className="position-absolute top-0 end-0 mt-2 me-2 p-9"
                style={{ cursor: "pointer" }}
              >
                <FontAwesomeIcon
                  icon={faXmarkCircle}
                  onClick={handleDelete}
                  style={{ color: "#be3144" }}
                />
              </div>

              <div
                className={`${visitStyles.commentNameHead}`}
                style={{ paddingTop: "20px" }}
              >
                <span className={visitStyles.commentsName}>{data?.note}</span>
                <Tooltip placement="bottom" title={data?.createdBy}>
                  <Popover
                    placement="bottom"
                    content={userDetails}
                    onOpenChange={() => renderUserDetails(createdBy)}
                    overlayStyle={{ zIndex: 1000 }}
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

const enhancer = connect(
  (state) => ({
    patientDetailsResult: state?.patientDetails?.details?.patientResult,
  }),
  {
    isDeleteNotes: detailsActions.isDeleteNotes,
    isAddNotes: detailsActions.isAddNotes,
  }
);
export default enhancer(Notes);
