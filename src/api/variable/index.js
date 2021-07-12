import axios from 'utils/request'

//获取整棵设备列表树结构
export function GetTreeStructure() {
  return axios({
    url: '/VariableManage/GetTreeStructure',
    method: 'get'
  })
}
export function GetTreeStructure2() {
  return axios({
    baseURL:"https://www.fastmock.site/mock/252af95046512548bd771bcf6a08b05b/src_iot",
    url: '/equList',
    method: 'get'
  })
}
//修改节点排序
export function SortTreeNode(data){
  return axios({
    url: "/VariableManage/SortTreeNode",
    data,
    method: "put"
  })
}
//获取设备
export function GetDevice(deviceId){
  return axios({
    url: '/VariableManage/GetDevice',
    params: {
      deviceId
    },
    method: 'get'
  })
}
//添加设备
export function AddDevice(data) {
  return axios({
    url: '/VariableManage/AddDevice',
    data, 
    method: 'post',
  })
}
//修改设备信息
export function ModifyDevice(data) {
  return axios({
    url: '/VariableManage/ModifyDevice',
    data,
    method: 'put'
  })
}
//删除设备
export function DeleteDevice(id) {
  return axios({
    url: "/VariableManage/DeleteDevice",
    data: {
      id
    },
    method: 'delete',
  })
}
//添加分组
export function AddGroup(data) {
  return axios({
    url: '/VariableManage/AddGroup',
    data,
    method: 'post'
  })
}
//修改分组
export function ModifyGroup(data) {
  return axios({
    url: '/VariableManage/ModifyGroup',
    data,
    method: 'put'
  })
}
//删除分组
export function DelGroup(id) {
  return axios({
    url: '/VariableManage/DeleteGroup',
    data: {
      id
    },
    method: 'delete'
  })
}
//查询变量
export function QueryTags(data) {
  return axios({
    url: "/VariableManage/QueryTags",
    params: data,
    method: 'get'
  })
}
//导出
export function ExportTags(data){
  return axios({
    url: '/VariableManage/ExportTags',
    params: data,
    responseType:'blob',
    method: 'get'
  })
}
//导入
export function ImportFile(data) {
  return axios({
    url: `/VariableManage/ImportTags?nodeId=${data.nodeId}&type=${data.type}`,
    method: 'post',
    data: data.formData,
    processData: false, //不处理发送的数据
    contentType: false, //不设置Content-Type请求头
  })
}

//获取导入变量的任务状态
export function GetImportTagsTaskProgress(id) {
  return axios({
    url: "/VariableManage/GetImportTagsTaskProgress",
    method: "get",
    params: {
      id
    }
  })
}

//初次加载变量
export function InitTags(data) {
  return axios({
    url: "/VariableManage/InitTags",
    params: data,
    method: 'get'
  })
}
export function GetNextPageTags(nodeId) {
  return axios({
    url: "/VariableManage/GetNextPageTags",
    params: {
      nodeId
    },
    method: "get"
  })
}
//校验变量名是否格式正确、重复
//params: object
export function VerifyTagName(params) {
  return axios({
    url: "/VariableManage/VerifyTagName",
    params,
    method: 'get'
  })
}
//校验IO变量地址是否合法
//params: object
export async function VerifyAddress(params) {
  return await axios({
    url: "/VariableManage/VerifyAddress",
    params,
    method: 'get'
  })
}
//校验最大值是否合法
//params: object
export function VerifyMax(params) {
  return axios({
    url: "/VariableManage/VerifyMax",
    params,
    method: 'get'
  })
}
//校验最小值是否合法
//params: object
export function VerifyMin(params) {
  return axios({
    url: "/VariableManage/VerifyMin",
    params,
    method: 'get'
  })
}
//获取地址编辑信息
//params: object
export function GetAddressEditInfo(params) {
  return axios({
    url: "/VariableManage/GetAddressEditInfo",
    params,
    method: 'get'
  })
}

//保存变量
//data: object
export function SaveTags(data) {
  return axios({
    url: "/VariableManage/SaveTags",
    data,
    method: 'post'
  })
}
//获取保存变量任务状态
//id: string
export function GetSaveTagsTaskProgress(id) {
  return axios({
    url: "/VariableManage/GetSaveTagsTaskProgress",
    params: {
      id
    },
    method: 'get'
  })
}
//删除变量
//ids: Array
export function DeleteTags(data) {
  return axios({
    url: '/VariableManage/DeleteTags',
    data: data,
    method: 'delete'
  })
}

//获取设备状态
export function GetDeviceStatus() {
  return axios({
    url: '/IoTControl/GetDeviceStatus',
    method: 'get'
  })
}

//启动设备
export function StartDevice(id) {
  return axios({
    url: '/IoTControl/StartDevice',
    data: {
      id
    },
    method: 'put'
  })
}

//停止设备
export function StopDevice(id) {
  return axios({
    url: '/IoTControl/StopDevice',
    data: {
      id
    },
    method: 'put'
  })
}

//重启设备
export function RestartDevice(id) {
  return axios({
    url: '/IoTControl/RestartDevice',
    data: {
      id
    },
    method: 'put'
  })
}

//测试OPC_UA连接
export function TestOPCUaConnect(params) {
  return axios({
    url: '/VariableManage/TestOPCUaConnect',
    params,
    method: 'get'
  })
}

//获取OPC_UA节点
export function GetOPCUaNodes(nodeId) {
  return axios({
    url: '/VariableManage/GetOPCUaNodes',
    params: {
      nodeId
    }, 
    method: 'get'
  })
}
//获取OPC_UA节点
export function InitOPCUaWindows(params) {
  return axios({
    url: '/VariableManage/InitOPCUaWindows',
    params,
    method: 'get'
  })
}

//关闭OPC_UA变量选择弹窗
export function CloseOPCUaWindows() {
  return axios({
    url: "/VariableManage/CloseOPCUaWindows",
    method: 'put'
  })
}