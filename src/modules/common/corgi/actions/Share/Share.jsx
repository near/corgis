import React from 'react';

import './Share.scss';

import { InlineShareButtons } from 'sharethis-reactjs';

import { CorgiType } from '~types/CorgiTypes';

const SharePropTypes = { id: CorgiType.id };

const Share = ({ id }) => (
  <div className='share'>
    <InlineShareButtons
      config={{
        alignment: 'center',
        color: 'social',
        enabled: true,
        labels: 'cta',
        language: 'en',
        networks: ['telegram', 'linkedin', 'facebook', 'twitter', 'pinterest', 'whatsapp', 'vk', 'wechat'],

        // url examples:
        // window.location.origin = https://epam.github.io
        // window.location.pathname = /corgis/
        url: `${window.location.origin}${window.location.pathname}#corgi/${id}`,
      }}
    />
  </div>
);

Share.propTypes = SharePropTypes;

export default Share;
