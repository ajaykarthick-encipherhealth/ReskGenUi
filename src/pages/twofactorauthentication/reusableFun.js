import Image from "next/image";
import cogentLogo from "../../images/logo/cogentAI-logo-loginpage.webp";
import c360Logo from "../../images/logo/newLoginLogo.png";
import cogentHeaderLogo from "../../images/logo/header_logo.png";
import neChatImage from "../../images/logo/newChatImage.png";
import cogentChat from "../../images/logo/CAICell.png";
import riskgen from "../../images/logo/riskgen-i.png";
import { companyDeatils } from "../../utils/config";
import riskGenImage from "../../../public/favicon4.png"
export const getLogoImage = () => {
  switch (companyDeatils) {
    case "cogentai":
      return (
        <Image
          className={`login-logo `}
          src={cogentLogo}
          alt="Cogentai Logo"
          style={{
            display: "block",
            margin: "0 auto",
            width: "450px",
          }}
        />
      );
    case "riskgenai":
      return (
        <Image
          className={`login-logo `}
          src={riskgen}
          alt="Cogentai Logo"
          style={{
            display: "block",
            margin: "0 auto",
            width: "450px",
          }}
        />
      );
    case "c360":
      return (
        <Image
          className="login-logo"
          src={c360Logo}
          alt="C360 Logo"
          style={{
            display: "block",
            margin: "0 auto",
            width: "350px",
            height: "280px",
          }}
        />
      );
    default:
      return (
        <Image
          className={`login-logo `}
          src={cogentLogo}
          alt="Default Logo"
          style={{
            display: "block",
            margin: "0 auto",
            width: "450px",
          }}
        />
      );
  }
};

export const getHeaderLoge = () => {
  switch (companyDeatils) {
    case "cogentai":
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "120px",
            aspectRatio: "2 / 1",
          }}
          className="mx-3"
        >
          <Image
            src={cogentHeaderLogo}
            alt="Cogentai Header Logo"
            style={{
              width: "100%",
              height: "auto",
            }}
          />
        </div>
      );
    case "riskgenai":
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "120px",
            aspectRatio: "2 / 1",
          }}
          className="mx-3"
        >
          <Image src={riskgen} alt="Riskgen Header Logo"  style={{
            width: "120px",
            height: 25,
          }}/>
        </div>
      );
    case "c360":
      return (
        <div className="header-logo">
          <Image src={c360Logo} alt="C360 Header Logo" />
        </div>
      );

    default:
      return (
        <Image
          src={cogentHeaderLogo}
          alt="Default Header Logo"
          width={200}
          height={150}
        />
      );
  }
};

export const getFaviconUrl = () => {
  switch (companyDeatils) {
    case "cogentai":
      return "/favicon.png";
    case "c360":
      return "/favicon2.png";
    case "riskgenai":
      return "/favicon4.png";
    default:
      return "/favicon.png";
  }
};

export const getLogo = () => {
  switch (companyDeatils) {
    case "cogentai":
      return (
        <Image
          src={cogentChat}
          alt="Cogentai Chat Logo"
          width={40}
          style={{ aspectRatio: "2 / 1" }}
        />
      );
    case "c360":
      return (
        <div className="header-logo">
          <Image
            src={neChatImage}
            alt="C360 Chat Logo"
            width={30}
            style={{ aspectRatio: "2 / 1" }}
          />
        </div>
      );
    case "riskgenai":
      return (
        <div className="bg-white rounded-circle d-flex align-items-center justify-content-center p-1">
          <Image
            src={riskGenImage}
            alt="Riskgen Chat Logo"
            width={13}
            height={13}
            style={{ aspectRatio: "2 / 1" }}
          />
        </div>
      );

    default:
      return (
        <Image
          src={cogentChat}
          alt="Default Chat Logo"
          width={30}
          style={{ aspectRatio: "2 / 1" }}
        />
      );
  }
};

const ReusableFunction = () => {
  return <></>;
};

export default ReusableFunction;
