import axios from 'axios'
import { toast } from 'react-toastify';


// Add a request interceptor
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    config.headers['authorization']=localStorage.getItem('counterjwt')
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, function (error) {

   if(error.response.status === 500){
    return toast.error(error.response.data)
   }
   if(error.response.status === 401){
    localStorage.clear()
    window.location="/";
   }

    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });

  export default axios