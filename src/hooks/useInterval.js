import { useEffect, useRef, useState } from 'react';

export default function useInterval(callback = () => {}, interval = 1000, delay = 0) {
  const callbackRef = useRef();

  // const [startInterval, setStartInterval] = useState(false);

  useEffect(() => {
    callbackRef.current = callback;
  });

  // useEffect(() => {
  //   if (!startInterval) {
  //     const id = setTimeout(() => {
  //       setStartInterval(true);
  //     }, delay);

  //     return () => {
  //       clearTimeout(id);
  //     };
  //   }
  // }, [startInterval, delay]);

  useEffect(() => {
    // if (startInterval) {
    function onTick() {
      callbackRef.current();
    }

    const id = setInterval(onTick, interval);

    return () => {
      clearInterval(id);
    };
    // }
    // }, [startInterval, interval]);
  }, [interval]);
}
