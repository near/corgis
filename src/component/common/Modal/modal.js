import React, { Component } from 'react';

import './modal.css';
import Backdrop from '../Backdrop/backdrop';

class Modal extends Component {
    render () {
        let { show, CancelHandler, children} = this.props
        return (
            <div>
                <Backdrop show={show} clicked={CancelHandler} />
                <div
                    className="Modal"
                    style={{
                        transform: show ? 'translateY(0)' : 'translateY(-100vh)',
                        opacity: show ? '1' : '0'
                    }}>
                    {children}
                </div>
            </div>
        )
    }
}

export default Modal;