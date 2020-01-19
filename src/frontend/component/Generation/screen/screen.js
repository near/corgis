import React, { Component } from 'react';
import SampleH from '../../common/sample/sample_h';

import './screen.css';
let tinycolor = require("tinycolor2");

class Screen extends Component {

    render() {
        let { color, backgroundColor } = this.props
        let corgiEgg = (
            <div style={{ width: "100%", height: "100%", margin: "auto", position: "relative", zIndex: "10", }}>
                <svg width="147px" height="146px" viewBox="0 0 147 146" version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink">
                    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <g id="gen1" transform="translate(-782.000000, -1123.000000)">
                            <g id="c-phase1-(1)" transform="translate(783.000000, 1124.000000)">
                                <ellipse id="Oval" fill="#FFFFFF" fillRule="nonzero" cx="72.2491349" cy="72" rx="72.2491349" ry="72"></ellipse>
                                <path d="M72.2491349,-3.04063978e-06 C44.9984819,-0.00657451501 20.0624063,15.2673463 7.76176471,39.499997 C12.5081315,57.27 23.9626298,74.095 51.367128,62.499997 C101.770934,41.155 139.576298,79.665 65.6463668,88.455 C7.08442907,95.42 50.0024221,139.68 111.925952,132.185 C138.620485,114.717056 150.640691,81.8562541 141.488774,51.3662523 C132.336856,20.8762505 104.184106,-0.00920366646 72.2491349,-3.04063978e-06 Z" id="Path" fill={color} fillRule="nonzero"></path>
                                <ellipse id="Oval" stroke="#24272A" strokeWidth="2" cx="72.2491349" cy="72" rx="72.2491349" ry="72"></ellipse>
                            </g>
                        </g>
                    </g>
                </svg>
            </div>
        )
        let shadow = (
            <div style={{ width: "60%", position: "relative", top: "-10px", margin: "auto" }}>
                <svg width="200px" height="25px" viewBox="0 0 200 25" version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink">
                    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" fillOpacity="0.2">
                        <g id="create" transform="translate(-801.000000, -709.000000)" fill="#000000">
                            <ellipse id="Oval" cx="901" cy="721.048193" rx="100" ry="12.0481928"></ellipse>
                        </g>
                    </g>
                </svg>
            </div>
        )

        let style = {
            backgroundColor,
            borderRadius: "10px",
            padding: "5%",
            marginBottom: "5%",
            textAlign: "center"
        }
        let textColor = tinycolor.mostReadable(backgroundColor,[color,"#fff","#000"]).toHexString()
        return (
            <div className="board">
                <div style={style}>
                    <p style={{color:textColor, fontWeight: "600"}}>All corgis come equipped with built-in cuteness and an unlimited capacity to love.</p>
                    <p style={{color:textColor, fontWeight: "600", marginBottom: "20px"}}>Just choose a name and a few colors and we’ll do the rest.</p>
                    {corgiEgg}
                    {shadow}
                </div>
                <SampleH />
            </div>
        )
    }
}

export default Screen

