import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import './AuctionTimer.scss';

import { TimeTile } from '~modules/corgi/components';

import { useInterval, useIsAuctionExpired } from '~hooks';

import { humanizeTime } from '~helpers/time';

const auctionTimerOptions = {
  largest: 3,
  round: false,
  maxDecimalPoints: 0,
  short: true,
};

const AuctionTimerPropTypes = { expires: PropTypes.string };

const AuctionTimer = ({ expires }) => {
  const [timeLeft, setTimeLeft] = useState(humanizeTime(expires, auctionTimerOptions));

  const [hours, setHours] = useState(24);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const isAuctionExpired = useIsAuctionExpired(expires);

  const calculateTime = () => {
    if (!isAuctionExpired) {
      setTimeLeft(humanizeTime(expires, auctionTimerOptions));
    }
  };

  const setTime = (timeArr) => {
    let hr = 0;
    let min = 0;
    let sec = 0;

    /* eslint-disable-next-line no-plusplus */
    for (let i = 0; i < timeArr.length; i++) {
      if (timeArr[i].includes('h')) {
        hr = parseInt(timeArr[i], 10);
      } else if (timeArr[i].includes('m')) {
        min = parseInt(timeArr[i], 10);
      } else if (timeArr[i].includes('s')) {
        sec = parseInt(timeArr[i], 10);
      }
    }

    setHours(hr);
    setMinutes(min);
    setSeconds(sec);
  };

  useInterval(calculateTime, 1000);

  useEffect(() => {
    if (timeLeft && timeLeft.length) {
      setTime(timeLeft.trim().split(', '));
    }
  }, [timeLeft]);

  useEffect(() => {
    if (isAuctionExpired) {
      setHours(0);
      setMinutes(0);
      setSeconds(0);
    }
  }, [isAuctionExpired]);

  return (
    <div className='auction-timer'>
      {!isAuctionExpired ? (
        <>
          <h3 className='auction-timer__title'>Auction ends in</h3>

          <div className='auction-timer__time'>
            <TimeTile time={hours} label='hr' />
            <TimeTile time={minutes} label='min' />
            <TimeTile time={seconds} label='sec' />
          </div>
        </>
      ) : (
        <h3 className='auction-timer__title'>Auction ended</h3>
      )}
    </div>
  );
};

AuctionTimer.propTypes = AuctionTimerPropTypes;

export default AuctionTimer;
