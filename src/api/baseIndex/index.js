
import axios from 'utils/request'

//获取IOT节点状态
export function GetIOTStatus() {
  return axios({
    url: "/IoTControl/GetIoTStatus",
    method: "get"
  })
}
//启动IOT节点
export function StartIOT() {
  return axios({
    url: '/IoTControl/StartIoT',
    method: 'put'
  })
}
//停止IOT节点
export function StopIOT() {
  return axios({
    url: '/IoTControl/StopIoT',
    method: 'put'
  })
}
//重新启动IOT节点
export function RestartIoT() {
  return axios({
    url: '/IoTControl/RestartIoT',
    method: 'put'
  })
}