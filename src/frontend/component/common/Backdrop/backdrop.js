import React from 'react';

import './backdrop.css';

const backdrop = ({show, clicked}) => (
    show ? <div className="Backdrop" onClick={clicked}></div> : null
);

export default backdrop;