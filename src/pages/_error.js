// pages/_error.js
import { Button, Result } from "antd";
import { useRouter } from "next/router";
import React from "react";

const ErrorPage = ({ statusCode }) => {
  const router=useRouter()
  return (
    <div>
      <Result
        status={statusCode}
        title={statusCode}
        subTitle="Sorry, the page you visited does not exist."
        extra={<Button type="primary" onClick={()=>{router.back()}}>Back Home</Button>}
      />
    </div>
  );
};

ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage;
