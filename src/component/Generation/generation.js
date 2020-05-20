import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import Spinner from '../common/spinner/spinner';
import Info from './info/info'
import Screen from './screen/screen'

import './generation.css'

class Generation extends Component {
    render() {
        let {login, load, color, backgroundColor, handleChange,newCorgiName} = this.props
        if (!load) {return <Spinner />}
        if (load && !login) {return <Redirect to="/" />}
        return (
            <div className="generation">
                <h1 className="head">Create a Corgi</h1>
                <div className="content">
                    <Info  color={color} backgroundColor={backgroundColor} handleChange={handleChange} newCorgiName={newCorgiName}/>
                    <Screen color={color} backgroundColor={backgroundColor} />
                </div>
            </div>
        )
    }
}

export default Generation