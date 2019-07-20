import Vue from 'vue'
import axios from 'axios'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 在Vue上 挂载一个 $http 以便于发送 axios 请求

axios.interceptors.request.use(function (config) {
  config.headers.common['Authorization'] = sessionStorage.getItem('token')
  return config
}) 

Vue.prototype.$http = axios