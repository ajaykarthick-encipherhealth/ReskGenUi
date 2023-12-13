import React from "react";
// import "./dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import { Progress, Tooltip } from "antd";
import NavBar from "../../../jsx/layouts/nav";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const Screen = () => {
  const sideMenu = useSelector((state) => state.sideMenu);
  const navigate = useRouter();

  const gotoPatientDetails = (data) => {
    navigate.push("/physician/patients");
  };

  const series = [
    {
      name: "NEW",
      data: [55],
    },
    {
      name: "INVALIDATION",
      data: [32],
    },
    {
      name: "VALIDATION",
      data: [15],
    },
    {
      name: "IN - AUDIT",
      data: [25],
    },
    {
      name: "IN - RE AUDIT",
      data: [49],
    },
    {
      name: "QC",
      data: [22],
    },
    {
      name: "IN-QC",
      data: [7],
    },
    {
      name: "COMPLETED",
      data: [78],
    },
  ];

  const opations = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "100%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },

    legend: {
      show: true,
      fontSize: "12px",
      fontWeight: 300,

      labels: {
        colors: "#000",
        fontSize: "14px",
        fontFamily: "Poppins",
        fontWeight: 600,
      },
      position: "bottom",
      horizontalAlign: "center",
      markers: {
        width: 19,
        height: 19,
        strokeWidth: 0,
        radius: 19,
        // fillColors: ["#fc8019", "var(--primary)"],
        offsetX: 0,
        offsetY: 0,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#000",
          fontSize: "14px",
          fontFamily: "Poppins",
          fontWeight: 400,
        },
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: ["Total"],
      labels: {
        style: {
          colors: "#000",
          fontSize: "14px",
          fontFamily: "Poppins",
          fontWeight: 400,
        },
      },
    },
    fill: {
      opacity: 1,
    },
  };

  return (
    <>
      <div className={`show ${sideMenu ? "menu-toggle" : ""}`}>
        <NavBar />
        <div class="content-body">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xl-3 col-sm-6">
                <div className="card dashboard-card">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between">
                      <div
                        className={`icon-box icon-box-lg rounded-circle bg-success-light`}
                      >
                        <div className="dashboard-icon-bac">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="30"
                            viewBox="0 0 30 30"
                            fill="none"
                          >
                            <path
                              d="M23.75 11.25V22.25C23.75 23.6501 23.75 24.3503 23.4775 24.885C23.2379 25.3554 22.8554 25.7379 22.385 25.9775C21.8503 26.25 21.1501 26.25 19.75 26.25H10.25C8.84986 26.25 8.1498 26.25 7.61503 25.9775C7.14461 25.7379 6.76216 25.3554 6.52249 24.885C6.25 24.3503 6.25 23.6501 6.25 22.25V7.75C6.25 6.34986 6.25 5.6498 6.52249 5.11503C6.76216 4.64461 7.14461 4.26216 7.61503 4.02249C8.1498 3.75 8.84987 3.75 10.25 3.75H16.25M23.75 11.25L16.25 3.75M23.75 11.25H17.5C16.8096 11.25 16.25 10.6904 16.25 10V3.75"
                              stroke="white"
                              stroke-width="3.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="total-projects ms-3">
                        <h3 className={`count text-success`}>55</h3>
                        <span>NEW</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-sm-6">
                <div className="card dashboard-card">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between">
                      <div
                        className={`icon-box icon-box-lg rounded-circle bg-danger`}
                      >
                        <div
                          className="dashboard-icon-bac"
                          style={{ backgroundColor: "#FF0000" }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="30"
                            viewBox="0 0 30 30"
                            fill="none"
                          >
                            <g clip-path="url(#clip0_135_322)">
                              <path
                                d="M15 0C6.73868 0 0 6.74013 0 15C0 23.2598 6.73868 29.9999 15 29.9999C23.2613 29.9999 30 23.2598 30 15C30 6.74013 23.2613 0 15 0ZM15 3.99876C21.0974 3.99876 25.9987 8.89974 25.9987 15C25.9987 21.1002 21.0974 26.0012 15 26.0012C8.9026 26.0012 4.00118 21.1002 4.00118 15C4.00118 8.89974 8.9026 3.99876 15 3.99876Z"
                                fill="white"
                              />
                              <path
                                d="M20.4987 7.5011C20.236 7.50117 19.9759 7.55296 19.7332 7.65351C19.4905 7.75406 19.27 7.9014 19.0842 8.08712L8.08541 19.0862C7.89969 19.2719 7.75239 19.4924 7.65192 19.735C7.55146 19.9776 7.49979 20.2376 7.49988 20.5002C7.49996 20.7628 7.5518 21.0228 7.65243 21.2653C7.75305 21.5079 7.9005 21.7282 8.08634 21.9138C8.46165 22.2887 8.97058 22.4991 9.50117 22.499C10.0318 22.4988 10.5405 22.288 10.9156 21.9129L21.9144 10.9138C22.1002 10.7281 22.2475 10.5077 22.3479 10.265C22.4484 10.0224 22.5001 9.7624 22.5 9.49982C22.4999 9.23725 22.448 8.97727 22.3474 8.73471C22.2468 8.49216 22.0994 8.27179 21.9135 8.08619C21.5382 7.71139 21.0293 7.50093 20.4987 7.5011Z"
                                fill="white"
                              />
                              <path
                                d="M9.50121 7.5011C9.23848 7.501 8.97831 7.55262 8.73555 7.65301C8.49279 7.7534 8.27219 7.9006 8.08634 8.08619C7.9005 8.27179 7.75305 8.49216 7.65243 8.73471C7.5518 8.97727 7.49996 9.23725 7.49988 9.49982C7.49979 9.7624 7.55146 10.0224 7.65192 10.265C7.75239 10.5077 7.89969 10.7281 8.08541 10.9138L19.0842 21.9129C19.4593 22.288 19.9681 22.4988 20.4987 22.499C21.0293 22.4991 21.5382 22.2887 21.9135 21.9138C22.0993 21.7282 22.2468 21.5079 22.3474 21.2653C22.448 21.0228 22.4999 20.7628 22.5 20.5002C22.5001 20.2376 22.4484 19.9776 22.3479 19.735C22.2475 19.4924 22.1002 19.2719 21.9144 19.0862L10.9156 8.08712C10.5405 7.71207 10.0318 7.50127 9.50121 7.5011Z"
                                fill="white"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_135_322">
                                <rect width="30" height="30" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                        </div>
                      </div>
                      <div className="total-projects ms-3">
                        <h3 className={`count text-danger`}>32</h3>
                        <span>INVALIDATION</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-sm-6">
                <div className="card dashboard-card">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between">
                      <div
                        className={`icon-box icon-box-lg rounded-circle bg-success-light`}
                      >
                        <div
                          className="dashboard-icon-bac"
                          style={{ backgroundColor: "#14E600" }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="30"
                            viewBox="0 0 30 30"
                            fill="none"
                          >
                            <g clip-path="url(#clip0_135_327)">
                              <path
                                d="M18.2483 10.0489L13.4363 15.8203L11.7517 13.8007C11.5942 13.6117 11.4011 13.4556 11.1832 13.3412C10.9654 13.2269 10.7272 13.1566 10.4821 13.1343C10.2371 13.112 9.99013 13.1382 9.75524 13.2114C9.52036 13.2846 9.30218 13.4033 9.11318 13.5608C8.92418 13.7183 8.76805 13.9115 8.65371 14.1293C8.53937 14.3472 8.46906 14.5854 8.44678 14.8304C8.42451 15.0754 8.45071 15.3224 8.52389 15.5573C8.59708 15.7922 8.71581 16.0104 8.87331 16.1994L11.9971 19.9494C12.1727 20.1606 12.3926 20.3307 12.6412 20.4475C12.8899 20.5642 13.1612 20.6248 13.4359 20.625C13.7106 20.6252 13.982 20.5649 14.2308 20.4485C14.4796 20.332 14.6997 20.1623 14.8755 19.9512L21.1267 12.4512C21.2856 12.2624 21.4057 12.044 21.4799 11.8086C21.5542 11.5733 21.5813 11.3256 21.5596 11.0797C21.538 10.8339 21.4679 10.5947 21.3536 10.376C21.2393 10.1573 21.0829 9.96328 20.8934 9.80515C20.704 9.64701 20.4851 9.52784 20.2495 9.45448C20.0138 9.38112 19.766 9.35501 19.5203 9.37766C19.2745 9.4003 19.0356 9.47125 18.8174 9.58643C18.5991 9.70162 18.4057 9.85877 18.2483 10.0489Z"
                                fill="white"
                              />
                              <path
                                d="M15 0C12.0333 0 9.13319 0.879735 6.66645 2.52796C4.19972 4.17618 2.27713 6.51886 1.14181 9.25975C0.00649929 12.0006 -0.290551 15.0166 0.288228 17.9264C0.867006 20.8361 2.29562 23.5088 4.3934 25.6066C6.49119 27.7044 9.16394 29.133 12.0737 29.7118C14.9834 30.2906 17.9994 29.9935 20.7403 28.8582C23.4811 27.7229 25.8238 25.8003 27.472 23.3336C29.1203 20.8668 30 17.9667 30 15C29.9958 11.0231 28.4141 7.2102 25.6019 4.39808C22.7898 1.58595 18.977 0.0042353 15 0ZM15 26.25C12.775 26.25 10.5999 25.5902 8.74984 24.354C6.89979 23.1179 5.45785 21.3609 4.60636 19.3052C3.75488 17.2495 3.53209 14.9875 3.96617 12.8052C4.40026 10.6229 5.47171 8.61839 7.04505 7.04505C8.6184 5.47171 10.623 4.40025 12.8052 3.96617C14.9875 3.53208 17.2495 3.75487 19.3052 4.60636C21.3609 5.45784 23.1179 6.89978 24.354 8.74984C25.5902 10.5999 26.25 12.775 26.25 15C26.2468 17.9827 25.0604 20.8423 22.9514 22.9514C20.8423 25.0604 17.9827 26.2467 15 26.25Z"
                                fill="white"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_135_327">
                                <rect width="30" height="30" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                        </div>
                      </div>
                      <div className="total-projects ms-3">
                        <h3 className={`count text-success`}>15</h3>
                        <span>VALIDATION</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-sm-6">
                <div className="card dashboard-card">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between">
                      <div
                        className={`icon-box icon-box-lg rounded-circle bg-success-light`}
                      >
                        <div
                          className="dashboard-icon-bac"
                          style={{ backgroundColor: "#E1E12A" }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="30"
                            viewBox="0 0 30 30"
                            fill="none"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M22.5 5L27.5 10V25H2.49996L2.49988 11.367C3.09158 12.2665 3.91875 13.3068 4.99992 14.1892L4.99996 22.5H25V10.625L21.875 7.5L19.5467 7.5001C19.228 6.87589 18.6921 5.94796 17.9216 5L22.5 5ZM22.5 18.75V20H7.49996V18.75H22.5ZM22.5 15V16.25H15L15 15.0564C15.0317 15.0378 15.0632 15.019 15.0946 15L22.5 15ZM10.625 2.5C16.3125 2.5 18.75 8.75 18.75 8.75C18.75 8.75 16.3125 15 10.625 15C4.93746 15 2.49996 8.75 2.49996 8.75C2.49996 8.75 4.93746 2.5 10.625 2.5ZM10.625 4.0625C7.03371 4.0625 4.93746 7.40625 4.27934 8.75C4.93746 10.0938 7.03371 13.4375 10.625 13.4375C14.2162 13.4375 16.3125 10.0938 16.9706 8.75C16.3125 7.40625 14.2162 4.0625 10.625 4.0625ZM10.625 6.01562C12.1955 6.01562 13.4687 7.23985 13.4687 8.75C13.4687 10.2602 12.1955 11.4844 10.625 11.4844C9.0544 11.4844 7.78121 10.2602 7.78121 8.75C7.78121 7.23985 9.0544 6.01562 10.625 6.01562ZM10.625 7.57812C9.95186 7.57812 9.40621 8.10279 9.40621 8.75C9.40621 9.39721 9.95186 9.92188 10.625 9.92188C11.2981 9.92188 11.8437 9.39721 11.8437 8.75C11.8437 8.10279 11.2981 7.57812 10.625 7.57812Z"
                              fill="white"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="total-projects ms-3">
                        <h3 className={`count text-success`}>25</h3>
                        <span>IN - AUDIT</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-sm-6">
                <div className="card dashboard-card">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between">
                      <div
                        className={`icon-box icon-box-lg rounded-circle bg-success-light`}
                      >
                        <div
                          className="dashboard-icon-bac"
                          style={{ backgroundColor: "#EAE316" }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="30"
                            viewBox="0 0 30 30"
                            fill="none"
                          >
                            <path
                              d="M15 10V16.25M15 20H15.0125M9 25H21C22.4001 25 23.1003 25 23.635 24.7275C24.1054 24.4879 24.4879 24.1054 24.7275 23.635C25 23.1003 25 22.4001 25 21V9C25 7.59987 25 6.8998 24.7275 6.36503C24.4879 5.89461 24.1054 5.51216 23.635 5.27249C23.1003 5 22.4001 5 21 5H9C7.59987 5 6.8998 5 6.36503 5.27249C5.89461 5.51216 5.51216 5.89461 5.27249 6.36503C5 6.8998 5 7.59986 5 9V21C5 22.4001 5 23.1003 5.27249 23.635C5.51216 24.1054 5.89461 24.4879 6.36503 24.7275C6.8998 25 7.59986 25 9 25Z"
                              stroke="white"
                              stroke-width="3"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="total-projects ms-3">
                        <h3 className={`count text-success`}>49</h3>
                        <span>IN - RE AUDIT</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-sm-6">
                <div className="card dashboard-card">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between">
                      <div
                        className={`icon-box icon-box-lg rounded-circle bg-success-light`}
                      >
                        <div
                          className="dashboard-icon-bac"
                          style={{ backgroundColor: "#FFA500" }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="30"
                            viewBox="0 0 30 30"
                            fill="none"
                          >
                            <path
                              d="M17.5 20L20.125 23.125L25 16.875"
                              stroke="white"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M12.5 17.5H3.75"
                              stroke="white"
                              stroke-width="2"
                              stroke-linecap="round"
                            />
                            <path
                              d="M12.5 22.5H3.75"
                              stroke="white"
                              stroke-width="2"
                              stroke-linecap="round"
                            />
                            <path
                              d="M3.75 7.5H16.875M25 7.5H22.1875"
                              stroke="white"
                              stroke-width="2"
                              stroke-linecap="round"
                            />
                            <path
                              d="M25 12.5H11.875M3.75 12.5H6.5625"
                              stroke="white"
                              stroke-width="2"
                              stroke-linecap="round"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="total-projects ms-3">
                        <h3 className={`count text-success`}>22</h3>
                        <span>QC</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-sm-6">
                <div className="card dashboard-card">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between">
                      <div
                        className={`icon-box icon-box-lg rounded-circle bg-success-light`}
                      >
                        <div
                          className="dashboard-icon-bac"
                          style={{ backgroundColor: "#FFC04D" }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="30"
                            viewBox="0 0 30 30"
                            fill="none"
                          >
                            <path
                              d="M23.75 11.25V22.25C23.75 23.6501 23.75 24.3503 23.4775 24.885C23.2379 25.3554 22.8554 25.7379 22.385 25.9775C21.8503 26.25 21.1501 26.25 19.75 26.25H10.25C8.84986 26.25 8.1498 26.25 7.61503 25.9775C7.14461 25.7379 6.76216 25.3554 6.52249 24.885C6.25 24.3503 6.25 23.6501 6.25 22.25V7.75C6.25 6.34986 6.25 5.6498 6.52249 5.11503C6.76216 4.64461 7.14461 4.26216 7.61503 4.02249C8.1498 3.75 8.84987 3.75 10.25 3.75H16.25M23.75 11.25L16.25 3.75M23.75 11.25H17.5C16.8096 11.25 16.25 10.6904 16.25 10V3.75"
                              stroke="white"
                              stroke-width="3.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="total-projects ms-3">
                        <h3 className={`count text-success`}>07</h3>
                        <span>IN-QC</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-sm-6">
                <div className="card dashboard-card">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between">
                      <div
                        className={`icon-box icon-box-lg rounded-circle bg-success-light`}
                      >
                        <div
                          className="dashboard-icon-bac"
                          style={{ backgroundColor: "#0000FF" }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="30"
                            viewBox="0 0 30 30"
                            fill="none"
                          >
                            <g clip-path="url(#clip0_135_355)">
                              <path
                                d="M15 30C13.5 30 12.375 28.75 11.5 27.75C11 27.25 10.5 26.625 10.25 26.5C9.875 26.375 9 26.375 8.375 26.375C7 26.5 5.5 26.5 4.5 25.5C3.5 24.5 3.5 22.875 3.625 21.625C3.625 20.875 3.75 20.125 3.5 19.75C3.375 19.375 2.75 18.875 2.25 18.5C1.25 17.625 0 16.5 0 15C0 13.5 1.25 12.375 2.25 11.5C2.75 11 3.375 10.5 3.5 10.25C3.625 9.875 3.625 9 3.625 8.375C3.5 7 3.5 5.5 4.5 4.5C5.5 3.5 7.125 3.5 8.375 3.625C9.125 3.625 9.875 3.75 10.25 3.5C10.625 3.375 11.125 2.75 11.5 2.25C12.375 1.25 13.5 0 15 0C16.5 0 17.625 1.25 18.5 2.25C19 2.75 19.5 3.375 19.75 3.5C20.125 3.625 21 3.625 21.625 3.625C23 3.5 24.5 3.5 25.5 4.5C26.5 5.5 26.5 7.125 26.375 8.375C26.375 9.125 26.25 9.875 26.5 10.25C26.625 10.625 27.25 11.125 27.75 11.5C28.75 12.375 30 13.5 30 15C30 16.5 28.75 17.625 27.75 18.5C27.25 19 26.625 19.5 26.5 19.75C26.375 20.125 26.375 21 26.375 21.625C26.5 23 26.5 24.5 25.5 25.5C24.5 26.5 22.875 26.5 21.625 26.375C20.875 26.375 20.125 26.25 19.75 26.5C19.375 26.625 18.875 27.25 18.5 27.75C17.625 28.75 16.5 30 15 30ZM9.375 23.875C10 23.875 10.625 24 11.25 24.125C12.125 24.5 12.875 25.25 13.5 26C14 26.625 14.75 27.375 15.125 27.375C15.5 27.375 16.25 26.625 16.75 26C17.375 25.25 18.125 24.5 19 24.125C19.875 23.75 21 23.75 22 23.875C22.75 23.875 23.75 24 24 23.75C24.25 23.5 24.125 22.5 24.125 21.75C24 20.75 24 19.625 24.375 18.75C24.75 17.875 25.5 17.125 26.25 16.5C26.75 16.125 27.5 15.375 27.5 15C27.5 14.625 26.75 13.875 26.125 13.375C25.375 12.75 24.625 12 24.25 11.125C23.875 10.25 23.875 9.125 24 8.125C24 7.375 24.125 6.375 23.875 6.125C23.625 5.875 22.625 6 21.875 6C20.875 6.125 19.75 6.125 18.875 5.75C18 5.375 17.25 4.625 16.625 3.875C16.125 3.25 15.375 2.5 15 2.5C14.625 2.5 13.875 3.25 13.375 3.875C12.75 4.625 12 5.375 11.125 5.75C10.25 6.125 9.125 6.125 8.125 6C7.375 6 6.375 5.875 6.125 6.125C5.875 6.375 6 7.375 6 8.125C6.125 9.125 6.125 10.25 5.75 11.125C5.375 12 4.625 12.75 3.875 13.375C3.25 13.875 2.5 14.625 2.5 15C2.5 15.375 3.25 16.125 3.875 16.625C4.625 17.25 5.375 18 5.75 18.875C6.125 19.75 6.125 20.875 6 21.875C6 22.625 5.875 23.625 6.125 23.875C6.375 24.125 7.375 24 8.125 24C8.5 24 8.875 23.875 9.375 23.875ZM13.75 20.5L9.125 15.875L10.875 14.125L13.75 17L20.375 10.375L22.125 12.125L13.75 20.5Z"
                                fill="white"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_135_355">
                                <rect width="30" height="30" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                        </div>
                      </div>
                      <div className="total-projects ms-3">
                        <h3 className={`count text-success`}>78</h3>
                        <span>COMPLETED</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-12 col-sm-12">
                <div className="card dashboard-card">
                  <div className="card-body">
                    <div id="chart" className="line-chart-style bar-chart">
                      <ReactApexChart
                        options={opations}
                        series={series}
                        type="bar"
                        height={300}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Screen;
