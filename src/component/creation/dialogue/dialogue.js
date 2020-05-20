import React from 'react';

const Dialogue = ({quote,color}) => {

    return (
        <div style={{ 
                position: "relative", 
                fontSize: "0.5em", 
                width: "150px", 
                padding: "3px",
                wordWrap: "break-word", 
                backgroundColor:"white",
                opacity: "0.7", 
                borderRadius: "20px",
                left: "25%" }}>
            <p style={{color:color,filter: "brightness(50%)", margin:"0"}}><i className="fa fa-quote-left"></i> {quote}</p>
        </div>
    )
}

export default Dialogue