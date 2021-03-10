import React, { useContext, useEffect, useState } from 'react';

import './AuctionCard.scss';

import { ContractContext, MarketplaceContext, NearContext } from '~contexts';

import { BasicSpinner, Button, Donation } from '~modules/common';
import { AuctionTimer, BidDifference, BidHistory, HighestBid } from '~modules/corgi/components';

import { formatToNears } from '~helpers/nears';
import { formatToMs } from '~helpers/time';

import { CORGI_VALIDATION_MESSAGES } from '~constants/validation/corgi';

import { CorgiTypeShape } from '~types/CorgiTypes';

const AuctionCardPropTypes = { corgi: CorgiTypeShape.isRequired };

const AuctionCard = ({ corgi }) => {
  const { bidding, clearing, bidForCorgi, clearanceForCorgi } = useContext(MarketplaceContext);
  const { user } = useContext(NearContext);
  const { mintFee } = useContext(ContractContext);

  const { id, owner, for_sale } = corgi;

  const isAuctionExpired = for_sale && for_sale.expires && Date.now() > formatToMs(for_sale.expires);

  const [highestBid, setHighestBid] = useState(null);

  const [minBid, setMinBid] = useState(mintFee);
  const [bidNears, setBidNears] = useState(mintFee);

  const [isErrorShown, setIsErrorShown] = useState(false);

  const [existedBid, setExistedBid] = useState(null);

  const handleNears = (amount) => {
    setBidNears(amount);
  };

  const onBid = (event) => {
    event.preventDefault();

    if (bidNears <= minBid) {
      setIsErrorShown(true);
    } else {
      bidForCorgi(id, existedBid ? formatToNears(existedBid.amount) - bidNears : bidNears);
    }
  };

  const onClearance = (event) => {
    event.preventDefault();

    clearanceForCorgi(id);
  };

  useEffect(() => {
    if (for_sale && for_sale.bids.length) {
      setHighestBid(
        for_sale.bids.reduce(
          (curr, next) => (formatToNears(next.amount) > formatToNears(curr.amount) ? next : curr),
          for_sale.bids[0],
        ),
      );
    }
  }, [for_sale]);

  useEffect(() => {
    if (highestBid) {
      const min = parseFloat(formatToNears(highestBid.amount)).toFixed(1);

      setBidNears(min);
      setMinBid(min);
    }
  }, [highestBid]);

  useEffect(() => {
    if (for_sale) {
      const foundBid = for_sale.bids.find((bid) => user && bid.bidder === user.accountId);

      if (foundBid) {
        setExistedBid(parseFloat(formatToNears(foundBid.amount)).toFixed(1));
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
          <HighestBid bid={highestBid} />
        </div>
      )}

      {!isAuctionExpired && user && user.accountId !== owner && (
        <>
          {!bidding ? (
            <div className='auction-card__bid-field'>
              <div className='auction-card__input'>
                <Donation
                  label='My bid'
                  handleNears={handleNears}
                  value={bidNears}
                  min={minBid}
                  showError={isErrorShown}
                  error={CORGI_VALIDATION_MESSAGES.BID}
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

      {existedBid && <BidDifference existed={existedBid} bid={bidNears} />}

      {isAuctionExpired && user && user.accountId === owner && (
        <>{!clearing ? <Button description='Finish auction' action={onClearance} /> : <BasicSpinner />}</>
      )}

      <div className='auction-card__history'>
        <BidHistory bids={for_sale.bids} />
      </div>
    </form>
  );
};

AuctionCard.propTypes = AuctionCardPropTypes;

export default AuctionCard;
