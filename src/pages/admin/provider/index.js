import React, { useState, useRef, useEffect, useContext } from "react";
import { Button } from "react-bootstrap";
import axios from "../../../utility/axiosConfig";
import ENDPOINTS from "../../../utility/enpoints";
import { Offcanvas } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Select from "react-select";
import Header from "../../../jsx/layouts/nav/Header";
import { useSelector } from "react-redux";
import { ThemeContext } from "../../../context/ThemeContext";
import { Avatar, Switch } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { AntDesignOutlined, UserOutlined } from '@ant-design/icons';


const UserList = () => {
  // const { sidebariconHover} = useContext(ThemeContext);

  const sideMenu = useSelector((state) => state.sideMenu);

  const [validated, setValidated] = useState(false);
  const [userList, setUserList] = useState([]);
  const [userListAll, setUserListAll] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [addUser, setAddUser] = useState(false);

  const recordsPage = 10;
  const lastIndex = currentPage * recordsPage;
  const firstIndex = lastIndex - recordsPage;

  const [npage, setNPage] = useState("");
  const [number, setNumber] = useState([]);
  const [records, setRecords] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isStatus, setStatus] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
  });

  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageOptions, setPageOptions] = useState(0);
  const [canPreviousPage, setCanPreviousPage] = useState(false);
  const [canNextPage, setCanNextPage] = useState(true);
  const [canMaxPage, setCanMaxPage] = useState(10);

  useEffect(() => {
    console.log(sideMenu);
    getAllList();
  }, []);

  const getAllList = async () => {
    const response = await axios.get(ENDPOINTS.apiEndoint + "/patient/getall");
    console.log(response.data);
    if (response.data) {
      const records = response.data.slice(firstIndex, lastIndex);
      setUserListAll(response.data);
      setUserList(records);
      setRecords(records);
      const npage = Math.ceil(response.data.length / recordsPage);
      const number = [...Array(npage + 1).keys()].slice(1);
      setNPage(npage);
      setNumber(number);
      setIsDataLoading(false);
      setIsLoading(false);
    }
  };

  const addUserForm = () => {
    setValidated(false);
    setAddUser(true);
  };

  const handleChange = async (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === true) {
      console.log(formData);
      // postPatient(formData);
    }
    setValidated(true);
  };
  const postPatient = async (data) => {
    setIsLoading(true);
    const response = await axios.post(ENDPOINTS.apiEndoint + `patient`, data);
    if (response?.status == 200) {
      setAddUser(false);
      getAllList();
    } else {
    }
  };
  const roleUpdate = async (data) => {
    setIsLoading(true);
    const response = await axios.post(ENDPOINTS.apiEndoint + `patient`, data);
    if (response?.status == 200) {
      setAddUser(false);
      getAllList();
    } else {
    }
  };

  const options3 = [
    { value: "1", label: "ALL" },
    { value: "2", label: "Enabled" },
    { value: "3", label: "Disabled" },
  ];
  const RoleList = [
    { value: "Coder(Level 1)", label: "Coder(Level 1)" },
    { value: "Coder(Level 2)", label: "Coder(Level 2)" },
    { value: "Auditor", label: "Auditor" },
    { value: "Team Lead", label: "Team Lead" },
  ];

  function gotoPage(number) {
    if (canMaxPage > number) {
      setCanNextPage(true);
      setPageIndex(number);
      if (number > 0) {
        setCanPreviousPage(true);
      } else {
        setCanPreviousPage(false);
      }
      setPageCount(number);
    } else {
      setCanNextPage(false);
    }
    var start = number * 10;
    var end = start + 10;
    const records = userListAll.slice(start, end);
    setUserList(records);
  }
  function nextPage(number) {
    if (canMaxPage > number) {
      setPageCount(number);
      setPageIndex(number);
      setCanPreviousPage(true);
    } else {
      setCanNextPage(false);
    }
    var start = number * 10;
    var end = start + 10;
    const records = userListAll.slice(start, end);
    setUserList(records);
  }

  function previousPage(number) {
    setCanNextPage(true);
    setPageIndex(number);
    if (number > 0) {
      setCanPreviousPage(true);
    } else {
      setCanPreviousPage(false);
    }
    setPageCount(number);
    var start = number * 10;
    var end = start + 10;
    const records = userListAll.slice(start, end);
    setUserList(records);
  }

  const roleChange = async (e) => {
    console.log(e.value);
    var data = {};
    data.role = e.value;
    console.log(data);
    // roleUpdate(data);
  };

  const switchHandler = (event, id) => {
    const isChecked = event;
    setStatus(({ isStatus }) => ({
      isStatus: {
        ...isStatus,
        [id]: isChecked,
      },
    }));

    console.log(isStatus);
  };
  const cardsData = [
    { id: 1, title: "Provider 1", buttonLabel: 'Select Provider ', avatarSrc: 'avatar2.jpg'  },
    { id: 2, title: "Provider 2" , buttonLabel: 'Select Provider ', avatarSrc: 'avatar2.jpg' },
    { id: 3, title: "Provider 3", buttonLabel: 'Select Provider ', avatarSrc: 'avatar2.jpg'  },
    { id: 4, title: "Provider 4", buttonLabel: 'Select Provider ', avatarSrc: 'avatar2.jpg' },
    { id: 5, title: "Provider 5", buttonLabel: 'Select Provider ', avatarSrc: 'avatar2.jpg'  },
    { id: 6, title: "Provider 6" , buttonLabel: 'Select Provider ', avatarSrc: 'avatar2.jpg' },
    { id: 7, title: "Provider 7" , buttonLabel: 'Select Provider ', avatarSrc: 'avatar2.jpg' },
    { id: 8, title: "Provider 8" , buttonLabel: 'Select Provider ', avatarSrc: 'avatar2.jpg' },
    { id: 9, title: "Provider 9" , buttonLabel: 'Select Provider ', avatarSrc: 'avatar2.jpg' },
    { id: 10, title: "Provider 10" , buttonLabel: 'Select Provider ', avatarSrc: 'avatar2.jpg' },
    { id: 11, title: "Provider 11", buttonLabel: 'Select Provider ', avatarSrc: 'avatar2.jpg'  },
    { id: 12, title: "Provider 12" , buttonLabel: 'Select Provider ', avatarSrc: 'avatar2.jpg' },
   
  
   
    // Add data for the other cards
  ];

  return (
    <>
      <div className={`show ${sideMenu ? "menu-toggle" : ""}`}>
        <Header />
        <div className="content-body show menu-toggle no-sidebar">
          <div className="container-fluid">
            <div className="page-title-card">
              <div className="page-titles column">
                <div>
                  <ol className="breadcrumb">
                    <li>
                      <h5 className="bc-title">Providers</h5>
                    </li>
                  </ol>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Name"
                    name="name"
                    className="form-control"
                    required
                  />
                </div>
                <div>
                  <button
                    className="btn btn-primary sw-btn-next ms-1"
                    onClick={() => FinalStepSubmit(5)}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div className="row" style={{ marginTop: "3pc" }}>
              {cardsData.map((card) => (
                <div
                  key={card.id}
                  className="col-12 col-md-4 col-lg-4 col-xl-2"
                >
                  <div className="card">
                    <div className="card-body">
                    <div style={{ display:"flex", justifyContent:'center',alignItems:'center', margin:'2pc' }}>
                      <Avatar
    size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
    icon={<AntDesignOutlined />}
  />

                      </div>
                      <div
                        style={{
                          marginBottom: "20px",
                          color: "#000",
                          fontSize: "26px",
                          fontWeight: "400",
                          display:"flex", justifyContent:'center',alignItems:'center', margin:'2pc' 
                        }}
                      >
                        {card.title}
                      </div>
                    
                      <div>
                        {" "}
                        <button
                          className="btn btn-primary sw-btn-next ms-1  btn-block"
                          onClick={() => FinalStepSubmit(5)}
                          style={{
                            backgroundColor: "#241571",
                            borderRadius: "10px",
                          }}
                        >
                          {card.buttonLabel}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserList;
