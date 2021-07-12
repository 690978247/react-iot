import React, { PureComponent } from 'react'
import { Modal, message, Spin } from "antd"
import PubSub from "pubsub-js";
import $ from "jquery"

import DrowDownMenu from 'components/common/DrowDownMenu'
import ZTree from 'components/common/Ztree'
import EditableTable from 'components/common/DataTable'

import AddEqu from './components/AddEqu'
import AddGroupPane from './components/AddGroup'
import Search from './components/Search'
import AddressConfig from './components/AddressConfig'
import OpcConfig from './components/AddressConfig/OpcConfig'

import { downFile, deepClone, isFit } from "utils";

import {
  AddDevice, ModifyDevice, AddGroup, ModifyGroup,
  GetTreeStructure, GetDevice, DeleteDevice, DelGroup,
  InitTags, GetNextPageTags, QueryTags, SaveTags, ExportTags, DeleteTags,
  GetSaveTagsTaskProgress, ImportFile, GetImportTagsTaskProgress, GetAddressEditInfo,
  SortTreeNode, TestOPCUaConnect, CloseOPCUaWindows,
  GetDeviceStatus,StartDevice,StopDevice
} from 'api/variable'

let deviceStatusTimer = null;
let getProcessTimer = null;
class RealTime extends PureComponent{
  state = {
    loading: false, //保存时显示加载中
    treeData: [],//设备树数据
    dataSource: [], //表格的变量列表数据
    gist: [],//表格的变量列表数据参考对象
    dataTypes: [], //查询的数据类型
    total: 0, //正常加载显示的数量
    count: 0, //总数
    collasped: false,
    selectedRowKeys: [],
    //添加设备
    visible: false, //弹窗显示隐藏
    title: "",//弹窗标题
    modalContent: "",//弹窗内容
    node: {},//当前显示的变量对象
    activeNode: "", //当前显示变量列表的节点ID
    activeNodeName: "",//当前显示变量列表的节点名称
    activeNodeType: 0, //当前显示变量列表的节点类型
    tableDataTypes: [],
    modifyTagsList: [],
    fileList: [],
    canSubmit: {},
    tableLoading: false,
    pageIndex: 0, //当前页面
    selectedKeys: [],
    opcConfigVisible: false,
    opcConfigContent: "",
    preTime: 0,
    nowTime: ""
  }
  searchRef = React.createRef();
  componentDidMount() {
    this.getTreeStructure();
    PubSub.subscribe("modifyTags", (msg, data) => {
      this.setState({modifyTagsList: data})
    })
    PubSub.subscribe("canSubmit", (msg, data) => {
      this.setState({canSubmit: data})
    })

    this.getDeviceStatus();
    deviceStatusTimer = setInterval(() => {
      this.getDeviceStatus();
    }, 5000)
  }
  componentWillUnmount() {
    clearInterval(deviceStatusTimer)
    clearInterval(getProcessTimer)
    //取消订阅
    PubSub.unsubscribe("modifyTags")
    PubSub.unsubscribe("canSubmit")
  }
  getDeviceStatus = () =>{
    GetDeviceStatus().then(res => {
      PubSub.publish("deviceStatus", res.data)
    })
  }

  //获取整棵设备列表树结构
  getTreeStructure = () => {
    GetTreeStructure().then(res => {
      // console.log("设备树：",res.data)
      this.setState({treeData: res.data})
    })
  }

  //收缩设备列表
  toggleLeft = ()=>{
    const collapsed = !this.state.collasped
    this.setState({collasped: collapsed})
  }

  //设备树操作菜单
  zTreeOptionMenu = (
    <DrowDownMenu lists={[
        {
          key: "addDevice",
          name: "添加设备",
        },
        {
          key: "addGroup",
          name: "添加分组",
      }, {
          key: "allExport",
          name: "整体导出"
        }
      ]}
      onClick={(e) => {
        e.domEvent.stopPropagation();
        this.menuClick(e)
      }}
    />
  )
  //操作内部变量菜单
  interVariable = (el) => {
    return (
      <DrowDownMenu lists={[
        {
          key: "overallExport",
          name: '整体导出',
        }
      ]}
      onClick={(e) => {
        // console.log(el)
        e.domEvent.stopPropagation();
        this.menuClick(e, el)
      }}
    />
    )
  }
  //操作设备菜单
  optionDeviceMenu = (el, length)=> {
    return (
      <DrowDownMenu lists={[
        {
          key: "startDevice",
          name: "启用",
        },
        {
          key: "stopDevice",
          name: "停止",
        },
        {
          key: "modifyDevice",
          name: "编辑设备",
        },
        {
          key: "delDevice",
          name: "删除设备",
        },
        {
          key: "overallExport",
          name: '整体导出',
        }
      ]}
      onClick={(e) => {
        // console.log(el)
        e.domEvent.stopPropagation();
        this.menuClick(e, el, length)
      }}
    />
    )
  }
  //操作分组菜单
  optionGroupMenu = (el)=> {
    return (
      <DrowDownMenu lists={[
        {
          key: "modifyGroup",
          name: "编辑分组",
        },
        {
          key: "delGroup",
          name: "删除分组",
        }
      ]}
        onClick={(e) => {
        e.domEvent.stopPropagation();
        this.menuClick(e, el)
      }}
      />
    )
  }

