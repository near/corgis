import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';

import CreationProfile from '../creation/creationProgile/creationProfile';
import Spinner from '../common/spinner/spinner'

import './profile.css'
class Profile extends Component {
    state = {
        running: false
    }

    handleDelete = () =>{
        let state = this.state.running
        this.setState({running: !state})
    }
    render() {
        let { corgis, contract, handleChange, login, load } = this.props
        if (!load) { return <Spinner /> }
        if (load && !login) { return <Redirect to="/" /> }
        let Corgis = <Spinner />
        if (corgis && corgis.length === 0) { return <Redirect to="/generation" /> }
        if (corgis.length > 0) {
            Corgis = corgis.map(corgi => {
                return (
                    <li style={{ textDecoration: "none" }} key={corgi.dna}>
                        <CreationProfile
                            contract={contract}
                            corgi={corgi}
                            handleChange={handleChange}
                            handleDelete={this.handleDelete} />
                    </li>)
            })
        }
        if(this.state.running) {return <Goodbye />}
        return (
            <div>
                <h1>Your Corgis</h1>
                <p>look and delete</p>
                <div>
                    <ul style={{ textAlign: "center", padding: "10px", margin: "auto", textDecoration: "none" }}>
                        {Corgis}
                    </ul>
                </div>
            </div>
        )
    }


}

export default Profile

const Goodbye = () => (
    <div class='container'>
        <div class='bk'>
            <div class='mid'>
                <div class='fore'>
                    <div class='figure'></div>
                </div>
            </div>
        </div>
    </div>
)