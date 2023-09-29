import React, { useContext  } from "react";
import { useDispatch, useSelector } from "react-redux";
/// React router dom
import {  Routes, Route, Outlet, Navigate  } from "react-router-dom";

import { ThemeContext } from "../context/ThemeContext";

/// Css
import "../main-css/index.css";
import "../main-css/chart.css";
import "../main-css/step.css";

import Nav from "../jsx/layouts/nav";
import Footer from "../jsx/layouts/Footer";
import ScrollToTop from "../jsx/layouts/ScrollToTop";



/// Dashboard
import Dashboard from "../screens/admin/dashboard/dashboard";

// Patient
import PatientList from "../screens/admin/patient/patient-list";

// FileManagement

import FileManagement from "../screens/admin/file-management/file-management";


const allroutes = [
    // Dashboard
      { url: "", component: <Dashboard /> },     
      { url: "/dashboard", component: <Dashboard /> },     
      { url: "/patient-list", component: <PatientList /> },   
      { url: "/file-management", component: <FileManagement /> },     
  

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