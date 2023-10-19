import axios from 'axios';
import LoadingSpinner from "../jsx/components/spinner/spinner";

import ENDPOINTS from '../utility/enpoints';
// axios.defaults.baseURL = ENDPOINTS.apiEndoint;


  axios.interceptors.request.use((config) => {    
    let _list = ['/admin/login','/securityservice/auth/organization/create']
    const currentUrl = config?.url?.split('/secure')[1]

    console.log(currentUrl)
    // if(!_list.includes(currentUrl)) {
    //   config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    // }
    return config;
  }, (error) => {
        console.log(error)
  })
  
  axios.interceptors.response.use(function (response) { 
    return response;
  }, function (error) {
    
    const statusCode = error?.response?.status

    if(statusCode === 500) {
 
    }
    if(statusCode === 401) {
   
    }
    return Promise.reject(error);
  });

  export default axios;