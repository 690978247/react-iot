import React, { PureComponent } from 'react'
import { Form, Input, Select, Button } from 'antd'

import { GetTreeStructure } from 'api/variable/index'


const { Option } = Select;
class AddGroups extends PureComponent {
  state = {
    internalVariable: "", //内部变量ID
    euqList: [],
    initialValues: {
      deviceId: "",
      groupId: "00000000-0000-0000-0000-000000000000",
      type: 0,
      name: "",
    },
    hidden: false
  }

  formRef = React.createRef()

  componentDidMount() {
    const list = [];
    //获取设备列表
    GetTreeStructure().then(res => {
      res.data.forEach(el => {
        if (el.nodeName === "内部变量") {
          this.setState({
            internalVariable: el.nodeID,
          })
          this.formRef.current.setFieldsValue({ deviceId: el.nodeID })
        }
        list.push({
          nodeID: el.nodeID,
          nodeName: el.nodeName
        })
      })
      this.setState({ euqList: list })
    })

    if (this.props.node) {
      this.setState({ initialValues: this.props.node, hidden: true })
      this.formRef.current.setFieldsValue(this.props.node);
    }
  }
  componentWillUnmount() {
    this.setState = () => false;
  }

  changeType = (e) => {
    let type
    if (e === this.state.internalVariable) {
      type = 0
    } else {
      type = 3
    }
    this.formRef.current.setFieldsValue({
      type: type,
    });
  }

  render() {
    return (
      <Form
        ref={this.formRef}
        onFinish={this.props.onFinish}
        initialValues={this.state.initialValues}
      >
        <Form.Item label="所属设备" name="deviceId" hidden={this.state.hidden}>
          <Select onChange={this.changeType}>
            {
              this.state.euqList.map(e => {
                return <Option value={e.nodeID} key={e.nodeID}>{e.nodeName}</Option>
              })
            }
          </Select>
        </Form.Item>
        <Form.Item label="分组Id" name="groupId" hidden>
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item label="设备类型" name="type" hidden>
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item label="分组名称" name="name" rules={[
          {
            required: true,
            message: '请输入分组名称!',
          },
        ]}
        >
          <Input autoComplete="off" placeholder="请输入分组名称" />
        </Form.Item>
        <Form.Item className="form-footer">
          <Button type="default" className="login-form-button" onClick={this.props.onCancel}>取消</Button>
          <Button type="primary" htmlType="submit" className="login-form-button">确认</Button>
        </Form.Item>
      </Form>
    )
  }
}

export default AddGroups