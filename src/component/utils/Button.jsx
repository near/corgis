import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ action, description, disabled = false }) => (
  <button className='Button' onClick={action} disabled={disabled}>
    {description}
    <style>{`
        .Button {
          background: #fbb040;
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
          border-radius: 5px;
          color: #fff;
          font-weight: 600;
          margin: auto;
          padding: 5px 30px;
          letter-spacing: 0;
          white-space: nowrap;
          cursor: pointer;
        }
        
        .Button:disabled {
          background: #cfcfcf;
          color: #888888;
        }
        
        @media all and (max-width: 451px) {
          .Button {
            padding: 8px 3px;
            color: #fff;
          }
        }
        `}</style>
  </button>
);

Button.propTypes = {
  action: PropTypes.func.isRequired,
  description: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

export default Button;
