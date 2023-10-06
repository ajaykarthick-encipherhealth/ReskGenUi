import React, { useContext  } from "react";
import { useDispatch, useSelector } from "react-redux";
/// React router dom
import {  Routes, Route, Outlet, Navigate  } from "react-router-dom";

import { ThemeContext } from "../context/ThemeContext";

/// Css
import "../main-css/index.css";
import "../main-css/chart.css";
import "../main-css/step.css";
import "../main-css/custom.css";

import Nav from "../jsx/layouts/nav";
import Footer from "../jsx/layouts/Footer";
import ScrollToTop from "../jsx/layouts/ScrollToTop";



// Admin

/// Dashboard
import Dashboard from "../screens/admin/dashboard/dashboard";

// User
import UserList from "../screens/admin/user-management/user-list";

// Patient
import PatientList from "../screens/admin/patient/patient-list";

// FileManagement

import FileManagement from "../screens/admin/file-management/file-management";
import FileView from "../screens/admin/file-management/file-view";


// Physican
import Dashboard2 from "../screens/physican/dashboard/dashboard";
import PhysicanPatientList from "../screens/physican/patient/patient-list";
import SummaryDetails from "../screens/physican/patient/summary-details";
import PatientDocumentView from "../screens/physican/patient/patient-document-view";






const allroutes = [
    // Admin
      { url: "", component: <Dashboard /> },     
      { url: "/dashboard2", component: <Dashboard /> }, 
      { url: "/user-list", component: <UserList /> },     
      // { url: "/patient-list", component: <PhysicanPatientList /> },   
      { url: "/file-management", component: <FileManagement /> }, 
      { url: "/file-view", component: <FileView /> },   
      
      // Physican
      { url: "/dashboard", component: <Dashboard2 /> }, 
      { url: "/patient-list", component: <PhysicanPatientList /> },
      { url: "/summary-details", component: <SummaryDetails /> },
      { url: "/document-view", component: <PatientDocumentView /> },

  ];
  
   
    function NotFound(){    
        return <Navigate to="/dashboard" />; 
        
    //   if(url.indexOf(path) <= 0){     
    //     return <Error404 />
    //   }
    }
  
  
  
  const Markup = () => {   
    
     
      return (
        <>
            <Routes>   
            {/* <Route exact path="/" component={NotFound} />            */}
                 <Route  element={<MainLayout />} > 
                    {allroutes.map((data, i) => (
                      <Route
                        key={i}
                        exact
                        path={`${data.url}`}
                        element={data.component}
                      />
                      ))}
                </Route>                
                <Route path='*' element={<NotFound/>} />     
            </Routes>     
            <ScrollToTop />
            
        </>
      );       
  };
  
  
    function MainLayout(){
      const { menuToggle , sidebariconHover} = useContext(ThemeContext);
  
      const dispatch = useDispatch();
      const sideMenu = useSelector(state => state.sideMenu);
      // const handleToogle = () => {
      //   dispatch(navtoggle());
      // };
      return (
        <div id="main-wrapper" className={`show ${sidebariconHover ? "iconhover-toggle": ""} ${ sideMenu ? "menu-toggle" : ""}`}>  
            <Nav />
            <div className="content-body" style={{ minHeight: window.screen.height - 45 }}>          
              <Outlet />   
            </div>
          <Footer />
        </div>
      )
    };
  
  
  
  export default Markup;