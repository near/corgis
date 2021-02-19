import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

import './Dropdown.scss';

import classNames from 'classnames';

import { useDetectClickOutside } from '~hooks';

import { ReactChildrenType } from '~types/ReactChildrenType';

const DropdownPropTypes = {
  dropdownTitle: PropTypes.string.isRequired,
  children: ReactChildrenType,
};

const Dropdown = ({ dropdownTitle, children }) => {
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
    <div className={classNames('dropdown', { 'dropdown--opened': isOpened })} ref={dropdownRef}>
      <button className='dropdown__title' onClick={() => handleOpen()}>
        {dropdownTitle}
      </button>

      <ul className='dropdown__list'>
        {children.length
          ? children.map((child, index) => (
              // TODO: item ids
              <li key={`dropdownItem-idSlug${index}`} className='dropdown__item'>
                {child}
              </li>
            ))
          : children}
      </ul>
    </div>
  );
};

Dropdown.propTypes = DropdownPropTypes;

export default Dropdown;
