import React, { Component } from "react";
import Router from "next/router";

export default class Index extends Component {
  componentDidMount = () => {
    var userLogin = localStorage.getItem("loginCheck");
    if (userLogin == "true") {
      Router.push("/physician/dashboard");
    } else {
      Router.push("/userlogin");
    }
  };

  render() {
    return <div />;
  }
}