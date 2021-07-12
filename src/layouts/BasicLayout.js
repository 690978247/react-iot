import React, { PureComponent } from 'react'
import {Route,Switch,Redirect} from 'react-router-dom'
import { Layout } from 'antd';

import Load from 'utils/lazy'
import './index.less'

const { Content } = Layout;

let Variable = Load(() => import('pages/Variable/index')),
RealTime = Load(() => import('pages/RealTime')),
Operations = Load(() => import('pages/Operations')),
Authorization = Load(() => import('pages/Authorization')),
User = Load(() => import('pages/User')),
Header = Load(() => import('./HeaderLayout')),
PageSider = Load(() => import('components/content/Sider'))

class BasicLayout extends PureComponent {

  render() {
    return (
      <Layout className="full-page">
        <Header/>
        <Layout className="site-layout">
          <PageSider/>
          <Content className="site-layout-background">
            <Switch>
              <Route path="/index/variable" component={Variable}/>
              <Route path="/index/realTime" component={RealTime}/>
              <Route path="/index/operations" component={Operations}/>
              <Route path="/index/authorization" component={Authorization} />
              <Route path="/index/user" component={User}/>
              <Redirect to="/index/variable"/>
            </Switch>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default BasicLayout;
