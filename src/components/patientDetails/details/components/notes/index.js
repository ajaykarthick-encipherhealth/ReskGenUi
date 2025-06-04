import React, { useState, useEffect } from "react";
import { Button, Offcanvas } from "react-bootstrap";
import Form from "react-bootstrap/Form";
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
import { formatDateTime, getResponePopup } from "../../../../../utils/reusable";
import {
  getNotesLists,
  getUserDetails,
} from "../../../../../stores/patient/details/network";

const Notes = ({
  setOpen,
  open,
  patientDetailsResult,
  isDeleteNotes,
  isAddNotes,
  patientIdDetailsData
}) => {
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
  const isDisabled =
  patientIdDetailsData?.data?.response
    ?.workflow?.[0]?.status !== "PENDING";
  const handleSubmitNotes = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (inputValue.comments.trim() === "") {
      getResponePopup({
        data: {
          status: "USER_DEFINED_ERROR",
          message: "Comment cannot be empty",
        },
      });
      return;
    }
    const yearData = patientDetailsResult?.data?.response;
    if (isDisabled) return;
    if (form.checkValidity() === true) {
      setCommentsTrigger(true);
      const orgId = getStorage("orgId");

      var dataFormatSuggested = {
        patientId: yearData?.patientId,
        note: inputValue.comments,
        processedYear: yearData?.processedYear,
        dateOfService: patientDetailsResult?.data?.response?.dateOfService,
      };
      try {
        const response = await isAddNotes(dataFormatSuggested);
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

  const handleDelete = async (noteId) => {
    const payload = {
      patientId: patientDetailsResult?.data?.response?.patientId,
      noteId: noteId,
      processedYear: patientDetailsResult?.data?.response?.processedYear,
      dateOfService: patientDetailsResult?.data?.response?.dateOfService,
    };

    try {
      const response = await isDeleteNotes(payload);
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
        getResponePopup({
          data: {
            status: "USER_DEFINED_ERROR",
            message: "Comment cannot be empty",
          },
        });
        return;
      }

      if (inputValue.comments.trim() !== "") {
        const orgId = getStorage("orgId");

        var dataFormatSuggested = {
          patientId: yearData?.patientId,
          note: inputValue.comments,
          processedYear: yearData?.processedYear,
          dateOfService: yearData?.dateOfService,
        };

        try {
          const response = await isAddNotes(dataFormatSuggested);
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
    const response = await getNotesLists(
      patientDetailsResult?.data?.response?.patientId,
      yearData
    );
    setNotesList(response?.response);
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
      const response = await getUserDetails(userId);
      if (response?.response) {
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
      id="offcanvasRightNotes"
      name="offcanvasRightNotes"
      onHide={setOpen}
      show={open}
      placement="end"
      className={`offcanvas-end ${visitStyles.commentDrawer}`}
      style={{
        width: "370px",
      }}
    >
      <div
        className="offcanvas-header"
        id="gridSystemModal"
        name="gridSystemModal"
      >
        <h5
          className="modal-title"
          id="gridSystemModalNotes"
          name="gridSystemModalNotes"
        >
          Notes
        </h5>
        <button
          id="closeNotes"
          name="closeNotes"
          type="button"
          className="btn-close"
          onClick={() => setOpen(false)}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div
        className="offcanvas-body"
        id="gridSystemModalBodyNotes"
        name="gridSystemModalBodyNotes"
      >
        <div
          className="container-fluid"
          id="gridSystemModalContainerNotes"
          name="gridSystemModalContainerNotes"
        >
          <Form
            noValidate
            validated={validated}
            onSubmit={handleSubmitNotes}
            id="notesForm"
            name="notesForm"
          >
            <div className="row">
              <div
                className={`col-xl-12 ${visitStyles.textareaContainer}`}
                id="notesContainer"
                name="notesContainer"
              >
                <textarea
                  className={visitStyles.commentsFormControl}
                  rows="5"
                  required
                  id="add-notes"
                  name="comments"
                  placeholder="Add Notes"
                  onChange={handleChange}
                  onKeyPress={handleEnterTextNotes}
                  type="submit"
                  value={inputValue.comments}
                  style={{
                    cursor: commentsTrigger || isDisabled ? "not-allowed" : "pointer"
                  }}
                ></textarea>
                <Button
                  id="submitNotes"
                  name="submitNotes"
                  type="submit"
                  style={{
                    cursor: commentsTrigger || isDisabled ? "not-allowed" : "pointer"
                  }}
                  disabled={commentsTrigger ||  isDisabled}
                  className={visitStyles.commentSendIcon}
                >
                  {SVGICON.sentMessageIcon}
                </Button>
              </div>
            </div>
          </Form>
          {notesList?.map((data, index) => (
            <div
              id={`notesCard-${index}`}
              name={`notesCard-${index}`}
              className={`${visitStyles.comments_card} position-relative`}
              key={index}
            >
              <div
                id={`deleteNotes-${index}`}
                name={`deleteNotes-${index}`}
                className="position-absolute top-0 end-0 mt-2 me-2 p-9"
                style={{ cursor: "pointer" }}
              >
                <FontAwesomeIcon
                  id="deleteNotesIcon"
                  name="deleteNotesIcon"
                  icon={faXmarkCircle}
                  onClick={() => handleDelete(data.noteId)}
                  style={{ color: "#be3144" }}
                />
              </div>

              <div
                id={`commentNameHead-${index}`}
                name={`commentNameHead-${index}`}
                className={`${visitStyles.commentNameHead}`}
                style={{ paddingTop: "20px" }}
              >
                <span className={` send_details ${visitStyles.commentsName}`}>
                  {data?.note}
                </span>
                <Tooltip
                  placement="bottom"
                  title={data?.createdBy}
                  id="notesCreatedBy"
                  name="notesCreatedBy"
                >
                  <Popover
                    id={`notesCreatedByPopover-${index}`}
                    name={`notesCreatedByPopover-${index}`}
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
              <span
                className={visitStyles.commentsTime}
                id={`notesTime-${index}`}
                name={`notesTime-${index}`}
              >
                {data?.createdDate
                  ? formatDateTime({
                      date: data?.createdDate,
                      formatType: "datetime",
                    })
                  : "---"}
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
    patientIdDetailsData: state?.patientDetails.details?.patientIdResult,
  }),
  {
    isDeleteNotes: detailsActions.isDeleteNotes,
    isAddNotes: detailsActions.isAddNotes,
  }
);
export default enhancer(Notes);
