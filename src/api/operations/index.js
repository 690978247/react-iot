import axios from 'utils/request'

//获取远程运维信息
export function GetRemote() {
  return axios({
    url: "/Remote",
    method: 'get'
  })
}

//更新远程运维信息
export function PutRemote(data) {
  return axios({
    url: "/Remote",
    data:data,
    method: 'put'
  })
}