import React from 'react';
import PropTypes from 'prop-types';

import './Dropdown.scss';

import { ReactChildrenType } from '~types/ReactChildrenType';

const DropdownPropTypes = {
  dropdownTitle: PropTypes.string.isRequired,
  children: ReactChildrenType,
};

const Dropdown = ({ dropdownTitle, children }) => (
  <div className='dropdown'>
    <button className='dropdown__title'>{dropdownTitle}</button>
    <div className='dropdown__content'>
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
  </div>
);

Dropdown.propTypes = DropdownPropTypes;

export default Dropdown;
