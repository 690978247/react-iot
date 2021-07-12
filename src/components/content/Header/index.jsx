import React, { PureComponent } from 'react'
import { Dropdown, message, Modal } from 'antd'
import { withRouter } from "react-router-dom";
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'

import DrowDownMenu from 'components/common/DrowDownMenu'
import { getCookie } from 'utils'
import PubSub from 'pubsub-js'

import './index.less'

import { GetRemote } from 'api/operations'
import { GetIOTStatus, StartIOT, StopIOT, RestartIoT } from "api/baseIndex"

let timer = null;
class PageHeader extends PureComponent {
  state = {
    currentEqu: '',
    userName: getCookie("userName"),
    toggleMenu: false,
    status: 1
  }

  componentDidMount() {
    GetRemote().then(res => {
      if (res.code === 0) {
        let data = res.data;
        this.setState({
          currentEqu: data.name || "",
        })
      } else {
      }
    })

    PubSub.subscribe("projectName", (res, data) => {
      this.setState({ currentEqu: data })
    })

    timer = setInterval(() => {
      GetIOTStatus().then(res => {
        if (res.code === 0) {
          this.setState({
            status: res.data
          })
        } else {
          if (getCookie("Authorization") === "") {
            message.error("登录失效，即将跳转登录页")
            setTimeout(() => {
              this.props.history.replace("/login")
            }, 2000)
          }
        }
      })
    }, 5000)
  }

  componentWillUnmount() {
    clearInterval(timer)
  }

  toggle = () => {
    this.setState(state => {
      PubSub.publish("toggleMenu", !state.toggleMenu)
      return {
        toggleMenu: !state.toggleMenu
      }
    })
  }

  logout = () => {
    Modal.confirm({
      title: "是否确认退出",
      cancelText: "取消",
      okText: "确认",
      onOk: () => {
        this.props.history.push('/')
      }
    })
  }

  menu = () => {
    let that = this;
    return <DrowDownMenu lists={[
      {
        name: "重新启动",
        key: "restart",
        onClick() {
          RestartIoT().then(res => {
            console.log(res)
            if (res.code === 0) {
              that.setState({
                status: 1
              }, () => {
                message.info("重新启动成功")
              })
            } else {
              message.error(res.msg)
            }
          })
        }
      }, {
        name: "启动",
        key: "start",
        onClick() {
          StartIOT().then(res => {
            console.log(res)
            if (res.code === 0) {
              that.setState({
                status: 1
              }, () => {
                message.info("启动成功")
              })
            } else {
              message.error(res.msg)
            }
          })
        }
      }, {
        name: "停止",
        key: "stop",
        onClick() {
          StopIOT().then(res => {
            if (res.code === 0) {
              console.log(res)
              that.setState({
                status: 0
              }, () => {
                message.info("已停止")
              })
            } else {
              message.error(res.msg)
            }
          })
        }
      }
    ]} />
  }

  render() {
    return (
      <div className="pageHeader">
        <div className="logo">
          <img src={this.props.logo} alt="logo" />
          <span className="name">{this.props.name}</span>
        </div>
        <div className="flexContent">
          {/* {this.props.flexChildren} */}
          {React.createElement(this.state.toggleMenu ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: this.toggle,
          })}
          <div className="divider"></div>
          <label className="equ-tags">
            <span className={`iot-status ${this.state.status === 1 ? 'iot-status-normal' : (this.state.status === 2 ? 'iot-status-danger' : 'iot-status-disable')}`}></span>
            <span className="equ-name">{this.state.currentEqu}</span>
            {<Dropdown overlay={this.menu} trigger={['click']} placement="bottomCenter" arrow>
              <div className="equ-option"></div>
            </Dropdown>}
          </label>
        </div>
        {<div className="userComp">
          <span className="userName">{this.state.userName}</span>
          <span className="divider"></span>
          <div className="logout" onClick={this.logout}></div>
        </div>}
      </div>
    )
  }
}

export default withRouter(PageHeader)