import React, { Component } from 'react'
import { Form, Input, Popconfirm, Button, message } from "antd"
import { LoadingOutlined } from '@ant-design/icons'
import { withRouter } from "react-router-dom";
import axios from 'utils/request'
import {setCookie} from 'utils'
import "./index.less"

import user from 'assets/img/login/user.png'
import password from 'assets/img/login/password.png'

class Login extends Component {
  state = {
    isLogin: document.cookie.includes('login=true'),
    loading: false
  }

  componentDidMount() {
    console.log(this.props)
    // 设置时间为负数, 取消设置的 cookie
    setCookie('login', '', -1)
    setCookie('accessToken', '', -1)
    setCookie('userName', '', -1)
  }
  
  jumpBack = () => {
    // 打哪儿来回哪去
    const { location } = this.props
    const from = location.state && location.state.from
    this.props.history.push({
      pathname: from || "/index",
      state: {}
    })
  }
  text = (<div>
    <ul>
      <li><b>普通用户</b><span>请联系超级管理员重置密码</span></li>
      <li><b>超级管理员</b><span>请联系盛原成科技有限公司获取密码</span></li>
    </ul>
  </div>)

  onFinish = (e) => {
    try {
      this.setState({loading: true})
      axios.get(`/Login/Login?argUserAccount=${e.user}&argUserPassword=${e.password}`).then(res => {
        this.setState({loading: false})
        if (res.code === 0) {
            // 设置cookie之后跳转回来时的页面
            setCookie('login', true, 1)
            setCookie('accessToken', res.data, 1)
            setCookie('userName', e.user, 1)
            this.jumpBack()
        } else {
          message.error("用户名或密码不正确")
        }
      })
    } catch(err) {
      this.setState({loading: false})
      message.error(err)
    }
  }

  render() {
    return (
      <div className="login">
        <div className="login-pane">
          <Form className="card" onFinish={this.onFinish}>
            <div className="card-head">盛云圈IOT平台</div>
            <Form.Item name="user" className="card-item" rules={[{
              required: true,
              message: "请输入用户名称"
            }]}>
              <div>
                <img src={user} className="input-icon" alt=""/>
                <Input className="card-input" placeholder="请输入用户名称"/>
              </div>
            </Form.Item>
            <Form.Item name="password" className="card-item" rules={[{
              required: true,
              message: "请输入登录密码"
            }]}>
              <div>
                <img src={password} className="input-icon" alt=""/>
                <Input.Password className="card-input" placeholder="请输入登录密码"/>
              </div>
            </Form.Item>
            <div className="card-item">
              <Popconfirm placement="rightTop" title={this.text} icon={false} cancelText="确定" okType="hidden" cancelType="primary">
                <span className="item-tip">忘记密码</span>
              </Popconfirm>
            </div>
            <div className="card-item">
              <Button className="login-form-button" htmlType="submit" disabled={this.state.loading ? true : false}>
                {
                  this.state.loading ? <LoadingOutlined /> : <></>
                }
                登录
              </Button>
            </div>
            <div>
              <span></span>
            </div>
          </Form>
        </div>
      </div>
    )
  }
}
export default withRouter(Login)