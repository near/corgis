import React from 'react';

import Corgi from '../../CorgiCard/Corgi/Corgi';
import { Dialogue } from '../../CorgiCard/Card';

import { CorgiTypeShape } from '../../../types/CorgiTypes';

const AccountCardPropTypes = { corgi: CorgiTypeShape };

const AccountCard = ({ corgi }) => (
  <div className='creation'>
    <div className='corgiboard'>
      <div
        style={{
          backgroundColor: corgi.backgroundColor,
          borderRadius: '10px',
          padding: '20px',
          display: 'inline-block',
        }}
      >
        <Dialogue quote={corgi.quote} color={corgi.color} />
        <Corgi color={corgi.color} sausage={corgi.sausage} />
      </div>
    </div>
    <p className='dogname'>{corgi.name}</p>
    <p className='address blue'>§ {corgi.rate}</p>
    <style>{`
                .creation {
                    margin: 1%;
                    display: inline-block;
                }
                
                .corgiboard {
                    width: 300px;
                    height: 260px;
                    border-radius: 10px;
                }
                
                .dogname {
                    text-align: left;
                    font-size: 1em;
                    margin-left: 1%;
                    margin-top: 1%;
                    margin-bottom: 0;
                    display: block;
                }
                
                .address {
                    text-align: left;
                    font-size: 0.7em;
                    margin-left: 1%;
                    font-weight: lighter;
                    display: block;
                }
                
                .orange {
                    color: orange;
                }
                
                .blue {
                    color: lightblue;
                }
            `}</style>
  </div>
);

AccountCard.propTypes = AccountCardPropTypes;

export default AccountCard;