  handleCancel = ()=>{
    this.setState({visible: false})
  }
  opcConfigCancel = () => {
    this.setState({ opcConfigVisible: false }, () => {
      //关闭OPC_UA变量选择弹窗，断开连接
      CloseOPCUaWindows().then(res => {
      })
    })
  }
  confirm = (content,callback)=> {
    Modal.confirm({
      title: '注意',
      content: content,
      okText: '确认',
      cancelText: '取消',
      onOk: callback
    });
  }

  //添加设备提交函数
  onAddDeviceFinish = val => {
    const list = ["id", "name", "desc", "nodeType", "protocolName", "supplier", "model"]
    //数据二次处理
    const equObj = { params: {} }
    for (let key in val) {
      if (list.indexOf(key) < 0) {
        if (key === "StrByteOrder1") {
          equObj.params.StrByteOrder = val[key] ? "True" : "False"
        } else {
          equObj.params[key] = val[key]
        }
      } else {
        equObj[key] = val[key]
      }
    }
    if (val.id === "00000000-0000-0000-0000-000000000000") {
      AddDevice(equObj).then(res => {
        if (res.code === 0) {
          this.handleCancel();
          this.getTreeStructure();
          message.info("新增成功");
        } else {
          message.error("新增失败。" + res.msg)
        }
      })
    } else {
      ModifyDevice(equObj).then(res => {
        if (res.code === 0) {
          this.handleCancel();
          this.getTreeStructure();
          message.info("编辑成功")
        } else {
          message.error("编辑失败。" + res.msg)
        }
      })
    }
  }
  
  //opc_ua协议测试连接
  connetTest = (val) => {
    TestOPCUaConnect(val).then(res => {
      if (res.code === 0) {
        message.info("连接成功")
      } else {
        message.error(res.msg)
      }
    })
  }

  //添加分组提交函数
  onAddGroupFinish = (val) => {
    if (val.groupId === "00000000-0000-0000-0000-000000000000") {
      AddGroup(val).then(res => {
        if (res.code === 0) {
          this.setState({
            visible: false
          }, () => {
            this.getTreeStructure();
            message.info("新增成功")
          })
        } else {
          message.error("新增失败。" + res.msg)
        }
      })
    } else {
      ModifyGroup(val).then(res => {
        if (res.code === 0) {
          this.setState({
            visible: false
          }, () => {
            this.getTreeStructure();
            message.info("编辑成功")
          })
        } else {
          message.error("编辑失败。" + res.msg)
        }
      })
    }
  }

  delDevice = (id) => {
    DeleteDevice(id).then(res=>{
      if(res.code === 0){
        this.getTreeStructure();
        message.info("删除成功") 
      }else{
        message.error(res.msg)
      }
    })
  }

