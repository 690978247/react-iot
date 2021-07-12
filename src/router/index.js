import React, {PureComponent} from 'react';
import { HashRouter as Router, Switch, Route, Redirect } from "react-router-dom";//引入routerdom
import Load from 'utils/lazy'
import PrivateRoute from './PrivateRoute'

//按需导入
const Login = Load(() => import("pages/Login"))
const Index = Load(() => import("@/layouts/BasicLayout"))

class Routers extends PureComponent {
  render() {
    return (
      <>
        <Router>
          <Switch>
            <Route path="/login" component={Login}/>
            <PrivateRoute path="/index" component={Index}/>
            <Redirect to="/login"/>
          </Switch>
        </Router>
      </>
    );
  }
}

export default Routers;