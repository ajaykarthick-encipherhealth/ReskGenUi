import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Form from "react-bootstrap/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import styles from "./styles.module.css";
import { IMAGES } from "../../jsx/constant/theme";
import { faComments, faCopy } from "@fortawesome/free-regular-svg-icons"; // Import the desired icon
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons"; // Import the close icon if needed
import chatAssistant from "../../images/chat/chatAssistant.svg";
import { handleCopyToClipboard } from "../commonFunctions";
import { actions as allActions } from "../../stores/chatService";
import { connect } from "react-redux";
const AICHAT = ({ openMsg, getChatReply }) => {
  const [activeChat, setActiveChat] = useState(false);
  const [inputValue, setInputValue] = useState({
    question: "",
  });
  const [validated, setValidated] = useState(false);
  const [startChart, setStartChat] = useState(false);
  let messagesEndRef = useRef(null);
  const [chatResponse, setChatResponse] = useState([]);

  const handleChange = (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setInputValue({ question: value });
  };

  const handleNewUserMessage = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === true) {
      const res = await getChatReply(inputValue?.question);
      if (res.status === "SUCCESS") {
        setChatResponse((prev) => [
          ...prev,
          {
            question: inputValue.question,
            details: res?.response[0],
          },
        ]);
        setInputValue({ question: "" });
        setStartChat(true);
        setValidated(false);
      }
    } else {
      setValidated(true);
    }
  };
  return (
    <>
      <button
        className={styles.clickBtn}
        onClick={() => {
          setActiveChat(activeChat ? false : true);
          setStartChat(false);
        }}
      >
        {activeChat ? (
          <FontAwesomeIcon icon={faTimesCircle} color="white" />
        ) : (
          <FontAwesomeIcon icon={faComments} color="white" />
        )}
      </button>
      {activeChat && (
        <>
          <div className={`${styles.main}`}>
            <div
              className={`card chatbox chat dlab-chat-history-box chat-history-card ${
                openMsg ? "" : "d-none"
              } ${styles.chatContainer}`}
            >
              {startChart ? (
                <>
                  <div
                    className={`card-header chat-list-header text-center ${styles.chatTitleCard} rounded-0 m-2`}
                  >
                    <div className="text-white">Hello user</div>
                    <div className={`${styles.chatHead} mt-4`}>
                      <Image
                        src={IMAGES.loginPageLogo3}
                        width={50}
                        height={50}
                      />
                      <h4 className={`${styles.chatTitle} text-white`}>
                        Chat with CogentAI
                      </h4>
                    </div>
                    <div
                      className={`d-flex justify-content-center align-items-center text-white ${styles.subText}`}
                    >
                      💬 How can I assist you today? Whether you have a question
                      or want to explore something new, I’m here to chat and
                      assist you in the best way possible.
                    </div>
                  </div>
                  <div
                    ref={messagesEndRef}
                    className={`card-body msg_card_body ${
                      openMsg ? "ps ps--active-y" : ""
                    } ${styles.detailsContainer}`}
                    id="chat-scroll"
                  >
                    <div className="d-flex justify-content-start mb-0">
                      {/* <div className="img_cont_msg">
                        <Image src={IMAGES.loginPageLogo3} />
                      </div> */}
                      <div className="msg_cotainer">
                        Welcome to CogentAI!
                        {/* <span className="msg_time">8:40 AM, Today</span> */}
                      </div>
                    </div>
                    {chatResponse?.map((data) => (
                      <>
                        <div name="test1" className="element">
                          <div className="d-flex justify-content-end mb-1">
                            <div className="msg_cotainer_send">
                              {data?.question}
                            </div>
                          </div>
                          <div
                            className="d-flex justify-content-end align-items-end my-1 cursor-pointer mx-2"
                            onClick={() =>
                              handleCopyToClipboard({ text: data?.question })
                            }
                          >
                            <FontAwesomeIcon
                              icon={faCopy}
                              className={styles.copyIcon}
                            />
                          </div>
                          <div className="d-flex justify-content-start my-2">
                            <div className="msg_cotainer">{data?.details}</div>
                          </div>
                          <div
                            className="d-flex justify-content-start align-items-start my-1 mx-1 cursor-pointer"
                            onClick={() =>
                              handleCopyToClipboard({ text: data?.details })
                            }
                          >
                            <FontAwesomeIcon
                              icon={faCopy}
                              className={styles.copyIcon}
                            />
                          </div>
                        </div>
                        <div ref={messagesEndRef} />
                      </>
                    ))}
                  </div>
                  <div className="card-footer type_msg">
                    <Form
                      noValidate
                      validated={validated}
                      onSubmit={handleNewUserMessage}
                      autoComplete="off"
                    >
                      <div className="input-group">
                        <input
                          required
                          type="text"
                          className={`form-control ${styles.textareaContainer}`}
                          placeholder="Type your message..."
                          onChange={handleChange}
                          id="question"
                          name="question"
                          value={inputValue.question}
                        ></input>
                        <div className="input-group-append">
                          <button type="submit" className="btn btn-primary">
                            <FontAwesomeIcon
                              icon={faLocationArrow}
                              style={{
                                color: "#fff",
                              }}
                            />
                          </button>
                        </div>
                      </div>
                    </Form>
                  </div>
                </>
              ) : (
                <div
                  className="h-100 m-2"
                  style={{
                    backgroundColor: "#263E50",
                  }}
                >
                  <div style={{ height: "85%" }}>
                    <div className="d-flex justify-content-center align-items-center">
                      <Image
                        src={chatAssistant}
                        alt="no Img"
                        width={250}
                        height={250}
                        className="d-flex justify-content-center align-items-center"
                      />
                    </div>

                    <div className="d-flex justify-content-center align-items-center text-white font-weight-bold fs-3">
                      Welcome to CogentAI
                    </div>
                    <div className="d-flex justify-content-center align-items-center text-white fs-10 text-center my-2">
                      Your personal AI assistant, ready to help you anytime.
                    </div>
                  </div>
                  <div className="d-flex justify-content-center alignItems-end">
                    <button
                      className={`${styles.btnStyle} rounded-2 px-4 py-2`}
                      style={{ height: "15%" }}
                      onClick={() => setStartChat(true)}
                    >
                      Get Started
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};
const connector = connect(
  (state) => ({
    msgReply: state.chartService?.chatReply,
  }),
  {
    getChatReply: allActions.getChatReply,
  }
);

export default connector(AICHAT);
