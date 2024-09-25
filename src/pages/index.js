import React, { Component } from "react";
import Router from "next/router";
import { getStorage } from "../utils/storages";

export default class Index extends Component {
  componentDidMount = () => {
    let login = getStorage("loginCheck");
    const role=getStorage("userRole")
    // if (login == "true") {
    //   Router.push("/reviewer/dashboard");
    // } else {
      Router.push("/login");
    // }
  };

  render() {
    return <div />;
  }
}
