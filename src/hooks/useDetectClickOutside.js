import { useEffect, useCallback } from 'react';

export default function useDetectClickOutside(ref, action) {
  const handleClickOutside = useCallback(
    (event) => {
      if (ref && ref.current && !ref.current.contains(event.target)) {
        action();
      }
    },
    [ref, action],
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);
}
