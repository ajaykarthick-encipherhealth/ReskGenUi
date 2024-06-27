import React, { Component } from "react";
import Router from "next/router";

export default class Index extends Component {
  componentDidMount = () => {
    let login = localStorage.getItem("loginCheck");
    const role=localStorage.getItem("userRole")
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
