import React, { PureComponent } from 'react'
import { Form, Select, Input, Button } from 'antd'
import "./index.less"

export default class config extends PureComponent {
  addressForm = React.createRef()
  state={
    stringLength: this.props.row.stringLength,
    // 需e要在此处手动修改协议protocolNam 和 数据类型 dataType 模拟不同协议下的数据结构
    popupData: {
      protocolName: this.props.data.protocolName,
      // dataType: $("#dataType" + this.props.row.key).parent().siblings(".ant-select-selection-item").attr("title"),
      dataType: this.props.row.dataType,
      dataValue: '',  // 变量地址
      dataLen: '',  // 字符长度
      supplier: '', // S7-TCP 设备厂家
      model: '',  // S7_TCP 设备型号
    },
    // 定义一个提交的数据结构， 用来填写默认值与回显
    addressData: {
      dataArea: '', // 数据区域
      letters: 'M', // 寄存器字母块（M/DBX/I/Q/MB/DBB/IB/QB/MW/DBW/IW/QW/MD/DBD/ID/QD）
      lettlesValue: 0, // 寄存器字母对应的值
      DBNum: 1, // DB号
      bit: 0,  //  位
      len: "", // 长度
      addressOffset: 1, // 地址偏移量
      addressType: '字节', // 地址类型
      addressValue: '', // 最后组装出来的变量值
      showList: [], // 弹窗显示的form块
      address: 1, // S7_TCP 以外的协议 偏移地址
    },
    data: {}, 
    type: "",
    formData: {},
    showList:[]
  }

  componentDidMount() {
    this.setState({ formData: JSON.parse(JSON.stringify(this.state.addressData)) }, () => {
        //根据变量地址的值以及数据类型，将数据进行初始化处理
      this.init();
      this.openPop()

    })
  }

