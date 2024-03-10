const axios = require('axios');
import LoadingSpinner from "../jsx/components/spinner/spinner";

import ENDPOINTS from '../utility/enpoints';
import Swal from 'sweetalert2';
import { notification } from 'antd';


// axios.defaults.baseURL = ENDPOINTS.apiEndoint;


  axios.interceptors.request.use((config) => {    
    let _list = ['/securityservice/auth/admin/login','/securityservice/auth/organization/create','/securityservice/auth/login']
    const currentUrl = config?.url?.split('/secure')[1]

    // console.log(currentUrl)
    if(!_list.includes(currentUrl)) {
      config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;    }
    return config;
  }, (error) => {
        console.log(error)
  })
  
  axios.interceptors.response.use(function (response) { 
    // console.log(response)
    //  notification.success({
    //   message: response.data.message,
    // });
    return response;
  }, function (error) {
    
    
    const statusCode = error?.response?.status;
       
    const methodName = error?.config?.method;


    

    if(statusCode === 500) {
      Swal.fire({
        title: 'Internal Server Error!',
        text: error?.response?.data.message,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: "#DD6B55",
        closeOnConfirm: false
      }).then((result) => { 
        if (result.isConfirmed) {
         
          } 
      })
 
    }
    if(statusCode === 503) {
      Swal.fire({
        title: 'Service Unavailable!',
        text: error?.response?.data.message,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: "#DD6B55",
        closeOnConfirm: false
      }).then((result) => { 
        if (result.isConfirmed) {
         
          } 
      })
 
    }
    if(statusCode === 400) {
      Swal.fire({
        title: 'Bad Request!',
        text: error?.response?.data.message,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: "#DD6B55",
        closeOnConfirm: false
      }).then((result) => { 
        if (result.isConfirmed) {
         
          } 
      })
 
    }
    if(statusCode === 401) {
      Swal.fire({
        title: '',
        text: 'Your session has timed out. Please log in again.',
        icon: 'warning',
        confirmButtonText: 'Logout',
        confirmButtonColor: "#DD6B55",
        closeOnConfirm: false
      }).then((result) => { 
        if (result.isConfirmed) {
           window.location = "/login"
          } 
      })
   
    }
    return Promise.reject(error);
  });

  export default axios;