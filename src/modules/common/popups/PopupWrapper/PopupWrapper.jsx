import React, { useState, useRef, useImperativeHandle, useLayoutEffect, useEffect } from 'react';

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
  const [isPopupOpenedAnimate, setIsPopupOpenedAnimate] = useState(false);

  const [timeoutId, setTimeoutId] = useState(null);

  const clearTimeoutId = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  };

  const openPopup = () => {
    clearTimeoutId();
    setIsPopupOpened(true);
  };

  const closePopup = () => {
    setIsPopupOpenedAnimate(false);
  };

  const togglePopup = () => {
    if (isPopupOpened) {
      closePopup();
    } else {
      openPopup();
    }
  };

  const handleClickOutside = () => {
    setIsPopupOpened(false);
    setIsPopupOpenedAnimate(false);
  };

  const popupWrapperRef = useRef(null);

  useDetectClickOutside(popupWrapperRef, handleClickOutside);

  useImperativeHandle(ref, () => ({
    hidePopup() {
      closePopup();
    },
  }));

  useLayoutEffect(() => {
    if (isPopupOpened) {
      setTimeout(() => {
        setIsPopupOpenedAnimate(isPopupOpened);
      }, 0);
    }
  }, [isPopupOpened]);

  useEffect(() => {
    if (!isPopupOpenedAnimate && !timeoutId) {
      setTimeoutId(
        setTimeout(() => {
          setIsPopupOpened(false);
          clearTimeoutId();
        }, 300),
      );
    }

    return () => {
      clearTimeoutId();
    };
  }, [isPopupOpenedAnimate, timeoutId]);

  useEffect(() => {
    if (isPopupOpened && isPopupOpenedAnimate && timeoutId) {
      clearTimeoutId();
    }
  }, [isPopupOpened, isPopupOpenedAnimate, timeoutId]);

  return (
    <div className='popup-wrapper' ref={popupWrapperRef} onClick={() => togglePopup()}>
      {isPopupOpened && (
        <Popup isOpened={isPopupOpenedAnimate} title={popup.title} position={popup.position}>
          {popup.children}
        </Popup>
      )}

      <div className='popup-wrapper__content'>{children}</div>
    </div>
  );
});

PopupWrapper.propTypes = PopupWrapperPropTypes;

export default PopupWrapper;
