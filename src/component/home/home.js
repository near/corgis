import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';

import Poster from './poster/poster'
import ShowCase from './showcase/showcase'
import Spinner from '../common/spinner/spinner';

import './home.css';
class Home extends Component {
    render() {
        let { login, load, requestSignIn, accountId,length } = this.props
        if (!load) {return <Spinner />}
        if (login && length === 0) {return <Redirect to="/generation"/>}
        return (
            <div className="home">
                <Poster 
                    requestSignIn={requestSignIn} 
                    load={load} 
                    login={login} 
                    accountId={accountId} />
                <ShowCase />
            </div>
        )
    }
}

export default Home