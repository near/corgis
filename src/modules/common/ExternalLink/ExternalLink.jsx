import React from 'react';
import PropTypes from 'prop-types';

import './ExternalLink.scss';

import classNames from 'classnames';

const ExternalLinkPropTypes = {
  customClasses: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  description: PropTypes.string,
  disabled: PropTypes.bool,
  href: PropTypes.string,
  rel: PropTypes.string,
  showUnderline: PropTypes.bool,
  target: PropTypes.string,
  underlineOnHover: PropTypes.bool,
};

const ExternalLink = ({
  customClasses = '',
  description = 'link to...',
  disabled = false,
  href = '',
  rel = 'noopener noreferrer',
  showUnderline = false,
  target = '_blank',
  underlineOnHover = false,
}) => (
  <a
    className={classNames(
      'link',
      { 'link--disabled': disabled, 'link--underline': showUnderline, 'link--underline-on-hover': underlineOnHover },
      customClasses,
    )}
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