  menuClick = (e, node, length)=>{
    if (e.key === "addDevice") {
      this.setState({
        visible: true, 
        title: "新增设备", 
        modalContent: <AddEqu key={ new Date()}
          onCancel={this.handleCancel}
          onFinish={this.onAddDeviceFinish}
          connetTest={this.connetTest} />
      })
    } else if (e.key === "modifyDevice") {
      GetDevice(node.nodeID).then(res=>{
        this.setState({
          visible: true, 
          title: "编辑设备", 
          modalContent: <AddEqu
            key={`modifyDevice + ${node.nodeID}`}
            node={res.data}
            onCancel={this.handleCancel}
            onFinish={this.onAddDeviceFinish}
            connetTest={ this.connetTest } />
        })
      })
    } else if(e.key === "delDevice"){
      if(length > 0){
        this.confirm('节点下有分组存在，删除将会跟随分组一起删除，无法恢复，是否继续?',()=>{
          this.delDevice(node.nodeID);
        })
      }else{
        this.delDevice(node.nodeID)
      }
    } else if (e.key === "allExport") {
      ExportTags({
        nodeId: "00000000-0000-0000-0000-000000000000",
        type: -1
      }).then(res => {
        downFile(res, "变量总列表.xls");
      })
    } else if (e.key === "overallExport") {
      ExportTags({
        nodeId: node.nodeID,
        type: node.nodeType
      }).then(res => {
        downFile(res, node.nodeName + ".xlsx");
      })
    }else if (e.key === "addGroup") {
      this.setState({
        visible: true, 
        title: "新增分组", 
        modalContent: <AddGroupPane key={new Date()}
          onCancel={this.handleCancel} 
          onFinish={this.onAddGroupFinish}/>
      })
    } else if (e.key === "modifyGroup") {
      console.log(node)
      this.setState({
        visible: true, 
        title: "编辑分组", 
        modalContent: <AddGroupPane
          key={node.groupId} node={node}
          onCancel={this.handleCancel}
          onFinish={this.onAddGroupFinish} />
      })
    } else if (e.key === "delGroup") {
      this.confirm('节点下有变量存在，删除将会跟随变量一起删除，无法恢复，是否继续?',()=>{
        DelGroup(node.groupId).then(res=>{
          if(res.code === 0){
            message.info("删除成功")
            this.getTreeStructure();
          }else{
            message.error(res.msg)
          }
        })
      })
    } else if (e.key === "startDevice") {
      StartDevice(node.nodeID).then(res =>{
        if (res.code === 0) {
          message.info("启动成功")
        } else {
          message.info(res.msg)
        }
      })
    } else if (e.key === "stopDevice") {
      StopDevice(node.nodeID).then(res =>{
        if (res.code === 0) {
          message.info("停止成功")
        } else {
          message.info(res.msg)
        }
      })
    }
  }
  //点击节点触发函数
  onSelect = (res, info) => {
    this.setState({selectedKeys: [info.node.key]})
    // console.log(this.state.modifyTagsList)
    let tags = {
      nodeId: info.node.key,
      type: info.node.nodeType
    }
    //当前节点存在未保存的变量，提示是否继续下面的操作
    if (this.state.modifyTagsList.length > 0) {
      this.confirm('当前节点存在未保存的变量，是否继续？',()=>{
        this.setState({modifyTagsList: []},()=>{
          this.initTagList(tags,info)
        })
      })
    } else {
      this.initTagList(tags,info)
    }
  }
  //初始加载变量列表
  initTagList = (tags, info = null) => {
    //重置查询
    this.searchRef.current.refs.formRef.setFieldsValue({
      dataType: "不限",
      key: "",
    })
    // let nodeName = info.node.nodeType === 1 ? info.selectedNodes[0].title : info.selectedNodes[0].title.props.children[0].props.children
    if (info) {
      this.setState({
        tableLoading: true,
        activeNode: info.node.key,
        // activeNodeName: nodeName,
        activeNodeType: info.node.nodeType,
        node: info.node
      })      
    } else {
      this.setState({
        tableLoading: true,
      })
    }
    InitTags(tags).then(res => {
      let dataList = [];
      this.setState({tableLoading: false})
      if (res.code === 0) {
        res.data.tags.forEach(element => {
          element.key = element.id
          dataList.push(element)
        });
        this.setState({
          dataSource: JSON.parse(JSON.stringify(dataList)),
          tableDataTypes: res.data.gridDataTypes,
          gist: JSON.parse(JSON.stringify(dataList)),
          count: res.data.total,
          total: res.data.total > 100 ? 100 : res.data.total,
          dataTypes: res.data.dataTypes,
          activeNode: tags.nodeId,
          activeNodeName: res.data.nodeName,
          activeNodeType: tags.type,
          modifyTagsList: [],
          pageIndex: 0
        })
      } else {
        message.info(res.msg)
      }
    })
  }

