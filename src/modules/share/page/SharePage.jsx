import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';

import './SharePage.scss';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { GiBowTieRibbon, GiImperialCrown } from 'react-icons/gi';

import { ContractContext, NearContext } from '~contexts';

import { CorgiCard, CorgiSpinner, SwitchCorgiPhoto } from '~modules/common';

const SharePage = () => {
  const { user } = useContext(NearContext);
  const { corgi, getCorgi, loading } = useContext(ContractContext);

  const [isCopied, setIsCopied] = useState(false);

  const { hash } = useLocation();
  const id = hash.length ? hash.slice(1) : hash;

  const address = `${window.location.origin}/share${window.location.hash}`;

  useEffect(() => {
    if (id) {
      getCorgi(id);
    }
  }, [getCorgi, id]);

  if (!corgi || loading) {
    return <CorgiSpinner />;
  }

  const sausage = Number(corgi.sausage).toFixed(4);

  return (
    <div className='share'>
      <h1 className='share__title'>Meet {corgi.name}!</h1>

      <div className='share__corgi'>
        <CorgiCard corgi={corgi} size='big' />
      </div>

      <div className='share__content'>
        <div>
          <p>Rarity: {corgi.rate}</p>
          <SwitchCorgiPhoto rate={corgi.rate} color={corgi.color} />
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

      <div className='share__description' style={{ marginBottom: '10px' }}>
        {user ? (
          <p>Create your own and share</p>
        ) : (
          <p>Do you want to have corgi yourself? click Get started and enjoy the advanture!</p>
        )}

        <p>Do you also want to share {corgi.name}?</p>

        <CopyToClipboard text={address} onCopy={() => setIsCopied(true)}>
          <button className='share__copy-button'>Copy Link</button>
        </CopyToClipboard>

        {isCopied && <span style={{ color: '#961be0', marginLeft: '5px' }}>Copied.</span>}
      </div>
    </div>
  );
};

export default SharePage;
