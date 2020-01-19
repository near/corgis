import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { CreationSingleSmall } from '../creation/creationSingle/creationsingle';
import Modal from '../common/Modal/modal';
import Button from '../common/Button/Button';
class SharePage extends Component {
    state = {
        copied: false
    }
    shareOnTwitter = () => {
        // found on https://gist.github.com/McKinneyDigital/2884508#file-share-twitter-js
        let shareURL = "http://twitter.com/share?url="; //url base
        let params = {
            text: "This lovely corgi is mine",
            via: "NEARProtocol",
        }
        for (let prop in params) shareURL += '&' + prop + '=' + encodeURIComponent(params[prop]);
        window.open(shareURL, '', 'left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0');
    }
    shareOnFacebook = () => {
        let shareURL = 'https://www.facebook.com/sharer/sharer.php?'; //url base
        window.open(shareURL, '', 'left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0');
    }
    render() {
        let { name, backgroundColor, color, sausage, rate, quote, back, backCancelHandler, location, dna } = this.props
        let address = window.location.origin + "/share" + location.hash
        return (
            <Modal show={back} CancelHandler={backCancelHandler}>
                <div style={{ width: "100%", height: "100%", marginBottom: "10px" }} >
                    <h3>Share a Corgi</h3>
                    <div>
                        <div style={{ overflowX: "scroll", width: "100%", height: "90%" }}>
                            <Link to={{
                                pathname: "/share",
                                hash: dna
                            }} key={dna}><CreationSingleSmall
                                    backgroundColor={backgroundColor}
                                    color={color}
                                    sausage={sausage}
                                    quote={quote} /></Link>
                        </div>
                        <p style={{ margin: "0" }}>{name}</p>
                        <span style={{ color: "orange", fontSize: "0.7rem" }}>{rate}</span>
                        <hr />
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        <p style={{ backgroundColor: "white", borderRadius: "5px", padding: "4px 2px", wordWrap: "break-word" }}>{address}</p>
                        <CopyToClipboard text={address}
                            onCopy={() => this.setState({ copied: true })}>
                            <button style={{
                                backgroundColor: "#fbb040",
                                color: "#f2f2f2",
                                borderRadius: "5px",
                                padding: "4px 2px",
                                cursor: "alias",
                                boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.5)"
                            }}>Copy Link</button>
                        </CopyToClipboard>
                        {this.state.copied ? <span style={{ color: '#961be0', marginLeft: "5px" }}>Copied.</span> : null}
                    </div>
                    <div>
                        <p style={{ color: "#999" }}>or share directly on</p>
                        <div style={{display: "flex", justifyContent:"space between"}}>
                            <Button description="Twitter" action={this.shareOnTwitter} />
                            <Button description="Facebook" action={this.shareOnFacebook} />
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }
}

export default withRouter(SharePage)

