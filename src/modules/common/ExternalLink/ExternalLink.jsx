import React from 'react';
import PropTypes from 'prop-types';

import './ExternalLink.scss';

import classNames from 'classnames';

const ExternalLinkPropTypes = {
  description: PropTypes.string,
  disabled: PropTypes.bool,
  href: PropTypes.string,
  rel: PropTypes.string,
  showUnderline: PropTypes.bool,
  target: PropTypes.string,
};

const ExternalLink = ({
  description = 'link to...',
  disabled = false,
  href = '',
  rel = 'noopener noreferrer',
  showUnderline = false,
  target = '_blank',
}) => (
  <a
    className={classNames('link', { 'link--disabled': disabled, 'link--underline': showUnderline })}
    target={target}
    href={href}
    rel={rel}
    disabled={disabled}
  >
    {description}
  </a>
);

ExternalLink.propTypes = ExternalLinkPropTypes;

export default ExternalLink;
