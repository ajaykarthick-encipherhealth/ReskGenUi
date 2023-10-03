// import axios from 'axios';

// import ENDPOINTS from '../utility/enpoints';
// axios.defaults.baseURL = 'http://13.68.177.51:8081/ai/';


//   axios.interceptors.request.use((config) => {    
//     let _list = 'auth/login'
//     const currentUrl = config?.url;
//     if(_list !== currentUrl) {
//       config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
//     }
//     return config;
//   }, (error) => {
//         console.log(error)
//   })
  
//   axios.interceptors.response.use(function (response) {    
//     return response;
//   }, function (error) {
    
//     const statusCode = error?.response?.status

//     if(statusCode === 500) {
 
//     }
//     if(statusCode === 401) {
   
//     }
//     return Promise.reject(error);
//   });

//   export default axios;