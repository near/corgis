import React from 'react';

import './Quote.scss';

import classNames from 'classnames';

import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';

import { CorgiType } from '~types/CorgiTypes';
import { CardSizeType } from '~types/CardSizeType';

const QuotePropTypes = {
  color: CorgiType.color,
  text: CorgiType.quote,
  size: CardSizeType,
};

const quoteIconSize = '0.8em';

const Quote = ({ color, text, size = 'small' }) => (
  <div className={classNames('quote', `quote--${size}`)}>
    <p className='quote__text' style={{ color }}>
      <FaQuoteLeft size={quoteIconSize} /> {text} <FaQuoteRight size={quoteIconSize} />
    </p>
  </div>
);

Quote.propTypes = QuotePropTypes;

export default Quote;
