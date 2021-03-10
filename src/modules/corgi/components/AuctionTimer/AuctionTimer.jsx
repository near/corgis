import React, { useEffect, useState } from 'react';

import useInterval from '~hooks/useInterval';

import { TimeTile } from '~modules/corgi/components';

import { formatToMs, humanizeTime } from '~helpers/time';

import './AuctionTimer.scss';

const auctionTimerOptions = {
  largest: 3,
  round: false,
  maxDecimalPoints: 0,
  short: true,
};

const AuctionTimer = ({ expires }) => {
  const [timeLeft, setTimeLeft] = useState(humanizeTime(expires, auctionTimerOptions));

  const [hours, setHours] = useState(24);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const [isAuctionExpired, setIsAuctionExpired] = useState(false);

  const calculateTime = () => {
    if (!isAuctionExpired) {
      setTimeLeft(humanizeTime(expires, auctionTimerOptions));
    }
  };

  const setTime = (timeArr) => {
    let hr = 0;
    let min = 0;
    let sec = 0;

    for (let i = 0; i < timeArr.length; i++) {
      if (timeArr[i].includes('h')) {
        hr = parseInt(timeArr[i]);
      } else if (timeArr[i].includes('m')) {
        min = parseInt(timeArr[i]);
      } else if (timeArr[i].includes('s')) {
        sec = parseInt(timeArr[i]);
      }
    }

    setHours(hr);
    setMinutes(min);
    setSeconds(sec);

    if (hr === 0 && min === 0 && sec === 0) {
      setIsAuctionExpired(true);
    }
  };

  useInterval(calculateTime, 1000);

  useEffect(() => {
    if (timeLeft && timeLeft.length) {
      setTime(timeLeft.trim().split(', '));
    }
  }, [timeLeft]);

  useEffect(() => {
    if (!isAuctionExpired && hours === 0 && minutes === 0 && seconds === 0) {
      setIsAuctionExpired(true);
    }
  }, [isAuctionExpired, hours, minutes, seconds]);

  useEffect(() => {
    if (isAuctionExpired) {
      setHours(0);
      setMinutes(0);
      setSeconds(0);
    }
  }, [isAuctionExpired]);

  useEffect(() => {
    if (expires && Date.now() > formatToMs(expires)) {
      setIsAuctionExpired(true);
    }
  }, []);

  return (
    <div className='auction-timer'>
      <h3 className='auction-timer__title'>Auction ends in</h3>

      <div className='auction-timer__time'>
        <TimeTile time={hours} label='hr' />
        <TimeTile time={minutes} label='min' />
        <TimeTile time={seconds} label='sec' />
      </div>
    </div>
  );
};

// AuctionTimer.propTypes = AuctionTimerPropTypes;

export default AuctionTimer;
