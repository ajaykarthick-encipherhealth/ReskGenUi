import Image from "next/image";
import cogentLogo from "../../images/logo/cogentAI-logo-loginpage.png";
import c360Logo from "../../images/logo/newLoginLogo.png";
import cogentHeaderLogo from "../../images/logo/header_logo.png";
import neChatImage from "../../images/logo/newChatImage.png";
import cogentChat from "../../images/logo/CAICell.png";
import { companyDeatils } from "../../utils/config";

export const getLogoImage = () => {
  switch (companyDeatils) {
    case "cogentai":
      return (
        <Image
          className="login-logo"
          src={cogentLogo}
          style={{
            display: "block",
            margin: "0 auto",
            width: "500px",
            // height: "230px",
          }}
        />
      );
    case "c360":
      return (
        <Image
          className="login-logo"
          src={c360Logo}
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
          className="login-logo"
          src={cogentLogo}
          style={{
            display: "block",
            margin: "0 auto",
            width: "500px",
            // height: "230px",
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
            alt="Logo"
            style={{
              width: "100%", 
              height: "auto",
            }}
          />
        </div>
      );
    case "c360":
      return (
        <div className="header-logo">
          <Image src={c360Logo} alt="noImg" />
        </div>
      );

    default:
      return (
        <Image src={cogentHeaderLogo} alt="noImg" width={200} height={150} />
      );
  }
};

export const getFaviconUrl = () => {
  switch (companyDeatils) {
    case "cogentai":
      return "/favicon.png";
    case "c360":
      return "/favicon2.png";
    default:
      return "/favicon.png";
  }
};

export const getLogo = () => {
  switch (companyDeatils) {
    case "cogentai":
      return (
        <Image src={cogentChat} width={40} height={50} />
      );
    case "c360":
      return (
        <div className="header-logo">
           <Image src={neChatImage} width={30} height={40} />
        </div>
      );

    default:
      return (
        <Image src={cogentChat} width={30} height={40} />
      );
  }
}

const ReusableFunction = () => {
  return <></>;
};

export default ReusableFunction;