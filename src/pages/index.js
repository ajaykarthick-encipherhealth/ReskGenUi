import React, { Component } from "react";
import Router, { useRouter } from "next/router";
import { getStorage } from "../utils/storages";

// export default class Index extends Component {
//   componentDidMount = () => {
// let login = getStorage("loginCheck");
// const role=getStorage("userRole")
// // if (login == "true") {
// //   Router.push("/reviewer/dashboard");
// // } else {
//   Router.push("/login");
// // }
//   };

//   render() {
//     return <div />;
//   }
// }

import { useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import PageLoading from "../components/page-loading";
import { setStorage } from "../utils/storages";

export default function Home() {
  const { instance, accounts, inProgress } = useMsal();
  const router = useRouter();

  useEffect(() => {
    let login = getStorage("loginCheck");
    const role = getStorage("userRole");
    // if (login == "true") {
    //   Router.push("/reviewer/dashboard");
    // } else {
      router.push("/login");
    // }
  }, []);

  useEffect(() => {
    // Already logged in
    if (accounts.length > 0) {
      setStorage("token", accounts[0].idToken);
      console.log("✅ User authenticated. Redirecting to dashboard...");
      router.push("/projects");
    }
  }, [instance, accounts, inProgress, router]);

  console.log(accounts, "testings");
  

  return <PageLoading />;
}
