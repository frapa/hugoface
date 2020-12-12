import React from "react";
import ReactDOM from "react-dom";
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import "./index.css";
import { isLoggedIn } from "./services/login";
import Login from "./components/Login/Login";
import Admin from "./components/Admin/Admin";
import { Articles } from "./components/Articles/Articles";
import Editor from "./components/Editor/Editor";

function PrivateRoute({ children, ...attributes }) {
  return isLoggedIn() ? (
    <Route {...attributes}>{children}</Route>
  ) : (
    <Redirect to="/login" />
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route path="/login">
          {isLoggedIn() ? <Redirect to="/dashboard" /> : <Login />}
        </Route>

        <PrivateRoute path="/dashboard">
          <Admin>dashboard</Admin>
        </PrivateRoute>
        <PrivateRoute path="/articles">
          <Admin>
            <Articles />
          </Admin>
        </PrivateRoute>
        <PrivateRoute path="/article/:filename">
          <Admin>
            <Editor />
          </Admin>
        </PrivateRoute>
        <PrivateRoute path="/pages">
          <Admin>pages</Admin>
        </PrivateRoute>

        <Route path="*">
          {isLoggedIn() ? (
            <Redirect to="/dashboard" />
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
