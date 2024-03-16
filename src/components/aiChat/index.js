import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import { getChatReply } from "../../store/actions/DashboardActions";
import { renderUserPrfoile } from "../headerFilters/functions";
import styles from "./styles.module.css";
import { IMAGES } from "../../jsx/constant/theme";

const AICHAT = ({ openMsg, offMsg }) => {
  const dispatch = useDispatch();
  const msgReply = useSelector((state) => state.auth.chatReply);
  const currentUserInfo = useSelector((state) => state.auth.userInfo);
  const [activeChat, setActiveChat] = useState(false);
  const [inputValue, setInputValue] = useState({
    question: "",
  });
  let messagesEndRef = useRef(null);

  const handleChange = async (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setInputValue({ ...inputValue, [key]: value });
  };

  const handleNewUserMessage = () => {
    dispatch(getChatReply(inputValue.question));
    inputValue.question = "";
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
    inputValue.question = "";
  }, [msgReply?.data?.length]);

  return (
    <>
      <button
        className={styles.clickBtn}
        onClick={() => setActiveChat(activeChat ? false : true)}
      >
        {activeChat ? (
          <Image src={IMAGES.aiCloseChat} />
        ) : (
          <Image src={IMAGES.aiChatIcon} />
        )}
      </button>
      {activeChat && (
        <>
          <div className={styles.main}>
            <div
              className={`card chatbox chat dlab-chat-history-box chat-history-card ${
                openMsg ? "" : "d-none"
              } ${styles.chatContainer}`}
            >
              <div
                className={`card-header chat-list-header text-center ${styles.chatTitleCard}`}
              >
                <div className={styles.chatMainHead}>
                  <div className={styles.chatHead}>
                    <Image src={IMAGES.loginPageLogo3} />
                    <h4 className={styles.chatTitle}>Chat with CogentAI</h4>
                  </div>
                </div>
              </div>
              <div
                ref={messagesEndRef}
                className={`card-body msg_card_body ${
                  openMsg ? "ps ps--active-y" : ""
                } ${styles.detailsContainer}`}
                id="chat-scroll"
              >
                <div className="d-flex justify-content-start mb-4">
                  <div className="img_cont_msg">
                    <Image src={IMAGES.loginPageLogo3} />
                  </div>
                  <div className="msg_cotainer">
                    Welcome to CogentAI!
                    {/* <span className="msg_time">8:40 AM, Today</span> */}
                  </div>
                </div>
                {msgReply?.data?.map((data) => (
                  <>
                    <div name="test1" className="element">
                      <div className="d-flex justify-content-end mb-4">
                        <div className="msg_cotainer_send">
                          {data.question}
                          {/* <span className="msg_time_send">8:55 AM, Today</span> */}
                        </div>
                        <div className="img_cont_msg">
                          {renderUserPrfoile(
                            currentUserInfo?.data?.response?.firstName,
                            currentUserInfo?.data?.response?.lastName,
                            currentUserInfo?.data?.response?.profileImageUrl,
                            "header"
                          )}
                        </div>
                      </div>
                      <div className="d-flex justify-content-start mb-4">
                        <div className="img_cont_msg">
                          <Image src={IMAGES.loginPageLogo3} />
                        </div>
                        <div className="msg_cotainer">
                          {data.details}
                          {/* <span className="msg_time">8:40 AM, Today</span> */}
                        </div>
                        {/* <div ref={messagesEndRef} /> */}
                      </div>
                    </div>
                    <div ref={messagesEndRef} />
                  </>
                ))}
              </div>
              <div className="card-footer type_msg">
                <div className="input-group">
                  <textarea
                    className={`form-control ${styles.textareaContainer}`}
                    placeholder="Type your message..."
                    onChange={handleChange}
                    id="question"
                    name="question"
                    value={inputValue.question}
                  ></textarea>
                  <div className="input-group-append">
                    <button
                      onClick={() => handleNewUserMessage()}
                      type="button"
                      className="btn btn-primary"
                    >
                      <FontAwesomeIcon
                        icon={faLocationArrow}
                        style={{
                          color: "#fff",
                        }}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AICHAT;
