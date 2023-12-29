import React, { useState } from 'react'
import styles from "./styles.module.css";
import { IMAGES } from "../../jsx/constant/theme";
import Image from "next/image";
import Chat from '../chat/index'

const Notification = ({ notificationResponse }) => {
  const [openMsg, setOpenMsg] = useState(false);

  const emailSplitFunction = (email) => {
    let emailSplit = email.split("@");
    return emailSplit[0];
  }

  return (
    <div className={`card-body chatbox contacts_body p-0`} id='DZ_W_Contacts_Body' >
      {!openMsg ?
      <ul className='contacts'>
        {notificationResponse.map(
          (data, i) => (
            <li
              className='active dlab-chat-user'
             
            >
              <div className='d-flex bd-highlight'>
                <div className='img_cont'>
                  <Image src={IMAGES.profileImage} alt="" />
                  <span className='online_icon'></span>
                </div>
                <div className='user_info'>
                  <span>{emailSplitFunction(data.userFrom.userName)} </span>
                  <p>{data.content}</p>
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
