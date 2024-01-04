import React, { useState } from 'react'
import styles from "./styles.module.css";
import { IMAGES } from "../../jsx/constant/theme";
import Image from "next/image";
import Chat from '../chat/index';
import { Tooltip } from "antd";
import moment from 'moment';



const Notification = ({ notificationResponse }) => {
  const [openMsg, setOpenMsg] = useState(false);

  const emailSplitFunction = (email) => {
    let emailSplit = email.split("@");
    return capitalizeFirstLetter(emailSplit[0]);
  }
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const splitUserName = (name) => {
    return name[0].toUpperCase();
  };

  return (
    <div className={`card-body chatbox contacts_body p-0`} id='DZ_W_Contacts_Body' >
      {!openMsg ?
      <ul className='contacts'>
        {notificationResponse?.map(
          (data, i) => (
            <li
              className='active dlab-chat-user'            
            >
              <div className='d-flex bd-highlight'>
                <div className='img_cont'>
                <Tooltip title={emailSplitFunction(data.userFrom.userName)} placement="bottom">                             
                <span>{splitUserName(data.userFrom.userName)}</span>
                </Tooltip>
                  <span className='online_icon'></span>
                </div>
                <div className='user_info'>
                  <div className='d-flex'>
                  {/* <span>{emailSplitFunction(data.userFrom.userName)} </span> */}
                  <span>{data.content}</span>
                  </div>                
                  <p> {moment(data.createdAt).fromNow()}</p>                
                </div>
              </div>
            </li>
          )
        )}
         </ul>:null}

         <Chat      
        openMsg={openMsg}
        offMsg={() => setOpenMsg(false)}
      />
    </div>
  );
};

export default Notification;
