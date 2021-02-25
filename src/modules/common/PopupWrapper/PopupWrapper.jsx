import React, { useState, useRef, useImperativeHandle } from 'react';

import './PopupWrapper.scss';

import { useDetectClickOutside } from '~hooks/';

import { Popup } from '~modules/common';

import { PopupTypeShape } from '~types/PopupTypes';
import { ReactChildrenTypeRequired } from '~types/ReactChildrenType';

const PopupWrapperPropTypes = {
  popup: PopupTypeShape,
  children: ReactChildrenTypeRequired,
};

const PopupWrapper = React.forwardRef(({ popup = { title: '', position: 'top', children: <></> }, children }, ref) => {
  const [isPopupOpened, setIsPopupOpened] = useState(false);

  useImperativeHandle(ref, () => ({
    hidePopup() {
      setIsPopupOpened(false);
    },
  }));

  const togglePopup = () => {
    if (isPopupOpened) {
      setIsPopupOpened(false);
    } else {
      setIsPopupOpened(true);
    }
  };

  const handleClickOutside = () => {
    setIsPopupOpened(false);
  };

  const popupWrapperRef = useRef(null);

  useDetectClickOutside(popupWrapperRef, handleClickOutside);

  return (
    <div className='popup-wrapper' ref={popupWrapperRef} onClick={() => togglePopup()}>
      <Popup isOpened={isPopupOpened} title={popup.title} position={popup.position}>
        {popup.children}
      </Popup>

      <div className='popup-wrapper__content'>{children}</div>
    </div>
  );
});

PopupWrapper.propTypes = PopupWrapperPropTypes;

export default PopupWrapper;
