import React from 'react';
import './Button.css'

const Button = ({action,description,disabled = false}) => {
    return (
      <button
        className="Button"
        onClick={action}
        disabled={disabled}>{description}</button>
    )
}

export default Button