  handleSave = (dataIndex, val, row, flag = true) => {
    /**
     * 1、判断在modifyTags中存在，
     * 2、存在判断 新、旧（gist中对比）对象是否有一致，一致则在modifyTags中移除该对象
     * 3、不存在在加入
     */

    let index = -1;
    //判断是否已经存在
    let isHas = this.state.modifyTagsList.some((item, i) => {
      if (item.key === row.key) {
        index = i;
        return true
      }else {
        index = -1;
        return false
      }
    })

    this.setState(state => {
      if (isHas) {
        if (isFit(state.gist, row)) {//新旧对象一致,modifyTags移除该对象
          state.modifyTagsList.splice(index, 1)
        } else {
          state.modifyTagsList[index][dataIndex] = val
        }
      } else if (!flag) { //完善点击输入框，没有输入时的bug
        return
      }else {
        //否则添加
        state.modifyTagsList.push(row)
      }

      return {
        modifyTagsList: state.modifyTagsList
      }
    })
  };

  hintSave = (callback) => {
    if (this.state.modifyTagsList.length > 0) {
      Modal.confirm({
        title: "当前存在未保存的变量，确认继续将会被还原",
        okText: "确认",
        cancelText: "取消",
        onCancel: () => {
          //重置查询
          this.searchRef.current.refs.formRef.setFieldsValue({
            dataType: "不限",
            key: "",
          })
        },
        onOk: callback
      })
    } else {
      callback()
    }
  }
 
