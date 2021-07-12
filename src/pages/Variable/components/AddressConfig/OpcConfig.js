import React, { PureComponent } from 'react'
import { Button, Tree, Table, message } from 'antd'
import "./index.less"

import { InitOPCUaWindows, GetOPCUaNodes } from 'api/variable'

export default class config extends PureComponent {
  state={
    popupData: {
      protocolName: this.props.data.protocolName,
      dataType: this.props.row.dataType,
      dataValue: '',  // 变量地址
      dataLen: '',  // 字符长度
    },
    OPC_Tree: [],
    OPC_Table: [],
    selectedRowKeys: [],
    selectedRows: []
  }

  componentDidMount(){
    this.initPop();
  }

  initPop = () =>{
    let { node } = this.props
    InitOPCUaWindows({
      nodeId: node.key,
      type: node.nodeType
    }).then(res => {
      if (res.code === 0) {
        this.setState({
          OPC_Tree: this.dataProcess(res.data.tree),
          OPC_Table: this.tableDataProcess(res.data.table)
        })
      }
    })
  }

  //组列表树数据处理
  dataProcess = (data=[])=>{
    let treeData = [];
    data.forEach(item=>{
      treeData.push({
        key: item.id,
        title: item.name
      })
    })
    return treeData
  }
  //表格数据处理
  tableDataProcess = ((data=[])=>{
    let tableData = [];
    data.forEach(item=>{
      console.log(item.name)
      item.key = item.name
      tableData.push(item)
    })
    return tableData
  })

  updateTreeData = (list, key, children) => {
    return list.map((node) => {
      if (node.key === key) {
        return { ...node, children };
      }
  
      if (node.children) {
        return { ...node, children: this.updateTreeData(node.children, key, children) };
      }
  
      return node;
    });
  }
  loadData = ({ key, children })=>{
    return new Promise((resolve) => {
      if (children) {
        resolve();
        return;
      }
      GetOPCUaNodes(key).then(res=>{
        if(res.code === 0){
          this.setState({
            OPC_Tree: this.updateTreeData(this.state.OPC_Tree, key, this.dataProcess(res.data.tree)),
            OPC_Table: this.tableDataProcess(res.data.table)
          })
        }else{
          console.log(res)
        }
        resolve();
      })
    });
  }


  columns = [
    {
      title: '',
      dataIndex: 'key',
      width: "60px",
      ellipsis: true,
      render: (key, row, i)=>{
        return i+1
      }
    },
    {
      title: '节点名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '节点ID',
      dataIndex: 'id',
      ellipsis: true,
    },
    {
      title: '数据类型',
      dataIndex: 'dataType',
      ellipsis: true,
    }
  ];
  onFinish = ()=>{
    this.props.onFinish(this.state.selectedRows, this.props.row);
  }

  onSelect=(key, row)=>{
    GetOPCUaNodes(row.node.key).then(res=>{
      if (res.code === 0) {
        console.log(res.data)
        this.setState({
          OPC_Table: this.tableDataProcess(res.data.table)
        })
      }else{
        message.error(res.msg)
      }
    })
  }
  rowSelect = (selectedRowKeys, selectedRows)=>{
    this.setState({ selectedRowKeys, selectedRows });
    console.log("_----------", selectedRows)
  }

  render(){
    return (
      <>
      <div className="modal-pane">
        <div className='tree-pane'>
          <div className="tree-header">组列表</div>
          <Tree className="modal-tree" 
            onSelect={this.onSelect}
            showIcon={false}
            loadData={this.loadData}
            treeData={this.state.OPC_Tree} />
        </div>
        <div className="table-list">
          <Table columns={this.columns}
            pagination={false}
            scroll={{ y: 463 }}
            rowSelection={{
              columnWidth: "50px",
              selectedRowKeys: this.state.selectedRowKeys,
              onChange: this.rowSelect,
            }}
            dataSource={this.state.OPC_Table}
          />
        </div>
      </div>
      <div className="form-footer">
        <Button type="default" className="login-form-button" onClick={this.props.onCancel}>取消</Button>
        <Button type="primary" className="login-form-button" onClick={this.onFinish}>
          确认
        </Button>
      </div>
      </>
    )
  }
}