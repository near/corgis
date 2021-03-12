import { useEffect, useState } from 'react';

import { formatToNears } from '~helpers/nears';

export default function useHighestBid(forSale) {
  const [highestBid, setHighestBid] = useState();

  useEffect(() => {
    if (forSale && forSale.bids.length) {
      setHighestBid(
        forSale.bids.reduce(
          (curr, next) => (formatToNears(next.amount) > formatToNears(curr.amount) ? next : curr),
          forSale.bids[0],
        ),
      );
    }
  }, [forSale]);

  return highestBid;
}
