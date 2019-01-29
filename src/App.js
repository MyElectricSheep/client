import React, { Component } from "react";
import "./App.css";
import { Switch, Route } from "react-router-dom";
import dashboard from "./components/dashboard";
import Login from "./components/LoginPage";
require("dotenv").config();

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/dashboard/moncompte" component={dashboard} />
        <Route path="/dashboard/:composant" component={dashboard} />
      </Switch>
    );
  }
}

export default App;
