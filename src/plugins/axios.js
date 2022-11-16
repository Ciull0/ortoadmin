import Vue from 'vue';
import axios from 'axios'
import VueAxios from 'vue-axios'

axios.interceptors.request.use(request => {
  let userToken=localStorage.getItem('userToken');
  if (userToken) {
      request.headers.Authorization = `${userToken}`;
  }

  return request;
});

axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {

  if (error.response && 401 === error.response.status) {
    document.location.href="/#/login";
  } else {
    
        return Promise.reject(error);
    }});



export default function configAxios(){
    Vue.use(VueAxios, axios);
};