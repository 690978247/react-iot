import React, { PureComponent } from 'react'
import { Menu } from 'antd'
import './index.less'

export default class DrowDownMenu extends PureComponent {
  render() {
    const { lists } = this.props

    return (
      <Menu className="option-menu" {...this.props}>
        {
          lists.map(e => {
            return <Menu.Item className="option-menu-item" {...e}>{e.name}</Menu.Item>
          })
        }
      </Menu>
    )
  }
}