import { useEffect, useState } from 'react';

import { formatToMs } from '~helpers/time';

export default function useIsAuctionExpired(expires) {
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    setIsExpired(expires && Date.now() > formatToMs(expires));
  }, [expires]);

  return isExpired;
}
