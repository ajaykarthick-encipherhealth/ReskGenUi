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
  message,
} from "antd";
import { IMAGES } from "../../jsx/constant/theme";
import Image from "next/image";
import Styles from "./tenantOnboarding.module.css";
import { encyptingPass } from "../../components/headerFilters/functions";
import Tenant from "./tenant";
import Organisation from "./organisation";
import Personal from "./personal";
import { connect } from "react-redux";
import { actions as getAllOnBoarding } from "../../stores/tenantOnBoarding";

const { Sider, Content } = Layout;
const { Step } = Steps;

const TenantOnboarding = ({ createOnBoarding }) => {
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
    name: "",
    email: "",
    address: "",
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
    confirmPassword: "",
    role: [],
    userName: "",
    mobileNumber: "",
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
    {
      current === 2 ? handleSubmit() : "test";
    }
  };

  const handleSubmit = async () => {
    const encrptedData = encyptingPass(credentials?.password);
    const transformedData = {};

    Object.keys(credentials.roles).forEach((key) => {
      const role = credentials.roles[key].role;
      const idValue = credentials.roles[key].idValue;
      transformedData[role] = idValue;
    });
    const payload = {
      tenantDTO: {
        clientId: credentials.clientId,
        clientSecret: credentials.clientSecret,
        tenantid: credentials.tenantid,
        appObjectId: credentials.appObjectId,
        tenantDomain: credentials.tenantDomain,
        roles: transformedData,
        scope: credentials.scope,
      },
      signUpDTO: {
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        emailId: credentials.emailId,
        password: encrptedData?.pass,
        role: [credentials.role],
        userName: credentials.userName,
        mobileNumber: credentials.mobileNumber,
        passwordIv: encrptedData.iv,
      },
      organizationCreationDTO: {
        email: credentials.email,
        name: credentials.name,
        address: credentials.address,
      },
    };
    console.log(payload, "payload");
    try {
      const response = await createOnBoarding(payload);
      console.log("User added successfully:", response);
      message.success("User added successfully");
    } catch (error) {
      console.error("Failed to add user:", error);
      message.error("Failed to add user");
    }
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
            credentials={credentials}
            handleInputChange={handleInputChange}
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
            credentials={credentials}
            handleInputChange={handleInputChange}
            handleRoleChange={handleRoleChange}
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

          <div
            className={`d-flex justify-content-center align-items-center ${Styles.customSteps}`}
          >
            <Steps current={current} onChange={onChange} direction="vertical">
              {customDescriptions.map((description, index) => (
                <Step key={index} description={description} />
              ))}
            </Steps>
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

const enhancer = connect((state) => ({}), {
  createOnBoarding: getAllOnBoarding.getAllOnBoarding,
});

export default enhancer(TenantOnboarding);
