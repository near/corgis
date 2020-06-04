import "regenerator-runtime/runtime";
import React from "react";
import { Route, Switch } from "react-router-dom";

import Dash from "./component/Dash/Dash";

import Account from "./component/Account/Account";
import Profile from "./component/Profile/Profile";

import Generation from "./component/Generation/Generation";

import SinglePage from "./component/SinglePage/SinglePage";
import SharePage from "./component/SharePage/SharePage";

import Header from "./component/Header/Header";
import Footer from "./component/Footer/Footer";

export default () => {
  return (
    <div className="App">
      <Header />
      <Switch>
        <Route exact path="/" component={Dash} />
        <Route exact path="/generation" component={Generation} />
        <Route exact path="/account" component={Account} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/@:name" component={SinglePage} />
        <Route exact path="/share" component={SharePage} />
        <Route
          render={() => (
            <h1>
              Not found This page. Please go back to continue or you can contact
              us about the issue.
            </h1>
          )}
        />
      </Switch>
      <Footer />
      <style>{`
        body {
          text-align: center;
          font-family: 'Poppins', sans-serif;
          position: relative;
          min-height: calc(100vh - 80px);
        }
        
        button {
          all: unset;
          outline:none;
        }
        
        input {
          all:unset;
          padding: 5px;
        }
      `}</style>
    </div>
  );
};
