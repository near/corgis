import React from 'react';
import Corgi from '../../corgi/corgi'
import Dialogue from '../../creation/dialogue/dialogue'

export const CreationSingle = ({ backgroundColor, color, quote, sausage }) => {
    return (
        <div
            style={{
                backgroundColor: backgroundColor,
                borderRadius: "10px",
                padding: "20px",
                width: "86%",
                margin: "auto",
                maxWidth: "1000px",
            }}
        >
            <BigDialogue quote={quote} color={color} />
            <BigCorgi color={color} sausage={sausage} />
        </div>
    )
}

export const CreationSingleSmall = ({ backgroundColor, color, quote, sausage }) => {
    return (
        <div
            style={{
                backgroundColor: backgroundColor,
                borderRadius: "10px",
                padding: "20px",
                display: "inline-block",
            }}
        >
            <Dialogue quote={quote} color={color} />
            <Corgi color={color} sausage={sausage} />
        </div>
    )
}

const BigDialogue = ({ quote, color }) => {
    return (
        <div style={{
            position: "relative",
            width: "240px",
            padding: "3px",
            wordWrap: "breakWord",
            backgroundColor: "white",
            opacity: "0.7",
            borderRadius: "20px",
            margin: "auto"
        }}>
            <p style={{ color: color,filter: "brightness(50%)", margin: "0" }}><i className="fa fa-quote-left"></i> {quote}</p>
        </div>
    )
}

const BigCorgi = ({ color, sausage }) => {
    return (
        <div style={{ width: "90%", margin: "auto", maxWidth:"650px", overflowX: "scroll" }}>
            <Corgi color={color} sausage={sausage}/>
        </div>

    )
}

