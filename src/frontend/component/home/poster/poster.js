import React, { Component } from 'react';

import Button from '../../common/Button/Button';
import ImageLoader from '../../common/ImageLoad/ImageLoad';
import SampleH from '../../common/sample/sample_h'
import Spinner from '../../common/spinner/spinner';

import corgiFull from '../../../../assets/corgi-full.png';
import "./poster.css";

class Poster extends Component {
    componentDidMount() {

    }
    render() {
        let { requestSignIn, load, login, accountId } = this.props
        let showButton = <Spinner />;
        if (!login) { showButton = <Button description="Login with NEAR" action={requestSignIn} /> }
        else if (login && load) { showButton = <div className="show">Logged In {accountId}</div> }
        return (
            <div className="wrapper">
                <div className="backup">
                    <div className="textPoster" >
                        <p className="text1">Create your own </p>
                        <p className="text1">one-of-the-kind</p>
                        <p className="text1">Corgi today</p>
                        <p className="text2">create, collect, send, or trade</p>
                        {showButton}
                    </div>
                    <div className="imagePoster">
                        <ImageLoader image={corgiFull} style={{ width: '100%' }} />
                    </div>
                </div>
                <div className="pop">
                    <h2 className="title">Corgis Display</h2>
                    <SampleH className="sample" />
                </div>
            </div>
        )
    }
}

export default Poster