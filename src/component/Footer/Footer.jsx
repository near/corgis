import React from 'react';

import nearLogo from '../../assets/images/near_logo_stack.png';

const Footer = () => (
  <div className='footer'>
    <div className='left'>
      <img src={nearLogo} alt='' style={{ height: '7em' }} />
      <div className='text'>
        <p>Crypto Corgis was created to demonstrate the NFT</p>
        <p>capabilities of NEAR Protocol. </p>
        <p>
          Learn more at
          <a href='https://near.org/' target='_blank' rel='noopener noreferrer' className='blue'>
            {' '}
            near.org
          </a>
        </p>
      </div>
    </div>
    <div className='right'>
      <p>© 2019 Near Protocol </p>
      <p>All Rights Reserved.</p>
      <p className='blue'>
        Privacy Policy <span className='black'> | </span> Terms of Use
      </p>
    </div>
    <style>{`
      .footer {
        font-family: 'Poppins', sans-serif;
        font-size: 0.7em;
        font-weight: 200;
        color: #4A4F54;
        display: flex;
        justify-content: space-between;
        background-color: #f8f8f8;
        max-width: 100%;
        margin-top: 1%;
        padding: 3%;
        height: 80px;
    }
    
    .footer p {
        margin:0;
    }
    
    .text {
        padding: 10px;
    }
    
    .left {
        text-align: start;
        margin-left: 15px;
        display: inline-flex;
        justify-content: flex-start;
    }
    
    .right {
        display: block;
        text-align: end;
        margin-right: 15px;
        padding-top: 10px;
    }
    
    .blue {
        color: lightblue;
    }
    
    .black {
        color: black;
    }
    `}</style>
  </div>
);

export default Footer;
