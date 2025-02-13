import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Form from "react-bootstrap/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import { faComments, faCopy } from "@fortawesome/free-regular-svg-icons";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import styles from "./styles.module.css";
import { handleCopyToClipboard } from "../commonFunctions";
import { actions as allActions } from "../../stores/chatService";
import { connect } from "react-redux";
import chatAssistant from "../../images/chat/chatAssistant.svg";
import { Skeleton } from "antd";
import { getLogo } from "../../pages/twofactorauthentication/reusableFun";

const AICHAT = ({ openMsg, getChatReply }) => {
  const [activeChat, setActiveChat] = useState(false);
  const [inputValue, setInputValue] = useState({ question: "" });
  const [validated, setValidated] = useState(false);
  const [startChat, setStartChat] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chatResponse, setChatResponse] = useState([]);
  const messagesEndRef = useRef(null);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatResponse]);

  const handleChange = (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setInputValue({ question: value });
  };

  const handleNewUserMessage = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === true) {
     setValidated(false);
     const userMessage = {
       question: inputValue.question,
       details: (
           <Skeleton.Input style={{ width: 10 }} active />
       ),
       loading: true,
     };
      setChatResponse((prev) => [...prev, userMessage]);
      setInputValue({ question: "" });
      getChatReply(inputValue?.question).then((res) => {
        if (res?.status === "SUCCESS") {
          setChatResponse((prev) => {
            const updatedChat = [...prev];
            const lastMessageIndex = updatedChat.length - 1;
            if (
              updatedChat[lastMessageIndex]?.question === inputValue.question
            ) {
              updatedChat[lastMessageIndex].details = res?.response[0];
            }
            return updatedChat;
          });
        }
      });
    } else {
      setValidated(true);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleNewUserMessage(event);
    }
  };
  const handleChat = () => {
    setActiveChat(!activeChat);
    if (activeChat) {
      setChatResponse([]);
    }
    setStartChat(false);
  };
  return (
    <>
      <button
        className={styles.clickBtn}
        onClick={handleChat}
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
              {startChat ? (
                <>
                  <div
                    className={`card-header chat-list-header text-center ${styles.chatTitleCard} rounded-0 m-2`}
                  >
                    <div className="text-white">Hello user</div>
                    <div className={`${styles.chatHead} align-items-center`}>
                     
                      {getLogo()}
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
                    className={`card-body msg_card_body ${
                      openMsg ? "ps ps--active-y" : ""
                    } ${styles.detailsContainer}`}
                    id="chat-scroll"
                  >
                    <div className="d-flex justify-content-start mb-0">
                      <div className="msg_cotainer">Welcome to CogentAI!</div>
                    </div>
                    {chatResponse?.map((data, index) => (
                      <div key={index}>
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
                    ))}
                    {loading && (
                      <div className="d-flex justify-content-start my-2">
                        <div className="msg_cotainer">
                          <i>Loading...</i>
                        </div>
                      </div>
                    )}
                    {/* Scroll Target */}
                    <div ref={messagesEndRef} />
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
                          onKeyDown={handleKeyDown}
                          id="question"
                          name="question"
                          value={inputValue.question}
                        />
                        <div className="input-group-append">
                          <button type="submit" className="btn btn-primary">
                            <FontAwesomeIcon
                              icon={faLocationArrow}
                              style={{ color: "#fff" }}
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
