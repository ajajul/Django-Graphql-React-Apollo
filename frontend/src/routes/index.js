import React from 'react';
import {
  Switch,
  Route,
} from "react-router-dom";

import Home from "../components/Home";
import Login from "../components/Login";
import Register from "../components/Register";

const Routes = () => {

  return (
    <Switch>
      <Route exact path="/" component={Login}/>
      <Route exact path="/home" component={Home}/>
      <Route exact path="/register" component={Register}/>
    </Switch>
  )
}

export default Routes
