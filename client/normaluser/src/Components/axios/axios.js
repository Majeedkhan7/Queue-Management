import axios from 'axios'
import { toast } from 'react-toastify';

// Add a request interceptor
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    config.headers['authorization']=localStorage.getItem('normaluserjwt')
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

  
// Add a response interceptor
axios.interceptors.response.use(function (response) {
    return response;
  }, function (error) {

    if(error.response.status === 500){
      return toast.error(error.response.data)
     }
     if(error.response.status === 401){
      localStorage.clear()
      window.location="/";
     }
    return Promise.reject(error);
  });

  export default axios