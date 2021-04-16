import React, { useContext, useEffect, useState } from 'react';

import './AuctionCard.scss';

import Big from 'big.js';

import { MarketplaceContext, NearContext } from '~contexts';

import { BasicSpinner, Button } from '~modules/common';
import { AuctionTimer, HighestBid } from '~modules/common/corgi';
import { BidDifference, BidHistory, BidInput, ClearanceButton } from '~modules/corgi/components';

import { useHighestBid, useIsAuctionExpired } from '~hooks';

import { formatToNears } from '~helpers/nears';

import { CorgiTypeShape } from '~types/CorgiTypes';

const AuctionCardPropTypes = { corgi: CorgiTypeShape.isRequired };

const AuctionCard = ({ corgi }) => {
  const { bidding, clearing, bidForCorgi, clearanceForCorgi } = useContext(MarketplaceContext);
  const { user } = useContext(NearContext);

  const { id, owner, for_sale } = corgi;

  const highestBid = useHighestBid(for_sale);
  const isAuctionExpired = useIsAuctionExpired(for_sale && for_sale.expires);

  const [bidNears, setBidNears] = useState(0);
  const [minBid, setMinBid] = useState(0);

  const [isErrorShown, setIsErrorShown] = useState(false);

  const [existedBid, setExistedBid] = useState(null);

  const handleNears = (amount) => {
    setBidNears(amount);

    if (Big(minBid).gt(amount)) {
      setIsErrorShown(true);
    }
  };

  const onBid = (event) => {
    event.preventDefault();

    if (Big(bidNears).gt(minBid)) {
      bidForCorgi(id, existedBid ? Big(bidNears).minus(existedBid).toFixed() : bidNears);
    } else {
      setIsErrorShown(true);
    }
  };

  const onClearance = (event) => {
    event.preventDefault();

    clearanceForCorgi(id);
  };

  useEffect(() => {
    if (highestBid) {
      const min = formatToNears(highestBid.amount);

      setBidNears(min);
      setMinBid(min);
    }
  }, [highestBid]);

  useEffect(() => {
    if (for_sale) {
      const foundBid = for_sale.bids.find((bid) => user && bid.bidder === user.accountId);

      if (foundBid) {
        setExistedBid(formatToNears(foundBid.amount));
      }
    }
  }, [for_sale]);

  useEffect(() => {
    if (isErrorShown) {
      setIsErrorShown(false);
    }
  }, [isErrorShown]);

  return (
    <form className='auction-card'>
      <div className='auction-card__timer'>
        <AuctionTimer expires={for_sale.expires} />
      </div>

      {highestBid && (
        <div className='auction-card__highest-bid'>
          <HighestBid bid={highestBid} isExpired={isAuctionExpired} />
        </div>
      )}

      {!isAuctionExpired && user && user.accountId !== owner && (
        <>
          {!bidding ? (
            <div className='auction-card__bid-field'>
              <div className='auction-card__input'>
                <BidInput
                  label='My bid'
                  handleNears={handleNears}
                  value={bidNears}
                  min={minBid}
                  showError={isErrorShown}
                />
              </div>

              <div className='auction-card__submit'>
                <Button description='Make a bid' action={onBid} />
              </div>
            </div>
          ) : (
            <BasicSpinner />
          )}
        </>
      )}

      {!isAuctionExpired && existedBid && Big(bidNears).gt(existedBid) && (
        <BidDifference existed={existedBid} bid={bidNears} />
      )}

      {user && !clearing ? (
        <ClearanceButton
          isAuctionExpired={isAuctionExpired}
          isOwner={user.accountId === owner}
          isHighestBidder={!!highestBid && user.accountId === highestBid.bidder}
          isUserBidded={!!existedBid}
          onClearance={onClearance}
        />
      ) : (
        user && highestBid && <BasicSpinner />
      )}

      <div className='auction-card__history'>
        <BidHistory bids={for_sale.bids} />
      </div>
    </form>
  );
};

AuctionCard.propTypes = AuctionCardPropTypes;

export default AuctionCard;
