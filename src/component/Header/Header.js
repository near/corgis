import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import ImageLoader from '../common/ImageLoad/ImageLoad';
import Button from '../common/Button/Button';
import Nav from './Nav/nav'

import logo from '../../../assets/logo.png';
import Spinner from '../common/spinner/spinner';


import './Header.css';

class Header extends Component {
    render() {
        let { login, load, requestSignIn, requestSignOut, accountId, length, handleChange } = this.props
        let show = <Spinner />
        if (login && load) {
            show =<div className="header">
                <NavLink exact to="/" ><ImageLoader image={logo} style={{ minWidth: "100px", width: "70%" }} /></NavLink>
                <Nav
                    accountName={accountId}
                    number={length}
                    requestSignOut={requestSignOut}
                    login={login}
                    handleChange={handleChange} /></div>
        } else if (load) {
            show =<div className="header">
                <NavLink exact to="/" ><ImageLoader image={logo} style={{ minWidth: "100px", width: "60%" }} /></NavLink>
                <Button description="Get Started" action={requestSignIn} /></div>
        }
        return (
            <div>
                {show}
            </div>
        )
    }

}

export default Header
