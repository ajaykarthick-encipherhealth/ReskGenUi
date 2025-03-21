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
import { formatDateTime, getResponePopup } from "../../../../../utils/reusable";
import { actions as detailsActions } from "../../../../../stores/patient/details";
import {
  getCommentList,
  getUserDetails,
} from "../../../../../stores/patient/details/network";
import CardSkeleton from "../../../../skeleton/card";

const Comments = ({
  setOpen,
  open,
  patientDetailsResult,
  isDeleteComments,
  isAddComments,
  commentListLoader,
}) => {
  const [inputValue, setInputValue] = useState({
    patientId: "",
    comments: "",
  });
  const [commentList, setCommentList] = useState([]);
  const [filterDataLoading, setFilterDataLoading] = useState(true);
  const [commentsTrigger, setCommentsTrigger] = useState(false);
  const [validated, setValidated] = useState(false);
  const [localPatientId, setLocalPatientId] = useState("");
  const [userDetails, setUserDetails] = useState("");

  const getCommentsList = async () => {
    const yearData = patientDetailsResult?.data?.response;
    const response = await getCommentList(
      patientDetailsResult?.data?.response?.patientId,
      yearData
    );
    setCommentList(response?.response);
    setFilterDataLoading(false);
  };

  const handleSubmitCommnets = async (event) => {
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

    if (form.checkValidity() === true) {
      setCommentsTrigger(true);

      var dataFormatSuggested = {
        patientId: patientDetailsResult?.data?.response?.patientId,
        userComment: inputValue.comments,
        processedYear: patientDetailsResult?.data?.response?.processedYear,
        dateOfService: patientDetailsResult?.data?.response?.dateOfService,
      };

      try {
        const response = await isAddComments(dataFormatSuggested);
        getResponePopup(response);
        setInputValue({ ...inputValue, comments: "" });
        getCommentsList();
      } catch (error) {
        getResponePopup(error?.response);
      } finally {
        setCommentsTrigger(false);
      }
    }

    setValidated(true);
  };

  const handleEnterText = async (event) => {
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
      var dataFormatSuggested = {
        patientId: patientDetailsResult?.data?.response?.patientId,
        userComment: inputValue.comments,
        processedYear: patientDetailsResult?.data?.response?.processedYear,
        dateOfService: patientDetailsResult?.data?.response?.dateOfService,
      };
      try {
        const response = await isAddComments(dataFormatSuggested);
        getResponePopup(response);
        setInputValue({ ...inputValue, comments: "" });
        getCommentsList();
      } catch (error) {
        getResponePopup(error?.response);
      }
    }
  };

  const handleDelete = async (commentId) => {
    const payload = {
      patientId: patientDetailsResult?.data?.response?.patientId,
      commentId: commentId,
      processedYear: patientDetailsResult?.data?.response?.processedYear,
      dateOfService: patientDetailsResult?.data?.response?.dateOfService,
    };

    try {
      const response = await isDeleteComments(payload);
      getResponePopup(response);
      getCommentsList();
    } catch (error) {
      getResponePopup(error.response);
      console.error(error);
    }
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

    getCommentsList();
  }, []);

  return (
    <Offcanvas
      id="gridSystemModal-comments"
      name="gridSystemModal-comments"
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
        id="gridSystemModal-comments-header"
        name="gridSystemModal-comments-header"
      >
        <h5 className="modal-title" id="#gridSystemModal">
          Comments
        </h5>
        <button
          id="gridSystemModal-comments-close"
          name="gridSystemModal-comments-close"
          type="button"
          className="btn-close"
          onClick={() => setOpen(false)}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div
        className="offcanvas-body"
        id="gridSystemModal-comments-body"
        name="gridSystemModal-comments-body"
      >
        <div
          className="container-fluid"
          id="gridSystemModal-comments-container"
        >
          <Form
            id="gridSystemModal-comments-form"
            name="gridSystemModal-comments-form"
            noValidate
            validated={validated}
            onSubmit={handleSubmitCommnets}
          >
            <div
              className="row"
              id="gridSystemModal-comments-row"
              name="gridSystemModal-comments-row"
            >
              <div
                className="col-xl-12"
                id="gridSystemModal-comments-col"
                name="gridSystemModal-comments-col"
              >
                <textarea
                  className={visitStyles.commentsFormControl}
                  rows="5"
                  required
                  id="add-comments"
                  name="comments"
                  placeholder="Add Comments"
                  value={inputValue.comments}
                  onChange={handleChange}
                  onKeyPress={handleEnterText}
                  type="submit"
                ></textarea>
                <Button
                  id="gridSystemModal-comments-button"
                  name="gridSystemModal-comments-button"
                  type="submit"
                  disabled={commentsTrigger}
                  className={visitStyles.commentSendIcon}
                >
                  {SVGICON.sentMessageIcon}
                </Button>
              </div>
            </div>
          </Form>

          {commentListLoader ? (
            <CardSkeleton count={5} />
          ) : (
            commentList?.map((data, index) => (
              <div
                id={`gridSystemModal-comments-card-${index}`}
                name={`gridSystemModal-comments-card-${index}`}
                className={` ${visitStyles.comments_card} position-relative`}
                key={index}
              >
                <div
                  id={`gridSystemModal-comments-delete-${index}`}
                  name={`gridSystemModal-comments-delete-${index}`}
                  className="position-absolute top-0 end-0 mt-2 me-2 p-9"
                  style={{ cursor: "pointer" }}
                >
                  <FontAwesomeIcon
                    icon={faXmarkCircle}
                    onClick={() => handleDelete(data.commentId)}
                    style={{ color: "#be3144" }}
                  />
                </div>

                <div
                  id={`gridSystemModal-comments-name-${index}`}
                  name={`gridSystemModal-comments-name-${index}`}
                  className={`${visitStyles.commentNameHead}`}
                  style={{ paddingTop: "20px" }}
                >
                  <span
                    id={`gridSystemModal-userComment-name-${index}`}
                    name={`gridSystemModal-userComment-name-${index}`}
                    className={`send_details ${visitStyles.commentsName}`}
                  >
                    {data.userComment}
                  </span>
                  <Tooltip
                    id={`gridSystemModal-userComment-tooltip-${index}`}
                    name={`gridSystemModal-userComment-tooltip-${index}`}
                    placement="bottom"
                    title={data.commentCreatedBy}
                  >
                    <Popover
                      id={`gridSystemModal-userComment-popover-${index}`}
                      name={`gridSystemModal-userComment-popover-${index}`}
                      placement="bottom"
                      content={userDetails}
                      onOpenChange={() =>
                        renderUserDetails(data.commentCreatedBy)
                      }
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
                  {data.createdDate
                    ? formatDateTime({
                        date: data.createdDate,
                        formatType: "datetime",
                      })
                    : "---"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </Offcanvas>
  );
};

const enhancer = connect(
  (state) => ({
    patientDetailsResult: state?.patientDetails?.details?.patientResult,
    commentListLoader: state?.patientDetails?.details?.CommentListLoader,
  }),
  {
    isDeleteComments: detailsActions.isDeleteComments,
    isAddComments: detailsActions.isAddComments,
  }
);
export default enhancer(Comments);
