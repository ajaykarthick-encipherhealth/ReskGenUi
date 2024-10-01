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
  faTrash,
  faXmark,
  faFlag,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { SVGICON } from "../../../../../jsx/constant/theme";
import { connect } from "react-redux";
import Select from "react-select";
import { actions as detailsActions } from "../../../../../stores/patient/details";
import { getStorage } from "../../../../../utils/storages";
import { DeleteOutlined } from "@ant-design/icons";
import { faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
import { deleteflag } from "../../../../../stores/patient/details/network";
import SvgFlag from "../svg/svg";
import { getResponePopup } from "../../../../../utils/reusable";

const Flag = ({
  setOpen,
  open,
  patientDetailsResult,
  getFlagsData,
  getFlagDetailsData,
  flagsDetailsResult,
  isdeleteFlag,
}) => {
  const [inputValue, setInputValue] = useState({
    flagId: "",
    comments: "",
  });
  const [flagResultList, setFlagResultList] = useState([]);
  const [filterDataLoading, setFilterDataLoading] = useState(true);
  const [commentsTrigger, setCommentsTrigger] = useState(false);
  const [validated, setValidated] = useState(false);
  const [localPatientId, setLocalPatientId] = useState("");
  const [userDetails, setUserDetails] = useState("");

  const flagPostList = getFlagsData?.response?.map((item) => ({
    value: item?.id,
    label: (
      <>
        {item?.flagName ? item?.flagName.replaceAll("_", " ") : ""}
        <SvgFlag fillColor={item?.flagColour} />
      </>
    ),
    name: item?.flagName,
  }));

  const handleDelete = async () => {
    const payload = {
      flagId: flagsDetailsResult?.response[0]?.patientFlagDTO?.flagId || "",
      patientId: patientDetailsResult?.data?.response?.patientId,
      comment: flagsDetailsResult?.response[0]?.patientFlagDTO?.comment,
      processedYear: patientDetailsResult?.data?.response?.processedYear,
      dateOfService: patientDetailsResult?.data?.response?.dateOfService,
    };
    try {
      const response = await isdeleteFlag(payload);
      getResponePopup(response);
      getFlagDetailsData(
        patientDetailsResult?.data?.response?.patientId,
        patientDetailsResult?.data?.response?.processedYear,
        patientDetailsResult?.data?.response?.dateOfService
      );
    } catch (error) {
      getResponePopup(error?.response);
      console.error(error);
    }
  };

  const handleSubmitFlag = async (event) => {
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
    if (form.checkValidity() === true) {
      setCommentsTrigger(true);
      const orgId = getStorage("orgId");
      var dataFormatSuggested = {
        patientId: patientDetailsResult?.data?.response?.patientId,
        comment: inputValue.comments.trim(),
        processedYear: patientDetailsResult?.data?.response?.processedYear,
        dateOfService: patientDetailsResult?.data?.response?.dateOfService,
        flagId: inputValue.flagId,
      };
      try {
        const response = await axios.post(
          ENDPOINTS.apiEndoint + `dbservice/flagdetails`,
          dataFormatSuggested
        );
        getResponePopup(response);
        getFlagDetailsData(
          patientDetailsResult?.data?.response?.patientId,
          patientDetailsResult?.data?.response?.processedYear,
          patientDetailsResult?.data?.response?.dateOfService
        );

        setInputValue({
          flagId: "",
          comments: "",
        });
        setCommentsTrigger(false);
        setIsModalComments(false);
      } catch (error) {
        getResponePopup(error.response);
        setCommentsTrigger(false);
      }
    }
    setValidated(true);
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputValue((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangeFlag = (selectedOption) => {
    setInputValue((prevState) => ({
      ...prevState,
      flagId: selectedOption.value,
      flag: selectedOption.label,
    }));
  };

  useEffect(() => {
    const patientId = getStorage("patientId");
    setLocalPatientId(patientId);
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
          Flag The File
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
        <div className="border rounded p-2 py-3 mb-3">
          <Form noValidate validated={validated} onSubmit={handleSubmitFlag}>
            <div className="row">
              <div className="col-xl-12 mb-3">
                <Select
                  options={flagPostList}
                  className="customize-react-select"
                  isSearchable={false}
                  id="flag"
                  name="flag"
                  value={
                    flagPostList.find(
                      (option) => option.value === inputValue.flagId
                    ) || null
                  } 
                  onChange={handleChangeFlag}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xl-12">
                <textarea
                  style={{ cursor: "default !important" }}
                  className={visitStyles.commentsFormControl}
                  rows="5"
                  required
                  id="comments"
                  name="comments"
                  value={inputValue.comments}
                  placeholder="Add Comments"
                  onChange={handleChange}
                  // onKeyPress={handleEnterTextNotes}
                  // type="submit"
                ></textarea>
              </div>
            </div>
            <div className="row">
              <div className="d-flex justify-content-center">
                <Button
                  type="submit"
                  disabled={commentsTrigger}
                  // className={visitStyles.commentSendIcon}
                >
                  Save
                </Button>{" "}
              </div>
            </div>
          </Form>
        </div>{" "}
        <div>
          {flagsDetailsResult?.response?.map((data, index) => (
            <div
              className={`${visitStyles.comments_card} position-relative`}
              key={index}
            >
              <div
                className="position-absolute top-0 end-0 mt-2 me-2"
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
                <span className={visitStyles.commentsName}>
                  {data?.flagDetails?.flagName && (
                    <>
                      {data?.flagDetails?.flagName
                        ? data?.flagDetails?.flagName.replaceAll("_", " ")
                        : ""}
                      <SvgFlag fillColor={data?.flagDetails?.flagColour} />
                    </>
                  )}
                </span>
                <div>
                  <Tooltip
                    placement="bottom"
                    title={data?.patientFlagDTO?.createdBy}
                  >
                    <Popover
                      placement="bottom"
                      content={userDetails}
                      onOpenChange={() =>
                        renderUserDetails(data?.patientFlagDTO?.createdBy)
                      }
                    >
                      <Avatar className={visitStyles.timeLineUsername}>
                        {splitUserName(data?.patientFlagDTO?.createdBy)}
                      </Avatar>
                    </Popover>
                  </Tooltip>
                </div>
              </div>
              <span className={visitStyles.commentsDesc}>
                {data?.patientFlagDTO?.comment}
              </span>
              <span className={visitStyles.commentsTime}>
                {moment(data?.patientFlagDTO?.createdDate).format(
                  "MM-DD-YYYY hh:mm:A"
                )}
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
    getFlagsData: state?.reviewer?.workQueue?.flags?.data,
    flagsDetailsResult: state?.patientDetails.details?.flagsDetailsResult.data,
  }),
  {
    getFlagDetailsData: detailsActions.getFlagDetailsAction,
    isdeleteFlag: detailsActions.isDeleteFlag,
  }
);
export default enhancer(Flag);
