import React, { useState } from 'react'
import styles from "./styles.module.css";
import { IMAGES } from "../../jsx/constant/theme";
import Image from "next/image";
import Chat from '../chat/index';
import { Tooltip } from "antd";
import moment from 'moment';



const Notification = ({ notificationResponse }) => {
  const [openMsg, setOpenMsg] = useState(false);
  const notificationData = notificationResponse?.content;
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
        {notificationData?.map(
          (data, i) => (
            <li
              className='active dlab-chat-user'            
            >
              <div className='d-flex bd-highlight'>
              <Tooltip title={emailSplitFunction(data.userFrom.userName)} placement="bottom">       
                <div className='img_cont'>                                    
                <span>{splitUserName(data.userFrom.userName)}</span>               
                  <span className='online_icon'></span>
                </div>
                </Tooltip>
                <div className='user_info'>
                  <div className='d-flex'>
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
