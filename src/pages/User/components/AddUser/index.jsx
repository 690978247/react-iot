import React, { PureComponent } from 'react'
import {Form, Input, Button} from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

export default class AddUserPane extends PureComponent{
  formRef = React.createRef()
  state = {
    loading: false,
  }

  componentDidMount() {
    if (this.props.userkey) {
      this.formRef.current.setFieldsValue(this.props.userkey);
    }
  }

  render() {
    return (
      <>
        <Form ref={this.formRef} onFinish={this.props.onFinish} initialValues={{
          userID: "00000000-0000-0000-0000-000000000000",
          userAccount: "",
          userPassword: "",
          userName: "",
          phone: ""
        }}>
          <Form.Item name="userID" label="用户账号" hidden={true}>
            <Input placeholder="请输入账号" autoComplete="off"/>
          </Form.Item>
          <Form.Item name="userAccount" label="用户账号" rules={[{
            required: true,
            message: "账号不能为空"
          }]}>
            <Input placeholder="请输入账号" autoComplete="off"/>
          </Form.Item>
          {
            !this.props.userkey ? (
              <Form.Item name="userPassword" label="用户密码" rules={[{
                required: true,
                message: "密码不能为空"
              }]}>
                <Input.Password placeholder="请输入密码" autoComplete="off"/>
              </Form.Item>
            ):<></>
          }
          <Form.Item name="userName" label="用户名称" rules={[{
            required: true,
            message: "用户名称不能为空"
          }]}>
            <Input placeholder="请输入用户名称" autoComplete="off"/>
          </Form.Item>
          <Form.Item name="phone" label="电话号码" rules={[
            //   {
            //     required: true,
            //     message: "电话号码不能为空"
            // },
            {
                pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
                message: "请输入11位的手机号码"
              }]}>
            <Input placeholder="请输电话号码" autoComplete="off" />
          </Form.Item>
          <Form.Item className="form-footer">
            <Button type="default" className="login-form-button" onClick={this.props.onCancel}>取消</Button>
            <Button type="primary" htmlType="submit" className="login-form-button" ref="submit" disabled={this.state.loading ? true : false}>
              {
                this.state.loading ? <LoadingOutlined /> : <></>
              }
              确认
            </Button>
          </Form.Item>
        </Form>
      </>
    )
  }
}