import React from "react";
import Table from "tablex";
import {Input, Select, Checkbox} from 'antd'

class Demo extends React.Component {
  constructor(props){
    super(props)
    this.tableRef = React.createRef()
    const columns = (() => {
      let {activeNodeType} = props
      let columArr = [
        {
          title: '序号',
          dataIndex: 'no',
          width: 50,
          editable: false
        },{
          title: '变量名',
          dataIndex: 'name',
          onCell: (row, value, index) => {
            return {
              onClick: () => {
                this.beginEdit(row)
              },
            }
          },
          validator: function(value, row) {
            if (!value) {
              return { valid: false, message: '请输入' }
            }

            return { valid: true, message: 'false' }
          },
          editor: (value, row, index, onchange, ref)=>{
            return (
              <Input
                defaultValue={value}
                ref={ref}
                onBlur={this.onBlur}
                onChange={e =>
                  onchange([
                    { 'column-1': e.target.value, id: row.id },
                    { id: '3', address: e.target.value },
                  ])
                }
              />
            )
          },
          editable: true,
        }, {
          title: '变量描述',
          dataIndex: 'desc',
          editable: true,
        }, {
          title: '数据类型',
          dataIndex: 'dataType',
          type: "select",
          content: props.tableDataTypes,
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
    })()
    console.log(columns)
    this.state = {
      data: [],
      columns: columns,
      loading: false,
      expandedRowKeys: [],
      modified: ""
    }
    let data = this.generateData(columns, 10)
  }
  beginEdit(row) {
    let arr = []
    arr.push(row.key)
    this.tableRef.current.api.editRows(arr)
    this.setState({
      modified: row.key
    })
  }

  generateData(columns, count = 20, prefix = 'Row') {
    console.log("----------")
    return new Array(count).fill(0).map((row, rowIndex) => {
      return columns.reduce(
        (rowData, column, columnIndex) => {
          if (column.dataIndex !== 'id') {
            rowData[column.dataIndex] = Math.floor(Math.random() * 100 + 1)
          } else {
            rowData[column.dataIndex] =
              prefix + ' ' + rowIndex + ' - Col ' + columnIndex
          }
          return rowData
        },
        {
          id: prefix + rowIndex,
          parentId: null,
        },
      )
    })
  }

  componentDidMount(){
    window.onClick = (e)=>{
      console.log("-------")
      this.onEditComplete(this.state.modified)
    }
  }

  static getDerivedStateFromProps(props, state) {
    state.dataSource = props.dataSource
    return null
  }
  onEditComplete(modified) {
    console.log('onEditComplete:', modified)
  }
  onEditSave(changedRows, newRows, editType) {
    console.log('onEditSave changedRows:', changedRows)
    console.log('onEditSave newRows:', newRows)
    console.log('onEditSave editType:', editType)
  }

  onBlur = (e)=>{
    console.log(e)
    // this.onEditSave();
  }
  
  render() {
    let { columns, dataSource } = this.state
    return (
      <>
        <div className="table-contain">
          <Table rowKey="id" 
            ref={this.tableRef}
            columns={columns} 
            data={dataSource} 
            rowSelection={{
              type: 'checkbox',
              checkOnSelect: true,
              selectOnCheck: true,
            }}
            isAppend={true}
            allowSaveEmpty={true}
            alwaysValidate={false}
            validateTrigger="onChange"
            editable={true}
            editTools={[]}
            selectOnRowClick={false}
            orderNumber={false} />
        </div>
        <div className="paging">
          {
            <>
              {
                dataSource && (this.props.count - dataSource.length) > 0 && this.props.count - dataSource.length > 0 ? (
                  <label className="load-more" onClick={this.props.loadMore}>
                    <span>...加载更多</span>
                    <span style={{ color: '#999' }}>(剩余{this.props.count - dataSource.length}条数据)</span>
                  </label>) : <></>
              }
              <label style={{ float: 'right', color: '#666', 'paddingRight': '20px' }}>
                <span>总条数：</span>
                <span>{this.props.count}</span>
              </label>
            </>
          }
        </div>
      </>
    )
  }
}
export default Demo