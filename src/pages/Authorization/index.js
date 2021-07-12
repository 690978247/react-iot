import React, { PureComponent } from 'react'
import {  Button, message } from 'antd';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import project from "assets/img/operation/project.png";

import { GetSerialNumber, GetAuthState, UploadAuthFile } from "api/authorization";
import { converTime } from 'utils'

class AuthorizationPane extends PureComponent{
  state = {
    nodeID: "",
    status: "",
    time: ""
  }

  componentDidMount() {
    this.getSerialNumber(false);
    this.upDateState(false)
  }
  
  //获取产品序列号
  getSerialNumber = (show = true) => {
    GetSerialNumber().then(res => {
      if (res.code === 0) {
        console.log(res.data)
        this.setState({nodeID: res.data})
        if (show) {
          message.info("已生成")
        }
      } else {
        message.info("生成失败："+ res.msg)
      }
    })
  }

  //复制产品序列号
  copySerialNumber = () => {
    message.info("已复制到剪切板")
  }

  //更新授权状态
  upDateState = (show = true) => {
    GetAuthState().then(res => {
      if (res.code === 0) {
        if (show) {
          message.info("刷新成功")
        }
        let time = res.data.hasExpirationTime ? converTime(res.data.expirationTime, 10, " ") + "到期" : ""
        let status = res.data.hasExpirationTime ? "已激活" : "未激活"
        this.setState({status: status, time: time})
      } else {
        message.error("更新错误: "+res.msg)
      }
    })
  }

  //导入授权文件
  exportAuth = () => {
    //当校验通过时，自动刷新授权状态和授权时间
    document.getElementById("importFile").click();
  }

  importProps = (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append('files', e.target.files[0]);
    UploadAuthFile({
      formData: formdata
    }).then(res => {
      console.log(res)
      if (res.code === 0) {
        this.setState(state => {
          return {
            status: res.data.isAuthorization,
            time: res.data ? converTime(res.data.expirationTime, 10, " ") : "永久激活"
          }
        }, () =>{
          this.upDateState();
        })
      } else {
        message.error(res.mag)
      }
    })
  }

  render() {
    return (
      <div style={{ padding: "32px 52px" }}>
        <input type="file" className="upload-file" name="file" multiple="multiple" onChange={this.importProps} id="importFile"/>
        <div className="card-form">
          <div className="card-title">
            <img className="card-title-icon" src={ project } alt=""/>
            <span>授权信息</span>
          </div>
          <div className="form" style={{width: '100%'}}>
            <div className="form-item">
              <label className="form-item-label">节点ID:</label>
              <span className="form-item-val">{this.state.nodeID}</span>
              <Button className="ant-btn-opt-normal" onClick={ this.getSerialNumber }>生成产品序列号</Button>
              <CopyToClipboard onCopy={this.copySerialNumber} text={ this.state.nodeID }>
                <Button className="ant-btn-opt-normal">复制产品序列号</Button>
              </CopyToClipboard>
            </div>
            <div className="form-item">
              <label className="form-item-label">授权状态:</label>
              <span className="form-item-val">{ this.state.status }</span>
              <Button className="ant-btn-opt-normal" onClick={ this.upDateState }>刷新授权状态</Button>
            </div>
            <div className="form-item">
              <label className="form-item-label">到期时间:</label>
              <span className="form-item-val">{ this.state.time }</span>
            </div>
            <div className="form-item">
              <Button type="primary" onClick={this.exportAuth}>导入授权文件</Button>
              <div className="tip">*请请联系广州盛原成科技有限公司，获取授权文件，激活软件</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default AuthorizationPane