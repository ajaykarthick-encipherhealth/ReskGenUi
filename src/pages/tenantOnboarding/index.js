import React, { useState } from "react";
import {
  Layout,
  Divider,
  Steps,
  Form,
  Input,
  Button,
  Row,
  Col,
  Select,
} from "antd";
import { IMAGES } from "../../jsx/constant/theme";
import Image from "next/image";
import Styles from "./tenantOnboarding.module.css";

import Tenant from "./tenant";
import Organisation from "./organisation";
import Personal from "./personal";

const { Sider, Content } = Layout;
const { Step } = Steps;

const TenantOnboarding = () => {
  const [current, setCurrent] = useState(0);
  const [sets, setSets] = useState([{ id: 1 }]);
  const [credentials, setCredentials] = useState({
    clientId: "",
    clientSecret: "",
    tenantid: "",
    appObjectId: "",
    tenantDomain: "",
    scope: "",
    roles: {},
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleRoleChange = (value, key, field) => {
    setCredentials((prevState) => ({
      ...prevState,
      roles: {
        ...prevState.roles,
        [key]: {
          ...prevState.roles[key],
          [field]: value,
        },
      },
    }));
  };

  const addSet = () => {
    setSets([...sets, { id: sets.length + 1 }]);
  };

  const deleteSet = (id) => {
    setSets(sets.filter((set) => set.id !== id));
  };

  const [log, setLog] = useState("");

  const onChange = (value) => {
    setLog(`onChange: ${value}`);
    setCurrent(value);
  };

  const nextStep = () => {
    if (current < customDescriptions.length - 1) {
      setCurrent((prevCurrent) => prevCurrent + 1);
    }
    console.log(credentials, "test");
  };
  const previousStep = () => {
    if (current > 0) {
      setCurrent((prevCurrent) => prevCurrent - 1);
    }
  };

  const description = "Tenant Onboarding";
  const { Option } = Select;

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Tenant
            Styles={Styles}
            IMAGES={IMAGES}
            sets={sets}
            addSet={addSet}
            nextStep={nextStep}
            deleteSet={deleteSet}
            credentials={credentials}
            handleInputChange={handleInputChange}
            handleRoleChange={handleRoleChange}
          />
        );
      case 1:
        return (
          <Organisation
            Styles={Styles}
            IMAGES={IMAGES}
            sets={sets}
            addSet={addSet}
            nextStep={nextStep}
            deleteSet={deleteSet}
          />
        );
      case 2:
        return (
          <Personal
            Styles={Styles}
            IMAGES={IMAGES}
            sets={sets}
            addSet={addSet}
            nextStep={nextStep}
            deleteSet={deleteSet}
          />
        );
      default:
        return null;
    }
  };

  const customDescriptions = [
    <div className={Styles.customDescription}>
      <p>Tenant Onboarding</p>
    </div>,
    <div className={Styles.customDescription}>
      <p>Organization</p>
    </div>,
    <div className={Styles.customDescription}>
      <p>Personal Details</p>
    </div>,
  ];
  return (
    <div style={{ background: "#ffff" }} className="layout">
      <Layout style={{ minHeight: "100vh" }}>
        <Sider width={250} className={Styles.sider}>
          <div
            className={`text-white bg-white rounded-pill ${Styles.customBox}`}
          ></div>
          <div style={{ position: "relative", bottom: "144px" }}>
            <Image className="login-logo" src={IMAGES.loginPageLogo1} />
          </div>
          <div className="customsteps"
            style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Steps
        current={current}
        onChange={onChange}
        direction="vertical" > {customDescriptions.map((description, index) => (
          <Step key={index} description={description} />
        ))}</Steps>
          </div>
        </Sider>
        <Layout style={{ padding: "0 24px", minHeight: 280 }}>
          <Content className={Styles.content}>
            <h1 style={{ color: "#06439D" }}>Tenant Onboarding</h1>
            <p>
              Please fill in the details properly{" "}
              <span style={{ color: "red" }}>*</span>
            </p>
            <div className={Styles.maincontent}>
              {renderStepContent(current)}
            </div>

            <div className="d-flex justify-content-between align-items-center mt-5">
              {current > 0 && (
                <Button className={Styles.customButton} onClick={previousStep}>
                  Previous
                </Button>
              )}

              <Button className={Styles.customButton} onClick={nextStep}>
                {current === 2 ? "Submit" : "Next"}
              </Button>
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default TenantOnboarding;
