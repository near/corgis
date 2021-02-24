import PropTypes from 'prop-types';
import { ReactChildrenTypeRequired } from '~types/ReactChildrenType';

export const PopupType = {
  title: PropTypes.string,
  position: PropTypes.oneOf(['top', 'top-left', 'top-right', 'bottom', 'bottom-left', 'bottom-right', 'right', 'left']),
  children: ReactChildrenTypeRequired,
};

export const PopupTypeShape = PropTypes.shape(PopupType);
