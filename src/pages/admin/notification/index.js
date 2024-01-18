import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Header from "../../../jsx/layouts/nav/Header";
import CreateNotification from "./createnotification";

const Notification = ({}) => {
  const [isOpne, setIsOpen] = useState(false);

  const addNotification = () => {
    setIsOpen(true);
  };

  return (
    <>
      <div className={`menu-toggle`}>
        <Header />
        <div class="content-body">
          <div className="container-fluid">
            <div className="row">
              <Button
                onClick={() => addNotification()}
                className="btn btn-primary btn-sm"
              >
                <FontAwesomeIcon icon={faPlus} fontSize={11} />
                Add Notification
              </Button>
            </div>
          </div>
        </div>
      </div>

      <CreateNotification open={isOpne} setOpen={setIsOpen} />
    </>
  );
};

export default Notification;
