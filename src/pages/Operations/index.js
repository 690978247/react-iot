import React, { PureComponent, createRef } from 'react'
import { Form, Input, Button, message } from 'antd';
import PubSub from "pubsub-js";

import {CopyToClipboard} from 'react-copy-to-clipboard';
import project from "assets/img/operation/project.png";

import { GetRemote, PutRemote } from 'api/operations'


let refForm = createRef()

class OperationsPane extends PureComponent {
  state = {
    isSaved: true, //已保存
    nodeID: "",
    verificationCode: "",
    name: "",
    copyText: ""
  }

  componentDidMount(){
    GetRemote().then(res => {
      if (res.code === 0) {
        let data = res.data;
        this.setState({
          nodeID: data.id || "",
          verificationCode: data.verificationCode || "",
          name: data.name || "",
          copyText: `项目名称：${data.name||""},节点ID：${data.id},节点ID：${data.verificationCode||""}`
        })
        refForm.current.setFieldsValue({
          verificationCode: data.verificationCode || "",
          name: data.name || "",
        })
      } else {
        message.error(res.msg)
      }
    })
  }

  onProjectFinish = (res) => {
    if (!this.state.isSaved) {
      PutRemote({
        "id": this.state.nodeID,
        "name": res.name,
        "verificationCode": res.verificationCode
      }).then(result => {
        if (result.code === 0) {
          this.setState({
            isSaved: true
          }, () => {
            message.info("保存成功")
            PubSub.publish("projectName", res.name)
          })
        } else {
          message.error(result.msg)
        }
      })
    }
  }

  //判断是否有新的编辑
  change = (e, editName) => {
    let { nodeID , verificationCode, name} = this.state;
    let formVal = refForm.current.getFieldsValue()

    this.setState({
      copyText: `项目名称：${editName === "name" ? e.target.value : name},节点ID：${nodeID},
                  节点ID：${editName === "verificationCode" ? e.target.value : verificationCode}`,
      isSaved: formVal.name === name && formVal.verificationCode === verificationCode
    })
  }

  //复制连接信息
  copySerialNumber = () => {
    message.info("已复制到剪切板")
  }

  render() {
    let { nodeID, copyText, isSaved } = this.state;
    return (
      <div style={{ padding: "32px 52px"}}>
        <div className="card-form">
          <div className="card-title">
            <img className="card-title-icon" src={ project } alt=""/>
            <span>项目管理</span>
          </div>
          <Form ref={refForm} onFinish={this.onProjectFinish} className="form">
            <Form.Item label="项目名称" name="name">
              <Input autoComplete="off" onChange={ (e)=>{this.change(e, "name")} }/>
            </Form.Item>
            <Form.Item label="节点ID">
              <div>{ nodeID }</div>
            </Form.Item>
            <Form.Item label="验证码" name="verificationCode" required={[{
              require: true,
              message: "请输入验证码"
            }]}>
              <Input autoComplete="off" onChange={ (e)=>{this.change(e, "verificationCode")} }/>
            </Form.Item>
            <Form.Item className="form-footer">
              <CopyToClipboard onCopy={this.copySerialNumber} text={copyText}>
                <Button type="primary" >复制连接信息</Button>
              </CopyToClipboard>
              <Button type="primary" htmlType="submit" className={ `${isSaved ? "saved" : ""}` }>保存</Button>
            </Form.Item>
          </Form>
        </div>

      </div>
    )
  }
}

export default OperationsPane
