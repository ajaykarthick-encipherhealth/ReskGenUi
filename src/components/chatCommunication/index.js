import React, { useEffect, useState, useRef, useCallback } from "react";
import { over } from "stompjs";
import { v4 as uuidv4 } from "uuid";
import TimeAgo from "react-timeago";
import _ from "lodash";
import SockJS from "sockjs-client";
import { ToastContainer, toast } from "react-toastify";
import { Badge, Avatar } from "antd";
import styles from "./styles.module.css";
import { MDBIcon } from "mdbreact";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faPaperPlane,
  faLink,
  faCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { WechatOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Tab, Nav } from "react-bootstrap";
import {
  MDBTypography,
  MDBBadge,
  MDBInputGroup,
  MDBTooltip,
} from "mdb-react-ui-kit";
import moment from "moment";

let stompClient = null;
let pageSize = 10;

import {
  getChatHistory,
  getUsers,
  getHandleChatHistory,
  getHandleResetReadHistory,
  handleFilePost,
  addUser,
} from "../../services/ChatService";
import ENDPOINTS from "../../utility/enpoints";
import { number } from "prop-types";

const ChatCommunication = ({ openMsg, offMsg }) => {
  const messagesEndRef = useRef(null);
  const messagesTopRef = useRef(null);
  const messagesRef = useRef(null);
  const activeSecondaryUserRef = useRef(null);
  const searchedInMembersListRef = useRef(null);
  const [pageNo, setPageNo] = useState(0);
  const [chatAction, setChatAction] = useState("");
  const [message, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [messagedMembersList, setMessagedMembersList] = useState([]);
  const [searchedInMembersList, setSearchedInMembersList] = useState([]);
  const [currentChatMember, setCurrentChatMember] = useState(null);
  const [fileModal, setFileModal] = useState(false);

  const [userData, setUserData] = useState({
    username: "",
    receivername: "",
    connected: false,
    message: "",
    searchNewUserMessage: "",
  });
  const [loading, setLoading] = useState(false);
  const [isLastPage, setIsLastPage] = useState();
  const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.pdf|\.xls|\.xlsx)$/i;
  const imgExtensions = /(\.jpg|\.jpeg|\.png)$/i;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToTop = () => {
    messagesTopRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    var userName = localStorage.getItem("userId");
    handleUsername(userName);
    if (message && chatAction === "load") {
      scrollToBottom();
    } else if (message && chatAction === "add") {
      // scrollToTop();
    }
  }, [message, chatAction]);
  const fetchChatHistory = async (username) => {
    var result = await getChatHistory(username);
    setMessagedMembersList(result);
    setSearchedInMembersList(result);
    searchedInMembersListRef.current = result;
  };

  const fetchUsers = async () => {
    var data = await getUsers();
    const temp = [];
    data?.forEach((item) => {
      temp.push(item);
    });
    setUsers(temp);
    setSearchedUsers(temp);
  };
  const connect = () => {
    const token = localStorage.getItem("token");
    let Sock = new SockJS(
      `https://hcc.encipherhealth.com/chatservice/chatservice/ws?token=${token}`
    );
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    setUserData({ ...userData, connected: true });
    stompClient.subscribe(
      "/user/" + userData.username + "/private",
      onPrivateMessage
    );
    stompClient.subscribe(
      "/user/" + userData.username + "/topic",
      onUpdatedUsersHistory
    );
  };

  const getCurrentTimestamp = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const formattedTime = `${day < 10 ? "0" : ""}${day}-${
      month < 10 ? "0" : ""
    }${month}-${year}, ${hours % 12 || 12}:${
      minutes < 10 ? "0" : ""
    }${minutes} ${hours >= 12 ? "pm" : "am"}`;

    return formattedTime;
  };

  const onPrivateMessage = (payload) => {
    let payloadData = JSON.parse(payload.body);
    let memberList = [...searchedInMembersListRef.current];
    let updatedChatCountIndex = null;
    const activeChat = activeSecondaryUserRef.current;
    let result = _.find(memberList, function (obj) {
      if (obj.secondaryUser === payloadData.senderName) {
        return true;
      }
    });
    if (result) {
      searchedInMembersListRef.current.map((member, index) => {
        if (
          payloadData.senderName === member.secondaryUser &&
          activeChat === member.secondaryUser
        ) {
          updatedChatCountIndex = index;
          memberList[index].unreadCount = 0;
          memberList[index].lastMessage = payloadData.message;
          memberList[index].lastUpdatedDate = payloadData.timeStamp;
        } else if (
          payloadData.senderName === member.secondaryUser &&
          activeChat !== member.secondaryUser
        ) {
          updatedChatCountIndex = index;
          memberList[index].unreadCount = memberList[index].unreadCount + 1;
          memberList[index].lastMessage = payloadData.message;
          memberList[index].lastUpdatedDate = payloadData.timeStamp;
        } else {
          memberList[index].unreadCount = memberList[index].unreadCount;
        }
      });
      const chat = memberList[updatedChatCountIndex];
      memberList.splice(updatedChatCountIndex, 1);
      memberList.unshift(chat);
    } else {
      const newUser = _.filter(users, (o) => {
        return o.userName === payloadData.senderName;
      });
      const newChat = {
        id: payloadData.id,
        lastMessage: payloadData.message,
        lastUpdatedDate: payloadData.timeStamp,
        primaryUser: payloadData.receiverName,
        secondaryUser: payloadData.senderName,
        secondaryUserFirstName: newUser.firstName,
        secondaryUserLastName: newUser.lastName,
        sentby: payloadData.senderName,
        unreadCount: 1,
      };
      memberList.unshift({ ...newChat });
    }

    setSearchedInMembersList(() => [...memberList]);
    searchedInMembersListRef.current = [...memberList];
    if (payloadData.senderName === activeChat) {
      handleResetReadHistory([payloadData], {
        primaryUser: userData.username,
        secondaryUser: activeChat,
      });
    }
    setMessages((temp) => [...temp, payloadData]);
    messagesRef.current = [...message, payloadData];
  };

  const onUpdatedUsersHistory = (payload) => {
    const payloadData = JSON.parse(payload.body);
    const updatedMessage = [...messagesRef.current];
    if (payloadData.topicName === "read-messages-status") {
      payloadData.readMessageIDs.map((id) => {
        messagesRef.current.map((msg, index) => {
          if (msg.id === id) {
            updatedMessage[index].messageStatus = "READ";
          }
        });
      });

      setMessages(() => updatedMessage);
    }
  };

  const onError = (err) => {
    console.log(err);
  };

  const handleMessage = (event) => {
    const { value } = event.target;
    setUserData({ ...userData, message: value });
  };

  const connectingFunction = async () => {
    const isUsernameExists = users.some(
      (user) => user.userName === userData.username
    );

    if (isUsernameExists) {
      try {
        // Connect to WebSocket after updating state
        connect();
      } catch (error) {
        console.error("Error connecting web socket", error);
      }
    } else {
      try {
        // If username doesn't exist, add user to the database
        await addUserToDatabase(userData.username);

        // After adding user to the database, connect to WebSocket
        connect();
      } catch (error) {
        console.error("Error adding user to the database:", error);
      }
    }
  };

  useEffect(() => {
    users.length > 0 &&
      userData.username &&
      stompClient === null &&
      connectingFunction();
  }, [users, userData]);
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (userData.message === "") {
      return;
    }
    if (stompClient) {
      let chatMessage = {};

      if (userData.fileUrl) {
        chatMessage = {
          senderName: currentChatMember.sender.primaryUser,
          receiverName: currentChatMember.sender.secondaryUser,
          message: userData.message,
          messageStatus: "DELIVERED",
          fileUrl: userData.fileUrl,
          fileName: userData.fileName,
          fileType: userData.fileType,
          date: getCurrentTimestamp(),
          status: "MESSAGE",
        };
      } else {
        chatMessage = {
          senderName: currentChatMember.sender.primaryUser,
          receiverName: currentChatMember.sender.secondaryUser,
          message: userData.message,
          messageStatus: "DELIVERED",
          id: uuidv4(),
          date: getCurrentTimestamp(),
          status: "MESSAGE",
        };
      }

      stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
      messagesRef.current = [...message, chatMessage];
      setMessages([...message, chatMessage]);
      setFileModal(false);

      if (!userData.receivername) {
        setUserData({
          ...userData,
          receivername: currentChatMember.sender?.secondaryUser,
          message: "",
          fileUrl: "",
          fileName: "",
          fileType: "",
        });
      } else {
        setUserData({
          ...userData,
          message: "",
          fileUrl: "",
          fileName: "",
          fileType: "",
        });
      }
      if (
        currentChatMember !== null &&
        searchedInMembersList.length > 0 &&
        searchedInMembersList[0].secondaryUser !==
          currentChatMember.sender?.secondaryUser
      ) {
        if (currentChatMember.isNewMember) {
          setSearchedInMembersList([
            currentChatMember.sender,
            ...searchedInMembersList,
          ]);
          searchedInMembersListRef.current = [
            currentChatMember.sender,
            ...searchedInMembersList,
          ];
        } else {
          const data = [...searchedInMembersList];
          data.splice(
            _.findIndex(searchedInMembersList, function (member) {
              return (
                member.secondaryUser == currentChatMember.sender?.secondaryUser
              );
            }),
            1
          );
          data.unshift(currentChatMember.sender);
          setSearchedInMembersList(data);
          searchedInMembersListRef.current = data;
        }
      } else if (searchedInMembersList.length === 0) {
        setSearchedInMembersList([currentChatMember.sender]);
        searchedInMembersListRef.current = [currentChatMember.sender];
      }
    } else {
      connect();
      // handleSendMessage();
      setFileModal(false);
    }
  };

  useEffect(() => {
    if (chatAction === "load") {
      scrollToBottom();
    } else if (chatAction === "add") {
      scrollToTop();
    }
  }, [chatAction, message]);

  const handleSearchUser = (e) => {
    setUserData({ ...userData, searchNewUserMessage: e.target.value });
    if (e.target.value.length > 0) {
      const regexp = new RegExp(e.target.value, "i");
      const filteredUsers = users
        .filter((user) => user.userName !== userData.username)
        .filter((user) => regexp.test(user));
      setSearchedUsers([...filteredUsers]);
    } else {
      setSearchedUsers(users);
    }
  };

  const handleUsername = (userName) => {
    setUserData({ ...userData, username: userName });
    fetchChatHistory(userName);
    registerUser(userName);
  };

  const registerUser = async (userName) => {
    if (!userName.trim()) {
      alert("Username should not be empty");
      return;
    }
    activeSecondaryUserRef.current = "";
    fetchUsers();
    // Check if the entered username exists in the messagedMembersList
  };
  const handleGetChatHistory = async (sender, status, pageNumber) => {
    const data = await getHandleChatHistory(
      sender?.secondaryUser,
      userData.username,
      pageNumber,
      pageSize
    );
    const privateMessages = data?.content?.reverse();
    setIsLastPage(data?.last);
    setChatAction(status);
    if (status === "load") {
      messagesRef.current = privateMessages;
      setMessages(privateMessages);
    } else {
      messagesRef.current = [...privateMessages, ...message];
      setMessages([...privateMessages, ...message]);
    }
    handleResetReadHistory(privateMessages, sender);
    setLoading(false);
  };
  const handleResetReadHistory = async (privateMessages, sender) => {
    const messageIds = [];
    privateMessages.map((msg) => {
      if (msg.messageStatus === "UNREAD") {
        messageIds.push(msg.id);
      }
    });
    if (messageIds.length > 0) {
      var dataBody = {
        messageIds: messageIds,
        messageStatus: "READ",
        primaryUser: sender.primaryUser,
        secondaryUser: sender.secondaryUser,
      };
      const result = await getHandleResetReadHistory(dataBody);
    }
  };
  const handleUpdateUrl = (activeMember) => {
    activeSecondaryUserRef.current = activeMember;
  };
  const onTabChange = (name, index, sender) => {
    setPageNo(0);
    setCurrentChatMember({ sender, isNewMember: false });
    handleUpdateUrl(sender?.secondaryUser);
    const data = [...searchedInMembersList];
    data[index].unreadCount = 0;
    setSearchedInMembersList((temp) => [...data]);
    searchedInMembersListRef.current = [...data];
    handleGetChatHistory(sender, "load", 0);
  };
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!allowedExtensions.exec(file.name)) {
      toast.error("File type not allowed", {
        position: "bottom-right",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      // fileInput.value = '';
      return false;
    } else {
      let formData = new FormData();
      formData.append("file", file);
      var result = await handleFilePost(formData);
      setUserData({
        ...userData,
        fileUrl: result?.response?.fileUploadedUrl,
        fileName: file?.name,
        fileType: file?.type,
        message: userData?.message,
      });
      setFileModal(true);
    }
  };
  const addUserToDatabase = async (username) => {
    var dataBoday = {
      name: username,
    };
    var result = await addUser(dataBoday);
  };

  const handleSearchMembers = (e) => {
    if (e.target.value.length > 0) {
      const regexp = new RegExp(e.target.value, "i");
      const filteredMember = messagedMembersList.filter((member) =>
        regexp.test(member.secondaryUser)
      );
      setSearchedInMembersList(filteredMember);
      searchedInMembersListRef.current = filteredMember;
    } else {
      setSearchedInMembersList(messagedMembersList);
      searchedInMembersListRef.current = messagedMembersList;
    }
  };

  const handleCreateNewChat = (newUser) => {
    const isAlreadyMember = searchedInMembersList
      ? searchedInMembersList.filter(
          (member) => member.secondaryUser === newUser.userName
        )
      : [];
    if (isAlreadyMember.length === 0) {
      handleGetChatHistory({ senderName: newUser.userName }, "load", 0);
      setCurrentChatMember({
        index: null,
        isNewMember: true,
        sender: {
          secondaryUserFirstName: newUser.firstName,
          secondaryUserLastName: newUser.lastName,
          sentby: newUser.userName,
          secondaryUser: newUser.userName,
          primaryUser: userData.username,
          unreadCount: 0,
          lastMessageTimeStamp: "",
          lastMessage: "",
          secondaryUserImageUrl: newUser.profileImageUrl,
        },
      });
    } else {
      const index = messagedMembersList.findIndex(
        (member) => member.secondaryUser === newUser.userName
      );
      onTabChange(newUser.userName, index, isAlreadyMember[0]);
    }
    setPageNo(0);
    messagesRef.current = [];
    setMessages([]);
    setUserData({
      ...userData,
      searchNewUserMessage: "",
    });
    setSearchedUsers(users);
  };
  const handleChatScroll = (e) => {
    if (e.target.scrollTop === 0 && !isLastPage) {
      setLoading(true);
      setPageNo(pageNo + 1);
      handleGetChatHistory(currentChatMember.sender, "add", pageNo + 1);
    }
  };

  const handleFileModalClose = () => {
    setFileModal(false);
    setUserData({ ...userData, message: "", fileUrl: "", fileName: "" });
  };

  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.keyCode === 13) {
      handleSendMessage();
    }
  };

  const renderUserPrfoile = (
    firstName,
    lastName,
    imageUrl,
    currentChatMember
  ) => {
    const firstNameInitial = firstName?.charAt(0) || "";
    const secondNameInitial = lastName?.charAt(0) || "";
    if (!imageUrl) {
      var profileAvatar = (
        <Avatar
          style={{
            backgroundColor: "#F3C217 ",
            color: "white",
            cursor: "pointer",
            width: "50px",
            height: "50px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "bold",
            borderRadius: "35%",
          }}
        >
          {firstNameInitial?.toUpperCase() + secondNameInitial?.toUpperCase()}
        </Avatar>
      );
      return profileAvatar;
    } else {
      var profileAvatar = (
        <img
          src={imageUrl}
          alt="avatar"
          className="rounded-4 shadow-4"
          style={{
            width: "50px",
            height: "50px",
          }}
        />
      );
      return profileAvatar;
    }
  };

  const tabOnClick =(number)=>{
   if(number == 1){
    fetchChatHistory(userData?.username);
   }
  }

  return (
    <>
      <ToastContainer />
      <div className={styles.chatContainer}>
        <div className={`chat-tab`}>
          <div className="custom-tab-1 ">
            <Tab.Container defaultActiveKey="1">
              <div className={`tabContainer ${styles.tabContainer} `}>
                <div className={styles.firstdCard}>
                  <Nav as="ul" className="nav nav-tabs">
                    <Nav.Item as="li" className="nav-item"   onClick={() => {
                      tabOnClick(1);
                    }}>
                      <Nav.Link to="#my-posts" eventKey="1">
                        Recent
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li" className="nav-item"  onClick={() => {
                      tabOnClick(1);
                    }}>
                      <Nav.Link to="#my-posts" eventKey="2">
                        Team Members
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </div>
                <div className={styles.secondCard}>
                  <span
                    onClick={() => {
                      offMsg(false);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faTimesCircle}
                      style={{
                        color: "red",
                        marginRight: "20px",
                        fontSize: 20,
                        marginTop: "10px",
                        cursor: "pointer",
                      }}
                    />
                  </span>
                </div>
              </div>
              <Tab.Content>
                <Tab.Pane id="my-posts" eventKey="1">
                  {!currentChatMember ? (
                    <div className="mb-4 mb-md-0 p-0"
                    >
                      <div className="card"
                        style={{
                          minHeight: "70vh",
                          borderRadius: "0 0 6px 6px",
                        }}
                      >
                        {messagedMembersList && (
                          <div className="p-2">
                            <MDBInputGroup className="rounded p-0">
                              <input
                                className={`form-control ${styles.searchInput}`}
                                placeholder="Search members"
                                type="search"
                                onChange={handleSearchMembers}
                              />
                            </MDBInputGroup>
                          </div>
                        )}
                        <div className="card-body m-0 p-1 customScroll">
                          {messagedMembersList ? (
                            <MDBTypography listUnStyled className="mb-0">
                              {searchedInMembersList &&
                                searchedInMembersList.length > 0 && (
                                  <ul className="chat-persons">
                                    {searchedInMembersList?.map(
                                      (
                                        {
                                          secondaryUserImageUrl,
                                          secondaryUser,
                                          secondaryUserFirstName,
                                          secondaryUserLastName,
                                          unreadCount,
                                          lastMessage,
                                          lastMessageTimeStamp,
                                          lastUpdatedDate,
                                        },
                                        index
                                      ) => (
                                        <li
                                          key={index}
                                          className="p-2"
                                          style={{
                                            backgroundColor:
                                              currentChatMember?.sender
                                                ?.secondaryUser ===
                                                secondaryUser &&
                                              "rgb(220 226 236)",
                                            color:
                                              currentChatMember?.sender
                                                ?.secondaryUser ===
                                                secondaryUser && "#000",
                                            borderRadius:
                                              currentChatMember?.sender
                                                ?.secondaryUser ===
                                                secondaryUser && "0.5rem",
                                          }}
                                          onClick={() => {
                                            onTabChange(
                                              secondaryUser,
                                              index,
                                              searchedInMembersList[index]
                                            );
                                          }}
                                        >
                                          <div className="d-flex justify-content-between">
                                            <div className="d-flex flex-row">
                                              <div className="d-inline-flex position-relative">
                                                <MDBBadge className="position-absolute top-0 start-100 translate-middle p-1 bg-success-chat border border-light rounded-circle">
                                                  <span className="visually-hidden">
                                                    New alerts
                                                  </span>
                                                </MDBBadge>
                                                {renderUserPrfoile(
                                                  secondaryUserFirstName,
                                                  secondaryUserLastName,
                                                  secondaryUserImageUrl
                                                )}
                                              </div>

                                              <div className="pt-1 ms-3">
                                                <p className="fw-bold mb-0">
                                                  {secondaryUserFirstName}{" "}
                                                  {secondaryUserLastName}
                                                </p>
                                                <p className="small text-muted">
                                                  {lastMessage?.slice(0, 45)}
                                                  {lastMessage.length > 45
                                                    ? "..."
                                                    : null}
                                                </p>
                                              </div>
                                            </div>
                                            <div className="pt-1">
                                              <p className="small text-muted mb-1">
                                                <TimeAgo
                                                  date={lastMessageTimeStamp}
                                                  minPeriod={60}
                                                />
                                              </p>
                                              {unreadCount > 0 &&
                                                currentChatMember?.sender
                                                  ?.secondaryUser !==
                                                  secondaryUser && (
                                                  <span className="badge bg-danger float-end">
                                                    {unreadCount}
                                                  </span>
                                                )}
                                              <span className="text-muted float-end">
                                                <p
                                                  className={styles.timeFromNow}
                                                >
                                                  {" "}
                                                  {moment(
                                                    lastUpdatedDate
                                                  ).fromNow()}
                                                </p>
                                              </span>
                                            </div>
                                          </div>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                )}
                            </MDBTypography>
                          ) : (
                            <MDBTypography listUnStyled className="mb-0">
                              No Chats
                            </MDBTypography>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={styles.chatContainer2}
                      style={{ backgroundColor: "#fff", minHeight: "70vh" }}
                    >
                      <div  className="p-0">
                      <div className="card"
                          style={{
                            minHeight: "70vh",
                            borderRadius: "0 0 6px 6px",
                            boxShadow: "none",
                          }}
                        >
                          <div
                            className="d-flex flex-row p-1"
                            style={{ background: "rgb(244, 244, 244)" }}
                          >
                            {renderUserPrfoile(
                              currentChatMember?.sender?.secondaryUserFirstName,
                              currentChatMember?.sender?.secondaryUserLastName,
                              currentChatMember?.sender?.secondaryUserImageUrl,
                              currentChatMember
                            )}
                            <div
                              className="ms-3 pt-2 float-start"
                              style={{ width: "90%" }}
                            >
                              <p className="fw-bold mb-0">
                                {
                                  currentChatMember?.sender
                                    ?.secondaryUserFirstName
                                }{" "}
                                {
                                  currentChatMember?.sender
                                    ?.secondaryUserLastName
                                }
                              </p>
                              <p className="small text-muted m-0">
                                <span className="text-muted float-start m-0 p-0">
                                  <FontAwesomeIcon
                                    icon={faCircle}
                                    style={{
                                      color: "#3479FE",
                                      marginRight: "0.5rem",
                                      fontSize: 10,
                                    }}
                                  />
                                </span>
                                Available
                              </p>
                            </div>
                            <div className="float-end mt-4">
                              <CloseCircleOutlined
                                className="d-flex align-self-center mt-1 me-2 float-end"
                                fas
                                size="lg"
                                icon="square-xmark"
                                style={{ color: "#212529", cursor: "pointer" }}
                                onClick={() => setCurrentChatMember(null)}
                              />
                            </div>
                          </div>

                          {fileModal ? (
                            <div className="card-body customScroll border rounded-2">
                              <div className="mt-2 p-2 text-center">
                                <p className="fw-bold mb-0">Attachment</p>
                                <div className="pt-2">
                                  {!imgExtensions.exec(userData.fileName) ? (
                                    <>
                                      <MDBIcon
                                        className="mt-3"
                                        fas
                                        size="10x"
                                        icon="file-lines"
                                        style={{ color: "grey" }}
                                      />
                                      <p className="mt-4">
                                        {userData.fileName}{" "}
                                        <MDBIcon
                                          className="align-self-center mt-1"
                                          fas
                                          size="lg"
                                          icon="trash-arrow-up"
                                          style={{
                                            color: "#212529",
                                            cursor: "pointer",
                                          }}
                                          onClick={handleFileModalClose}
                                        />
                                      </p>
                                    </>
                                  ) : (
                                    <>
                                      <img
                                        src={userData.fileUrl}
                                        height={300}
                                        width={300}
                                        alt={userData.fileName}
                                      />
                                      <p>
                                        {userData.fileName}{" "}
                                        <MDBIcon
                                          className="align-self-center mt-1"
                                          fas
                                          size="lg"
                                          icon="trash-arrow-up"
                                          style={{
                                            color: "#212529",
                                            cursor: "pointer",
                                          }}
                                          onClick={handleFileModalClose}
                                        />
                                      </p>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div
                              className="card-body customScroll"
                              onScroll={handleChatScroll}
                            >
                              <div>
                                <div>
                                  <MDBTypography listUnStyled>
                                    <ul>
                                      {loading && <span>Loading</span>}
                                      <div ref={messagesTopRef} />
                                      {message?.map((chat, index) => (
                                        <>
                                          {chat.senderName ===
                                            currentChatMember?.sender
                                              ?.secondaryUser && (
                                            <li
                                              className="d-flex flex-row justify-content-start"
                                              key={index}
                                              ref={
                                                index === 2
                                                  ? messagesTopRef
                                                  : {}
                                              }
                                            >
                                              <div>
                                                <p className="small p-2 ms-3 mb-1 text-white bg-secondary-chat bg-gradient-sender bubble-left">
                                                  {chat.fileUrl &&
                                                    chat.fileType.includes(
                                                      "image"
                                                    ) && (
                                                      <img
                                                        src={chat.fileUrl}
                                                        alt="avatar 1"
                                                        style={{
                                                          width: "200px",
                                                          height: "300%",
                                                        }}
                                                      />
                                                    )}
                                                  {chat.fileUrl &&
                                                    !chat.fileType.includes(
                                                      "image"
                                                    ) && (
                                                      <MDBIcon
                                                        fas
                                                        size="5x"
                                                        icon="file-lines"
                                                        style={{
                                                          color: "#212529",
                                                        }}
                                                      />
                                                    )}
                                                  <p className="mb-0">
                                                    {chat.message}
                                                    {chat.fileUrl && (
                                                      <a
                                                        className="download-link"
                                                        href={chat.fileUrl}
                                                      >
                                                        <MDBIcon
                                                          fas
                                                          size="lg"
                                                          icon="circle-down"
                                                          style={{
                                                            color: "#212529",
                                                          }}
                                                        />
                                                      </a>
                                                    )}
                                                  </p>
                                                </p>

                                                <p className="small ms-3 mb-3 rounded-3 text-muted float-end">
                                                  {chat.date}
                                                </p>
                                              </div>
                                            </li>
                                          )}{" "}
                                          {chat.receiverName ===
                                            currentChatMember?.sender
                                              ?.secondaryUser && (
                                            <li
                                              className="d-flex flex-row justify-content-end"
                                              key={index}
                                            >
                                              <div>
                                                <p className="small p-2 me-3 mb-1 text-white bg-info-sender bg-gradient bubble-right">
                                                  {chat.fileUrl &&
                                                    chat.fileType.includes(
                                                      "image"
                                                    ) && (
                                                      <img
                                                        src={chat.fileUrl}
                                                        alt="avatar 1"
                                                        style={{
                                                          width: "200px",
                                                          height: "300%",
                                                        }}
                                                      />
                                                    )}
                                                  {chat.fileUrl &&
                                                    !chat.fileType.includes(
                                                      "image"
                                                    ) && (
                                                      <MDBIcon
                                                        fas
                                                        size="5x"
                                                        icon="file-lines"
                                                        style={{
                                                          color: "#212529",
                                                        }}
                                                      />
                                                    )}
                                                  <p className="mb-0">
                                                    {chat.message}
                                                    {chat.fileUrl && (
                                                      <a
                                                        className="download-link"
                                                        href={chat.fileUrl}
                                                      >
                                                        <MDBIcon
                                                          fas
                                                          size="lg"
                                                          icon="circle-down"
                                                          style={{
                                                            color: "#212529",
                                                          }}
                                                        />
                                                      </a>
                                                    )}
                                                    {chat.senderName ===
                                                      userData.username &&
                                                      chat.messageStatus ===
                                                        "DELIVERED" && (
                                                        <span className="text-muted float-end">
                                                          <MDBTooltip
                                                            tag="a"
                                                            wrapperProps={{
                                                              href: "#",
                                                            }}
                                                            title="Sent"
                                                          >
                                                            <MDBIcon
                                                              fas
                                                              icon="check"
                                                              size="xs"
                                                              style={{
                                                                color: "black",
                                                                marginLeft:
                                                                  "1rem",
                                                              }}
                                                            />
                                                          </MDBTooltip>
                                                        </span>
                                                      )}
                                                    {chat.senderName ===
                                                      userData.username &&
                                                      chat.messageStatus ===
                                                        "READ" && (
                                                        <span className="text-muted float-end">
                                                          <MDBTooltip
                                                            tag="a"
                                                            wrapperProps={{
                                                              href: "#",
                                                            }}
                                                            title="Read"
                                                          >
                                                            <MDBIcon
                                                              fas
                                                              icon="check-double"
                                                              size="xs"
                                                              style={{
                                                                color: "white",
                                                                marginLeft:
                                                                  "1rem",
                                                              }}
                                                            />
                                                          </MDBTooltip>
                                                        </span>
                                                      )}
                                                    {chat.senderName ===
                                                      userData.username &&
                                                      chat.messageStatus ===
                                                        "UNREAD" && (
                                                        <span className="text-muted float-end">
                                                          <MDBTooltip
                                                            tag="a"
                                                            wrapperProps={{
                                                              href: "#",
                                                            }}
                                                            title="Unread"
                                                          >
                                                            <MDBIcon
                                                              fas
                                                              icon="check"
                                                              size="xs"
                                                              style={{
                                                                color: "white",
                                                                marginLeft:
                                                                  "1rem",
                                                              }}
                                                            />
                                                          </MDBTooltip>
                                                        </span>
                                                      )}
                                                  </p>
                                                </p>
                                                <p className="small me-3 mb-3 rounded-3 text-muted">
                                                  {chat.date}
                                                </p>
                                              </div>
                                            </li>
                                          )}
                                        </>
                                      ))}
                                    </ul>

                                    <div ref={messagesEndRef} />
                                  </MDBTypography>
                                </div>
                              </div>
                            </div>
                          )}
                          <form className="border rounded-2">
                            <div
                              className={`text-muted d-flex justify-content-start align-items-center pe-3 ${styles.form_submit_container}`}
                            >
                              <label className="me-3" htmlFor="fileAdd">
                                <FontAwesomeIcon
                                  icon={faLink}
                                  style={{
                                    size: 10,
                                    color: "#3479FE",
                                    cursor: "pointer",
                                  }}
                                />
                              </label>
                              <input
                                type={"file"}
                                onChange={handleFile}
                                id="fileAdd"
                                style={{ display: "none" }}
                                className="ms-1 text-muted"
                              />
                              <input
                                type="text"
                                className="form-control form-control-lg"
                                id="exampleFormControlInput2"
                                placeholder="Type message"
                                value={userData.message}
                                onChange={handleMessage}
                                onKeyPress={handleKeypress}
                              />
                              <button
                                onClick={handleSendMessage}
                                // ref={node => (this.btn = node)}
                                type="submit"
                                style={{
                                  border: "none",
                                  background: "#fff",
                                }}
                                className="ms-3"
                              >
                                <FontAwesomeIcon
                                  icon={faPaperPlane}
                                  style={{
                                    size: 10,
                                    color: "#3479FE",
                                    cursor: "pointer",
                                  }}
                                />
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  )}
                </Tab.Pane>
                <Tab.Pane id="my-posts" eventKey="2">
                  {!currentChatMember ? (
                    <div className="card"
                      style={{ minHeight: "70vh", borderRadius: "0 0 6px 6px" }}
                    >
                      <div className="p-2">
                        <MDBInputGroup className="rounded">
                          <input
                            className={`form-control ${styles.searchInput}`}
                            placeholder="Search a new user"
                            type="search"
                            value={userData.searchNewUserMessage}
                            onChange={handleSearchUser}
                          />
                        </MDBInputGroup>
                      </div>
                      <div className="card-body m-0 p-1 customScroll">
                        {searchedUsers && (
                          <MDBTypography listUnStyled className="mb-0">
                            <ul className="chat-persons">
                              {searchedUsers?.map((user, index) => (
                                <li className="p-2" key={index}>
                                  <div
                                    className="d-flex justify-content-between"
                                    onClick={() => {
                                      handleCreateNewChat(user);
                                    }}
                                  >
                                    <div className="d-flex flex-row">
                                      {
                                        <div className="d-inline-flex position-relative">
                                          <MDBBadge className="position-absolute top-0 start-100 translate-middle p-1 bg-success-chat border border-light rounded-circle">
                                            <span className="visually-hidden">
                                              New alerts
                                            </span>
                                          </MDBBadge>
                                          {renderUserPrfoile(
                                            user.firstName,
                                            user.lastName,
                                            user.profileImageUrl
                                          )}
                                        </div>
                                      }
                                      <div className="pt-1 ms-3">
                                        <p className="fw-bold mb-0">
                                          {user.firstName} {user.lastName}
                                        </p>
                                        <p className="small text-muted">
                                          {user?.role[0]}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </MDBTypography>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div
                      className={styles.chatContainer2}
                      style={{ backgroundColor: "#fff", minHeight: "70vh" }}
                    >
                      <div  className="p-0">
                        <div className="card"
                          style={{
                            minHeight: "70vh",
                            borderRadius: "0 0 6px 6px",
                          }}
                        >
                          <div
                            className="d-flex flex-row  p-1"
                            style={{ background: "rgb(244, 244, 244)" }}
                          >
                            {renderUserPrfoile(
                              currentChatMember?.sender?.secondaryUserFirstName,
                              currentChatMember?.sender?.secondaryUserLastName,
                              currentChatMember?.sender?.secondaryUserImageUrl
                            )}

                            <div
                              className="ms-3 pt-2 float-start"
                              style={{ width: "90%" }}
                            >
                              <p className="fw-bold mb-0">
                                {
                                  currentChatMember?.sender
                                    ?.secondaryUserFirstName
                                }{" "}
                                {
                                  currentChatMember?.sender
                                    ?.secondaryUserLastName
                                }
                              </p>
                              <p className="small text-muted m-0">
                                <span className="text-muted float-start m-0 p-0">
                                  <FontAwesomeIcon
                                    icon={faCircle}
                                    style={{
                                      color: "#3479FE",
                                      marginRight: "0.5rem",
                                      fontSize: 10,
                                    }}
                                  />
                                </span>
                                Available
                              </p>
                            </div>
                            <div className="float-end mt-4">
                              <CloseCircleOutlined
                                className="d-flex align-self-center mt-1 me-2 float-end"
                                fas
                                size="lg"
                                icon="square-xmark"
                                style={{ color: "#212529", cursor: "pointer" }}
                                onClick={() => setCurrentChatMember(null)}
                              />
                            </div>
                          </div>

                          {fileModal ? (
                            <div className="customScroll card-body border rounded-2">
                              <div className="mt-2 p-2 text-center">
                                <p className="fw-bold mb-0">Attachment</p>
                                <div className="pt-2">
                                  {!imgExtensions.exec(userData.fileName) ? (
                                    <>
                                      <MDBIcon
                                        className="mt-3"
                                        fas
                                        size="10x"
                                        icon="file-lines"
                                        style={{ color: "grey" }}
                                      />
                                      <p className="mt-4">
                                        {userData.fileName}{" "}
                                        <MDBIcon
                                          className="align-self-center mt-1"
                                          fas
                                          size="lg"
                                          icon="trash-arrow-up"
                                          style={{
                                            color: "#212529",
                                            cursor: "pointer",
                                          }}
                                          onClick={handleFileModalClose}
                                        />
                                      </p>
                                    </>
                                  ) : (
                                    <>
                                      <img
                                        src={userData.fileUrl}
                                        height={300}
                                        width={300}
                                        alt={userData.fileName}
                                      />
                                      <p>
                                        {userData.fileName}{" "}
                                        <MDBIcon
                                          className="align-self-center mt-1"
                                          fas
                                          size="lg"
                                          icon="trash-arrow-up"
                                          style={{
                                            color: "#212529",
                                            cursor: "pointer",
                                          }}
                                          onClick={handleFileModalClose}
                                        />
                                      </p>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div
                              className="card-body customScroll"
                              onScroll={handleChatScroll}
                            >
                              <div>
                                <div>
                                  <MDBTypography listUnStyled>
                                    <ul>
                                      {loading && <span>Loading</span>}
                                      <div ref={messagesTopRef} />
                                      {message?.map((chat, index) => (
                                        <>
                                          {chat.senderName ===
                                            currentChatMember.sender
                                              ?.secondaryUser && (
                                            <li
                                              className="d-flex flex-row justify-content-start"
                                              key={index}
                                              ref={
                                                index === 2
                                                  ? messagesTopRef
                                                  : {}
                                              }
                                            >
                                              <div>
                                                <p className="small p-2 ms-3 mb-1 text-white bg-secondary-chat bg-gradient-sender bubble-left">
                                                  {chat.fileUrl &&
                                                    chat.fileType.includes(
                                                      "image"
                                                    ) && (
                                                      <img
                                                        src={chat.fileUrl}
                                                        alt="avatar 1"
                                                        style={{
                                                          width: "200px",
                                                          height: "300%",
                                                        }}
                                                      />
                                                    )}
                                                  {chat.fileUrl &&
                                                    !chat.fileType.includes(
                                                      "image"
                                                    ) && (
                                                      <MDBIcon
                                                        fas
                                                        size="5x"
                                                        icon="file-lines"
                                                        style={{
                                                          color: "#212529",
                                                        }}
                                                      />
                                                    )}
                                                  <p className="mb-0">
                                                    {chat.message}
                                                    {chat.fileUrl && (
                                                      <a
                                                        className="download-link"
                                                        href={chat.fileUrl}
                                                      >
                                                        <MDBIcon
                                                          fas
                                                          size="lg"
                                                          icon="circle-down"
                                                          style={{
                                                            color: "#212529",
                                                          }}
                                                        />
                                                      </a>
                                                    )}
                                                  </p>
                                                </p>

                                                <p className="small ms-3 mb-3 rounded-3 text-muted float-end">
                                                  {chat.date}
                                                </p>
                                              </div>
                                            </li>
                                          )}{" "}
                                          {chat.receiverName ===
                                            currentChatMember.sender
                                              ?.secondaryUser && (
                                            <li
                                              className="d-flex flex-row justify-content-end"
                                              key={index}
                                            >
                                              <div>
                                                <p className="small p-2 me-3 mb-1 text-white bg-info-sender bg-gradient bubble-right">
                                                  {chat.fileUrl &&
                                                    chat.fileType.includes(
                                                      "image"
                                                    ) && (
                                                      <img
                                                        src={chat.fileUrl}
                                                        alt="avatar 1"
                                                        style={{
                                                          width: "200px",
                                                          height: "300%",
                                                        }}
                                                      />
                                                    )}
                                                  {chat.fileUrl &&
                                                    !chat.fileType.includes(
                                                      "image"
                                                    ) && (
                                                      <MDBIcon
                                                        fas
                                                        size="5x"
                                                        icon="file-lines"
                                                        style={{
                                                          color: "#212529",
                                                        }}
                                                      />
                                                    )}
                                                  <p className="mb-0">
                                                    {chat.message}
                                                    {chat.fileUrl && (
                                                      <a
                                                        className="download-link"
                                                        href={chat.fileUrl}
                                                      >
                                                        <MDBIcon
                                                          fas
                                                          size="lg"
                                                          icon="circle-down"
                                                          style={{
                                                            color: "#212529",
                                                          }}
                                                        />
                                                      </a>
                                                    )}
                                                    {chat.senderName ===
                                                      userData.username &&
                                                      chat.messageStatus ===
                                                        "DELIVERED" && (
                                                        <span className="text-muted float-end">
                                                          <MDBTooltip
                                                            tag="a"
                                                            wrapperProps={{
                                                              href: "#",
                                                            }}
                                                            title="Sent"
                                                          >
                                                            <MDBIcon
                                                              fas
                                                              icon="check"
                                                              size="xs"
                                                              style={{
                                                                color: "black",
                                                                marginLeft:
                                                                  "1rem",
                                                              }}
                                                            />
                                                          </MDBTooltip>
                                                        </span>
                                                      )}
                                                    {chat.senderName ===
                                                      userData.username &&
                                                      chat.messageStatus ===
                                                        "READ" && (
                                                        <span className="text-muted float-end">
                                                          <MDBTooltip
                                                            tag="a"
                                                            wrapperProps={{
                                                              href: "#",
                                                            }}
                                                            title="Read"
                                                          >
                                                            <MDBIcon
                                                              fas
                                                              icon="check-double"
                                                              size="xs"
                                                              style={{
                                                                color: "white",
                                                                marginLeft:
                                                                  "1rem",
                                                              }}
                                                            />
                                                          </MDBTooltip>
                                                        </span>
                                                      )}
                                                    {chat.senderName ===
                                                      userData.username &&
                                                      chat.messageStatus ===
                                                        "UNREAD" && (
                                                        <span className="text-muted float-end">
                                                          <MDBTooltip
                                                            tag="a"
                                                            wrapperProps={{
                                                              href: "#",
                                                            }}
                                                            title="Unread"
                                                          >
                                                            <MDBIcon
                                                              fas
                                                              icon="check"
                                                              size="xs"
                                                              style={{
                                                                color: "white",
                                                                marginLeft:
                                                                  "1rem",
                                                              }}
                                                            />
                                                          </MDBTooltip>
                                                        </span>
                                                      )}
                                                  </p>
                                                </p>
                                                <p className="small me-3 mb-3 rounded-3 text-muted">
                                                  {chat.date}
                                                </p>
                                              </div>
                                            </li>
                                          )}
                                        </>
                                      ))}
                                    </ul>

                                    <div ref={messagesEndRef} />
                                  </MDBTypography>
                                </div>
                              </div>
                            </div>
                          )}
                          <form className="border rounded-2">
                            <div
                              className={`text-muted d-flex justify-content-start align-items-center pe-3 ${styles.form_submit_container}`}
                            >
                              <label className="me-3" htmlFor="fileAdd">
                                <FontAwesomeIcon
                                  icon={faLink}
                                  style={{
                                    size: 10,
                                    color: "#3479FE",
                                    cursor: "pointer",
                                  }}
                                />
                              </label>
                              <input
                                type={"file"}
                                onChange={handleFile}
                                id="fileAdd"
                                style={{ display: "none" }}
                                className="ms-1 text-muted"
                              />
                              <input
                                type="text"
                                className="form-control form-control-lg"
                                id="exampleFormControlInput2"
                                placeholder="Type message"
                                value={userData.message}
                                onChange={handleMessage}
                                onKeyPress={handleKeypress}
                              />
                              <button
                                onClick={handleSendMessage}
                                type="submit"
                                style={{
                                  border: "none",
                                  background: "#fff",
                                }}
                                className="ms-3"
                              >
                                <FontAwesomeIcon
                                  icon={faPaperPlane}
                                  style={{
                                    size: 10,
                                    color: "#3479FE",
                                    cursor: "pointer",
                                  }}
                                />
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  )}
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatCommunication;
