import React, { useState, useEffect, useContext } from 'react';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { GiBowTieRibbon, GiImperialCrown } from 'react-icons/gi';
import { ContractContext } from '../../context/contract';
import { NearContext } from '../../context/NearContext';

import { BigCard } from '../CorgiCard/Card';
import Spinner from '../utils/Spinner';
import { Common, Uncommon, Rare, VeryRare } from '../utils/Photo';

const SharePage = () => {
  const { user } = useContext(NearContext);
  const { corgi, getCorgi, loading } = useContext(ContractContext);

  const [isCopied, setIsCopied] = useState(false);

  const id = window.location.hash.slice(1);

  const address = `${window.location.origin}/share${window.location.hash}`;
  const sausage = Number(corgi.sausage).toFixed(4);

  const renderSwitchRate = (rate) => {
    switch (rate) {
      case 'COMMON':
        return <Common color={corgi.color} />;

      case 'UNCOMMON':
        return <Uncommon color={corgi.color} />;

      case 'RARE':
        return <Rare color={corgi.color} />;

      case 'VERY RARE':
        return <VeryRare color={corgi.color} />;

      case 'ULTRA RARE':
        return 'ULTRA RARE';

      default:
        return 'ULTRA RARE';
    }
  };

  useEffect(() => {
    if (!!id) {
      getCorgi(id);
    }
  }, [getCorgi, id]);

  if (!corgi || loading) {
    return <Spinner />;
  }

  return (
    <div>
      <h1>Meet {corgi.name}!</h1>
      <div>
        <BigCard
          backgroundColor={corgi.backgroundColor}
          color={corgi.color}
          sausage={corgi.sausage}
          quote={corgi.quote}
        />
      </div>
      <div className='text'>
        <div>
          <p>Rarity: {corgi.rate}</p>
          {renderSwitchRate(corgi.rate)}
        </div>
        <div>
          <p>
            <GiImperialCrown style={{ color: '#9437ff', fontSize: '1.1rem' }} />
            Owner: {corgi.owner}
          </p>
          <p>
            <GiBowTieRibbon style={{ color: '#9437ff', fontSize: '1.2rem' }} />
            Sausage: {sausage}
          </p>
        </div>
      </div>
      <div style={{ marginBottom: '10px' }}>
        {user ? (
          <p>Create your own and share</p>
        ) : (
          <p>Do you want to have corgi yourself? click Get started and enjoy the advanture!</p>
        )}
        <p>Do you also want to share {corgi.name}?</p>
        <CopyToClipboard text={address} onCopy={() => setIsCopied(true)}>
          <button className='button'>Copy Link</button>
        </CopyToClipboard>
        {isCopied && <span style={{ color: '#961be0', marginLeft: '5px' }}>Copied.</span>}
      </div>
      <style>{`
          .text {
              width: 70%;
              max-width: 800px;
              margin: 2% auto;
              display: flex;
              justify-content: space-around;
          }
          .button {
            background-color: #fbb040;
            color: #f2f2f2;
            border-radius: 5px;
            padding: 4px 6px;
            cursor: alias;
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
          }
        `}</style>
    </div>
  );
};

export default SharePage;