  //输入框回显
  init = () => {
    let { row, addressValue, codeLen, data } = this.props
    let { formData, popupData } = this.state,
    address = addressValue
    console.log(this.props.row, addressValue)
    // let initValue = {}

    // initValue.dataValue = address
    popupData.dataValue = address
    popupData.dataLen = codeLen
    popupData.supplier = data.supplier
    popupData.model = data.model
    /* 
      正则：
      ^   以后面的字符开始
      $    以前面字符结束
      ([0-9]{1,})   大于0的正整数 不限位数
      ([.]{1})  匹配.
      ([0-9]|(1[0-5])) 1-15 位整数
    */
    //设置初始默认值
    // if (address.trim() === '') {
    //   if (popupData.protocolName === 'S7_TCP') {
    //     if (row.dataType === '二进制变量') {
    //       initValue.dataArea = '位'
    //       initValue = {
    //         dataArea: '位',
    //         letter: 'M',
    //         lettlesValue: 0,
    //         DBNum: 1,
    //         addressOffset: 1,
    //         bit: 0,
    //         len: 1,
    //         addressType: '字节'
    //       }
    //     }
    //   }

    //   console.log(initValue)
    //   this.setState(state=> {
    //     return {
    //       formData: initValue
    //     }
    //   })
    //   this.addressForm.current.setFieldsValue(initValue)
    //   return
    // }
    if (popupData.protocolName === 'S7_TCP') {
      // 1: 数据区域  2. 寄存器字母块（M/DBX/I/Q/MB/DBB/IB/QB/MW/DBW/IW/QW/MD/DBD/ID/QD） 3.  DB号  4. 地址偏移量   5. 位   6. 长度   7.  地址类型 
      if (popupData.model === 'S7-200Smart') {  //S7_TCP S7-200Smart型号
        if (popupData.dataType === '二进制变量') {
          let bitReg = /^[M]([0-9]{1,})([.]{1})([0-7]{1})$/     // 位匹配正则
          // let dbReg = /^(DB)([1-9]{1,})([.]{1})((DBX){1})([0-9]{1,})([.]{1})([0-7]{1,})$/ // DB号匹配正则
          let VReg = /^[V]([0-9]{1,})([.]{1})([0-7]{1})$/
          let IReg = /^[I]([0-9]{1,})([.]{1})([0-7]{1})$/ // 输入匹配正则
          let QReg = /^[Q]([0-9]{1,})([.]{1})([0-7]{1})$/ // 输出匹配正则
          if (bitReg.test(address)) {
            let arr =  address.match(bitReg) 
            formData.dataArea = 'M'
            formData.letters = 'M'
            formData.lettlesValue = arr[1]
            formData.bit = arr[3]
            formData.showList = [1, 2, 5]
          } else if (VReg.test(address)) {
            let arr =  address.match(VReg) 
            formData.dataArea = 'V'
            formData.letters = 'V'
            formData.lettlesValue = arr[1]
            formData.bit = arr[3]
            formData.showList = [1, 2, 5]
          } else if (IReg.test(address)) {
            let arr =  address.match(IReg) 
            formData.dataArea = 'I'
            formData.letters = 'I'
            formData.lettlesValue = arr[1]
            formData.bit = arr[3]
            formData.showList = [1,2,5]
          } else if (QReg.test(address)) {
            let arr =  address.match(QReg) 
            formData.dataArea = 'Q'
            formData.letters = 'Q'
            formData.lettlesValue = arr[1]
            formData.bit = arr[3]
            formData.showList = [1,2,5]
          } else {
            formData.dataArea = 'M'
          }
        } else if (popupData.dataType === '有符号8位整型' || popupData.dataType === '无符号8位整型') {
          let bitReg = /^(MB)([0-9]{1,})$/     // 位匹配正则
          // let dbReg = /^(DB)([1-9]{1,})([.]{1})((DBB){1})([0-9]{1,})$/ // DB号匹配正则
          let VReg = /^(VB)([0-9]{1,})$/
          let IReg = /^(IB)([0-9]{1,})$/ // 输入匹配正则
          let QReg = /^(QB)([0-9]{1,})$/ // 输出匹配正则

          if (bitReg.test(address)) {
            let arr =  address.match(bitReg) 
            formData.dataArea = 'M'
            formData.letters = 'MB'
            formData.lettlesValue = arr[2]
            formData.showList = [1,2]
          } else if (VReg.test(address)) {
            let arr =  address.match(VReg) 
            formData.dataArea = 'V'
            formData.letters = 'VB'
            formData.lettlesValue = arr[2]
            formData.showList = [1,2]
          } else if (IReg.test(address)) {
            let arr =  address.match(IReg) 
            formData.dataArea = 'I'
            formData.letters = 'IB'
            formData.lettlesValue = arr[2]
            formData.showList = [1,2]
          } else if (QReg.test(address)) {
            let arr =  address.match(QReg) 
            formData.dataArea = 'Q'
            formData.letters = 'QB'
            formData.lettlesValue = arr[2]
            formData.showList = [1,2]
          }
        } else if (popupData.dataType === '有符号16位整型' || popupData.dataType === '无符号16位整型') {
          let bitReg = /^(MW)([0-9]{1,})$/     // 位匹配正则
          // let dbReg = /^(DB)([1-9]{1,})([.]{1})((DBW){1})([0-9]{1,})$/ // DB号匹配正则
          let VReg = /^(VW)([0-9]{1,})$/ 
          let IReg = /^(IW)([0-9]{1,})$/ // 输入匹配正则
          let QReg = /^(QW)([0-9]{1,})$/ // 输出匹配正则

          if (bitReg.test(address)) {
            let arr =  address.match(bitReg) 
            formData.dataArea = 'M'
            formData.letters = 'MW'
            formData.lettlesValue = arr[2]
            formData.showList = [1,2]
          } else if (VReg.test(address)) {
            let arr =  address.match(VReg) 
            formData.dataArea = 'V'
            formData.letters = 'VW'
            formData.lettlesValue = arr[2]
            formData.showList = [1,2]
          } else if (IReg.test(address)) {
            let arr =  address.match(IReg) 
            formData.dataArea = 'I'
            formData.letters = 'IW'
            formData.lettlesValue = arr[2]
            formData.showList = [1,2]
          } else if (QReg.test(address)) {
            let arr =  address.match(QReg) 
            formData.dataArea = 'Q'
            formData.letters = 'QW'
            formData.lettlesValue = arr[2]
            formData.showList = [1,2]
          }
        } else if (popupData.dataType === '有符号32位整型' || popupData.dataType === '无符号32位整型' || popupData.dataType === 'F32位浮点数IEEE754') {
          let bitReg = /^(MD)([0-9]{1,})$/     // 位匹配正则
          // let dbReg = /^(DB)([1-9]{1,})([.]{1})((DBD){1})([0-9]{1,})$/ // DB号匹配正则
          let VReg = /^(VD)([0-9]{1,})$/
          let IReg = /^(ID)([0-9]{1,})$/ // 输入匹配正则
          let QReg = /^(QD)([0-9]{1,})$/ // 输出匹配正则

          if (bitReg.test(address)) {
            let arr =  address.match(bitReg) 
            formData.dataArea = 'M'
            formData.letters = 'MD'
            formData.lettlesValue = arr[2]
            formData.showList = [1,2]
          } else if (VReg.test(address)) {
            let arr =  address.match(VReg) 
            formData.dataArea = 'V'
            formData.letters = 'VB'
            formData.lettlesValue = arr[2]
            formData.showList = [1,2]
          } else if (IReg.test(address)) {
            let arr =  address.match(IReg) 
            formData.dataArea = 'I'
            formData.letters = 'ID'
            formData.lettlesValue = arr[2]
            formData.showList = [1,2]
          } else if (QReg.test(address)) {
            let arr =  address.match(QReg) 
            formData.dataArea = 'Q'
            formData.letters = 'QD'
            formData.lettlesValue = arr[2]
            formData.showList = [1,2]
          }
        } else if (popupData.dataType === '文本变量8位字符集') {
          let bitReg = /^(MB)([0-9]{1,})$/     // 位匹配正则
          // let dbReg = /^(DB)([1-9]{1,})([.]{1})((DBW){1})([0-9]{1,})$/ // DB号匹配正则
          let VReg = /^(VB)([0-9]{1,})$/ 
          let IReg = /^(IB)([0-9]{1,})$/ // 输入匹配正则
          let QReg = /^(QB)([0-9]{1,})$/ // 输出匹配正则

          if (bitReg.test(address)) {
            let arr =  address.match(bitReg) 
            formData.dataArea = 'M'
            formData.addressOffset = arr[2]
            formData.len = popupData.dataLen
            formData.showList = [1,4,6]
          } else if (VReg.test(address)) {
            let arr =  address.match(VReg) 
            formData.dataArea = 'V'
            formData.addressOffset = arr[2]
            formData.len = popupData.dataLen
            formData.showList = [1,4,6]
          } else if (IReg.test(address)) {
            let arr =  address.match(IReg) 
            formData.dataArea = 'I'
            formData.addressOffset = arr[2]
            formData.len = popupData.dataLen
            formData.showList = [1,4,6]
          } else if (QReg.test(address)) {
            let arr =  address.match(QReg) 
            formData.dataArea = 'Q'
            formData.addressOffset = arr[2]
            formData.len = popupData.dataLen
            formData.showList = [1,4,6]
          }
        } else if (popupData.dataType === '字符串') {
          let bitReg = /^(MB|MW)([0-9]{1,})$/     // 位匹配正则
          // let dbReg = /^(DB)([1-9]{1,})([.]{1})((DBB|DBW){1})([0-9]{1,})$/ // DB号匹配正则
          let VReg = /^(VB|VW)([0-9]{1,})$/ 
          let IReg = /^(IB|IW)([0-9]{1,})$/ // 输入匹配正则
          let QReg = /^(QB|QW)([0-9]{1,})$/ // 输出匹配正则
          
          if (bitReg.test(address)) {
            let arr =  address.match(bitReg) 
            formData.dataArea = 'M'
            formData.len = popupData.dataLen
            formData.addressOffset = arr[2]
            if (arr[1] === 'MB') {
              formData.addressType = '字节'
            } else if (arr[1] === 'MW') {
              formData.addressType = '字'
            }
            formData.showList = [1,4,6,7]
          } else if (VReg.test(address)) {
            let arr =  address.match(VReg) 
            formData.dataArea = 'V'
            formData.len = popupData.dataLen
            formData.addressOffset = arr[2]
            if (arr[4] === 'VB') {
              formData.addressType = '字节'
            } else if (arr[4] === 'VW') {
              formData.addressType = '字'
            }
            formData.showList = [1,4,6,7]
          } else if (IReg.test(address)) {
            let arr =  address.match(IReg) 
            formData.dataArea = 'I'
            formData.len = popupData.dataLen
            formData.addressOffset = arr[2]
            if (arr[1] === 'IB') {
              formData.addressType = '字节'
            } else if (arr[1] === 'IW') {
              formData.addressType = '字'
            }
            formData.showList = [1,4,6,7]
          } else if (QReg.test(address)) {
            let arr =  address.match(QReg) 
            formData.dataArea = 'Q'
            formData.len = popupData.dataLen
            formData.addressOffset = arr[2]
            if (arr[1] === 'QB') {
              formData.addressType = '字节'
            } else if (arr[1] === 'QW') {
              formData.addressType = '字'
            }
            formData.showList = [1,4,6,7]
          }
        }
      } else {
        if (row.dataType === '二进制变量') {  
          let bitReg = /^[M]([0-9]{1,})([.]{1})([0-7]{1})$/     // 位匹配正则
          let dbReg = /^(DB)([1-9]{1,})([.]{1})((DBX){1})([0-9]{1,})([.]{1})([0-7]{1,})$/ // DB号匹配正则
          let IReg = /^[I]([0-9]{1,})([.]{1})([0-7]{1})$/ // 输入匹配正则
          let QReg = /^[Q]([0-9]{1,})([.]{1})([0-7]{1})$/ // 输出匹配正则
          if (bitReg.test(address)) {
            console.log("-------------1")
            let arr =  address.match(bitReg) 
            formData.dataArea = '位'
            formData.letters = 'M'
            formData.lettlesValue = arr[1]
            formData.bit = arr[3]
            formData.showList = [1, 2, 5]
            console.log(formData)
          } else if (dbReg.test(address)) {
            console.log("-------------2")
            let arr =  address.match(dbReg) 
            formData.dataArea = 'DB'
            formData.DBNum = arr[2]
            formData.letters = 'DBX'
            formData.lettlesValue = arr[6]
            formData.bit = arr[8]
            formData.showList = [1,2,3,5]
            console.log(formData)
          } else if (IReg.test(address)) {
            console.log("-------------3")
            let arr =  address.match(IReg) 
            formData.dataArea = '输入'
            formData.letters = 'I'
            formData.lettlesValue = arr[1]
            formData.bit = arr[3]
            formData.showList = [1,2,5]
          } else if (QReg.test(address)) {
            console.log("-------------4")
            let arr =  address.match(QReg) 
            formData.dataArea = '输出'
            formData.letters = 'Q'
            formData.lettlesValue = arr[1]
            formData.bit = arr[3]
            formData.showList = [1,2,5]
          } else {
            formData.dataArea = '位'
          }
        } else if (popupData.dataType === '有符号8位整型' || popupData.dataType === '无符号8位整型') {
          let bitReg = /^(MB)([0-9]{1,})$/     // 位匹配正则
          let dbReg = /^(DB)([1-9]{1,})([.]{1})((DBB){1})([0-9]{1,})$/ // DB号匹配正则
          let IReg = /^(IB)([0-9]{1,})$/ // 输入匹配正则
          let QReg = /^(QB)([0-9]{1,})$/ // 输出匹配正则

          if (bitReg.test(address)) {
            let arr =  address.match(bitReg) 
            formData.dataArea = '位'
            formData.letters = 'MB'
            formData.lettlesValue = arr[2]
            formData.showList = [1,2]
          } else if (dbReg.test(address)) {
            let arr =  address.match(dbReg) 
            formData.dataArea = 'DB'
            formData.DBNum = arr[2]
            formData.letters = 'DBB'
            formData.lettlesValue = arr[6]
            formData.showList = [1,2,3]
          } else if (IReg.test(address)) {
            let arr =  address.match(IReg) 
            formData.dataArea = '输入'
            formData.letters = 'IB'
            formData.lettlesValue = arr[2]
            formData.showList = [1,2]
          } else if (QReg.test(address)) {
            let arr =  address.match(QReg) 
            formData.dataArea = '输出'
            formData.letters = 'QB'
            formData.lettlesValue = arr[2]
            formData.showList = [1,2]
          }

        } else if (popupData.dataType === '有符号16位整型' || popupData.dataType === '无符号16位整型') {
          let bitReg = /^(MW)([0-9]{1,})$/     // 位匹配正则
          let dbReg = /^(DB)([1-9]{1,})([.]{1})((DBW){1})([0-9]{1,})$/ // DB号匹配正则
          let IReg = /^(IW)([0-9]{1,})$/ // 输入匹配正则
          let QReg = /^(QW)([0-9]{1,})$/ // 输出匹配正则

          if (bitReg.test(address)) {
            let arr =  address.match(bitReg) 
            formData.dataArea = '位'
            formData.letters = 'MW'
            formData.lettlesValue = arr[2]
            formData.showList = [1,2]
          } else if (dbReg.test(address)) {
            let arr =  address.match(dbReg) 
            formData.dataArea = 'DB'
            formData.DBNum = arr[2]
            formData.letters = 'DBW'
            formData.lettlesValue = arr[6]
            formData.showList = [1,2,3]
          } else if (IReg.test(address)) {
            let arr =  address.match(IReg) 
            formData.dataArea = '输入'
            formData.letters = 'IW'
            formData.lettlesValue = arr[2]
            formData.showList = [1,2]
          } else if (QReg.test(address)) {
            let arr =  address.match(QReg) 
            formData.dataArea = '输出'
            formData.letters = 'QW'
            formData.lettlesValue = arr[2]
            formData.showList = [1,2]
          }

        } else if (popupData.dataType === '有符号32位整型' || popupData.dataType === '无符号32位整型' || popupData.dataType === 'F32位浮点数IEEE754' || popupData.dataType === '定时器') {
          let bitReg = /^(MD)([0-9]{1,})$/     // 位匹配正则
          let dbReg = /^(DB)([1-9]{1,})([.]{1})((DBD){1})([0-9]{1,})$/ // DB号匹配正则
          let IReg = /^(ID)([0-9]{1,})$/ // 输入匹配正则
          let QReg = /^(QD)([0-9]{1,})$/ // 输出匹配正则

          if (bitReg.test(address)) {
            let arr =  address.match(bitReg) 
            formData.dataArea = '位'
            formData.letters = 'MD'
            formData.lettlesValue = arr[2]
            formData.showList = [1,2]
          } else if (dbReg.test(address)) {
            let arr =  address.match(dbReg) 
            formData.dataArea = 'DB'
            formData.DBNum = arr[2]
            formData.letters = 'DBD'
            formData.lettlesValue = arr[6]
            formData.showList = [1,2,3]
          } else if (IReg.test(address)) {
            let arr =  address.match(IReg) 
            formData.dataArea = '输入'
            formData.letters = 'ID'
            formData.lettlesValue = arr[2]
            formData.showList = [1,2]
          } else if (QReg.test(address)) {
            let arr =  address.match(QReg) 
            formData.dataArea = '输出'
            formData.letters = 'QD'
            formData.lettlesValue = arr[2]
            formData.showList = [1,2]
          }

        } else if (popupData.dataType === '有符号64位整型' || popupData.dataType === '无符号64位整型' || popupData.dataType === 'F64位浮点数IEEE754' || popupData.dataType === '日期'|| popupData.dataType === '时间'|| popupData.dataType === '日期时间') {
          let bitReg = /^(MB|MD|MW)([0-9]{1,})$/     // 位匹配正则
          let dbReg = /^(DB)([1-9]{1,})([.]{1})((DBB|DBW|DBD){1})([0-9]{1,})$/ // DB号匹配正则
          let IReg = /^(IB|IW|ID)([0-9]{1,})$/ // 输入匹配正则
          let QReg = /^(QB|QW|QD)([0-9]{1,})$/ // 输出匹配正则

          if (bitReg.test(address)) {
            let arr =  address.match(bitReg) 
            formData.dataArea = '位'
            formData.addressOffset = arr[2]
            if (arr[1] === 'MB') {
              formData.addressType = '字节'
            } else if (arr[1] === 'MW') {
              formData.addressType = '字'
            } else if (arr[1] === 'MD') {
              formData.addressType = '双字'
            }
            formData.showList = [1,4,7]
          } else if (dbReg.test(address)) {
            let arr =  address.match(dbReg) 
            console.log(arr)
            formData.dataArea = 'DB'
            formData.DBNum = arr[2]
            formData.addressOffset = arr[6]
            if (arr[4] === 'DBB') {
              formData.addressType = '字节'
            } else if (arr[4] === 'DBW') {
              formData.addressType = '字'
            } else if (arr[4] === 'DBD') {
              formData.addressType = '双字'
            }
            formData.showList = [1,3,4,7]
          } else if (IReg.test(address)) {
            let arr =  address.match(IReg) 
            formData.dataArea = '输入'
            formData.addressOffset = arr[2]
            if (arr[1] === 'IB') {
              formData.addressType = '字节'
            } else if (arr[1] === 'IW') {
              formData.addressType = '字'
            } else if (arr[1] === 'ID') {
              formData.addressType = '双字'
            }
            formData.showList = [1,4,7]
          } else if (QReg.test(address)) {
            let arr =  address.match(QReg) 
            formData.dataArea = '输出'
            formData.addressOffset = arr[2]
            if (arr[1] === 'QB') {
              formData.addressType = '字节'
            } else if (arr[1] === 'QW') {
              formData.addressType = '字'
            } else if (arr[1] === 'QD') {
              formData.addressType = '双字'
            }
            formData.showList = [1,4,7]
          }

        } else if (popupData.dataType === '文本变量8位字符集' || popupData.dataType === '文本变量16位字符集') {
          let bitReg = /^(MW)([0-9]{1,})$/     // 位匹配正则
          let dbReg = /^(DB)([1-9]{1,})([.]{1})((DBW){1})([0-9]{1,})$/ // DB号匹配正则
          let IReg = /^(IW)([0-9]{1,})$/ // 输入匹配正则
          let QReg = /^(QW)([0-9]{1,})$/ // 输出匹配正则

          if (bitReg.test(address)) {
            let arr =  address.match(bitReg) 
            formData.dataArea = '位'
            formData.addressOffset = arr[2]
            formData.len = popupData.dataLen
            formData.showList = [1,4,6]
          } else if (dbReg.test(address)) {
            let arr =  address.match(dbReg) 
            console.log(arr)
            formData.dataArea = 'DB'
            formData.DBNum = arr[2]
            formData.addressOffset = arr[6]
            formData.len = popupData.dataLen
            formData.showList = [1,3,4,6]
          } else if (IReg.test(address)) {
            let arr =  address.match(IReg) 
            formData.dataArea = '输入'
            formData.addressOffset = arr[2]
            formData.len = popupData.dataLen
            formData.showList = [1,4,6]
          } else if (QReg.test(address)) {
            let arr =  address.match(QReg) 
            formData.dataArea = '输出'
            formData.addressOffset = arr[2]
            formData.len = popupData.dataLen
            formData.showList = [1,4,6]
          }

        } else if (popupData.dataType === '字符串' || popupData.dataType === '宽字符串') {
          let bitReg = /^(MB|MW)([0-9]{1,})$/     // 位匹配正则
          let dbReg = /^(DB)([1-9]{1,})([.]{1})((DBB|DBW){1})([0-9]{1,})$/ // DB号匹配正则
          let IReg = /^(IB|IW)([0-9]{1,})$/ // 输入匹配正则
          let QReg = /^(QB|QW)([0-9]{1,})$/ // 输出匹配正则
          
          if (bitReg.test(address)) {
            let arr =  address.match(bitReg) 
            formData.dataArea = '位'
            formData.len = popupData.dataLen
            formData.addressOffset = arr[2]
            if (arr[1] === 'MB') {
              formData.addressType = '字节'
            } else if (arr[1] === 'MW') {
              formData.addressType = '字'
            }
            formData.showList = [1,4,6,7]
          } else if (dbReg.test(address)) {
            let arr =  address.match(dbReg) 
            formData.dataArea = 'DB'
            formData.len = popupData.dataLen
            formData.DBNum = arr[2]
            formData.addressOffset = arr[6]
            if (arr[4] === 'DBB') {
              formData.addressType = '字节'
            } else if (arr[4] === 'DBW') {
              formData.addressType = '字'
            }
            formData.showList = [1,3,4,6,7]
          } else if (IReg.test(address)) {
            let arr =  address.match(IReg) 
            formData.dataArea = '输入'
            formData.len = popupData.dataLen
            formData.addressOffset = arr[2]
            if (arr[1] === 'IB') {
              formData.addressType = '字节'
            } else if (arr[1] === 'IW') {
              formData.addressType = '字'
            }
            formData.showList = [1,4,6,7]
          } else if (QReg.test(address)) {
            let arr =  address.match(QReg) 
            formData.dataArea = '输出'
            formData.len = popupData.dataLen
            formData.addressOffset = arr[2]
            if (arr[1] === 'QB') {
              formData.addressType = '字节'
            } else if (arr[1] === 'QW') {
              formData.addressType = '字'
            }
            formData.showList = [1,4,6,7]
          }
          
        }
      }
    } else if (popupData.protocolName === 'Modbus_TCP') {
      let types = ['有符号8位整型','有符号16位整型','有符号32位整型','有符号64位整型','无符号8位整型','无符号16位整型','无符号32位整型','无符号64位整型','F32位浮点数IEEE754','F64位浮点数IEEE754']
      if (row.address == '000000') {
            row.address = ''
            popupData.dataValue = ''
            // resetData()
            // alert('输入格式不正确，请重新输入')
            return
      }
      // 1. 数据区域  2. 偏移地址   3.位  4. 长度
      if (popupData.dataType === '二进制变量') {
        let coilReg = /^[0]([0-9]{5})$/     // 线圈状态匹配正则
        let dIReg = /^[1]([0-9]{5})$/  // 离散输入匹配正则
        let IReg = /^[3]([0-9]{5})([.]{1})([0-9]|(1[0-5]))$/ // 输入寄存器正则
        let KReg = /^[4]([0-9]{5})([.]{1})([0-9]|(1[0-5]))$/  // 保持寄存器正则

        if (coilReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(coilReg) 
          formData.dataArea = '线圈状态'
          formData.address = parseInt(arr[1])
          formData.showList = [1,2]
        } else if (dIReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(dIReg) 
          formData.dataArea = '离散输入状态'
          formData.address = parseInt(arr[1])
          formData.showList = [1,2]
        } else if (IReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(IReg) 
          console.log(arr)
          formData.dataArea = '输入寄存器'
          formData.address = parseInt(arr[1])
          formData.bit = arr[3]
          formData.showList = [1,2,3]
        } else if (KReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(KReg) 
          formData.dataArea = '保持寄存器'
          formData.address = parseInt(arr[1])
          formData.bit = arr[3]
          formData.showList = [1,2,3]
        } else {
          // e.target.value = ''
          // popupData.dataValue = ''
          // resetData()
          // alert('输入格式不正确，请重新输入')
          return
        }

      } else if (types.includes(popupData.dataType)) {
        let IReg = /^[3]([0-9]{5})$/ // 输入寄存器正则
        let KReg = /^[4]([0-9]{5})$/  // 保持寄存器正则

        if (IReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(IReg) 
          formData.dataArea = '输入寄存器'
          formData.address = parseInt(arr[1])
          formData.showList = [1,2]
        } else if (KReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(KReg) 
          formData.dataArea = '保持寄存器'
          formData.address = parseInt(arr[1])
          formData.showList = [1,2]
        } else {
          // e.target.value = ''
          // popupData.dataValue = ''
          // resetData()
          // alert('输入格式不正确，请重新输入')
          return
        }
      } else if (popupData.dataType === '字符串') {
        let IReg = /^[3]([0-9]{5})$/ // 输入寄存器正则
        let KReg = /^[4]([0-9]{5})$/  // 保持寄存器正则

        if (IReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(IReg) 
          formData.dataArea = '输入寄存器'
          formData.address = parseInt(arr[1])
          formData.len = popupData.dataLen
          formData.showList = [1,2,4]
        } else if (KReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(KReg) 
          formData.dataArea = '保持寄存器'
          formData.address = parseInt(arr[1])
          formData.len = popupData.dataLen
          formData.showList = [1,2,4]
        } else {
          // e.target.value = ''
          // popupData.dataValue = ''
          // resetData()
          // alert('输入格式不正确，请重新输入')
          return
        }
      }
    } else if (popupData.protocolName === 'MC3E_Binary_Ethernet') {
      if (popupData.dataType === '二进制变量'){
        // 1. 数据区域    2.  地址    3.  位    4. 长度
        let XReg = /^[X]([0-9]{1,})$/     // 输入寄存器（X）匹配正则
        let YReg = /^[Y]([0-9]{1,})$/ // 输出寄存器（Y）匹配正则
        let MReg = /^[M]([0-9]{1,})$/ // 内部继电器（M）正则
        let TSReg = /^(TS)([0-9]{1,})$/  // 定时器（触点）（TS）正则
        let TCReg = /^(TC)([0-9]{1,})$/  // 定时器（线圈）（TC）正则
        let CSReg = /^(CS)([0-9]{1,})$/ // 计数器（触点）（CS）正则
        let CCReg = /^(CC)([0-9]{1,})$/  // 计数器（线圈）（CC）正则
        let DReg =  /^[D]([0-9]{1,})([.]{1})([0-9A-F]{1})$/  // 数据寄存器（D）正则
        let WReg = /^[W]([0-9]{1,})([.]{1})([0-9A-F]{1})$/  // 链接寄存器（W）正则
        let TNReg = /^(TN)([0-9]{1,})([.]{1})([0-9A-F]{1})$/  // 定时器（当前值）（TN）正则
        let CNReg = /^(CN)([0-9]{1,})([.]{1})([0-9A-F]{1})$/  // 计数器（当前值）（CN）正则
  
        if (XReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(XReg) 
          formData.dataArea = '输入寄存器（X）'
          formData.address = parseInt(arr[1])
          formData.showList = [1,2]
        } else if (YReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(YReg) 
          formData.dataArea = '输出寄存器（Y）'
          formData.address = parseInt(arr[1])
          formData.showList = [1,2]
        } else if (MReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(MReg) 
          formData.dataArea = '内部继电器（M）'
          formData.address = parseInt(arr[1])
          formData.showList = [1,2]
        } else if (TSReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(TSReg) 
          formData.dataArea = '定时器（触点）（TS）'
          formData.address = parseInt(arr[2])
          formData.showList = [1,2]
        } else if (TCReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(TCReg) 
          formData.dataArea = '定时器（线圈）（TC）'
          formData.address = parseInt(arr[2])
          formData.showList = [1,2]
        } else if (CSReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(CSReg) 
          formData.dataArea = '计数器（触点）（CS）'
          formData.address = parseInt(arr[2])
          formData.showList = [1,2]
        } else if (CCReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(CCReg) 
          formData.dataArea = '计数器（线圈）（CC）'
          formData.address = parseInt(arr[2])
          formData.showList = [1,2]
        } else if (DReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(DReg) 
          formData.dataArea = '数据寄存器（D）'
          formData.address = parseInt(arr[1])
          formData.bit = arr[3]
          formData.showList = [1,2,3]
        } else if (WReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(WReg) 
          formData.dataArea = '链接寄存器（W）'
          formData.address = parseInt(arr[1])
          formData.bit = arr[3]
          formData.showList = [1,2,3]
        } else if (TNReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(TNReg) 
          formData.dataArea = '定时器（当前值）（TN）'
          formData.address = parseInt(arr[2])
          formData.bit = arr[4]
          formData.showList = [1,2,3]
        } else if (CNReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(CNReg) 
          formData.dataArea = '计数器（当前值）（CN）'
          formData.address = parseInt(arr[2])
          formData.bit = arr[4]
          formData.showList = [1,2,3]
        } else {
          // e.target.value = ''
          // popupData.dataValue = ''
          // resetData()
          // alert('输入格式不正确，请重新输入')
          return
        }
  
  
  
      } else if (popupData.dataType === '字符串') {
        let DReg =  /^[D]([0-9]{1,})$/  // 数据寄存器（D）正则
        let WReg = /^[W]([0-9]{1,})$/  // 链接寄存器（W）正则
        let TNReg = /^(TN)([0-9]{1,})$/  // 定时器（当前值）（TN）正则
        let CNReg = /^(CN)([0-9]{1,})$/  // 计数器（当前值）（CN）正则
  
        if (DReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(DReg)
          console.log(arr) 
          formData.dataArea = '数据寄存器（D）'
          formData.address = arr[1]
          formData.len = popupData.dataLen
          formData.showList = [1,2,4]
        } else if (WReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(WReg) 
          formData.dataArea = '链接寄存器（W）'
          formData.address = arr[1]
          formData.len = popupData.dataLen
          formData.showList = [1,2,4]
        } else if (TNReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(TNReg) 
          formData.dataArea = '定时器（当前值）（TN）'
          formData.address = arr[2]
          formData.len = popupData.dataLen
          formData.showList = [1,2,4]
        } else if (CNReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(CNReg) 
          formData.dataArea = '计数器（当前值）（CN）'
          formData.address = arr[2]
          formData.len = popupData.dataLen
          formData.showList = [1,2,4]
        } else {
          // e.target.value = ''
          // popupData.dataValue = ''
          // resetData()
          // alert('输入格式不正确，请重新输入')
          return
        }
      } else {
        let DReg =  /^[D]([0-9]{1,})$/  // 数据寄存器（D）正则
        let WReg = /^[W]([0-9]{1,})$/  // 链接寄存器（W）正则
        let TNReg = /^(TN)([0-9]{1,})$/  // 定时器（当前值）（TN）正则
        let CNReg = /^(CN)([0-9]{1,})$/  // 计数器（当前值）（CN）正则
  
        if (DReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(DReg)
          console.log(arr) 
          formData.dataArea = '数据寄存器（D）'
          formData.address = arr[1]
          formData.showList = [1,2]
        } else if (WReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(WReg) 
          formData.dataArea = '链接寄存器（W）'
          formData.address = arr[1]
          formData.showList = [1,2]
        } else if (TNReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(TNReg) 
          formData.dataArea = '定时器（当前值）（TN）'
          formData.address = arr[2]
          formData.showList = [1,2]
        } else if (CNReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(CNReg) 
          formData.dataArea = '计数器（当前值）（CN）'
          formData.address = arr[2]
          formData.showList = [1,2]
        } else {
          // e.target.value = ''
          // popupData.dataValue = ''
          // resetData()
          // alert('输入格式不正确，请重新输入')
          return
        }
      }
    } else if (popupData.protocolName === 'MCA1E_Binary_Ethernet') {
      if (popupData.dataType === '二进制变量'){
        // 1. 数据区域    2.  地址    3.  位    4. 长度
        let XReg = /^[X]([0-9]{1,})$/     // 输入寄存器（X）匹配正则
        let YReg = /^[Y]([0-9]{1,})$/ // 输出寄存器（Y）匹配正则
        let MReg = /^[M]([0-9]{1,})$/ // 辅助继电器（M）正则
        let SReg = /^[S]([0-9]{1,})$/ // 状态（S）正则
        let TSReg = /^(TS)([0-9]{1,})$/  // 定时器（触点）（TS）正则
        let CSReg = /^(CS)([0-9]{1,})$/ // 计数器（触点）（CS）正则
        let DReg =  /^[D]([0-9]{1,})([.]{1})([0-9A-F]{1})$/  // 数据寄存器（D）正则
        let RReg =  /^[R]([0-9]{1,})([.]{1})([0-9A-F]{1})$/  // 扩展寄存器（R）正则
        let TNReg = /^(TN)([0-9]{1,})([.]{1})([0-9A-F]{1})$/  // 定时器（当前值）（TN）正则
        let CNReg = /^(CN)([0-9]{1,})([.]{1})([0-9A-F]{1})$/  // 计数器（当前值）（CN）正则
  
        if (XReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(XReg) 
          formData.dataArea = '输入寄存器（X）'
          formData.address = parseInt(arr[1])
          formData.showList = [1,2]
        } else if (YReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(YReg) 
          formData.dataArea = '输出寄存器（Y）'
          formData.address = parseInt(arr[1])
          formData.showList = [1,2]
        } else if (MReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(MReg) 
          formData.dataArea = '辅助继电器（M）'
          formData.address = parseInt(arr[1])
          formData.showList = [1,2]
        } else if (SReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(SReg) 
          formData.dataArea = '状态（S）'
          formData.address = parseInt(arr[1])
          formData.showList = [1,2]
        } else if (TSReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(TSReg) 
          formData.dataArea = '定时器（触点）（TS）'
          formData.address = parseInt(arr[2])
          formData.showList = [1,2]
        } else if (CSReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(CSReg) 
          formData.dataArea = '计数器（触点）（CS）'
          formData.address = parseInt(arr[2])
          formData.showList = [1,2]
        } else if (DReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(DReg) 
          formData.dataArea = '数据寄存器（D）'
          formData.address = parseInt(arr[1])
          formData.bit = arr[3]
          formData.showList = [1,2,3]
        } else if (RReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(RReg) 
          formData.dataArea = '扩展寄存器（R）'
          formData.address = parseInt(arr[1])
          formData.bit = arr[3]
          formData.showList = [1,2,3]
        } else if (TNReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(TNReg) 
          console.log(arr)
          formData.dataArea = '定时器（当前值）（TN）'
          formData.address = parseInt(arr[2])
          formData.bit = arr[4]
          formData.showList = [1,2,3]
        } else if (CNReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(CNReg) 
          formData.dataArea = '计数器（当前值）（CN）'
          formData.address = parseInt(arr[2])
          formData.bit = arr[4]
          formData.showList = [1,2,3]
        } else {
          // e.target.value = ''
          // popupData.dataValue = ''
          // resetData()
          // alert('输入格式不正确，请重新输入')
          return
        }
      } else if (popupData.dataType === '字符串') {
        let DReg =  /^[D]([0-9]{1,})$/  // 数据寄存器（D）正则
        let RReg =  /^[R]([0-9]{1,})$/  // 扩展寄存器（R）正则
        let TNReg = /^(TN)([0-9]{1,})$/  // 定时器（当前值）（TN）正则
        let CNReg = /^(CN)([0-9]{1,})$/  // 计数器（当前值）（CN）正则
  
        if (DReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(DReg) 
          formData.dataArea = '数据寄存器（D）'
          formData.address = parseInt(arr[1])
          formData.len = popupData.dataLen
          formData.showList = [1,2,4]
        } else if (RReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(RReg) 
          formData.dataArea = '扩展寄存器（R）'
          formData.address = parseInt(arr[1])
          formData.len = popupData.dataLen
          formData.showList = [1,2,4]
        } else if (TNReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(TNReg) 
          console.log(arr)
          formData.dataArea = '定时器（当前值）（TN）'
          formData.address = parseInt(arr[2])
          formData.len = popupData.dataLen
          formData.showList = [1,2,4]
        } else if (CNReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(CNReg) 
          formData.dataArea = '计数器（当前值）（CN）'
          formData.address = parseInt(arr[2])
          formData.len = popupData.dataLen
          formData.showList = [1,2,4]
        } else {
          // e.target.value = ''
          // popupData.dataValue = ''
          // resetData()
          // alert('输入格式不正确，请重新输入')
          return
        }
      } else {
        let DReg =  /^[D]([0-9]{1,})$/  // 数据寄存器（D）正则
        let RReg =  /^[R]([0-9]{1,})$/  // 扩展寄存器（R）正则
        let TNReg = /^(TN)([0-9]{1,})$/  // 定时器（当前值）（TN）正则
        let CNReg = /^(CN)([0-9]{1,})$/  // 计数器（当前值）（CN）正则
  
        if (DReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(DReg) 
          formData.dataArea = '数据寄存器（D）'
          formData.address = parseInt(arr[1])
          formData.showList = [1,2]
        } else if (RReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(RReg) 
          formData.dataArea = '扩展寄存器（R）'
          formData.address = parseInt(arr[1])
          formData.showList = [1,2]
        } else if (TNReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(TNReg) 
          console.log(arr)
          formData.dataArea = '定时器（当前值）（TN）'
          formData.address = parseInt(arr[2])
          formData.showList = [1,2]
        } else if (CNReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(CNReg) 
          formData.dataArea = '计数器（当前值）（CN）'
          formData.address = parseInt(arr[2])
          formData.showList = [1,2]
        } else {
          // e.target.value = ''
          // popupData.dataValue = ''
          // resetData()
          // alert('输入格式不正确，请重新输入')
          return
        }
  
  
      }
    } else if (popupData.protocolName === 'Fins_TCP') {
      // 1. 数据区域    2.  地址    3.  位    4. 长度
      if (popupData.dataType === '二进制变量'){
        let TIMReg = /^(T)([0-9]{1,})$/
        let CIOReg = /^(CIO)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let WRReg = /^(W)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let HRReg = /^(H)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let ARReg = /^(A)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let DMReg = /^(D)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let ECBReg = /^(E)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let E0Reg = /^(E00_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let E1Reg = /^(E01_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let E2Reg = /^(E02_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let E3Reg = /^(E03_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let E4Reg = /^(E04_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let E5Reg = /^(E05_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let E6Reg = /^(E06_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let E7Reg = /^(E07_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let E8Reg = /^(E08_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let EAReg = /^(E0A_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let EBReg = /^(E0B_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let ECReg = /^(E0C_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let EDReg = /^(E0D_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let EEReg = /^(E0E_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let EFReg = /^(E0F_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let E10Reg = /^(E10_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let E11Reg = /^(E11_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let E12Reg = /^(E12_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let E13Reg = /^(E13_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let E14Reg = /^(E14_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let E15Reg = /^(E15_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let E16Reg = /^(E16_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let E17Reg = /^(E17_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let E18Reg = /^(E18_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
  
        if (TIMReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(TIMReg) 
          formData.dataArea = 'TIM/CNT(Complettion Flag)'
          formData.address = parseInt(arr[2])
          formData.showList = [1,2]
        } else if (CIOReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(CIOReg) 
          formData.dataArea = 'CIO'
          formData.address = parseInt(arr[2])
          formData.bit = arr[4]
          formData.showList = [1,2,3]
        } else if (WRReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(WRReg) 
          formData.dataArea = 'WR'
          formData.address = parseInt(arr[2])
          formData.bit = arr[4]
          formData.showList = [1,2,3]
        } else if (HRReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(HRReg) 
          formData.dataArea = 'HR'
          formData.address = parseInt(arr[2])
          formData.bit = arr[4]
          formData.showList = [1,2,3]
        } else if (ARReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(ARReg) 
          formData.dataArea = 'AR'
          formData.address = parseInt(arr[2])
          formData.bit = arr[4]
          formData.showList = [1,2,3]
        } else if (DMReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(DMReg) 
          formData.dataArea = 'DM'
          formData.address = parseInt(arr[2])
          formData.bit = arr[4]
          formData.showList = [1,2,3]
        } else if (ECBReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(ECBReg) 
          formData.dataArea = 'EM current bank'
          formData.address = parseInt(arr[2])
          formData.bit = arr[4]
          formData.showList = [1,2,3]
        } else if (E0Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E0Reg) 
          formData.dataArea = 'EM bank 0'
          formData.address = parseInt(arr[2])
          formData.bit = arr[4]
          formData.showList = [1,2,3]
        } else if (E1Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E1Reg) 
          formData.dataArea = 'EM bank 1'
          formData.address = parseInt(arr[2])
          formData.bit = arr[4]
          formData.showList = [1,2,3]
        } else if (E2Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E2Reg) 
          formData.dataArea = 'EM bank 2'
          formData.address = parseInt(arr[2])
          formData.bit = arr[4]
          formData.showList = [1,2,3]
        } else if (E3Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E3Reg) 
          formData.dataArea = 'EM bank 3'
          formData.address = parseInt(arr[2])
          formData.bit = arr[4]
          formData.showList = [1,2,3]
        } else if (E4Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E4Reg) 
          formData.dataArea = 'EM bank 4'
          formData.address = parseInt(arr[2])
          formData.bit = arr[4]
          formData.showList = [1,2,3]
        } else if (E5Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E5Reg) 
          formData.dataArea = 'EM bank 5'
          formData.address = parseInt(arr[2])
          formData.bit = arr[4]
          formData.showList = [1,2,3]
        } else if (E6Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E6Reg) 
          formData.dataArea = 'EM bank 6'
          formData.address = parseInt(arr[2])
          formData.bit = arr[4]
          formData.showList = [1,2,3]
        } else if (E7Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E7Reg) 
          formData.dataArea = 'EM bank 7'
          formData.address = parseInt(arr[2])
          formData.bit = arr[4]
          formData.showList = [1,2,3]
        } else if (E8Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E8Reg) 
          formData.dataArea = 'EM bank 8'
          formData.address = parseInt(arr[2])
          formData.bit = arr[4]
          formData.showList = [1,2,3]
        } else if (EAReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(EAReg) 
          formData.dataArea = 'EM bank A'
          formData.address = parseInt(arr[2])
          formData.bit = arr[4]
          formData.showList = [1,2,3]
        } else if (EBReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(EBReg) 
          formData.dataArea = 'EM bank B'
          formData.address = parseInt(arr[2])
          formData.bit = arr[4]
          formData.showList = [1,2,3]
        } else if (ECReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(ECReg) 
          formData.dataArea = 'EM bank C'
          formData.address = parseInt(arr[2])
          formData.bit = arr[4]
          formData.showList = [1,2,3]
        } else if (EDReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(EDReg) 
          formData.dataArea = 'EM bank D'
          formData.address = parseInt(arr[2])
          formData.bit = arr[4]
          formData.showList = [1,2,3]
        } else if (EEReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(EEReg) 
          formData.dataArea = 'EM bank E'
          formData.address = parseInt(arr[2])
          formData.bit = arr[4]
          formData.showList = [1,2,3]
        } else if (EFReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(EFReg) 
          formData.dataArea = 'EM bank F'
          formData.address = parseInt(arr[2])
          formData.bit = arr[4]
          formData.showList = [1,2,3]
        } else if (E10Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E10Reg) 
          formData.dataArea = 'EM bank 10'
          formData.address = parseInt(arr[2])
          formData.bit = arr[4]
          formData.showList = [1,2,3]
        } else if (E11Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E11Reg) 
          formData.dataArea = 'EM bank 11'
          formData.address = parseInt(arr[2])
          formData.bit = arr[4]
          formData.showList = [1,2,3]
        } else if (E12Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E12Reg) 
          formData.dataArea = 'EM bank 12'
          formData.address = parseInt(arr[2])
          formData.bit = arr[4]
          formData.showList = [1,2,3]
        } else if (E13Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E13Reg) 
          formData.dataArea = 'EM bank 13'
          formData.address = parseInt(arr[2])
          formData.bit = arr[4]
          formData.showList = [1,2,3]
        } else if (E14Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E14Reg) 
          formData.dataArea = 'EM bank 14'
          formData.address = parseInt(arr[2])
          formData.bit = arr[4]
          formData.showList = [1,2,3]
        } else if (E15Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E15Reg) 
          formData.dataArea = 'EM bank 15'
          formData.address = parseInt(arr[2])
          formData.bit = arr[4]
          formData.showList = [1,2,3]
        } else if (E16Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E16Reg) 
          formData.dataArea = 'EM bank 16'
          formData.address = parseInt(arr[2])
          formData.bit = arr[4]
          formData.showList = [1,2,3]
        } else if (E17Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E17Reg) 
          formData.dataArea = 'EM bank 17'
          formData.address = parseInt(arr[2])
          formData.bit = arr[4]
          formData.showList = [1,2,3]
        } else if (E18Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E18Reg) 
          formData.dataArea = 'EM bank 18'
          formData.address = parseInt(arr[2])
          formData.bit = arr[4]
          formData.showList = [1,2,3]
        } else {
          // e.target.value = ''
          // popupData.dataValue = ''
          // resetData()
          // alert('输入格式不正确，请重新输入')
          return
        }
  
      } else if (popupData.dataType === '字符串') {
        let CIOReg = /^(CIO)([0-9]{1,})$/
        let WRReg = /^(W)([0-9]{1,})$/
        let HRReg = /^(H)([0-9]{1,})$/
        let ARReg = /^(A)([0-9]{1,})$/
        let DMReg = /^(D)([0-9]{1,})$/
        let ECBReg = /^(E)([0-9]{1,})$/
        let E0Reg = /^(E00_)([0-9]{1,})$/
        let E1Reg = /^(E01_)([0-9]{1,})$/
        let E2Reg = /^(E02_)([0-9]{1,})$/
        let E3Reg = /^(E03_)([0-9]{1,})$/
        let E4Reg = /^(E04_)([0-9]{1,})$/
        let E5Reg = /^(E05_)([0-9]{1,})$/
        let E6Reg = /^(E06_)([0-9]{1,})$/
        let E7Reg = /^(E07_)([0-9]{1,})$/
        let E8Reg = /^(E08_)([0-9]{1,})$/
        let EAReg = /^(E0A_)([0-9]{1,})$/
        let EBReg = /^(E0B_)([0-9]{1,})$/
        let ECReg = /^(E0C_)([0-9]{1,})$/
        let EDReg = /^(E0D_)([0-9]{1,})$/
        let EEReg = /^(E0E_)([0-9]{1,})$/
        let EFReg = /^(E0F_)([0-9]{1,})$/
        let E10Reg = /^(E10_)([0-9]{1,})$/
        let E11Reg = /^(E11_)([0-9]{1,})$/
        let E12Reg = /^(E12_)([0-9]{1,})$/
        let E13Reg = /^(E13_)([0-9]{1,})$/
        let E14Reg = /^(E14_)([0-9]{1,})$/
        let E15Reg = /^(E15_)([0-9]{1,})$/
        let E16Reg = /^(E16_)([0-9]{1,})$/
        let E17Reg = /^(E17_)([0-9]{1,})$/
        let E18Reg = /^(E18_)([0-9]{1,})$/
  
        if (CIOReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(CIOReg) 
          formData.dataArea = 'CIO'
          formData.address = parseInt(arr[2])
          formData.len = popupData.dataLen
          formData.showList = [1,2,4]
        } else if (WRReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(WRReg) 
          formData.dataArea = 'WR'
          formData.address = parseInt(arr[2])
          formData.len = popupData.dataLen
          formData.showList = [1,2,4]
        } else if (HRReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(HRReg) 
          formData.dataArea = 'HR'
          formData.address = parseInt(arr[2])
          formData.len = popupData.dataLen
          formData.showList = [1,2,4]
        } else if (ARReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(ARReg) 
          formData.dataArea = 'AR'
          formData.address = parseInt(arr[2])
          formData.len = popupData.dataLen
          formData.showList = [1,2,4]
        } else if (DMReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(DMReg) 
          formData.dataArea = 'DM'
          formData.address = parseInt(arr[2])
          formData.len = popupData.dataLen
          formData.showList = [1,2,4]
        } else if (ECBReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(ECBReg) 
          formData.dataArea = 'EM current bank'
          formData.address = parseInt(arr[2])
          formData.len = popupData.dataLen
          formData.showList = [1,2,4]
        } else if (E0Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E0Reg) 
          formData.dataArea = 'EM bank 0'
          formData.address = parseInt(arr[2])
          formData.len = popupData.dataLen
          formData.showList = [1,2,4]
        } else if (E1Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E1Reg) 
          formData.dataArea = 'EM bank 1'
          formData.address = parseInt(arr[2])
          formData.len = popupData.dataLen
          formData.showList = [1,2,4]
        } else if (E2Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E2Reg) 
          formData.dataArea = 'EM bank 2'
          formData.address = parseInt(arr[2])
          formData.len = popupData.dataLen
          formData.showList = [1,2,4]
        } else if (E3Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E3Reg) 
          formData.dataArea = 'EM bank 3'
          formData.address = parseInt(arr[2])
          formData.len = popupData.dataLen
          formData.showList = [1,2,4]
        } else if (E4Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E4Reg) 
          formData.dataArea = 'EM bank 4'
          formData.address = parseInt(arr[2])
          formData.len = popupData.dataLen
          formData.showList = [1,2,4]
        } else if (E5Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E5Reg) 
          formData.dataArea = 'EM bank 5'
          formData.address = parseInt(arr[2])
          formData.len = popupData.dataLen
          formData.showList = [1,2,4]
        } else if (E6Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E6Reg) 
          formData.dataArea = 'EM bank 6'
          formData.address = parseInt(arr[2])
          formData.len = popupData.dataLen
          formData.showList = [1,2,4]
        } else if (E7Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E7Reg) 
          formData.dataArea = 'EM bank 7'
          formData.address = parseInt(arr[2])
          formData.len = popupData.dataLen
          formData.showList = [1,2,4]
        } else if (E8Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E8Reg) 
          formData.dataArea = 'EM bank 8'
          formData.address = parseInt(arr[2])
          formData.len = popupData.dataLen
          formData.showList = [1,2,4]
        } else if (EAReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(EAReg) 
          formData.dataArea = 'EM bank A'
          formData.address = parseInt(arr[2])
          formData.len = popupData.dataLen
          formData.showList = [1,2,4]
        } else if (EBReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(EBReg) 
          formData.dataArea = 'EM bank B'
          formData.address = parseInt(arr[2])
          formData.len = popupData.dataLen
          formData.showList = [1,2,4]
        } else if (ECReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(ECReg) 
          formData.dataArea = 'EM bank C'
          formData.address = parseInt(arr[2])
          formData.len = popupData.dataLen
          formData.showList = [1,2,4]
        } else if (EDReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(EDReg) 
          formData.dataArea = 'EM bank D'
          formData.address = parseInt(arr[2])
          formData.len = popupData.dataLen
          formData.showList = [1,2,4]
        } else if (EEReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(EEReg) 
          formData.dataArea = 'EM bank E'
          formData.address = parseInt(arr[2])
          formData.len = popupData.dataLen
          formData.showList = [1,2,4]
        } else if (EFReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(EFReg) 
          formData.dataArea = 'EM bank F'
          formData.address = parseInt(arr[2])
          formData.len = popupData.dataLen
          formData.showList = [1,2,4]
        } else if (E10Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E10Reg) 
          formData.dataArea = 'EM bank 10'
          formData.address = parseInt(arr[2])
          formData.len = popupData.dataLen
          formData.showList = [1,2,4]
        } else if (E11Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E11Reg) 
          formData.dataArea = 'EM bank 11'
          formData.address = parseInt(arr[2])
          formData.len = popupData.dataLen
          formData.showList = [1,2,4]
        } else if (E12Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E12Reg) 
          formData.dataArea = 'EM bank 12'
          formData.address = parseInt(arr[2])
          formData.len = popupData.dataLen
          formData.showList = [1,2,4]
        } else if (E13Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E13Reg) 
          formData.dataArea = 'EM bank 13'
          formData.address = parseInt(arr[2])
          formData.len = popupData.dataLen
          formData.showList = [1,2,4]
        } else if (E14Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E14Reg) 
          formData.dataArea = 'EM bank 14'
          formData.address = parseInt(arr[2])
          formData.len = popupData.dataLen
          formData.showList = [1,2,4]
        } else if (E15Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E15Reg) 
          formData.dataArea = 'EM bank 15'
          formData.address = parseInt(arr[2])
          formData.len = popupData.dataLen
          formData.showList = [1,2,4]
        } else if (E16Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E16Reg) 
          formData.dataArea = 'EM bank 16'
          formData.address = parseInt(arr[2])
          formData.len = popupData.dataLen
          formData.showList = [1,2,4]
        } else if (E17Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E17Reg) 
          formData.dataArea = 'EM bank 17'
          formData.address = parseInt(arr[2])
          formData.len = popupData.dataLen
          formData.showList = [1,2,4]
        } else if (E18Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E18Reg) 
          formData.dataArea = 'EM bank 18'
          formData.address = parseInt(arr[2])
          formData.len = popupData.dataLen
          formData.showList = [1,2,4]
        } else {
          // e.target.value = ''
          // popupData.dataValue = ''
          // resetData()
          // alert('输入格式不正确，请重新输入')
          return
        }
  
      } else {
        let CIOReg = /^(CIO)([0-9]{1,})$/
        let WRReg = /^(W)([0-9]{1,})$/
        let HRReg = /^(H)([0-9]{1,})$/
        let ARReg = /^(A)([0-9]{1,})$/
        let DMReg = /^(D)([0-9]{1,})$/
        let ECBReg = /^(E)([0-9]{1,})$/
        let E0Reg = /^(E00_)([0-9]{1,})$/
        let E1Reg = /^(E01_)([0-9]{1,})$/
        let E2Reg = /^(E02_)([0-9]{1,})$/
        let E3Reg = /^(E03_)([0-9]{1,})$/
        let E4Reg = /^(E04_)([0-9]{1,})$/
        let E5Reg = /^(E05_)([0-9]{1,})$/
        let E6Reg = /^(E06_)([0-9]{1,})$/
        let E7Reg = /^(E07_)([0-9]{1,})$/
        let E8Reg = /^(E08_)([0-9]{1,})$/
        let EAReg = /^(E0A_)([0-9]{1,})$/
        let EBReg = /^(E0B_)([0-9]{1,})$/
        let ECReg = /^(E0C_)([0-9]{1,})$/
        let EDReg = /^(E0D_)([0-9]{1,})$/
        let EEReg = /^(E0E_)([0-9]{1,})$/
        let EFReg = /^(E0F_)([0-9]{1,})$/
        let E10Reg = /^(E10_)([0-9]{1,})$/
        let E11Reg = /^(E11_)([0-9]{1,})$/
        let E12Reg = /^(E12_)([0-9]{1,})$/
        let E13Reg = /^(E13_)([0-9]{1,})$/
        let E14Reg = /^(E14_)([0-9]{1,})$/
        let E15Reg = /^(E15_)([0-9]{1,})$/
        let E16Reg = /^(E16_)([0-9]{1,})$/
        let E17Reg = /^(E17_)([0-9]{1,})$/
        let E18Reg = /^(E18_)([0-9]{1,})$/
  
        if (CIOReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(CIOReg) 
          formData.dataArea = 'CIO'
          formData.address = parseInt(arr[2])
          formData.showList = [1,2]
        } else if (WRReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(WRReg) 
          formData.dataArea = 'WR'
          formData.address = parseInt(arr[2])
          formData.showList = [1,2]
        } else if (HRReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(HRReg) 
          formData.dataArea = 'HR'
          formData.address = parseInt(arr[2])
          formData.showList = [1,2]
        } else if (ARReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(ARReg) 
          formData.dataArea = 'AR'
          formData.address = parseInt(arr[2])
          formData.showList = [1,2]
        } else if (DMReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(DMReg) 
          formData.dataArea = 'DM'
          formData.address = parseInt(arr[2])
          formData.showList = [1,2]
        } else if (ECBReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(ECBReg) 
          formData.dataArea = 'EM current bank'
          formData.address = parseInt(arr[2])
          formData.showList = [1,2]
        } else if (E0Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E0Reg) 
          formData.dataArea = 'EM bank 0'
          formData.address = parseInt(arr[2])
          formData.showList = [1,2]
        } else if (E1Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E1Reg) 
          formData.dataArea = 'EM bank 1'
          formData.address = parseInt(arr[2])
          formData.showList = [1,2]
        } else if (E2Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E2Reg) 
          formData.dataArea = 'EM bank 2'
          formData.address = parseInt(arr[2])
          formData.showList = [1,2]
        } else if (E3Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E3Reg) 
          formData.dataArea = 'EM bank 3'
          formData.address = parseInt(arr[2])
          formData.showList = [1,2]
        } else if (E4Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E4Reg) 
          formData.dataArea = 'EM bank 4'
          formData.address = parseInt(arr[2])
          formData.showList = [1,2]
        } else if (E5Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E5Reg) 
          formData.dataArea = 'EM bank 5'
          formData.address = parseInt(arr[2])
          formData.showList = [1,2]
        } else if (E6Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E6Reg) 
          formData.dataArea = 'EM bank 6'
          formData.address = parseInt(arr[2])
          formData.len = popupData.dataLen
          formData.showList = [1,2]
        } else if (E7Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E7Reg) 
          formData.dataArea = 'EM bank 7'
          formData.address = parseInt(arr[2])
          formData.showList = [1,2]
        } else if (E8Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E8Reg) 
          formData.dataArea = 'EM bank 8'
          formData.address = parseInt(arr[2])
          formData.len = popupData.dataLen
          formData.showList = [1,2]
        } else if (EAReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(EAReg) 
          formData.dataArea = 'EM bank A'
          formData.address = parseInt(arr[2])
          formData.showList = [1,2]
        } else if (EBReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(EBReg) 
          formData.dataArea = 'EM bank B'
          formData.address = parseInt(arr[2])
          formData.showList = [1,2]
        } else if (ECReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(ECReg) 
          formData.dataArea = 'EM bank C'
          formData.address = parseInt(arr[2])
          formData.len = popupData.dataLen
          formData.showList = [1,2]
        } else if (EDReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(EDReg) 
          formData.dataArea = 'EM bank D'
          formData.address = parseInt(arr[2])
          formData.showList = [1,2]
        } else if (EEReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(EEReg) 
          formData.dataArea = 'EM bank E'
          formData.address = parseInt(arr[2])
          formData.showList = [1,2]
        } else if (EFReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(EFReg) 
          formData.dataArea = 'EM bank F'
          formData.address = parseInt(arr[2])
          formData.showList = [1,2]
        } else if (E10Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E10Reg) 
          formData.dataArea = 'EM bank 10'
          formData.address = parseInt(arr[2])
          formData.showList = [1,2]
        } else if (E11Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E11Reg) 
          formData.dataArea = 'EM bank 11'
          formData.address = parseInt(arr[2])
          formData.showList = [1,2]
        } else if (E12Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E12Reg) 
          formData.dataArea = 'EM bank 12'
          formData.address = parseInt(arr[2])
          formData.showList = [1,2]
        } else if (E13Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E13Reg) 
          formData.dataArea = 'EM bank 13'
          formData.address = parseInt(arr[2])
          formData.showList = [1,2]
        } else if (E14Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E14Reg) 
          formData.dataArea = 'EM bank 14'
          formData.address = parseInt(arr[2])
          formData.showList = [1,2]
        } else if (E15Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E15Reg) 
          formData.dataArea = 'EM bank 15'
          formData.address = parseInt(arr[2])
          formData.showList = [1,2]
        } else if (E16Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E16Reg) 
          formData.dataArea = 'EM bank 16'
          formData.address = parseInt(arr[2])
          formData.showList = [1,2]
        } else if (E17Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E17Reg) 
          formData.dataArea = 'EM bank 17'
          formData.address = parseInt(arr[2])
          formData.showList = [1,2]
        } else if (E18Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E18Reg) 
          formData.dataArea = 'EM bank 18'
          formData.address = parseInt(arr[2])
          formData.showList = [1,2]
        } else {
          // e.target.value = ''
          // popupData.dataValue = ''
          // resetData()
          // alert('输入格式不正确，请重新输入')
          return
        }
  
      }
    }


    this.setState(state=> {
      return {
        formData,
      }
    })
    
    // this.addressForm.current.setFieldsValue(formData)
  }

  openPop = ()=>{
    console.log('open')
    
    let { popupData, formData } = this.state
    if (popupData.protocolName === 'S7_TCP') {    //  渲染 S7_TCP弹窗
      // 1: 数据区域  2. 寄存器字母块（M/DBX/I/Q/MB/DBB/IB/QB/MW/DBW/IW/QW/MD/DBD/ID/QD） 3.  DB号  4. 地址偏移量   5. 位   6. 长度   7.  地址类型 
      // 数据区域 需要赋予默认值或回显
      if (popupData.model === 'S7-200Smart') { // S7_TCP协议 S7-200Smart型号
        let dataArea = formData.dataArea ? formData.dataArea : 'M'
        formData.dataArea = dataArea
        if (popupData.dataType === '二进制变量') {
          formData.showList = formData.showList.length === 0 ?  [1,2,5] : formData.showList
        } else if (popupData.dataType === '有符号8位整型' || popupData.dataType === '无符号8位整型') {
          formData.letters = dataArea === 'M' ?  formData.letters = 'MB' : formData.letters
          formData.showList = formData.showList.length === 0 ?  [1,2] : formData.showList
        } else if (popupData.dataType === '有符号16位整型' || popupData.dataType === '无符号16位整型') {
          formData.letters = dataArea === 'M' ?  formData.letters = 'MW' : formData.letters
          formData.showList = formData.showList.length === 0 ?  [1,2] : formData.showList
        } else if (popupData.dataType === '有符号32位整型' || popupData.dataType === '无符号32位整型' || popupData.dataType === 'F32位浮点数IEEE754') {
          formData.letters = dataArea === 'M' ?  formData.letters = 'MD' : formData.letters
          formData.showList = formData.showList.length === 0 ?  [1,2] : formData.showList
        } else if (popupData.dataType === '文本变量8位字符集') {
          formData.showList = formData.showList.length === 0 ?  [1,4,6] : formData.showList
        } else if (popupData.dataType === '字符串') {
          formData.showList = formData.showList.length === 0 ?  [1,4,6,7] : formData.showList
        }
      } else {
        let dataArea = formData.dataArea ? formData.dataArea : '位'
        formData.dataArea = dataArea
        if (popupData.dataType === '二进制变量') {
          formData.showList = formData.showList.length === 0 ?  [1,2,5] : formData.showList
        } else if (popupData.dataType === '有符号8位整型' || popupData.dataType === '无符号8位整型') {
          formData.letters = dataArea === '位' ?  formData.letters = 'MB' : formData.letters
          formData.showList = formData.showList.length === 0 ?  [1,2] : formData.showList
        } else if (popupData.dataType === '有符号16位整型' || popupData.dataType === '无符号16位整型') {
          formData.letters = dataArea === '位' ?  formData.letters = 'MW' : formData.letters
          formData.showList = formData.showList.length === 0 ?  [1,2] : formData.showList
        } else if (popupData.dataType === '有符号32位整型' || popupData.dataType === '无符号32位整型' || popupData.dataType === 'F32位浮点数IEEE754' || popupData.dataType === '定时器') {
          formData.letters = dataArea === '位' ?  formData.letters = 'MD' : formData.letters
          formData.showList = formData.showList.length === 0 ?  [1,2] : formData.showList
        } else if (popupData.dataType === '有符号64位整型' || popupData.dataType === '无符号64位整型' || popupData.dataType === 'F64位浮点数IEEE754' || popupData.dataType === '日期'|| popupData.dataType === '时间'|| popupData.dataType === '日期时间') {
          formData.showList = formData.showList.length === 0 ?  [1,4,7] : formData.showList
        } else if (popupData.dataType === '文本变量8位字符集' || popupData.dataType === '文本变量16位字符集') {
          formData.showList = formData.showList.length === 0 ?  [1,4,6] : formData.showList
        } else if (popupData.dataType === '字符串' || popupData.dataType === '宽字符串') {
          formData.showList = formData.showList.length === 0 ?  [1,4,6,7] : formData.showList
        }
      }
      console.log(formData.showList, formData, popupData.dataType)
      // this.renderS7_TCPHTML(formData.showList, formData, popupData.dataType)
      this.setState(state=>{
        return {
          formData,
          type: popupData.dataType
        }
      })
    }else if(popupData.protocolName === 'Modbus_TCP'){
      // 1. 数据区域  2. 偏移地址   3.位  4. 长度
      let types = ['有符号8位整型','有符号16位整型','有符号32位整型','有符号64位整型','无符号8位整型','无符号16位整型','无符号32位整型','无符号64位整型','F32位浮点数IEEE754','F64位浮点数IEEE754']
      formData.dataArea = formData.dataArea ? formData.dataArea : '线圈状态'
      if (popupData.dataType === '二进制变量') {
        formData.showList = formData.showList.length === 0 ?  [1,2] : formData.showList
      }  else if (types.includes(popupData.dataType)) {
        // 此处判断赋默认值还是回显值
        let areas = ['输入寄存器', '保持寄存器']
        formData.dataArea = areas.includes(formData.dataArea) ? formData.dataArea : '输入寄存器'
        formData.showList = formData.showList.length === 0 ?  [1,2] : formData.showList
      } else if (popupData.dataType === '字符串') {
        // 此处判断赋默认值还是回显值
        let areas = ['输入寄存器', '保持寄存器']
        formData.dataArea = areas.includes(formData.dataArea) ? formData.dataArea : '输入寄存器'
        formData.showList = formData.showList.length === 0 ?  [1,2,4] : formData.showList
      } 
      this.addressForm.current.setFieldsValue({
        dataArea: formData.dataArea
      })
      this.setState(state=>{
        return {
          formData,
          type: popupData.dataType
        }
      })
    }else if (popupData.protocolName === 'MC3E_Binary_Ethernet') { //  渲染 MC3E_Binary_Ethernet 弹窗
      formData.dataArea = formData.dataArea ? formData.dataArea : '输入寄存器（X）'
      if (popupData.dataType === '二进制变量') {
        formData.showList = formData.showList.length === 0 ?  [1,2] : formData.showList
      } else if (popupData.dataType === '字符串') {
        // 此处判断赋默认值还是回显值
        let areas = ['数据寄存器（D）', '链接寄存器（W）', '定时器（当前值）（TN）', '计数器（当前值）（CN）']
        formData.dataArea = areas.includes(formData.dataArea) ? formData.dataArea : '数据寄存器（D）'
        formData.showList = formData.showList.length === 0 ?  [1,2,4] : formData.showList
      } else {
        // 此处判断赋默认值还是回显值
        let areas = ['数据寄存器（D）', '链接寄存器（W）', '定时器（当前值）（TN）', '计数器（当前值）（CN）']
        formData.dataArea = areas.includes(formData.dataArea) ? formData.dataArea : '数据寄存器（D）'
        formData.showList = formData.showList.length === 0 ?  [1,2] : formData.showList
      }
      this.setState(state=>{
        return {
          formData,
          type: popupData.dataType
        }
      })
    } else if (popupData.protocolName === 'MCA1E_Binary_Ethernet') { //  渲染 MCA1E_Binary_Ethernet 弹窗
      formData.dataArea = formData.dataArea ? formData.dataArea : '输入寄存器（X）'
      if (popupData.dataType === '二进制变量') {
        formData.showList = formData.showList.length === 0 ?  [1,2] : formData.showList
      }  else if (popupData.dataType === '字符串') {
        // 此处判断赋默认值还是回显值
        let areas = ['数据寄存器（D）', '扩展寄存器（R）', '定时器（当前值）（TN）', '计数器（当前值）（CN）']
        formData.dataArea = areas.includes(formData.dataArea) ? formData.dataArea : '数据寄存器（D）'
        formData.showList = formData.showList.length === 0 ?  [1,2,4] : formData.showList
      } else {
        // 此处判断赋默认值还是回显值
        let areas = ['数据寄存器（D）', '扩展寄存器（R）', '定时器（当前值）（TN）', '计数器（当前值）（CN）']
        formData.dataArea = areas.includes(formData.dataArea) ? formData.dataArea : '数据寄存器（D）'
        formData.showList = formData.showList.length === 0 ?  [1,2] : formData.showList
      }
      this.setState(state=>{
        return {
          formData,
          type: popupData.dataType
        }
      })
    } else if (popupData.protocolName === 'Fins_TCP') { //  渲染 Fins_TCP 弹窗
      formData.dataArea = formData.dataArea ? formData.dataArea : 'CIO'
      if (popupData.dataType === '二进制变量') {
        formData.showList = formData.showList.length === 0 ?  [1,2,3] : formData.showList
      } else if (popupData.dataType === '字符串') {
        formData.showList = formData.showList.length === 0 ?  [1,2,4] : formData.showList
      } else {
        formData.showList = formData.showList.length === 0 ?  [1,2] : formData.showList
      }
      this.setState(state=>{
        return {
          formData,
          type: popupData.dataType
        }
      })
    }
    this.addressForm.current.setFieldsValue(this.state.formData)
  }

  // 选择下拉内容 -- S7_TCP协议
  changeData = (e, prop, type)=>{
    let obj={};
    let { popupData } = this.state
    obj[prop] = e
    if (popupData.model === 'S7-200Smart') {
      if (type === '二进制变量') {
        if (prop === 'dataArea') {  // 数据区域部分需要重新渲染弹窗html元素
          if (e === 'M') {
            obj.letters = 'M'
            obj.showList = [1,2,5]
          } else if (e === 'V') {
            obj.letters = 'V'
            obj.showList = [1,2,5]
          } else if (e === 'I') {
            obj.letters = 'I'
            obj.showList = [1,2,5]
          } else if (e === 'Q') {
            obj.letters = 'Q'
            obj.showList = [1,2,5]
          }
        }
      } else if (type === '有符号8位整型' || type === '无符号8位整型') {
        if (prop === 'dataArea') {  // 数据区域部分需要重新渲染弹窗html元素
          if (e === 'M') {
            obj.letters = 'MB'
            obj.showList = [1,2]
          } else if (e === 'V') {
            obj.letters = 'VB'
            obj.showList = [1,2]
          } else if (e === 'I') {
            obj.letters = 'IB'
            obj.showList = [1,2]
          } else if (e === 'Q') {
            obj.letters = 'QB'
            obj.showList = [1,2]
          }
        }
      } else if (type === '有符号16位整型' || type === '无符号16位整型') {
        if (prop === 'dataArea') {  // 数据区域部分需要重新渲染弹窗html元素
          if (e === 'M') {
            obj.letters = 'MW'
            obj.showList = [1,2]
          } else if (e === 'V') {
            obj.letters = 'VW'
            obj.showList = [1,2]
          } else if (e === 'I') {
            obj.letters = 'IW'
            obj.showList = [1,2]
          } else if (e === 'Q') {
            obj.letters = 'QW'
            obj.showList = [1,2]
          }
        }
      } else if (type === '有符号32位整型' || type === '无符号32位整型' || type === 'F32位浮点数IEEE754') {
        if (prop === 'dataArea') {  // 数据区域部分需要重新渲染弹窗html元素
          if (e === 'M') {
            obj.letters = 'MD'
            obj.showList = [1,2]
          } else if (e === 'V') {
            obj.letters = 'VD'
            obj.showList = [1,2]
          } else if (e === 'I') {
            obj.letters = 'ID'
            obj.showList = [1,2]
          } else if (e === 'Q') {
            obj.letters = 'QD'
            obj.showList = [1,2]
          }
        }
      } else if (type === '文本变量8位字符集') {
        if (prop === 'dataArea') {  // 数据区域部分需要重新渲染弹窗html元素
          if (e === 'M') {
            obj.showList = [1,4,6]
          } else if (e === 'V') {
            obj.showList = [1,4,6]
          } else if (e === 'I') {
            obj.showList = [1,4,6]
          } else if (e === 'Q') {
            obj.showList = [1,4,6]
          }
        }
      } else if (type === '字符串') {
        if (prop === 'dataArea') {  // 数据区域部分需要重新渲染弹窗html元素
          if (e === 'M') {
            obj.showList = [1,4,6,7]
          } else if (e === 'V') {
            obj.showList = [1,4,6,7]
          } else if (e === 'I') {
            obj.showList = [1,4,6,7]
          } else if (e === 'Q') {
            obj.showList = [1,4,6,7]
          }
        }
      }
    } else {
      if (type === '二进制变量') {
        if (prop === 'dataArea') {  // 数据区域部分需要重新渲染弹窗html元素
          if (e === '位') {
            obj.letters = 'M'
            obj.showList = [1,2,5]
          } else if (e === 'DB') {
            console.log("........")
            obj.letters = 'DBX'
            obj.showList = [1,2,3,5]
          } else if (e === '输入') {
            obj.letters = 'I'
            obj.showList = [1,2,5]
          } else if (e === '输出') {
            obj.letters = 'Q'
            obj.showList = [1,2,5]
          }
        }
      } else if (type === '有符号8位整型' || type === '无符号8位整型') {
          if (prop === 'dataArea') {  // 数据区域部分需要重新渲染弹窗html元素
            if (e === '位') {
              obj.letters = 'MB'
              obj.showList = [1,2]
            } else if (e === 'DB') {
              obj.letters = 'DBB'
              obj.showList = [1,2,3]
            } else if (e === '输入') {
              obj.letters = 'IB'
              obj.showList = [1,2]
            } else if (e === '输出') {
              obj.letters = 'QB'
              obj.showList = [1,2]
            }
          }
      } else if (type === '有符号16位整型' || type === '无符号16位整型') {
          if (prop === 'dataArea') {  // 数据区域部分需要重新渲染弹窗html元素
            if (e === '位') {
              obj.letters = 'MW'
              obj.showList = [1,2]
            } else if (e === 'DB') {
              obj.letters = 'DBW'
              obj.showList = [1,2,3]
            } else if (e === '输入') {
              obj.letters = 'IW'
              obj.showList = [1,2]
            } else if (e === '输出') {
              obj.letters = 'QW'
              obj.showList = [1,2]
            }
          }
      } else if (type === '有符号32位整型' || type === '无符号32位整型' || type === 'F32位浮点数IEEE754' || type === '定时器') {
          if (prop === 'dataArea') {  // 数据区域部分需要重新渲染弹窗html元素
            if (e === '位') {
              obj.letters = 'MD'
              obj.showList = [1,2]
            } else if (e === 'DB') {
              obj.letters = 'DBD'
              obj.showList = [1,2,3]
            } else if (e === '输入') {
              obj.letters = 'ID'
              obj.showList = [1,2]
            } else if (e === '输出') {
              obj.letters = 'QD'
              obj.showList = [1,2]
            }
          }
      } else if (type === '有符号64位整型' || type === '无符号64位整型' || type === 'F64位浮点数IEEE754' || type === '日期'|| type === '时间'|| type === '日期时间') {
          if (prop === 'dataArea') {  // 数据区域部分需要重新渲染弹窗html元素
            if (e === '位') {
              obj.showList = [1,4,7]
            } else if (e === 'DB') {
              obj.showList = [1,3,4,7]
              console.log(obj)
            } else if (e === '输入') {
              obj.showList = [1,4,7]
            } else if (e === '输出') {
              obj.showList = [1,4,7]
            }
          }
      } else if (type === '文本变量8位字符集' || type === '文本变量16位字符集') {
          if (prop === 'dataArea') {  // 数据区域部分需要重新渲染弹窗html元素
            if (e === '位') {
              obj.showList = [1,4,6]
            } else if (e === 'DB') {
              obj.showList = [1,3,4,6]
            } else if (e === '输入') {
              obj.showList = [1,4,6]
            } else if (e === '输出') {
              obj.showList = [1,4,6]
            }
          }
      } else if (type === '字符串' || type === '宽字符串') {
          if (prop === 'dataArea') {  // 数据区域部分需要重新渲染弹窗html元素
            if (e === '位') {
              obj.showList = [1,4,6,7]
            } else if (e === 'DB') {
              obj.showList = [1,3,4,6,7]
            } else if (e === '输入') {
              obj.showList = [1,4,6,7]
            } else if (e === '输出') {
              obj.showList = [1,4,6,7]
            }
          }
        }
    }
    this.setState(state => {
      return {
        formData: JSON.parse(JSON.stringify(Object.assign(state.formData, obj)))
      }
    })
  }

  // 选择下拉内容 -- Modbus_TCP协议
  changeModbus_TCPData = (e, prop, type)=>{
    let types = ['有符号8位整型','有符号16位整型','有符号32位整型','有符号64位整型','无符号8位整型','无符号16位整型','无符号32位整型','无符号64位整型','F32位浮点数IEEE754','F64位浮点数IEEE754']
    this.setState(state=>{
      let formData={};
      formData[prop] = e
      if (type === '二进制变量') {
        if (prop === 'dataArea') {  // 数据区域部分需要重新渲染弹窗html元素
          if (e === '线圈状态') {
            formData.showList = [1,2]
          } else if (e === '离散输入状态') {
            formData.showList = [1,2]
          } else if (e === '输入寄存器') {
            formData.showList = [1,2,3]
          } else if (e === '保持寄存器') {
            formData.showList = [1,2,3]
          }
        }
      } else if (types.includes(type)) {
        if (prop === 'dataArea') {  // 数据区域部分需要重新渲染弹窗html元素
           if (e === '输入寄存器') {
            formData.showList = [1,2]
          } else if (e === '保持寄存器') {
            formData.showList = [1,2]
          }
        }
      }
      return {
        formData: JSON.parse(JSON.stringify(Object.assign(state.formData, formData)))
      }
    })
  }
  // 选择下拉内容 -- MC3E_Binary_Ethernet协议
  changeMBEData = (e, prop, type)=> {
    let formData = {};
    formData[prop] = e;
    this.setState(state=>{
      if (type === '二进制变量') {
        let types = ['输入寄存器（X）','输出寄存器（Y）','内部继电器（M）','定时器（触点）（TS）','定时器（线圈）（TC）','计数器（触点）（CS）','计数器（线圈）（CC）']
        if (prop === 'dataArea') {  // 数据区域部分需要重新渲染弹窗html元素
          if (types.includes(e)) {
            formData.showList = [1,2]
          } else {
            formData.showList = [1,2,3]
          }
        }
      }
    
      return {
        formData: JSON.parse(JSON.stringify(Object.assign(state.formData, formData)))
      }
    })
  }
  // 选择下拉内容 -- MCA1E_Binary_Ethernet协议
  changeMABEData = (e, prop, type)=> {
    let formData = {};
    formData[prop] = e;
    this.setState(state=>{
      if (type === '二进制变量') {
        let types = ['输入寄存器（X）','输出寄存器（Y）','辅助继电器（M）','状态（S）','定时器（触点）（TS）','计数器（触点）（CS）']
        if (prop === 'dataArea') {  // 数据区域部分需要重新渲染弹窗html元素
          if (types.includes(e)) {
            formData.showList = [1,2]
          } else {
            formData.showList = [1,2,3]
          }
        }
      }
    
      return {
        formData: JSON.parse(JSON.stringify(Object.assign(state.formData, formData)))
      }
    })
  }
  // 选择下拉内容 -- Fins_TCP协议
  changeFins_TCPData (e, prop, type) {
    let formData = {};
    formData[prop] = e;
    this.setState(state=>{
      if (type === '二进制变量') {
        if (e === 'TIM/CNT(Complettion Flag)') {
          formData.showList = [1,2]
        } else {
          formData.showList = [1,2,3]
        }
      }
      return {
        formData: JSON.parse(JSON.stringify(Object.assign(state.formData, formData)))
      }
    })
  }

  blurData = (e, prop, protocal)=>{
    console.log(e, prop, protocal)
  }

  arrayEqual = (arr1, arr2)=> {
    if (arr1 === arr2) return true;
    if (arr1.length !== arr2.length) return false;
    for (var i = 0; i < arr1.length; ++i) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  }

  //提交弹窗
  confirmPop = (val) => {
    let {arrayEqual} = this
    let { popupData } = this.state
    // 协议名称： S7_TCP   Modbus_TCP  OPC_DA  OPC_UA  MC3E_Binary_Ethernet  MCA1E_Binary_Ethernet  Fins_TCP
    let addressData = JSON.parse(JSON.stringify(Object.assign(this.state.formData, val)))
    console.log(addressData)
    if (popupData.protocolName === 'S7_TCP') {
      // 1: 数据区域  2. 寄存器字母块（M/DBX/I/Q/MB/DBB/IB/QB/MW/DBW/IW/QW/MD/DBD/ID/QD） 3.  DB号  4. 地址偏移量   5. 位   6. 长度   7.  地址类型 
      /* 根据showList中的代码块  处理生成的变量 */
      if (arrayEqual(addressData.showList, [1,2,5])) {
        popupData.dataValue = `${addressData.letters + addressData.lettlesValue}.${addressData.bit}` 
      } else if (arrayEqual(addressData.showList, [1,2,3,5])) {
        popupData.dataValue = `${addressData.dataArea + addressData.DBNum}.${addressData.letters + addressData.lettlesValue}.${addressData.bit}`
      } else if (arrayEqual(addressData.showList, [1,2])) {
        popupData.dataValue = `${addressData.letters + addressData.lettlesValue}`
      } else if (arrayEqual(addressData.showList, [1,2,3])) {
        popupData.dataValue = `${addressData.dataArea + addressData.DBNum}.${addressData.letters + addressData.lettlesValue}`
      } else if (arrayEqual(addressData.showList, [1,4,7])) {
        if (addressData.dataArea === '位') {
          console.log(addressData.addressType === "字")
          if (addressData.addressType === '字节') {
            popupData.dataValue = `MB${addressData.addressOffset}`
          } else if (addressData.addressType === '字') {
            popupData.dataValue = `MW${addressData.addressOffset}`
          } else if (addressData.addressType === '双字'){
            popupData.dataValue = `MD${addressData.addressOffset}`
          }
        } else if (addressData.dataArea === '输入') {
          if (addressData.addressType === '字节') {
            popupData.dataValue = `IB${addressData.addressOffset}`
          } else if (addressData.addressType === '字') {
            popupData.dataValue = `IW${addressData.addressOffset}`
          } else if (addressData.addressType === '双字'){
            popupData.dataValue = `ID${addressData.addressOffset}`
          }
        } else if (addressData.dataArea === '输出') {
          if (addressData.addressType === '字节') {
            popupData.dataValue = `QB${addressData.addressOffset}`
          } else if (addressData.addressType === '字') {
            popupData.dataValue = `QW${addressData.addressOffset}`
          } else if (addressData.addressType === '双字'){
            popupData.dataValue = `QD${addressData.addressOffset}`
          }
        }
      } else if (arrayEqual(addressData.showList, [1,3,4,7])) {
        if (addressData.addressType === '字节') {
          popupData.dataValue = `${addressData.dataArea + addressData.DBNum}.DBB${addressData.addressOffset}`
        } else if (addressData.addressType === '字') {
          popupData.dataValue = `${addressData.dataArea + addressData.DBNum}.DBW${addressData.addressOffset}`
        } else if (addressData.addressType === '双字'){
          popupData.dataValue = `${addressData.dataArea + addressData.DBNum}.DBD${addressData.addressOffset}`
        }
      } else if (arrayEqual(addressData.showList, [1,4,6])) {
        if (popupData.model === 'S7-200Smart') {
          if (addressData.dataArea === 'M') {
            popupData.dataValue = `MB${addressData.addressOffset}`
          } else if (addressData.dataArea === 'V') {
            popupData.dataValue = `VB${addressData.addressOffset}`
          } else if (addressData.dataArea === 'I') {
            popupData.dataValue = `IB${addressData.addressOffset}`
          } else if (addressData.dataArea === 'Q') {
            popupData.dataValue = `QB${addressData.addressOffset}`
          }
        } else {
          if (addressData.dataArea === '位') {
            popupData.dataValue = `MW${addressData.addressOffset}`
          } else if (addressData.dataArea === '输入') {
            popupData.dataValue = `IW${addressData.addressOffset}`
          } else if (addressData.dataArea === '输出') {
            popupData.dataValue = `QW${addressData.addressOffset}`
          }
        }
      } else if (arrayEqual(addressData.showList, [1,3,4,6])) {
        popupData.dataValue = `${addressData.dataArea + addressData.DBNum}.DBW${addressData.addressOffset}`
      } else if (arrayEqual(addressData.showList, [1,4,6,7])) {
        if (popupData.model === 'S7-200Smart') {
          if (addressData.dataArea === 'M') {
            if (addressData.addressType === '字节') {
              popupData.dataValue = `MB${addressData.addressOffset}`
            } else if (addressData.addressType === '字') {
              popupData.dataValue = `MW${addressData.addressOffset}`
            }
          } else if (addressData.dataArea === 'V') {
            if (addressData.addressType === '字节') {
              popupData.dataValue = `VB${addressData.addressOffset}`
            } else if (addressData.addressType === '字') {
              popupData.dataValue = `VW${addressData.addressOffset}`
            }
          } else if (addressData.dataArea === 'I') {
            if (addressData.addressType === '字节') {
              popupData.dataValue = `IB${addressData.addressOffset}`
            } else if (addressData.addressType === '字') {
              popupData.dataValue = `IW${addressData.addressOffset}`
            }
          } else if (addressData.dataArea === 'Q') {
            if (addressData.addressType === '字节') {
              popupData.dataValue = `QB${addressData.addressOffset}`
            } else if (addressData.addressType === '字') {
              popupData.dataValue = `QW${addressData.addressOffset}`
            }
          }
        } else { 
          if (addressData.dataArea === '位') {
            if (addressData.addressType === '字节') {
              popupData.dataValue = `MB${addressData.addressOffset}`
            } else if (addressData.addressType === '字') {
              popupData.dataValue = `MW${addressData.addressOffset}`
            }
          } else if (addressData.dataArea === '输入') {
            if (addressData.addressType === '字节') {
              popupData.dataValue = `IB${addressData.addressOffset}`
            } else if (addressData.addressType === '字') {
              popupData.dataValue = `IW${addressData.addressOffset}`
            }
          } else if (addressData.dataArea === '输出') {
            if (addressData.addressType === '字节') {
              popupData.dataValue = `QB${addressData.addressOffset}`
            } else if (addressData.addressType === '字') {
              popupData.dataValue = `QW${addressData.addressOffset}`
            }
          }
        }
      } else if (arrayEqual(addressData.showList, [1,3,4,6,7])) {
        if (addressData.addressType === '字节') {
          popupData.dataValue = `${addressData.dataArea + addressData.DBNum}.DBB${addressData.addressOffset}`
        } else if (addressData.addressType === '字') {
          popupData.dataValue = `${addressData.dataArea + addressData.DBNum}.DBW${addressData.addressOffset}`
        }
      }
    } else if (popupData.protocolName === 'Modbus_TCP') {
      // 1. 数据区域  2. 偏移地址   3.位  4. 长度
      if (arrayEqual(addressData.showList, [1,2]) || arrayEqual(addressData.showList, [1,2,4])) {
        if (addressData.dataArea === '线圈状态') {
          popupData.dataValue = `0${addressData.address.toString().padStart(5, '0')}`
        } else if (addressData.dataArea === '离散输入状态') {
          popupData.dataValue = `1${addressData.address.toString().padStart(5, '0')}`
        } else if (addressData.dataArea === '输入寄存器') {
          popupData.dataValue = `3${addressData.address.toString().padStart(5, '0')}`
        } else if (addressData.dataArea === '保持寄存器') {
          popupData.dataValue = `4${addressData.address.toString().padStart(5, '0')}`
        }
      } else if (arrayEqual(addressData.showList, [1,2,3])) {
        if (addressData.dataArea === '线圈状态') {
          popupData.dataValue = `0${addressData.address.toString().padStart(5, '0')}.${addressData.bit}`
        } else if (addressData.dataArea === '离散输入状态') {
          popupData.dataValue = `1${addressData.address.toString().padStart(5, '0')}.${addressData.bit}`
        } else if (addressData.dataArea === '输入寄存器') {
          popupData.dataValue = `3${addressData.address.toString().padStart(5, '0')}.${addressData.bit}`
        } else if (addressData.dataArea === '保持寄存器') {
          popupData.dataValue = `4${addressData.address.toString().padStart(5, '0')}.${addressData.bit}`
        }
      }
    } else if (popupData.protocolName === 'MC3E_Binary_Ethernet') {
      // 1. 数据区域    2.  地址    3.  位    4. 长度
      if (arrayEqual(addressData.showList, [1,2]) || arrayEqual(addressData.showList, [1,2,4])) {
        if (addressData.dataArea === '输入寄存器（X）') {
          popupData.dataValue = `X${addressData.address}`
        } else if (addressData.dataArea === '输出寄存器（Y）') {
          popupData.dataValue = `Y${addressData.address}`
        } else if (addressData.dataArea === '内部继电器（M）') {
          popupData.dataValue = `M${addressData.address}`
        } else if (addressData.dataArea === '定时器（触点）（TS）') {
          popupData.dataValue = `TS${addressData.address}`
        } else if (addressData.dataArea === '定时器（线圈）（TC）') {
          popupData.dataValue = `TC${addressData.address}`
        } else if (addressData.dataArea === '计数器（触点）（CS）') {
          popupData.dataValue = `CS${addressData.address}`
        } else if (addressData.dataArea === '计数器（线圈）（CC）') {
          popupData.dataValue = `CC${addressData.address}`
        } else if (addressData.dataArea === '数据寄存器（D）') {
          popupData.dataValue = `D${addressData.address}`
        } else if (addressData.dataArea === '链接寄存器（W）') {
          popupData.dataValue = `W${addressData.address}`
        } else if (addressData.dataArea === '定时器（当前值）（TN）') {
          popupData.dataValue = `TN${addressData.address}`
        } else if (addressData.dataArea === '计数器（当前值）（CN）') {
          popupData.dataValue = `CN${addressData.address}`
        }
      } else if (arrayEqual(addressData.showList, [1,2,3])) {
        if (addressData.dataArea === '输入寄存器（X）') {
          popupData.dataValue = `X${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === '输出寄存器（Y）') {
          popupData.dataValue = `Y${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === '内部继电器（M）') {
          popupData.dataValue = `M${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === '定时器（触点）（TS）') {
          popupData.dataValue = `TS${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === '定时器（线圈）（TC）') {
          popupData.dataValue = `TC${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === '计数器（触点）（CS）') {
          popupData.dataValue = `CS${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === '计数器（线圈）（CC）') {
          popupData.dataValue = `CC${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === '数据寄存器（D）') {
          popupData.dataValue = `D${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === '链接寄存器（W）') {
          popupData.dataValue = `W${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === '定时器（当前值）（TN）') {
          popupData.dataValue = `TN${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === '计数器（当前值）（CN）') {
          popupData.dataValue = `CN${addressData.address}.${addressData.bit}`
        }
      }
      
  
    } else if (popupData.protocolName === 'MCA1E_Binary_Ethernet') {
      // 1. 数据区域    2.  地址    3.  位    4. 长度
      if (arrayEqual(addressData.showList, [1,2]) || arrayEqual(addressData.showList, [1,2,4])) {
        if (addressData.dataArea === '输入寄存器（X）') {
          popupData.dataValue = `X${addressData.address}`
        } else if (addressData.dataArea === '输出寄存器（Y）') {
          popupData.dataValue = `Y${addressData.address}`
        } else if (addressData.dataArea === '辅助继电器（M）') {
          popupData.dataValue = `M${addressData.address}`
        } else if (addressData.dataArea === '状态（S）') {
          popupData.dataValue = `S${addressData.address}`
        } else if (addressData.dataArea === '定时器（触点）（TS）') {
          popupData.dataValue = `TS${addressData.address}`
        } else if (addressData.dataArea === '计数器（触点）（CS）') {
          popupData.dataValue = `CS${addressData.address}`
        } else if (addressData.dataArea === '数据寄存器（D）') {
          popupData.dataValue = `D${addressData.address}`
        } else if (addressData.dataArea === '扩展寄存器（R）') {
          popupData.dataValue = `R${addressData.address}`
        } else if (addressData.dataArea === '定时器（当前值）（TN）') {
          popupData.dataValue = `TN${addressData.address}`
        } else if (addressData.dataArea === '计数器（当前值）（CN）') {
          popupData.dataValue = `CN${addressData.address}`
        }
      } else if (arrayEqual(addressData.showList, [1,2,3])) {
        if (addressData.dataArea === '输入寄存器（X）') {
          popupData.dataValue = `X${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === '输出寄存器（Y）') {
          popupData.dataValue = `Y${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === '辅助继电器（M）') {
          popupData.dataValue = `M${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === '状态（S）') {
          popupData.dataValue = `S${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === '定时器（触点）（TS）') {
          popupData.dataValue = `TS${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === '计数器（触点）（CS）') {
          popupData.dataValue = `CS${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === '数据寄存器（D）') {
          popupData.dataValue = `D${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === '扩展寄存器（R）') {
          popupData.dataValue = `R${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === '定时器（当前值）（TN）') {
          popupData.dataValue = `TN${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === '计数器（当前值）（CN）') {
          popupData.dataValue = `CN${addressData.address}.${addressData.bit}`
        }
      }
    } else if (popupData.protocolName === 'Fins_TCP') {
      // 1. 数据区域    2.  地址    3.  位    4. 长度
      if (arrayEqual(addressData.showList, [1,2]) || arrayEqual(addressData.showList, [1,2,4])) {
        if (addressData.dataArea === 'CIO') {
          popupData.dataValue = `CIO${addressData.address}`
        } else if (addressData.dataArea === 'WR') {
          popupData.dataValue = `W${addressData.address}`
        } else if (addressData.dataArea === 'HR') {
          popupData.dataValue = `H${addressData.address}`
        } else if (addressData.dataArea === 'AR') {
          popupData.dataValue = `A${addressData.address}`
        } else if (addressData.dataArea === 'TIM/CNT(Complettion Flag)') {
          popupData.dataValue = `T${addressData.address}`
        } else if (addressData.dataArea === 'DM') {
          popupData.dataValue = `D${addressData.address}`
        } else if (addressData.dataArea === 'EM current bank') {
          popupData.dataValue = `E${addressData.address}`
        } else if (addressData.dataArea === 'EM bank 0') {
          popupData.dataValue = `E00_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank 1') {
          popupData.dataValue = `E01_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank 2') {
          popupData.dataValue = `E02_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank 3') {
          popupData.dataValue = `E03_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank 4') {
          popupData.dataValue = `E04_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank 5') {
          popupData.dataValue = `E05_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank 6') {
          popupData.dataValue = `E06_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank 7') {
          popupData.dataValue = `E07_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank 8') {
          popupData.dataValue = `E08_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank 9') {
          popupData.dataValue = `E09_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank A') {
          popupData.dataValue = `E0A_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank B') {
          popupData.dataValue = `E0B_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank C') {
          popupData.dataValue = `E0C_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank D') {
          popupData.dataValue = `E0D_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank E') {
          popupData.dataValue = `E0E_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank F') {
          popupData.dataValue = `E0F_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank 10') {
          popupData.dataValue = `E10_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank 11') {
          popupData.dataValue = `E11_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank 12') {
          popupData.dataValue = `E12_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank 13') {
          popupData.dataValue = `E13_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank 14') {
          popupData.dataValue = `E14_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank 15') {
          popupData.dataValue = `E15_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank 16') {
          popupData.dataValue = `E16_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank 17') {
          popupData.dataValue = `E17_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank 18') {
          popupData.dataValue = `E18_${addressData.address}`
        }
      } else if (arrayEqual(addressData.showList, [1,2,3])) {
        if (addressData.dataArea === 'CIO') {
          popupData.dataValue = `CIO${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'WR') {
          popupData.dataValue = `W${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'HR') {
          popupData.dataValue = `H${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'AR') {
          popupData.dataValue = `A${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'TIM/CNT(Complettion Flag)') {
          popupData.dataValue = `T${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'DM') {
          popupData.dataValue = `D${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM current bank') {
          popupData.dataValue = `E${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank 0') {
          popupData.dataValue = `E00_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank 1') {
          popupData.dataValue = `E01_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank 2') {
          popupData.dataValue = `E02_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank 3') {
          popupData.dataValue = `E03_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank 4') {
          popupData.dataValue = `E04_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank 5') {
          popupData.dataValue = `E05_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank 6') {
          popupData.dataValue = `E06_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank 7') {
          popupData.dataValue = `E07_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank 8') {
          popupData.dataValue = `E08_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank 9') {
          popupData.dataValue = `E09_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank A') {
          popupData.dataValue = `E0A_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank B') {
          popupData.dataValue = `E0B_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank C') {
          popupData.dataValue = `E0C_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank D') {
          popupData.dataValue = `E0D_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank E') {
          popupData.dataValue = `E0E_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank F') {
          popupData.dataValue = `E0F_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank 10') {
          popupData.dataValue = `E10_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank 11') {
          popupData.dataValue = `E11_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank 12') {
          popupData.dataValue = `E12_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank 13') {
          popupData.dataValue = `E13_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank 14') {
          popupData.dataValue = `E14_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank 15') {
          popupData.dataValue = `E15_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank 16') {
          popupData.dataValue = `E16_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank 17') {
          popupData.dataValue = `E17_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank 18') {
          popupData.dataValue = `E18_${addressData.address}.${addressData.bit}`
        }
      }
    }
    console.log(popupData.dataValue, addressData.dataArea)
    return ({
      address: popupData.dataValue,
      stringLength: addressData.len+""
    })
  }

  onFinish = (val) => {
    console.log(val)
    this.props.onFinish(this.confirmPop(val), this.props.row);
  }

  render() {
    let {type, formData, popupData} = this.state
    console.log(formData)
    let items = formData.showList || []; 
    let types = ['有符号8位整型','有符号16位整型','有符号32位整型','有符号64位整型','无符号8位整型','无符号16位整型','无符号32位整型','无符号64位整型','F32位浮点数IEEE754','F64位浮点数IEEE754', '字符串']
    let binaryarea = ['CIO','WR','HR','AR','TIM/CNT(Complettion Flag)','DM','EM current bank','EM bank 0','EM bank 1','EM bank 2','EM bank 3','EM bank 4','EM bank 5','EM bank 6','EM bank 7','EM bank 8','EM bank 9','EM bank A','EM bank B','EM bank C','EM bank D',
    'EM bank E','EM bank F','EM bank 10','EM bank 11','EM bank 12','EM bank 13','EM bank 14','EM bank 15','EM bank 16','EM bank 17','EM bank 18']
    console.log(popupData.protocolName, items)
    return (
      <Form onFinish={this.onFinish} ref={this.addressForm} initialValues={this.state.formData}>
        <div className="form-table">
          {
            popupData.protocolName === "S7_TCP" ? (
              <>
              {
                items.includes(1) ? popupData.model === "S7-200Smart" ? 
                <>
                  <Form.Item label="数据区域" name="dataArea">
                    <Select onChange={(e)=>{this.changeData(e,'dataArea', type)}} >
                      <Select.Option value="M">M</Select.Option>
                      <Select.Option value="V">V</Select.Option>
                      <Select.Option value="I">I</Select.Option>
                      <Select.Option value="Q">Q</Select.Option>
                    </Select>
                  </Form.Item>
                </>
                :
                  <Form.Item label="数据区域" name="dataArea">
                    <Select onChange={(e)=>{this.changeData(e,'dataArea', type)}} >
                      <Select.Option value="位">位</Select.Option>
                      <Select.Option value="DB">DB</Select.Option>
                      <Select.Option value="输入">输入</Select.Option>
                      <Select.Option value="输出">输出</Select.Option>
                    </Select>
                  </Form.Item> : <></>
              }{
                items.includes(2) ?
                  <Form.Item label={formData.letters} name={"lettlesValue"} rules={[{required: true, message: "必填"}]}>
                    <Input autoComplete="off" onBlur={ (e)=>{this.blurData(e, 'lettlesValue', 'S7_TCP')} }/>
                  </Form.Item> : <></>
              }{
                items && items.includes(3) ?
                <Form.Item label="DB号" name="DBNum" rules={[{required: true, message: "必填"}]}>
                  <Input autoComplete="off" type="number" min="1" onBlur={ (e)=>{this.blurData(e, 'DBNum', 'S7_TCP')} }/>
                </Form.Item> : <></>
              }{
                items && items.includes(4) ?
                <Form.Item label="地址偏移量" name="addressOffset" rules={[{required: true, message: "必填"}]}>
                  <Input autoComplete="off" type="number" min="1" onBlur={ (e)=>{this.blurData(e, 'addressOffset', 'S7_TCP')} }/>
                </Form.Item> : <></>
              }{
                items.includes(5) ?
                <Form.Item label="位" name="bit">
                  <Select onChange={(e) => { this.changeData(e, 'bit', type) }}>
                    <Select.Option value="0">0</Select.Option>
                    <Select.Option value="1">1</Select.Option>
                    <Select.Option value="2">2</Select.Option>
                    <Select.Option value="3">3</Select.Option>
                    <Select.Option value="4">4</Select.Option>
                    <Select.Option value="5">5</Select.Option>
                    <Select.Option value="6">6</Select.Option>
                    <Select.Option value="7">7</Select.Option>
                  </Select>
                </Form.Item> : <></>
              }{
                items && items.includes(6) ?
                <Form.Item label="长度" name="len" rules={[{required: true, message: "必填"}]}>
                  <Input autoComplete="off" type="number" min="1" max="255" onBlur={ (e)=>{this.blurData(e, 'len', 'S7_TCP')} }/>
                </Form.Item> : <></>
              }{
                items && items.includes(7) ?
                <Form.Item label="地址类型" name="addressType">
                  <Select onChange={ (e)=>{this.changeData(e, 'addressType', type)} }>
                    <Select.Option value="字节">字节</Select.Option>   
                    <Select.Option value="字">字</Select.Option>
                    {
                      !['字符串', '宽字符串'].includes(type) ? 
                      <Select.Option value="双字">双字</Select.Option> : <></>
                    }
                  </Select>
                </Form.Item> : <></>
              }
            </>
            ) : <></>
          }{
            popupData.protocolName === "Modbus_TCP" ? 
              <>
                {
                  !types.includes(type) ? 
                    <Form.Item label="数据区域" name="dataArea">
                      <Select onChange={(e)=>{this.changeModbus_TCPData(e,'dataArea', type)}} >
                        <Select.Option value="线圈状态">线圈状态</Select.Option>
                        <Select.Option value="离散输入状态">离散输入状态</Select.Option>
                        <Select.Option value="输入寄存器">输入寄存器</Select.Option>
                        <Select.Option value="保持寄存器">保持寄存器</Select.Option>
                      </Select>
                    </Form.Item> : 
                    <Form.Item label="数据区域" name="dataArea">
                      <Select onChange={(e)=>{this.changeModbus_TCPData(e,'dataArea', type)}} >
                        <Select.Option value="输入寄存器">输入寄存器</Select.Option>
                        <Select.Option value="保持寄存器">保持寄存器</Select.Option>
                      </Select>
                    </Form.Item>
                }{
                  items && items.includes(2) ? 
                  <Form.Item label="偏移地址" name="address" rules={[{required: true, message: "必填"}]}>
                    <Input autoComplete="off" type="number" min="1" onBlur={ (e)=>{this.blurData(e, 'address', 'Modbus_TCP')} }/>
                  </Form.Item> : <></>
                }{
                  items && items.includes(3) ? 
                  <Form.Item label="位" name="bit">
                    <Select onChange={(e)=>{this.changeModbus_TCPData(e,'bit', type)}} >
                      <Select.Option value="0">0</Select.Option>
                      <Select.Option value="1">1</Select.Option>
                      <Select.Option value="2">2</Select.Option>
                      <Select.Option value="3">3</Select.Option>
                      <Select.Option value="4">4</Select.Option>
                      <Select.Option value="5">5</Select.Option>
                      <Select.Option value="6">6</Select.Option>
                      <Select.Option value="7">7</Select.Option>
                      <Select.Option value="8">8</Select.Option>
                      <Select.Option value="9">9</Select.Option>
                      <Select.Option value="10">10</Select.Option>
                      <Select.Option value="11">11</Select.Option>
                      <Select.Option value="12">12</Select.Option>
                      <Select.Option value="13">13</Select.Option>
                      <Select.Option value="14">14</Select.Option>
                      <Select.Option value="15">15</Select.Option>
                    </Select>
                  </Form.Item> : <></>
                }{
                  items && items.includes(4) ? 
                  <Form.Item label="长度" name="len" rules={[{required: true, message: "必填"}]}>
                    <Input autoComplete="off" type="number" min="1" max="255" onBlur={ (e)=>{this.blurData(e, 'len', 'Modbus_TCP')} }/>
                  </Form.Item> : <></>
                }
              </> : <></>
          }{
            popupData.protocolName === "MC3E_Binary_Ethernet" ? <>
              {
                items.includes(1) ? (
                  type === '二进制变量' ? 
                  <Form.Item label="数据区域" name="dataArea">
                    <Select onChange={(e)=>{this.changeMBEData(e,'dataArea', type)}} >
                      <Select.Option value="输入寄存器（X）">输入寄存器（X）</Select.Option>
                      <Select.Option value="输出寄存器（Y）">输出寄存器（Y）</Select.Option>
                      <Select.Option value="内部继电器（M）">内部继电器（M）</Select.Option>
                      <Select.Option value="定时器（触点）（TS）">定时器（触点）（TS）</Select.Option>
                      <Select.Option value="定时器（线圈）（TC）">定时器（线圈）（TC）</Select.Option>
                      <Select.Option value="计数器（触点）（CS）">计数器（触点）（CS）</Select.Option>
                      <Select.Option value="计数器（线圈）（CC）">计数器（线圈）（CC）</Select.Option>
                      <Select.Option value="数据寄存器（D）">数据寄存器（D）</Select.Option>
                      <Select.Option value="链接寄存器（W）">链接寄存器（W）</Select.Option>
                      <Select.Option value="定时器（当前值）（TN）">定时器（当前值）（TN）</Select.Option>
                      <Select.Option value="计数器（当前值）（CN）">计数器（当前值）（CN）</Select.Option>
                    </Select>
                  </Form.Item> : 
                  <Form.Item label="数据区域" name="dataArea">
                    <Select onChange={(e)=>{this.changeMBEData(e,'dataArea', type)}} >
                      <Select.Option value="数据寄存器（D）">数据寄存器（D）</Select.Option>
                      <Select.Option value="链接寄存器（W）">链接寄存器（W）</Select.Option>
                      <Select.Option value="定时器（当前值）（TN）">定时器（当前值）（TN）</Select.Option>
                      <Select.Option value="计数器（当前值）（CN）">计数器（当前值）（CN）</Select.Option>
                    </Select>
                  </Form.Item>
                ) : <></>
              }{
                items && items.includes(2) ? 
                <Form.Item label="偏移地址" name="address" rules={[{required: true, message: "必填"}]}>
                  <Input autoComplete="off" type="number" min="0" onBlur={ (e)=>{this.blurData(e, 'address', 'MC3E_Binary_Ethernet')} }/>
                </Form.Item> : <></>
              }{
                items && items.includes(3) ? 
                <Form.Item label="位" name="bit">
                  <Select onChange={(e)=>{this.changeModbus_TCPData(e,'bit', type)}} >
                    <Select.Option value="0">0</Select.Option>
                    <Select.Option value="1">1</Select.Option>
                    <Select.Option value="2">2</Select.Option>
                    <Select.Option value="3">3</Select.Option>
                    <Select.Option value="4">4</Select.Option>
                    <Select.Option value="5">5</Select.Option>
                    <Select.Option value="6">6</Select.Option>
                    <Select.Option value="7">7</Select.Option>
                    <Select.Option value="8">8</Select.Option>
                    <Select.Option value="9">9</Select.Option>
                    <Select.Option value="A">A</Select.Option>
                    <Select.Option value="B">B</Select.Option>
                    <Select.Option value="C">C</Select.Option>
                    <Select.Option value="D">D</Select.Option>
                    <Select.Option value="E">E</Select.Option>
                    <Select.Option value="F">F</Select.Option>
                  </Select>
                </Form.Item> : <></>
              }{
                items && items.includes(4) ? 
                <Form.Item label="长度" name="len" rules={[{required: true, message: "必填"}]}>
                  <Input autoComplete="off" type="number" min="1" max="255" onBlur={ (e)=>{this.blurData(e, 'len', 'MC3E_Binary_Ethernet')} }/>
                </Form.Item> : <></>
              }
            </> : <></>
          }{
            popupData.protocolName === "MCA1E_Binary_Ethernet" ? <>
              {
                items.includes(1) ? (
                  type === '二进制变量' ? 
                  <Form.Item label="数据区域" name="dataArea">
                    <Select onChange={(e)=>{this.changeMABEData(e,'dataArea', type)}} >
                      <Select.Option value="输入寄存器（X）">输入寄存器（X）</Select.Option>
                      <Select.Option value="输出寄存器（Y）">输出寄存器（Y）</Select.Option>
                      <Select.Option value="辅助继电器（M）">辅助继电器（M）</Select.Option>
                      <Select.Option value="状态（S）">状态（S）</Select.Option>
                      <Select.Option value="数据寄存器（D）">数据寄存器（D）</Select.Option>
                      <Select.Option value="扩展寄存器（R）">扩展寄存器（R）</Select.Option>
                      <Select.Option value="定时器（触点）（TS）">定时器（触点）（TS）</Select.Option>
                      <Select.Option value="定时器（当前值）（TN）">定时器（当前值）（TN）</Select.Option>
                      <Select.Option value="计数器（触点）（CS）">计数器（触点）（CS）</Select.Option>
                      <Select.Option value="计数器（当前值）（CN）">计数器（当前值）（CN）</Select.Option>
                    </Select>
                  </Form.Item> : 
                  <Form.Item label="数据区域" name="dataArea">
                    <Select onChange={(e)=>{this.changeMBEData(e,'dataArea', type)}} >
                      <Select.Option value="数据寄存器（D）">数据寄存器（D）</Select.Option>
                      <Select.Option value="扩展寄存器（R）">扩展寄存器（R）</Select.Option>
                      <Select.Option value="定时器（当前值）（TN）">定时器（当前值）（TN）</Select.Option>
                      <Select.Option value="计数器（当前值）（CN）">计数器（当前值）（CN）</Select.Option>
                    </Select>
                  </Form.Item>
                ) : <></>
              }{
                items && items.includes(2) ? 
                <Form.Item label="偏移地址" name="address" rules={[{required: true, message: "必填"}]}>
                  <Input autoComplete="off" type="number" min="0" onBlur={ (e)=>{this.blurData(e, 'address', 'MCA1E_Binary_Ethernet')} }/>
                </Form.Item> : <></>
              }{
                items && items.includes(3) ? 
                <Form.Item label="位" name="bit">
                  <Select onChange={(e)=>{this.changeMABEData(e,'bit', type)}} >
                    <Select.Option value="0">0</Select.Option>
                    <Select.Option value="1">1</Select.Option>
                    <Select.Option value="2">2</Select.Option>
                    <Select.Option value="3">3</Select.Option>
                    <Select.Option value="4">4</Select.Option>
                    <Select.Option value="5">5</Select.Option>
                    <Select.Option value="6">6</Select.Option>
                    <Select.Option value="7">7</Select.Option>
                    <Select.Option value="8">8</Select.Option>
                    <Select.Option value="9">9</Select.Option>
                    <Select.Option value="A">A</Select.Option>
                    <Select.Option value="B">B</Select.Option>
                    <Select.Option value="C">C</Select.Option>
                    <Select.Option value="D">D</Select.Option>
                    <Select.Option value="E">E</Select.Option>
                    <Select.Option value="F">F</Select.Option>
                  </Select>
                </Form.Item> : <></>
              }{
                items && items.includes(4) ? 
                <Form.Item label="长度" name="len" rules={[{required: true, message: "必填"}]}>
                  <Input autoComplete="off" type="number" min="1" max="255" onBlur={ (e)=>{this.blurData(e, 'len', 'MCA1E_Binary_Ethernet')} }/>
                </Form.Item> : <></>
              }
            </> : <></>
          }{
            popupData.protocolName === "Fins_TCP" ? <>
              {
                items.includes(1) ? (
                  type === '二进制变量' ? 
                  <Form.Item label="数据区域" name="dataArea">
                    <Select onChange={(e)=>{this.changeFins_TCPData(e,'dataArea', type)}} >
                    {
                      binaryarea.map((item,index) => {
                        return <Select.Option value={item} key={item+index}>{item}</Select.Option>
                      })
                    }
                    </Select>
                  </Form.Item> : 
                  <Form.Item label="数据区域" name="dataArea">
                    <Select onChange={(e)=>{this.changeFins_TCPData(e,'dataArea', type)}} >
                      {
                        binaryarea.filter(f => f !== 'TIM/CNT(Complettion Flag)').map((item,index) => {
                          return <Select.Option value={item} key={item+index}>{item}</Select.Option>
                        })
                      }
                    </Select>
                  </Form.Item>
                ) : <></>
              }{
                items.includes(2) ? 
                <Form.Item label="偏移地址" name="address" rules={[{required: true, message: "必填"}]}>
                  <Input autoComplete="off" type="number" min="0" onBlur={ (e)=>{this.blurData(e, 'address', 'Fins_TCP')} }/>
                </Form.Item> : <></>
              }{
                items.includes(3) ? 
                <Form.Item label="位" name="bit">
                  <Select onChange={(e)=>{this.changeMABEData(e,'bit', type)}} >
                    <Select.Option value="0">0</Select.Option>
                    <Select.Option value="1">1</Select.Option>
                    <Select.Option value="2">2</Select.Option>
                    <Select.Option value="3">3</Select.Option>
                    <Select.Option value="4">4</Select.Option>
                    <Select.Option value="5">5</Select.Option>
                    <Select.Option value="6">6</Select.Option>
                    <Select.Option value="7">7</Select.Option>
                    <Select.Option value="8">8</Select.Option>
                    <Select.Option value="9">9</Select.Option>
                    <Select.Option value="10">10</Select.Option>
                    <Select.Option value="11">11</Select.Option>
                    <Select.Option value="12">12</Select.Option>
                    <Select.Option value="13">13</Select.Option>
                    <Select.Option value="14">14</Select.Option>
                    <Select.Option value="15">15</Select.Option>
                  </Select>
                </Form.Item> : <></>
              }{
                items.includes(4)  ? 
                <Form.Item label="长度" name="len" rules={[{required: true, message: "必填"}]}>
                  <Input autoComplete="off" type="number" min="1" max="255" onBlur={ (e)=>{this.blurData(e, 'len', 'MCA1E_Binary_Ethernet')} }/>
                </Form.Item> : <></>
              }
            </> : <></>
          }
          
          <Form.Item className="form-footer">
            <Button type="default" className="login-form-button" onClick={this.props.onCancel}>取消</Button>
            <Button type="primary" htmlType="submit" className="login-form-button" ref="submit">
              确认
            </Button>
          </Form.Item>
        </div>
      </Form>
    )
  }
}