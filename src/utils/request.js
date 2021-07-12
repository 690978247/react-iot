import { message } from 'antd'
import axios from 'axios'
import {getCookie, setCookie} from 'utils'
// import { Route, Redirect } from 'react-router-dom'

const service = axios.create({
  // baseURL: "/api",
  baseURL: "http://localhost:3000/api1/api",
  timeout: 5000,
  async: true,
  //允许跨域
  crossDomain: true, 
})

service.interceptors.request.use(
  config => {
    let token = getCookie("accessToken")
    let url = config.url
    if (url.substring(1, 6) === "Login") {
      return config;
    } else {
      if (token) {
        config.headers['Authorization'] = token;
      } else if(token === ""){
        setCookie("login", -1)
      }
      return config;
    }
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.Code === 4002) {
      setCookie('login', '', -1)
      // message.error("登录失效，请重新登录")
      return []
    } else {
      return res
    }
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          setCookie('login', '', -1)
          // message.error("登录失效，请重新登录")
          break;
        case 504:
          message.error("服务器未响应")
          break;
        default:
          break;
      }
    }
    return Promise.reject(error.response.data)
  }
)

export default service
