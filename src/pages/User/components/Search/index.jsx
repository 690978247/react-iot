import React, { PureComponent } from 'react'
import { Form, Input, Button } from 'antd'
import './index.less'

import searchLogo from 'assets/img/common/search.png'

class Search extends PureComponent {

  render() {
    return (
      <div className="search-contain">
        <Form
          layout="inline"
          onFinish={this.props.searchForm}
          onFinishFailed={this.onFinishFailed}
        >
          <Form.Item name="argKeyWord" label="账号/用户名" colon={false}>
            <Input placeholder="请输入关键字" style={{ width: '240px' }} autoComplete="off"/>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submint" className="btn-submint"><img className="btn-icon" src={searchLogo} alt="" />查询</Button>
          </Form.Item>
        </Form>
        <div className="option-area" onClick={ this.props.optionClick }>
          <Button type="primary" onClick={this.props.addUser}>添加</Button>
          <Button className="ant-button-normal" onClick={ this.props.delUser } style={{ margin: 0 }}>删除</Button>
        </div>
      </div>
    )
  }
}

export default Search