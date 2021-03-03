import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import './Share.scss';

import corgiFull from '~assets/images/corgi-full.png';

import classNames from 'classnames';

import { InlineShareButtons } from 'sharethis-reactjs';

import { CorgiActionsContext } from '~contexts/';

console.log(corgiFull.slice(1));

const SharePropTypes = {
  display: PropTypes.oneOf(['grid', 'flex']),
  flexDirection: PropTypes.oneOf(['row', 'column']),
};

const Share = ({ display = 'grid', flexDirection = 'row' }) => {
  const { id, name } = useContext(CorgiActionsContext);

  return (
    <div className={classNames('share', `share--${display}`, display === 'flex' && `share--${flexDirection}`)}>
      <InlineShareButtons
        config={{
          alignment: 'center',
          color: 'social',
          enabled: true,
          // labels: 'cta',
          language: 'en',
          networks: ['telegram', 'linkedin', 'facebook', 'twitter', 'pinterest', 'whatsapp', 'vk', 'wechat'],

          // url examples:
          // window.location.origin = https://epam.github.io
          // window.location.pathname = /corgis/
          url: `${window.location.origin}${window.location.pathname}#corgi/${id}`,

          title: name,
          image: `${window.location.origin}${corgiFull}`,
        }}
      />
    </div>
  );
};

Share.propTypes = SharePropTypes;

export default Share;
