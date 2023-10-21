import axios from 'axios';
import LoadingSpinner from "../jsx/components/spinner/spinner";

import ENDPOINTS from '../utility/enpoints';
import Swal from 'sweetalert2'

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
    return response;
  }, function (error) {
    console.log(error)
    
    const statusCode = error?.response?.status;
    

    if(statusCode === 500) {
      Swal.fire({
        title: 'Internal Server Error!',
        text: 'Please Contact Admin',
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
        text: 'Please Contact Admin',
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
        title: 'Error!',
        text: 'Access Denied',
        icon: 'error',
        confirmButtonText: 'Logout',
        confirmButtonColor: "#DD6B55",
        closeOnConfirm: false
      }).then((result) => { 
        if (result.isConfirmed) {
           window.location = "/userlogin"
          } 
      })
   
    }
    return Promise.reject(error);
  });

  export default axios;