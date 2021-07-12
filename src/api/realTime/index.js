import axios from 'utils/request'

//进入页面
export function EnterPage() {
  return axios({
    url: "/RealTimeMonitor/EnterPag",
    method: 'put'
  })
}

//离开页面
export function LeavePage() {
  return axios({
    url: "/RealTimeMonitor/LeavePag",
    method: 'put'
  })
}

//选择变量组事件
export function InitTags(data) {
  return axios({
    url: "/RealTimeMonitor/InitTags",
    data,
    method: 'post'
  })
}

//查询变量
export function QueryTags(data) {
  return axios({
    url: "/RealTimeMonitor/QueryTags",
    data,
    method: 'post'
  })
}

//获取下一页变量
export function GetNextPageTags(data) {
  return axios({
    url: "/RealTimeMonitor/GetNextPageTags",
    data,
    method: 'post'
  })
}

//测试Signalr
export function SetSignalr() {
  return axios({
    url: "/Test/SetSignalr",
    method: 'get'
  })
}