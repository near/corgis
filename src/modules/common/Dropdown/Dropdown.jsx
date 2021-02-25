import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

import './Dropdown.scss';

import classNames from 'classnames';

import { useDetectClickOutside } from '~hooks';

import { ReactChildrenType } from '~types/ReactChildrenType';
import StylesType from '~types/StylesType';
import DropdownItem from './DropdownItem';

const DropdownPropTypes = {
  title: PropTypes.oneOfType([PropTypes.string, ReactChildrenType]).isRequired,
  wide: PropTypes.bool,
  listStyles: StylesType,
  hideTitleBorder: PropTypes.bool,
  hideArrow: PropTypes.bool,
  children: ReactChildrenType,
};

const Dropdown = ({
  title = '',
  wide = false,
  listStyles = {},
  hideTitleBorder = false,
  hideArrow = false,
  children,
}) => {
  const [isOpened, setIsOpened] = useState(false);

  const handleOpen = () => {
    setIsOpened(!isOpened);
  };

  const dropdownRef = useRef(null);

  const handleClickOutside = () => {
    setIsOpened(false);
  };

  useDetectClickOutside(dropdownRef, handleClickOutside);

  return (
    <div
      className={classNames('dropdown', {
        'dropdown--opened': isOpened,
        'dropdown--wide': wide,
      })}
      ref={dropdownRef}
    >
      <button
        className={classNames('dropdown__title', { 'dropdown__title--hide-border': hideTitleBorder })}
        onClick={() => handleOpen()}
      >
        {title}
        {!hideArrow && (
          <div className='dropdown__arrow-wrapper'>
            <svg className='dropdown__arrow' width='24' height='24' xmlns='http://www.w3.org/2000/svg' fillRule='evenodd' clipRule='evenodd'>
              <path d='M23.245 4l-11.245 14.374-11.219-14.374-.781.619 12 15.381 12-15.391-.755-.609z' />
            </svg>
          </div>
        )}
      </button>

      <ul className='dropdown__list' style={listStyles}>
        {children.length ? (
          children.map((child, index) => (
            // TODO: item ids
            <DropdownItem key={`dropdownItem-idSlug${index}`} isDivider={child.props.divider === 'true'}>
              {child}
            </DropdownItem>
          ))
        ) : (
          <DropdownItem>{children}</DropdownItem>
        )}
      </ul>
    </div>
  );
};

Dropdown.propTypes = DropdownPropTypes;

export default Dropdown;
