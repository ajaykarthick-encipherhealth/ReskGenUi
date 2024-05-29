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
import Select from "react-select";


const Flag = ({ setOpen, open, patientDetailsResult,getFlagsData }) => {
  const [inputValue, setInputValue] = useState({
    patientId: "",
    comments: "",
  });
  const [flagResultList, setFlagResultList] = useState([]);
  const [filterDataLoading, setFilterDataLoading] = useState(true);
  const [commentsTrigger, setCommentsTrigger] = useState(false);
  const [validated, setValidated] = useState(false);
  const [localPatientId, setLocalPatientId] = useState("");

  const flagPostList = getFlagsData?.response?.map((item) => ({
    value: item?.id,
    label: (
      <>
        {item?.flagName ? item?.flagName.replaceAll("_", " ") : ""}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="23"
          height="23"
          viewBox="0 0 800 800"
          fill={item?.flagColour}
        >
          <path
            d="M223 100V102H225H696.392L573.304 298.94L572.642 300L573.304 301.06L696.392 498H225H223V500V748H152V52H223V100Z"
            stroke="#000"
            stroke-width="10"
          />
        </svg>
      </>
    ),
    name: item?.flagName,
  }));

  const getFlagList = async () => {
    const response = await axios.get(
      ENDPOINTS.apiEndoint +
        `dbservice/flagdetails/get?patientId=${patientDetailsResult?.data?.response?.patientId}&processedYear=${patientDetailsResult?.data?.response?.processedYear}`
    );
    setFlagResultList(response.data.response);
    setFilterDataLoading(false);
  };

  const handleSubmitFlag = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === true) {
      setCommentsTrigger(true);
      const orgId = localStorage.getItem("orgId");
      var dataFormatSuggested = {
        "flagId":"dc44fa22-c406-489e-a1a9-f529c4a82579",
        "patientId":"V2-TEST-023",
        "processedYear":2023,
        "comment":"Test Comment"
      };
      try {
        const response = await axios.post(
            ENDPOINTS.apiEndoint + `dbservice/flagdetails`,
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
            getFlagList();
            setCommentsTrigger(false);
            setIsModalComments(false);
          } else {
          }
      } catch (error) {
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

  const handleChange = async (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setInputValue({ ...inputValue, [key]: value });
  };

  const handleChangeFlag = async (e) => {
    setInputValue({
      ...inputValue,
      ["flagId"]: e.value,
      ["flag"]: e.name,
      flagId: e.value,
    });
  };

  useEffect(() => {
    const patientId = localStorage.getItem("patientId");
    setLocalPatientId(patientId);
    getFlagList();
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
        <div className="container-fluid">
          <Form noValidate validated={validated} onSubmit={handleSubmitFlag}>
            <div className="row">
              <div className="col-xl-12 mb-3">
                <Select
                  options={flagPostList}
                  className="custom-react-select"
                  isSearchable={false}
                  id="flag"
                  name="flag"
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
                  placeholder="Add Comments"
                  onChange={handleChange}
                  // onKeyPress={handleEnterTextNotes}
                  // type="submit"
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

          {flagResultList.map((data, index) => (
            <div className={visitStyles.comments_card} key={index}>
              <div className={`${visitStyles.commentNameHead}`}>
                <span className={visitStyles.commentsName}>
                  {data?.flagDetails?.flagName && (
                    <>
                      {data?.flagDetails?.flagName
                        ? data?.flagDetails?.flagName.replaceAll("_", " ")
                        : ""}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="23"
                        height="23"
                        viewBox="0 0 800 800"
                        fill={data?.flagDetails?.flagColour}
                      >
                        <path
                          d="M223 100V102H225H696.392L573.304 298.94L572.642 300L573.304 301.06L696.392 498H225H223V500V748H152V52H223V100Z"
                          stroke="#000"
                          stroke-width="10"
                        />
                      </svg>
                    </>
                  )}
                </span>
                <Tooltip placement="bottom" title={data.commentCreatedBy}>
                  <Popover
                    placement="bottom"
                    content={userDetails}
                    onOpenChange={() =>
                      renderUserDetails(data.commentCreatedBy)
                    }
                  >
                    <Avatar className={visitStyles.timeLineUsername}>
                      {splitUserName(data?.commentCreatedBy)}
                    </Avatar>
                  </Popover>
                </Tooltip>
              </div>
              <span className={visitStyles.commentsDesc}>{data.comments}</span>
              <span className={visitStyles.commentsTime}>
                {moment(data.commentCreatedAt).format("MM-DD-YYYY hh:mm:A")}
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
  getFlagsData: state?.reviewer?.workQueue?.flags?.data,

}));
export default enhancer(Flag);
