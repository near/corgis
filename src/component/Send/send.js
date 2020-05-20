import React, { Component } from 'react';

import { CreationSingleSmall } from '../creation/creationSingle/creationsingle';
import Modal from '../common/Modal/modal';
import Transfer from '../tokens/transfer';
import Spinner from '../common/spinner/spinner';
class SendPage extends Component {
    state = {
        loading: false
    }

    loadingHandler = () => {
        let state = this.state.loading
        this.setState({ loading: !state })
    }

    render() {
        let { contract, 
            name, 
            dna, 
            backgroundColor, 
            color, 
            sausage, 
            rate, 
            quote, 
            backDrop, 
            backdropCancelHandler, 
            handleChange, 
            accountId } = this.props
        return (
            <Modal show={backDrop} CancelHandler={backdropCancelHandler}>
                {!this.state.loading
                    ? <div style={{ width: "100%", height: "100%" }}>
                        <h3>Send a Corgi</h3>
                        <div>
                            <div style={{ overflowX: "scroll", width: "100%", height: "90%" }}>
                                <CreationSingleSmall
                                    style={{ width: "100%", height: "100%" }}
                                    backgroundColor={backgroundColor}
                                    color={color}
                                    sausage={sausage}
                                    quote={quote} />
                            </div>
                            <p style={{margin:"0"}}>{name}</p>
                            <span style={{ color: "orange", fontSize:"0.7rem"}}>{rate}</span>
                            <hr />
                        </div>
                        <Transfer
                            contract={contract}
                            dna={dna}
                            loadingHandler={this.loadingHandler}
                            handleChange={handleChange}
                            accountId={accountId} />
                    </div>
                    : <Spinner />}
            </Modal>
        )
    }
}

export default SendPage

