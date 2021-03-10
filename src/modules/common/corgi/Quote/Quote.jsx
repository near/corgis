import React, { useState, useEffect } from 'react';

import './Quote.scss';

import { usePrevious } from '~hooks/';

import { getQuoteById } from '~helpers/quotes';

import { CorgiType } from '~types/CorgiTypes';

const QuotePropTypes = { id: CorgiType.quote };

const Quote = ({ id = '' }) => {
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');

  const prevId = usePrevious(id);

  useEffect(() => {
    if (id !== prevId) {
      const quote = getQuoteById(id);

      setText(quote.quote);
      setAuthor(quote.author);
    }
  }, [id, prevId]);

  return (
    <figure className='quote'>
      <blockquote className='quote__text'>{text}</blockquote>
      <figcaption className='quote__author'>{author}</figcaption>
    </figure>
  );
};

Quote.propTypes = QuotePropTypes;

export default Quote;
