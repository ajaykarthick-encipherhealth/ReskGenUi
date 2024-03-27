import React from "react";
import { Tab, Nav } from "react-bootstrap";
import visitStyles from "../../../../../styles/visitdata.module.css";
import File from "./file";
import VisitData from "./visitData";
const NonHcc = ({}) => {
  const selectTab = async (number) => {};

  return (
    <>
      <div className={visitStyles.visitdata_tab_body}>
        <div className={`profile-tab ${visitStyles.visitdata_header_card2}`}>
          <div className="custom-tab-1">
            <Tab.Container defaultActiveKey={activeTabHead}>
              <Nav as="ul" className="nav nav-tabs">
                <Nav.Item as="li" className="nav-item">
                  <Nav.Link
                    to="#my-posts"
                    className={visitStyles.navColor}
                    activeClassName={visitStyles.activeLink}
                    eventKey="file"
                    onClick={() => selectTab(1)}
                  >
                    File
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item as="li" className="nav-item">
                  <Nav.Link
                    to="#my-posts"
                    eventKey="validDiseases"
                    className={visitStyles.navColor}
                    activeClassName={visitStyles.activeLink}
                    onClick={() => selectTab(2)}
                  >
                    Visit Data
                  </Nav.Link>
                </Nav.Item>
              </Nav>
              <Tab.Content>
                <Tab.Pane id="my-posts" eventKey="validDiseases">
                  <VisitData />
                </Tab.Pane>
                <Tab.Pane id="my-posts" eventKey="file">
                  <File />
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </div>
        </div>
      </div>
    </>
  );
};

export default NonHcc;
