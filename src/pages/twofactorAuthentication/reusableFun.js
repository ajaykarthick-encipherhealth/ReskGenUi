import Image from "next/image";
import cogentLogo from "../../images/logo/cogentAI-logo-loginpage.png";
import c360Logo from "../../images/logo/newLoginLogo.png";
import cogentHeaderLogo from "../../images/logo/CogentAIlogo22.png";
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
            width: "550px",
            height: "230px",
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
            width: "550px",
            height: "230px",
          }}
        />
      );
  }
};

export const getHeaderLoge = () => {
  switch (companyDeatils) {
    case "cogentai":
      return (
        <Image src={cogentHeaderLogo} alt="noImg" width={200} height={150} />
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



const ReusableFunction = () => {
  return <></>;
};

export default ReusableFunction;