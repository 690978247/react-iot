import { message } from 'antd';
import PubSub from 'pubsub-js'
import { isRepeat } from 'utils'

import { VerifyTagName, VerifyAddress, VerifyMax, VerifyMin } from 'api/variable'

//变量地址校验
export function addressVerify(value, obj) {
  return new Promise(async function (resolve, reject) {
    if (value === "") {
      message.error("变量地址不能为空，请重新输入")
      PubSub.publish("canSubmit", {
        canSubmit: false,
        message: "变量地址不能为空，请重新输入"
      })
      resolve(false)
    } else {
       await VerifyAddress(obj).then(res => {
        console.log(res)
        if (res.code !== 0) {
          message.error(res.msg)
          PubSub.publish("canSubmit", {
            canSubmit: false,
            message: res.msg
          })
          resolve(false)
        } else {
          PubSub.publish("canSubmit", {
            canSubmit: true,
            message: ""
          })
          resolve(true)
        }
      })
    }
  })
}

//描述校验
export function descVerify(value) {
  console.log("描述校验")
  //(/^[\u4E00-\u9FA5A-Za-z0-9_.%&',;=?$\x22]+$/).test(value) && 
  if (value.length > 48) {
    message.error("变量描述文本过长，请重新输入，不超过48个英文字符、24个汉字")
    
    PubSub.publish("canSubmit", {
      canSubmit: false,
      message: "变量描述文本过长，请重新输入，不超过48个英文字符、24个汉字"
    })
  }
}

//变量名校验
export function nameVerify(value, dataSource, record, dataIndex, activeNodeType) {
  console.log("变量名校验")
  if (!isRepeat(dataSource, record.key, dataIndex, value)) {
    if (value === "") {
      message.error("变量名不可为空，请重新输入");
      PubSub.publish("canSubmit", {
        canSubmit: false,
        message: "变量名不可为空，请重新输入"
      })
    } else if (!(/^[a-zA-Z_]([a-zA-Z0-9_.]+)?$/).test(value)) {
      message.error("变量名格式错误，请输入字母、数字、下划线、点中的一种或多种，且必须以字母或下划线开头")
      PubSub.publish("canSubmit", {
        canSubmit: false,
        message: "变量名格式错误，请输入字母、数字、下划线、点中的一种或多种，且必须以字母或下划线开头"
      })
    } else {
      VerifyTagName({
        tagId: record.id,
        tagName: value,
        type: activeNodeType
      }).then(res => {
        if (res.code !== 0) {
          message.error(res.msg)
          PubSub.publish("canSubmit", {
            canSubmit: false,
            message: res.msg
          })
        } else {
          PubSub.publish("canSubmit", {
            canSubmit: true,
            message: ""
          })
        }
      })
    }
  } else {
      message.error("变量名" + value + "已存在")
  }
}

//校验最大值
export function verifyMax(value, dataType) {
  VerifyMax({
    value,
    dataType
  }).then(res => {
    if (res.code !== 0) {
      message.error(res.msg)
      PubSub.publish("canSubmit", {
        canSubmit: false,
        message: res.msg
      })
    } else {
      PubSub.publish("canSubmit", {
        canSubmit: true,
        message: ""
      })
    }
  })
}

//校验最小值
export function verifyMin(value, dataType) {
  VerifyMin({
    value,
    dataType
  }).then(res => {
    if (res.code !== 0) {
      message.error(res.msg)
      PubSub.publish("canSubmit", {
        canSubmit: false,
        message: res.msg
      })
    } else {
      PubSub.publish("canSubmit", {
        canSubmit: true,
        message: ""
      })
    }
  })
}