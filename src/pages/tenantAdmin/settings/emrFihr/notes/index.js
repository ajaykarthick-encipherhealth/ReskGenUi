import React, { use, useEffect, useState } from "react";
import Style from "./../../style.module.css";

const Notes = () => {
  return (
    <div className={` p-1 px-3  m-2  ${Style.notesContainer}`}>
      <h5 className="text-center">Notes</h5>
      <div className={Style.notesTextContainer}>
        <span className={Style.notesHeading}>App Type</span>
        <span className={Style.notesDes}>
          An app type refers to the category or function of a web application
        </span>
      </div>
      <div className={Style.notesTextContainer2}>
        <span className={Style.notesHeading2}>Backend </span>
        <span className={Style.notesDes}>
          The backend services method is a way of connecting to the
          eClinicalWorks® (eCW) without requiring direct user interaction.
        </span>
      </div>
      <div className={Style.notesTextContainer2}>
        <span className={Style.notesHeading2}>Provider Centric </span>
        <span className={Style.notesDes}>
          Provider centric apps used by providers or medical professionals.
        </span>
      </div>
      <div className={Style.notesTextContainer}>
        <span className={Style.notesHeading}>Access Type</span>
        <span className={Style.notesDes}>
          An app type refers to the category or function of a web application
        </span>
      </div>
      <div className={Style.notesTextContainer2}>
        <span className={Style.notesHeading2}>Online Access </span>
        <span className={Style.notesDes}>
          Request a refresh_token that can be used to obtain a new access token
          to replace an expired one, and that will be usable for as long as the
          end-user remains online.
        </span>
      </div>
      <div
        className={Style.notesTextContainer2}
        style={{ marginBottom: "20px" }}
      >
        <span className={Style.notesHeading2}>Offline Access </span>
        <span className={Style.notesDes}>
          Request a refresh_token that can be used to obtain a new access token
          to replace an expired one, even after the end-user no longer is online
          after the access token expires.
        </span>
      </div>
    </div>
  );
};

export default Notes;