  //变量查询
  searchForm = (res) => {
    let queryCondition = {
      nodeId: this.state.activeNode,
      type: this.state.activeNodeType,
      dataType: res.dataType,
      key: res.key
    }
    this.hintSave(() => {
      this.queryTagsFun(queryCondition);
    })
  }
  queryTagsFun = (queryCondition) => {
    this.setState({ modifyTagsList: [] })
    $(".effective-editor").removeClass("effective-editor")
    QueryTags(queryCondition).then(res => {
      if (res.code === 0) {
        this.setState({dataSource: res.data.tags, count: res.data.total, gist: [...res.data.tags]})
      } else {
        message.error(res.msg)
      }
    })
  }
  //数据表格选中的项
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
    // this.setState({selectedRowKeys: [selectedRowKeys, selectedRows.id]})
  }
  //加载更多
  loadMore = () => {
    GetNextPageTags(this.state.activeNode).then(res => {
      this.setState((state) => {
        state.dataSource.splice(state.total, 0, ...res.data)
        state.dataSource.forEach((item, index) => {
          item.no = index+1
        })
        return {
          gist: JSON.parse(JSON.stringify([...state.gist, ...res.data])),
          dataSource: JSON.parse(JSON.stringify(state.dataSource)),
          total: state.total + res.data.length,
        }
      }, () => {
        // console.log(this.state.gist)
      })
    })
  }
  
  //导入导出菜单
  importMenu = (e) => {
    let tags = {
      nodeId: this.state.activeNode,
      type: this.state.activeNodeType
    }
    if (e.key === "currentTableExport") { //导出当前点表
      if (this.state.activeNode === "") {
        message.error("请选择要导出的节点")
      } else {
        ExportTags(tags).then(res => {
          downFile(res, "变量列表.xlsx");
          // downFile(res, `${this.state.activeNodeName}.xlsx`);
        })
      }
    } else if (e.key === "currentTableImport") { //导入当前点表
      if (this.state.activeNode === "") {
        message.error("请选择要导入的节点")
      } else {
        this.hintSave(() => {
          document.getElementById("importFile").click();
        })
      }
    }
  }

  //保存变量列表
  saveList = () => {
    // console.log(this.state.modifyTagsList)
    console.log(this.state.modifyTagsList)
    if(this.state.modifyTagsList.length === 0){
      message.warning("当前没有更改的内容")
      return;
    }
    // if (!this.state.canSubmit.canSubmit) {
    //   // console.log(this.state.canSubmit.message)
    //   message.error(this.state.canSubmit.message)
    //   return;
    // }
    console.log("---------------")
    let modifyList = []
    deepClone(this.state.modifyTagsList).map(item => {
      item.key = item.id
      modifyList.push(item)
      return "";
    })
    this.setState({loading: true})
    SaveTags({
      nodeId: this.state.activeNode,
      type: this.state.activeNodeType,
      dataTypes: [],
      tags: modifyList,
      total: 0
    }).then(res => {
      if (res.code === 0) {
        let timer = setInterval(()=>{
          //获取
          GetSaveTagsTaskProgress(res.data).then(val=>{
            //清除定时器,关闭加载中
            if (val.data.status === 2 || val.data.status === 3) {
              clearInterval(timer)
              if(val.data.message){
                message.info(val.data.message)
              }
              $("div").removeClass("effective-editor")
              // console.log(val)
        
              this.setState({modifyTagsList: []},()=>{
                this.setState({loading: false})
              })
              if (val.data.resultData !== null) {
                let { dataTypes, tree } = val.data.resultData
                if (dataTypes !== null) {
                  this.setState({ dataTypes: dataTypes})
                }
                if (tree !== null) {
                  this.setState({ treeData: tree})
                }
          
                this.initTagList({
                  nodeId: this.state.activeNode,
                  type: this.state.activeNodeType
                })
              }
              // console.log(this.state.modifyTagsList)
            }
          })
        }, 1000)
      }else{
        console.log(this.state.modifyTagsList)
        message.error(res.msg)
        this.setState({loading: false})
      }
    })
   
  }
  //重置变量列表
  resetTags = () => {
    this.initTagList({
      nodeId: this.state.activeNode,
      type: this.state.activeNodeType
    })
    //重置查询
    this.searchRef.current.refs.formRef.setFieldsValue({
      dataType: "不限",
      key: "",
    })
  }
  //新增变量
  addTags = () => {
    const { dataSource, count } = this.state;
    let tagObj = {
      key: `${count + 1}`,
      id: "00000000-0000-0000-0000-000000000000",
      no: count+1,
      name: "",
      desc: "",
      dataType: this.state.tableDataTypes[0],
      max: "",
      min: "",
      address: "",
      stringLength: "",
      zoom: "",
      editable: true
    }
    this.setState(state => {
      return {
        dataSource: [...dataSource, tagObj],
        count: count + 1,
        modifyTagsList: [...state.modifyTagsList, tagObj],
        canSubmit: {
          canSubmit: false,
          message: "变量名不可为空，请重新输入"
        }
      }
    }, () => {
      $(`#dataType${count+1}`).parent().parent().addClass("effective-editor")
    })
    PubSub.publish("modifyTags", [...this.state.modifyTagsList, tagObj])
  }
  //删除变量
  delTags = () => {
    let phyDel = [], //物理删除
      dataDel = []; //数据库删除
    // console.log(this.state.selectedRowKeys)
    this.state.selectedRowKeys.forEach((item, i) => {
      if (item.length !== 36) {
        phyDel.push(item)
      } else {
        dataDel.push(item)
      }
    })
    if (dataDel.length === 0 ) {
      if (phyDel.length > 0) {
        this.setState(state => {
          let targetObj = [...state.dataSource]
          let gist = [...state.gist]
          let modify = [...state.modifyTagsList]
          phyDel.forEach((id)=>{
            for (let i = 0; i < targetObj.length;i++){ 
              if (targetObj[i].key === id) {
                targetObj.splice(i, 1);
                break;
              }
            }
            //移除modifyTagsList中删除的变量
            for (let i = 0; i < modify.length; i++){
              if (modify[i].key === id) {
                modify.splice(i, 1);
                break;
              }
            }
          })
          
          targetObj.forEach((item,index) => {
            item.no = index+1
          })
          return {
            dataSource: [...targetObj],
            gist: [...gist],
            modifyTagsList: modify,
            count: state.count - phyDel.length
          }
        })
      }
      return ;
    }
    DeleteTags({
      ids: dataDel,
      type: this.state.activeNodeType
    }).then(res => {
      if (res.code === 0) {
        message.info("删除成功")
        this.setState((state) => {
          let targetObj = [...state.dataSource]
          let gist = [...state.gist]
          let modify = [...state.modifyTagsList]
          res.data.forEach((id) => {
            for (let i = 0; i < targetObj.length;i++){ 
              if (targetObj[i].key === id) {
                targetObj.splice(i, 1);
                gist.splice(i, 1);
                break;
              }
            }
            //移除modifyTagsList中删除的变量
            for (let i = 0; i < modify.length; i++){
              if (modify[i].key === id) {
                modify.splice(i, 1);
                break;
              }
            }
          })
          phyDel.forEach((id)=>{
            for (let i = 0; i < targetObj.length;i++){ 
              if (targetObj[i].key === id) {
                targetObj.splice(i, 1);
                break;
              }
            }
            //移除modifyTagsList中删除的变量
            for (let i = 0; i < modify.length; i++){
              if (modify[i].key === id) {
                modify.splice(i, 1);
                break;
              }
            }
          })
          targetObj.forEach((item,index) => {
            item.no = index+1
          })
          return {
            dataSource: [...targetObj],
            gist: [...gist],
            modifyTagsList: modify,
            count: state.count - res.data.length - phyDel.length
          }
        })
      } else {
        message.error(res.msg)
      }
    })
  }

  //表格项变化
  tableColums = (activeNodeType) => {
    let columArr = [
      {
        title: '序号',
        dataIndex: 'no',
        width: 50,
        editable: false
      },{
        title: '变量名',
        dataIndex: 'name',
        editable: true,
      }, {
        title: '变量描述',
        dataIndex: 'desc',
        editable: true,
      }, {
        title: '数据类型',
        dataIndex: 'dataType',
        type: "select",
        content: this.state.tableDataTypes,
        editable: true,
      }
    ]
    if (activeNodeType === 0 || activeNodeType === 2) {
      //内部变量或者内部变量组
      columArr.push({
        title: '最大值',
        dataIndex: 'max',
        editable: true,
      },
      {
        title: '最小值',
        dataIndex: 'min',
        width: 100,
        editable: true,
      })
    } else if (activeNodeType === 3 || activeNodeType === 4) {
      //设备或者设备变量组
      columArr.push({
        title: '变量地址',
        dataIndex: 'address',
        editable: true,
        type: "input-group",
      },
      {
        title: '字符长度',
        dataIndex: 'stringLength',
        editable: true,
      },
      {
        title: '缩放比',
        dataIndex: 'zoom',
        editable: true,
      })
    }

    return columArr; 
  }

  //导入点表文件
  importProps = (e) => {
    e.preventDefault();
    //重置查询
    this.searchRef.current.refs.formRef.setFieldsValue({
      dataType: "不限",
      key: "",
    })
    const formdata = new FormData();
    formdata.append('files', e.target.files[0]);
    this.importFileFun(formdata);
  }

  importFileFun = (formdata) => {
    document.getElementById('importFile').value=null
    ImportFile({
      nodeId: this.state.activeNode,
      type: this.state.activeNodeType,
      formData: formdata
    }).then(res => {
      if (res.code === 0) {
        this.setState({loading: true})
        getProcessTimer = setInterval(() => {
          GetImportTagsTaskProgress(res.data).then(mes => {
            let result = mes.data.resultData
            if ( mes.data.status === 2 ||  mes.data.status === 3) {
              message.info(mes.data.message)
              
              this.setState(state => {
                if (mes.data.message === "导入成功") {
                  $(".effective-editor").removeClass("effective-editor")
                }
                // console.log(mes.data.message === "导入成功")
                // console.log(result.tags)
                return {
                  loading: false,
                  count: mes.data.message === "导入成功" ? result.total : state.count,
                  gist: mes.data.message === "导入成功" && result.tags !== null ? JSON.parse(JSON.stringify([...result.tags])) : state.gist,
                  dataSource: mes.data.message === "导入成功" && result.tags !== null ? result.tags : state.dataSource,
                  treeData: mes.data.message === "导入成功" && result.tree !== null ? result.tree : state.treeData,
                  dataTypes: mes.data.message === "导入成功" && result.dataTypes !== null ? result.dataTypes : state.dataTypes,
                  modifyTagsList: mes.data.message === "导入成功" ? [] : JSON.parse(JSON.stringify(state.modifyTagsList)) //导入成功，清空编辑项
                }
              })
              PubSub.publish("changeTags", true)
              clearInterval(getProcessTimer)
              PubSub.publish("changeTags", false)
            }
          })
        },1000)
      }
    })
  }

  throttle = (func, delay) => {
    return ((...rest) => {
      let now = Date.now()
      if (now - this.state.preTime >= delay) {
        this.setState({
          preTime: Date.now()
        }, () => {
          func(...rest);
        })
      }
    })
  }

  addressSearch = (value, event, row, codeLen) => {
    console.log(value)
    this.throttle(this.addressCommit, 1000)(value, event, row, codeLen)
  }

  addressCommit = (value, event, row, codeLen) => {
    GetAddressEditInfo({
      nodeId: this.state.activeNode,
      type: this.state.activeNodeType
    }).then(res => {
      let data = res.data
      if(data.protocolName === "OPC_UA" || data.protocolName === "OPC_DA"){
        this.setState({
          opcConfigContent: (
            <OpcConfig data={data} row={row} node={this.state.node}
              key={new Date()}
              onCancel={this.opcConfigCancel}
              onFinish={this.OpcConfigCommit}/>
          ),
          opcConfigVisible: true,
          title: "选择"+ data.protocolName +"地址"
        })
      }else{
        this.setState({
          modalContent : (
            <AddressConfig data={data} row={row} node={this.state.node}
              key={Date.now()}
              addressValue={value}
              codeLen={codeLen}
              onCancel={this.handleCancel}
              onFinish={this.addressFinish}/>
          ),
          visible: true,
          title: "选择"+ data.protocolName +"地址"
        })
      }
    })
  }
  OpcConfigCommit = (selectRows, row) => {
    this.opcConfigCancel();
    let length = this.state.dataSource.length
    if (selectRows.length > 0) {
      selectRows.forEach((item, index) => {
        Object.assign(item, {
          id: "00000000-0000-0000-0000-000000000000",
          key: length + index,
          address: item.id,
          max: "",
          min: "",
          no: length + index,
          stringLength: "",
          zoom: "",
          desc: "",
          editable: true
        })
      })
    }
    this.setState(state => {
      let currentObj = JSON.parse(JSON.stringify(state.dataSource[row.no - 1]))

      //第一条替换点击的那条，其余追加到表格后面
      Object.assign(state.dataSource[row.no - 1], selectRows[0], {key: row.no-1})
      
      //查找编辑列表中是否存在第一条记录，存在则覆盖，不存在则追加
      if (state.modifyTagsList.length === 0) {
        state.modifyTagsList.push(currentObj)
      }else {
        state.modifyTagsList.forEach(item => {
          if (item.key === currentObj.key) {
            Object.assign(item, selectRows[0], {key: row.no-1})
          }
        })
      }

      //删除第一条
      selectRows.shift();

      return {
        dataSource: [...state.dataSource, ...selectRows],
        count: state.count + selectRows.length,
        modifyTagsList: [...state.modifyTagsList, ...selectRows],
        canSubmit: {
          canSubmit: true,
          message: ""
        }
      }
    })
  }
  addressFinish = (res, row) => {
    this.setState(state => {
      let rowIndex = 0;
      console.log(res, row)
      state.dataSource.forEach((item, index)=>{
        if(item.key === row.key){
          rowIndex = index
          for (let key in res) {
            item[key] = res[key]
          }
        }
      })
      let isEdit = false;
      console.log(state.dataSource[rowIndex])
      //判断当前记录是否被编辑了
      state.gist.forEach(item=>{
        if(item.key === state.dataSource[rowIndex].key){
          for(let val in item){
            if(item[val] !== state.dataSource[rowIndex][val]){
              isEdit = true;
              return 
            }
          }
        }
      })

      if(isEdit){
        if (state.modifyTagsList.length === 0) {
          // console.log(state.dataSource[row.no -1])
          state.modifyTagsList.push(state.dataSource[rowIndex])
        }else {
          state.modifyTagsList.forEach(mod => {
            if (mod.key === state.dataSource[rowIndex].key) {
              Object.assign(mod, state.dataSource[rowIndex])
            }
          })
        }
      }

      return {
        dataSource: state.dataSource,
        visible: false,
        modifyTagsList: state.modifyTagsList,
        canSubmit: {
          canSubmit: true,
          messages: ""
        }
      }
    })
  } 

  onDrop = info => {
    const dragNode = info.dragNode;
    const dropNode = info.node;

    const isSameParent = (a, b) => {
      return a.fatherNodeID === b.fatherNodeID;
    };

    const sameParent = isSameParent(dragNode, dropNode);
    if (sameParent && dragNode.fatherNodeID === "00000000-0000-0000-0000-000000000000"){
      if (!info.dropToGap) {
        return
      } else {
        this.dropEvent(info, dropNode)
      }
    }else if (sameParent && !dropNode.dragOverGapBottom) {
      this.dropEvent(info, dropNode)
    } else if (dragNode.fatherNodeID === dropNode.key) {
    }
  };

  dropEvent = (info, dropNode) => {
    let newNodeList = []; //新的节点排序
    const dragKey = info.dragNode.key;

    //如果dragPos 小于 dropPos ，那要减一
    const dropPosition = info.dragNode.pos < info.node.pos ? info.dropPosition - 1: info.dropPosition;

    const loop = (data, key, callback) => {
      if(key === "00000000-0000-0000-0000-000000000000"){
        return callback(data);
      }else{
        for (let i = 0; i < data.length; i++) {
          if (data[i].nodeID === key) {
            return callback(data[i], i, data);
          }
          if (data[i].children) {
            loop(data[i].children, key, callback);
          }
        }
      }
    };
    const data = [...this.state.treeData];
    // 找到当前拖动的对象
    let dragObj; 
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dragObj.fatherNodeID, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到尾部，可以是随意位置
        item.children.splice(dropPosition + 1, 0, dragObj)
      });
    } else if (
      (info.node.children || []).length > 0 && // Has children
      info.node.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
    } else if(dragObj.fatherNodeID === "00000000-0000-0000-0000-000000000000"
      && dropNode.fatherNodeID === "00000000-0000-0000-0000-000000000000"
    ){
      //最外层
      loop(data, dragObj.fatherNodeID, (item) => {
        item.splice(dropPosition, 0, dragObj)
      });
    }

    data.forEach(item=>{
      if(dragObj.fatherNodeID === "00000000-0000-0000-0000-000000000000"){
        newNodeList.push(item.nodeID)
      }else if(dragObj.fatherNodeID === item.nodeID){
        item.children.forEach(child=>{
          newNodeList.push(child.nodeID)
        })
      }
    })

    SortTreeNode({
      nodeId: dragObj.fatherNodeID,
      children: newNodeList
    }).then(res=>{

    })
    this.setState({treeData: data});
  }
    
  render() {
    const { activeNodeType, collasped, treeData, dataSource, gist } = this.state
    
    return (
      <div className={`antProPageContainer ${ collasped ? 'foldToLeft' : "" }`}>
        <Spin spinning={this.state.loading}>
          <div className="leftContent">
            <div className="fullContain">
              {
                treeData ?
                  <ZTree
                    title="设备列表"
                    zTreeOption={{
                      className: "optAdd",
                      placement: "bottomCenter"
                    }}
                    move={true}
                    option={ true }
                    nodeDatas={ treeData}
                    zTreeOptionDropdown={true}
                    zTreeOptionMenu={this.zTreeOptionMenu}
                    interVariable={this.interVariable}
                    optionDeviceMenu={this.optionDeviceMenu}
                    optionGroupMenu={this.optionGroupMenu}
                    selectedKeys={this.state.selectedKeys}
                    onSelect={this.onSelect}
                    draggable
                    blockNode
                    onDrop={this.onDrop}
                  />
                  : null
              }
            </div>
            <span className="arrowLeft" onClick={this.toggleLeft}></span>
          </div>
          <div className="tableList">
            <Search
              ref={this.searchRef}
              importProps={this.importProps}
              activeNode={this.state.activeNode}
              dataTypes={this.state.dataTypes}
              type={activeNodeType}
              searchForm={this.searchForm}
              saveList={this.saveList}
              resetTags={this.resetTags}
              addTags={this.addTags}
              delTags={this.delTags}
              menuClick={this.importMenu}
            />
            <div className="tableContain">
              <EditableTable
                rowSelection={{
                  columnWidth: 56,
                  selectedRowKeys: this.state.selectedRowKeys,
                  onChange: this.onSelectChange,
                }}
                key={ this.state.activeNode }
                pageIndex={this.state.pageIndex}
                gist={gist}
                dataSource={dataSource}
                activeNode={this.state.activeNode}
                activeNodeType={this.state.activeNodeType}
                tableDataTypes={this.state.tableDataTypes}
                loadMore={this.loadMore}
                count={this.state.count}
                total={this.state.total}
                rowKey={record => {
                  return record.id
                }}
                handleSave={this.handleSave}
                addressSearch={ this.addressSearch }
                loading={this.state.tableLoading}
                columns={this.tableColums(activeNodeType).map(el => {
                  return {
                    title: el.title,
                    dataIndex: el.dataIndex,
                    width: el.width,
                    ellipsis: {
                      showTitle: false,
                    },
                    editable: el.editable,
                    type: el.type || "",
                    // content: el.content,
                    // render: el.render
                  }
                })}
              />
            </div>
          </div>
          {/* 新增编辑模态框 */}
          <Modal 
            title={this.state.title}
            maskClosable={false}
            visible={this.state.visible}
            onCancel={this.handleCancel}
            footer={null}
            key={new Date()}
            >
            {
              this.state.modalContent
            }
          </Modal>
          <Modal
            width="750px"
            bodyStyle={{padding: "30px 30px 20px"}}
            maskClosable={false}
            title={this.state.title}
            visible={this.state.opcConfigVisible}
            onCancel={this.opcConfigCancel}
            footer={null}
            >
            {
              this.state.opcConfigContent
            }
          </Modal>
        </Spin>
      </div>
    )
  }
}

export default RealTime