import { useEffect, useRef } from 'react';

export default function useInterval(callback = () => {}, interval = 1000) {
  const callbackRef = useRef();

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    function onTick() {
      callbackRef.current();
    }

    const id = setInterval(onTick, interval);

    return () => {
      clearInterval(id);
    };
  }, [interval]);
}
