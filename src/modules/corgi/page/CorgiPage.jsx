import React, { useContext, useEffect } from 'react';
import { Redirect, useRouteMatch } from 'react-router-dom';

import './CorgiPage.scss';

import classNames from 'classnames';

import { ContractContext, MarketplaceContext, NearContext } from '~contexts';

import { CorgiActions, CorgiCard, CorgiRate, CorgiSpinner } from '~modules/common';
import { AuctionCard } from '~modules/corgi/components';

const CorgiPage = () => {
  const { user } = useContext(NearContext);
  const { corgi, error, loading, getActiveCorgi, deleted, transfered } = useContext(ContractContext);
  const { added, bidded, cleared } = useContext(MarketplaceContext);

  const { params: { id } } = useRouteMatch();

  useEffect(() => {
    if (id) {
      getActiveCorgi(id);
    }
  }, [id, transfered, added, bidded, cleared]);

  if (deleted || !id) {
    return <Redirect to={user ? `/user/${user.accountId}` : '/'} />;
  }

  return (
    <div className={classNames('corgi-page', { 'corgi-page--sale': !error && corgi && corgi.for_sale })}>
      {!error ? (
        <>
          {corgi && !loading ? (
            <>
              <div className={classNames('corgi-page__content', { 'corgi-page__content--sale': corgi.for_sale })}>
                <div className='corgi-page__card'>
                  <CorgiCard corgi={corgi} big hideActions />
                </div>

                {corgi.for_sale && (
                  <div className='corgi-page__auction'>
                    <AuctionCard corgi={corgi} />
                  </div>
                )}
              </div>

              <div className='corgi-page__additional'>
                <CorgiRate rate={corgi.rate} responsiveRow={!!corgi.for_sale} />

                <div className='corgi-page__actions'>
                  <CorgiActions corgi={corgi} />
                </div>
              </div>
            </>
          ) : (
            <CorgiSpinner />
          )}
        </>
      ) : (
        <h1 className='corgi-page__error'>Such Corgi does not exist</h1>
      )}
    </div>
  );
};

export default CorgiPage;
