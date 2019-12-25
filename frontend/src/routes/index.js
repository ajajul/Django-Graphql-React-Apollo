import React from 'react';
import {
  Switch,
  Route,
} from "react-router-dom";
// import {store} from '../store';
import _ from 'lodash';

import Home from "../components/Home";
import Login from "../components/Login";
import Register from "../components/Register";

const Routes = () => {
//   const user = store.getState().user.profile;
//   const userType = !_.isEmpty(user) && user.type;

  return (
    <Switch>

      {/*Public routes    */}
      <Route exact path="/" component={Login}/>
      <Route exact path="/home" component={Home}/>
      <Route exact path="/register" component={Register}/>
      

      {/* <Route exact path="*" component={NotFound}/> */}

    </Switch>
  )
}

export default Routes
