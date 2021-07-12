import axios from 'utils/request'

//获取用户列表
export function GetUserList(argKeyWord) {
  return axios({
    url: '/UserManage/Query',
    params: argKeyWord,
    method: 'get'
  })
}
//添加用户
export function AddUser(data) {
  return axios({
    url: '/UserManage/AddUser',
    data,
    method: 'put'
  })
}
//修改用户
export function UpdateUser(data) {
  return axios({
    url: "/UserManage/UpdateUser",
    data,
    method: "put"
  })
}
//删除用户
export function DeleteUser(data) {
  return axios({
    url: '/UserManage/DeleteUser',
    data,
    method: 'delete'
  })
}
//修改密码
export function UpdateUserPassword(data) {
  return axios({
    url: "/UserManage/UpdateUserPassword",
    data,
    method: "put"
  })
}