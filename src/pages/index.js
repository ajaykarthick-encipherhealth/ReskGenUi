import React, { Component } from "react";
import Router from "next/router";

export default class Index extends Component {
  componentDidMount = () => {
    var login = localStorage.getItem("loginCheck");
    if (login == "true") {
      Router.push("/physician/dashboard");
    } else {
      Router.push("/login");
    }
  };

  render() {
    return <div />;
  }
}