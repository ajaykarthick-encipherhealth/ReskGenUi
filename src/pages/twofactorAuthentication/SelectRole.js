import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Select, notification } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import { selectedUserRole } from "../../store/actions/AuthActions";
import { IMAGES } from "../../jsx/constant/theme";
import LoginBack from "../../images/logo/login-back.jpg";
import styles from "../../styles/auth.module.css";

const SelectRole = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [username, setUsername] = useState();
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleError, setRoleError] = useState(false);
  const [role, setRole] = useState([]);
  const items = [];
  const data =
    role?.length > 0 &&
    role?.map((info) => {
      if (info?.toLowerCase() === "admin") {
        items?.push(
          { value: "Admin", label: "Admin" },
          { value: "L2auditor", label: "L2auditor" },
          { value: "L1auditor", label: "L1auditor" }
        );
      } else if (info?.toLowerCase() === "l2auditor") {
        items?.push(
          { value: "L2auditor", label: "L2auditor" },
          { value: "L1auditor", label: "L1auditor" }
        );
      } else {
        items?.push({ value: info, label: info });
      }
    });
  const onSubmitRole = (e) => {
    e.preventDefault();
    if (!selectedRole) {
      setRoleError(true);
    } else {
      notification.success({
        message: "Login Successfully",
        duration: 1,
      });
      localStorage.removeItem("password");
      setRoleError(false);
      const rolesMapping = {
        admin: { userRole: "admin", route: "/admin/user" },
        l1auditor: { userRole: "l1auditor", route: "/physician/dashboard" },
        l2auditor: { userRole: "l2auditor", route: "/l2Auditor/dashboard" },
      };
    
      const selectedRoleInfo = rolesMapping[selectedRole];
    
      if (selectedRoleInfo && !roleError) {
        localStorage.setItem("userRole", selectedRoleInfo.userRole);
        localStorage.setItem("role", selectedRole);
        router?.push(selectedRoleInfo.route);
      }
    }
  };
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setUsername(searchParams.get("username"));
    setRole([localStorage.getItem("roles")]);
  }, []);

  return (
    <div className="page-wraper">
      <div className="login-account">
        <div className="row h-100">
          <div className="col-lg-6 align-self-start">
            <div
              className="account-info-area"
              style={{ backgroundImage: "url(" + LoginBack + ")" }}
            >
              <div className="login-content">
                <p className="sub-title"></p>
                <Image className="login-logo" src={IMAGES.loginPageLogo} />
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-7 col-sm-12 mx-auto align-self-center">
            <div className="login-form">
              <div className="login-head">
                <h5 className="title">Log in to your account</h5>
              </div>
              <h6 className="login-title">
                <span>Login</span>
              </h6>

              <form onSubmit={onSubmitRole}>
                <div className="mb-4">
                  <label className="mb-1 text-dark">Select Role</label>
                  <div
                    style={{
                      height: "100px",
                      marginTop: "5px",
                    }}
                  >
                    <Select
                      style={{ width: "100%", height: "2.75rem" }}
                      placeholder="Select Role"
                      onChange={(value) => {
                        setSelectedRole(value?.toLowerCase());
                        setRoleError(false);
                      }}
                      options={items}
                    />
                  </div>
                  {roleError && (
                    <span className="text-danger fs-12">
                      Please Select Role
                    </span>
                  )}
                </div>
                <div className="d-flex">
                  <div className="col-lg-6 mx-2">
                    <button
                      className={styles.backBtn}
                      onClick={() => {
                        setRoleError(false);
                        router?.push(
                          `/twofactorAuthentication/Authentication?mfa=true&username=${username}`
                        );
                      }}
                    >
                      {"BACK"}
                    </button>
                  </div>
                  <div className="col-lg-6">
                    <button type="submit" className={styles.sendBtn}>
                      {"NEXT"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectRole;
