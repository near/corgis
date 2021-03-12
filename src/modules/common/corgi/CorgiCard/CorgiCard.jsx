import React from 'react';
import PropTypes from 'prop-types';

import './CorgiCard.scss';

import classNames from 'classnames';

import {
  Activity,
  AuctionTimer,
  CorgiActions,
  CorgiLink,
  CorgiSVG,
  HighestBid,
  Quote,
  RarityString,
} from '~modules/common/corgi';

import { useHighestBid, useIsAuctionExpired } from '~hooks';

import { SAUSAGE } from '~constants/corgi';

import { CorgiTypeShape } from '~types/CorgiTypes';

const CorgiCardPropTypes = {
  corgi: CorgiTypeShape.isRequired,
  hideActions: PropTypes.bool,
  big: PropTypes.bool,
  showAuctionInfo: PropTypes.bool,
};

const CorgiCard = ({ corgi, hideActions = false, big = false, showAuctionInfo = false }) => {
  const { id, background_color, color, quote, name, rate, owner, sender, created, modified, for_sale } = corgi;

  const highestBid = useHighestBid(for_sale);
  const isAuctionExpired = useIsAuctionExpired(for_sale && for_sale.expires);

  return (
    <div className={classNames('corgi-card', { 'corgi-card--big': big })}>
      <div className='corgi-card__header'>
        <RarityString rate={rate} />

        {!hideActions && <CorgiActions corgi={corgi} isDropdown />}
      </div>

      <CorgiLink id={id}>
        <div className='corgi-card__image' style={{ backgroundColor: background_color }}>
          <CorgiSVG color={color} sausage={SAUSAGE[rate] || SAUSAGE.COMMON} />
        </div>
      </CorgiLink>

      <div className='corgi-card__body'>
        <CorgiLink id={id}>
          <h5 className='corgi-card__name'>{name}</h5>
        </CorgiLink>
        <Quote id={quote} />
      </div>

      <div className='corgi-card__footer'>
        {showAuctionInfo && for_sale ? (
          <>
            {highestBid && <HighestBid bid={highestBid} isExpired={isAuctionExpired} />}
            <hr className='corgi-card__hr' />
            <AuctionTimer expires={for_sale.expires} />
          </>
        ) : (
          <Activity created={created} modified={modified} owner={owner} sender={sender} />
        )}
      </div>
    </div>
  );
};

CorgiCard.propTypes = CorgiCardPropTypes;

export default CorgiCard;
