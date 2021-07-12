import React, { PureComponent } from 'react'
import { NavLink } from 'react-router-dom'

export default class index extends PureComponent {

  render() {
    return (
      <NavLink activeClassName="active-route" className="menu-list" {...this.props}>
      </NavLink>
    )
  }
}
