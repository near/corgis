import React from 'react';

import Corgi from '../corgi/corgi';
import Dialogue from './dialogue/dialogue';
import './creation.css';

const Creation = ({ backgroundColor, color, name, owner, quote, sausage }) => {
    return (
        <div className="creation">
            <div className="corgiboard">
                <div style={{
                    backgroundColor: backgroundColor,
                    padding: "10px",
                    display: "inline-block",
                    borderRadius: "10px",
                }}>
                    <Dialogue quote={quote} color={color} />
                    <Corgi
                        color={color}
                        sausage={sausage} />
                </div>
            </div>
            <p className="dogname">{name}</p>
            <p className="address">Created by <span className="orange">@{owner}</span></p>
        </div>
    )
}

export default Creation